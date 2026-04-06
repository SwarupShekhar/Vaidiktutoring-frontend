'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import SessionChat from '@/app/components/SessionChat';
import api from '@/app/lib/api';
// import { DailyProvider } from '@daily-co/daily-react'; // Not used directly, using iframe
import AttendanceTracker from '@/app/components/session/AttendanceTracker';
import StudentSnapshotCard from '@/app/components/session/StudentSnapshotCard';
import { io, Socket } from 'socket.io-client';
import confetti from 'canvas-confetti';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from 'sonner';
import { 
    Library, 
    FileUp, 
    LogOut,
    Timer,
    Smile,
    Share2,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    PenTool,
    BarChart,
    X
} from 'lucide-react';
import { MANIPULATIVES_DATA, DICE_FACES } from '../manipulatives-data';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface BookingDetails {
    id: string;
    start_time: string;
    subject: { name: string; icon?: string };
    tutor: { id: string; first_name: string; last_name: string };
    students: {
        id: string;
        first_name: string;
        last_name: string;
        interests?: string[];
        recent_focus?: string;
        struggle_areas?: string[];
    };
    sessions: { id: string }[];
}

interface SessionProps {
    params: Promise<{ id: string }>;
}

export default function SessionPage({ params }: SessionProps) {
    const { id: sessionId } = React.use(params);
    const { user, loading: authLoading } = useAuthContext();
    const router = useRouter();

    // Protect the route - redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            console.log('[Session] No user found, redirecting to login');
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Daily.co State
    const [hasJoined, setHasJoined] = useState(false);
    const [dailyRoomUrl, setDailyRoomUrl] = useState<string | null>(null);
    const [dailyToken, setDailyToken] = useState<string | null>(null);
    const [videoLoading, setVideoLoading] = useState(false);
    const [booking, setBooking] = useState<BookingDetails | null>(null);

    // Attendance State
    const [showAttendance, setShowAttendance] = useState(false);
    // Mock Session Roster (In real app, comes from booking/program)
    const sessionRoster = [
        { id: 's1', name: 'Alice Walker' },
        { id: 's2', name: 'Bob Smith' },
        { id: 's3', name: 'Charlie Dave' }
    ];

    const saveAttendance = (records: any) => {
        // api.post(`/sessions/${sessionId}/attendance`, records);
        toast.success('Attendance saved!');
    };

    // Video Card State
    const [position, setPosition] = useState({ x: 8, y: 280 });
    const [isExpanded, setIsExpanded] = useState(false);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const startPos = useRef({ x: 0, y: 0 });

    // Whiteboard Enhancements State
    const [uploadingSlides, setUploadingSlides] = useState(false);
    const [showAssetLibrary, setShowAssetLibrary] = useState(false);

    // Session HUD State
    const [snapshotExpanded, setSnapshotExpanded] = useState(false);
    const [snapshotHidden, setSnapshotHidden] = useState(false);
    
    // Note Modal State
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [sessionNote, setSessionNote] = useState('');
    const [submittingNote, setSubmittingNote] = useState(false);
    
    // Mock Assets for Library
    const mockLibraryAssets = [
        { id: 'math1', type: 'image', url: 'https://placehold.co/400x300/e2e8f0/1e293b?text=Math+Diagram', label: 'Math Diagram' },
        { id: 'sci1', type: 'image', url: 'https://placehold.co/400x300/fee2e2/991b1b?text=Biology+Cell', label: 'Cell Structure' },
    ];

    const [socket, setSocket] = useState<Socket | null>(null);

    // Timer & Reactions State
    const [timeRemaining, setTimeRemaining] = useState(((booking as any)?.duration || 60) * 60);
    const [showWrapUp, setShowWrapUp] = useState(false);
    const [reactions, setReactions] = useState<{ id: string; emoji: string; x: number; delay?: number }[]>([]);
    
    // Whiteboard Multi-Slide State
    const [slides, setSlides] = useState<string[]>([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [slideAnnotations, setSlideAnnotations] = useState<Record<number, any[]>>({});
    const [collaborators, setCollaborators] = useState<Map<string, any>>(new Map());
    const [hasPenAccess, setHasPenAccess] = useState(user?.role === 'tutor');
    const lastInsertionPositions = useRef<Record<string, { x: number; y: number }>>({});

    useEffect(() => {
        if (user?.role === 'tutor') {
            setHasPenAccess(true);
        }
    }, [user?.role]);

    useEffect(() => {
        return () => {
            lastInsertionPositions.current = {};
        };
    }, []);

    // Polling State
    const [showPollModal, setShowPollModal] = useState(false);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '', '', '']);
    const [activePoll, setActivePoll] = useState<{ question: string; options: string[] } | null>(null);
    const [pollResults, setPollResults] = useState<{ results: number[]; totalResponses: number } | null>(null);
    const [studentSelection, setStudentSelection] = useState<number | null>(null);
    const [finalPollResults, setFinalPollResults] = useState<{ question: string; options: string[]; results: number[]; totalResponses: number } | null>(null);

    // Library Tab State
    const [libraryTab, setLibraryTab] = useState<'assets' | 'manipulatives'>('assets');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        'k-1': true,
        '2-3': true,
        '4-6': true
    });

    const slideRef = useRef(0);
    const annotationsRef = useRef<Record<number, any[]>>({});
    const [showLibraryTip, setShowLibraryTip] = useState(false);

    useEffect(() => {
        if (user?.role === 'tutor') {
            const hasSeenTip = localStorage.getItem('hasSeenLibraryTip');
            if (!hasSeenTip) {
                setShowLibraryTip(true);
                const timer = setTimeout(() => {
                    setShowLibraryTip(false);
                    localStorage.setItem('hasSeenLibraryTip', 'true');
                }, 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [user?.role]);

    useEffect(() => {
        slideRef.current = currentSlideIndex;
    }, [currentSlideIndex]);

    useEffect(() => {
        annotationsRef.current = slideAnnotations;
    }, [slideAnnotations]);

    const studentData = {
        name: booking?.students ? `${(booking.students as any).first_name} ${(booking.students as any).last_name || ''}`.trim() : 'Student',
        grade: (booking as any)?.students?.grade ? parseInt(String((booking as any).students.grade).replace(/\D/g, '')) : 0,
        interests: (booking as any)?.students?.interests || [],
        recentProgress: (booking as any)?.students?.recent_focus || 'Waiting for initial session assessment.',
        struggleAreas: (booking as any)?.students?.struggle_areas || []
    };

    // Initialize Shared Socket for Attention Events
    useEffect(() => {
        if (!user || !sessionId || !hasJoined) return;

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const SOCKET_URL = `${API_URL}/sessions`;

        console.log('[Attention] Connecting to socket:', SOCKET_URL);

        const newSocket = io(SOCKET_URL, {
            query: { sessionId, userId: user.id },
            transports: ['websocket'], // Force websocket to resolve "xhr poll error"
            withCredentials: true
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('joinSession', { sessionId, userId: user.id });
            // On every (re)connect the tutor pushes the current scene so late-joining
            // or reconnecting students receive the current whiteboard state immediately.
            if (user.role === 'tutor') {
                const api = excalidrawAPIRef.current;
                if (api) {
                    const elements = api.getSceneElements();
                    const files = api.getFiles();
                    if (elements.length > 0) {
                        newSocket.emit('whiteboard.update', { sessionId, update: { elements } });
                        newSocket.emit('whiteboard.syncFiles', { sessionId, files });
                    }
                }
            }
        });

        newSocket.on('session.reaction', (payload: { emoji: string }) => {
            const newReaction = {
                id: Math.random().toString(),
                emoji: payload.emoji,
                x: Math.random() * 80 + 10
            };
            setReactions(prev => [...prev, newReaction]);
            setTimeout(() => {
                setReactions(prev => prev.filter(r => r.id !== newReaction.id));
            }, 3000);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user, sessionId, hasJoined]);

    // Timer Logic
    useEffect(() => {
        if (!hasJoined || !booking) return;
        
        const interval = setInterval(() => {
            const sessions = (booking as any).sessions || [];
            const startTimeStr = sessions[0]?.start_time || (booking as any).start_time;
            const startTime = new Date(startTimeStr).getTime();
            const now = Date.now();
            
            // Derive remaining from dynamic session length
            const durationMs = ((booking as any)?.duration || 60) * 60 * 1000;
            const elapsedMs = now - startTime;
            const remaining = Math.max(0, Math.floor((durationMs - elapsedMs) / 1000));
            
            setTimeRemaining(prev => {
                if (remaining === 10 * 60 && prev > 10 * 60) {
                    setShowWrapUp(true);
                    setTimeout(() => setShowWrapUp(false), 10000);
                }
                return remaining;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [hasJoined, booking]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const sendReaction = (emoji: string) => {
        if (!socket) return;
        socket.emit('session.reaction', { sessionId, emoji });
        
        // Spawn 6-8 emojis at random x positions
        const count = 6 + Math.floor(Math.random() * 3);
        const newReactions = Array.from({ length: count }).map(() => ({
            id: Math.random().toString(),
            emoji,
            x: Math.random() * 90 + 5, // 5% to 95% width
            delay: Math.random() * 0.5 // staggered start
        }));
        
        setReactions(prev => [...prev, ...newReactions]);
        setTimeout(() => {
            setReactions(prev => prev.filter(r => !newReactions.find(nr => nr.id === r.id)));
        }, 4000);
    };

    // Draggable handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        startPos.current = { ...position };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPosition({
            x: startPos.current.x + dx,
            y: startPos.current.y + dy
        });
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // Fetch Booking Details
    useEffect(() => {
        if (sessionId) {
            api.get(`/bookings/${sessionId}`)
                .then(res => {
                    console.log('[Session] Booking details raw:', res.data);
                    setBooking(res.data);
                })
                .catch(err => {
                    console.error('Failed to load session details', err);
                });
        }
    }, [sessionId]);

    // Excalidraw State
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const excalidrawAPIRef = useRef<any>(null);
    const [ExcalidrawComp, setExcalidrawComp] = useState<any>(null);

    // Patch for process.env
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.process) {
            // @ts-ignore
            window.process = { env: { NODE_ENV: process.env.NODE_ENV } };
        }
    }, []);

    useEffect(() => {
        import('@excalidraw/excalidraw').then((mod) => setExcalidrawComp(() => mod.Excalidraw));
        // @ts-ignore
        import('@excalidraw/excalidraw/index.css');
    }, []);

    // Keep API ref in sync for use in async callbacks / reconnect handlers
    useEffect(() => { excalidrawAPIRef.current = excalidrawAPI; }, [excalidrawAPI]);

    // Whiteboard Sync State (Socket.io based)
    const whiteboardRef = useRef<{ isUpdating: boolean }>({ isUpdating: false });

    // Pointer Updates
    const onPointerUpdate = useCallback((payload: any) => {
        if (!socket || !sessionId) return;
        socket.emit('whiteboard.pointerUpdate', {
            sessionId,
            userId: user?.id,
            username: user?.first_name || 'User',
            pointer: payload.pointer,
            button: payload.button,
            selectedElementIds: payload.selectedElementIds,
        });
    }, [socket, sessionId, user?.id, user?.first_name]);

    const importImageToExcalidraw = useCallback(async (dataUrl: string, customFileId?: string) => {
        if (!excalidrawAPI) return;
        
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        
        const fileId = customFileId || Math.random().toString(36).substring(7);
        const mimeType = blob.type;
        
        excalidrawAPI.addFiles([{
            id: fileId,
            dataURL: dataUrl,
            mimeType: mimeType,
            created: Date.now(),
            lastRetrieved: Date.now()
        }]);

        // Determine actual dimensions so aspect ratio is preserved
        const imgEl = document.createElement('img');
        await new Promise<void>((resolve) => { imgEl.onload = () => resolve(); imgEl.src = dataUrl; });
        const naturalW = imgEl.naturalWidth || 800;
        const naturalH = imgEl.naturalHeight || 600;
        const maxWidth = 900;
        const scaleDown = naturalW > maxWidth ? maxWidth / naturalW : 1;
        const targetWidth = Math.round(naturalW * scaleDown);
        const targetHeight = Math.round(naturalH * scaleDown);

        const elementId = `img_${fileId}`;
        const appState = excalidrawAPI.getAppState();
        const zoom = typeof appState.zoom === 'number' ? appState.zoom : (appState.zoom?.value ?? 1);
        const centerX = (appState.width / 2 - appState.scrollX) / zoom;
        const centerY = (appState.height / 2 - appState.scrollY) / zoom;
        const currentElements = excalidrawAPI.getSceneElements();

        excalidrawAPI.updateScene({
            elements: [
                ...currentElements,
                {
                    type: 'image',
                    version: 1,
                    versionNonce: Math.floor(Math.random() * 1000000000),
                    isDeleted: false,
                    id: elementId,
                    fillStyle: 'solid',
                    strokeWidth: 1,
                    strokeStyle: 'solid',
                    roughness: 0,
                    opacity: 100,
                    angle: 0,
                    x: centerX - targetWidth/2,
                    y: centerY - targetHeight/2,
                    strokeColor: 'transparent',
                    backgroundColor: 'transparent',
                    width: targetWidth,
                    height: targetHeight,
                    seed: Math.floor(Math.random() * 1000000000),
                    groupIds: [],
                    roundness: null,
                    boundElements: [],
                    updated: Date.now(),
                    link: null,
                    locked: false,
                    fileId: fileId,
                    scale: [1, 1],
                },
            ],
            commitToHistory: true,
        });

        // Center on the new image then force-sync so student receives it
        setTimeout(() => {
            const target = excalidrawAPI.getSceneElements().filter((e: any) => e.id === elementId);
            if (target.length > 0) {
                excalidrawAPI.scrollToContent(target, { fitToViewport: true, padding: 20 });
            }
            // Force-push current elements + files regardless of isUpdating state
            if (socket && sessionId) {
                const allElements = excalidrawAPI.getSceneElements();
                const allFiles = excalidrawAPI.getFiles();
                socket.emit('whiteboard.update', { sessionId, update: { elements: allElements } });
                socket.emit('whiteboard.syncFiles', { sessionId, files: allFiles });
            }
        }, 150);
    }, [excalidrawAPI, socket, sessionId]);

    const insertManipulative = (manipulative: any) => {
        if (!excalidrawAPI) {
            toast.error("Whiteboard not ready");
            return;
        }

        try {
            const appState = excalidrawAPI.getAppState();
            const zoom = typeof appState.zoom === 'number' ? appState.zoom : (appState.zoom?.value ?? 1);
            
            const key = manipulative.id;
            const lastPos = lastInsertionPositions.current[key];
            
            // Calculate center of visible viewport in scene coordinates
            let centerX, centerY;
            if (lastPos) {
                centerX = lastPos.x + 40;
                centerY = lastPos.y + 40;
            } else {
                centerX = (appState.width / 2 - appState.scrollX) / zoom;
                centerY = (appState.height / 2 - appState.scrollY) / zoom;
            }
            lastInsertionPositions.current[key] = { x: centerX, y: centerY };

            const groupId = `group_${Math.random().toString(36).substr(2, 9)}`;
            const newElements: any[] = [];
            const time = Date.now();

            // Helper to create valid Excalidraw elements from simple definitions
            const normalizeElement = (el: any, localGroupId: string) => {
                const id = `${el.type}_${Math.random().toString(36).substr(2, 9)}`;
                const base = {
                    id,
                    groupIds: [localGroupId],
                    x: (el.x || 0) + centerX,
                    y: (el.y || 0) + centerY,
                    angle: 0,
                    strokeColor: el.strokeColor || "#1e293b",
                    backgroundColor: el.backgroundColor || "transparent",
                    fillStyle: el.fillStyle || "solid",
                    strokeWidth: el.strokeWidth || 1,
                    strokeStyle: "solid",
                    roughness: el.roughness ?? 0,
                    opacity: 100,
                    isDeleted: false,
                    boundElements: null,
                    link: null,
                    locked: false,
                    version: 2,
                    versionNonce: Math.floor(Math.random() * 1000000000),
                    updated: time
                };

                if (el.type === "rectangle" || el.type === "ellipse") {
                    const shape = {
                        ...base,
                        type: el.type,
                        width: el.width || 50,
                        height: el.height || 50,
                        roundness: el.roundness || null
                    };
                    newElements.push(shape);

                    // If it has a label, create a text element centered inside it
                    if (el.label) {
                        const fontSize = 14;
                        const textId = `text_${Math.random().toString(36).substr(2, 9)}`;
                        newElements.push({
                            ...base,
                            id: textId,
                            type: "text",
                            x: shape.x + (shape.width / 2) - (el.label.length * 4), // Rough centering
                            y: shape.y + (shape.height / 2) - (fontSize / 2),
                            width: el.label.length * 8, 
                            height: fontSize * 1.2,
                            text: el.label,
                            fontSize,
                            fontFamily: 1,
                            textAlign: "center",
                            verticalAlign: "middle",
                            strokeColor: el.labelColor || el.strokeColor || "#1e293b"
                        });
                    }
                } else if (el.type === "line" || el.type === "arrow") {
                    const points = el.points || [[0, 0], [10, 10]];
                    const xs = points.map((p: any) => p[0]);
                    const ys = points.map((p: any) => p[1]);
                    const minX = Math.min(...xs);
                    const minY = Math.min(...ys);
                    const maxX = Math.max(...xs);
                    const maxY = Math.max(...ys);

                    newElements.push({
                        ...base,
                        type: el.type,
                        points,
                        width: Math.max(1, maxX - minX),
                        height: Math.max(1, maxY - minY)
                    });
                } else if (el.type === "text") {
                    const fontSize = el.fontSize || 20;
                    newElements.push({
                        ...base,
                        type: "text",
                        text: el.text || "",
                        fontSize,
                        fontFamily: el.fontFamily || 1,
                        textAlign: el.textAlign || "left",
                        verticalAlign: el.verticalAlign || "top",
                        width: el.width || (el.text?.length || 1) * (fontSize * 0.6),
                        height: el.height || fontSize * 1.2
                    });
                }
            };

            manipulative.elements.forEach((el: any) => normalizeElement(el, groupId));

            const existingElements = excalidrawAPI.getSceneElements();
            excalidrawAPI.updateScene({
                elements: [...existingElements, ...newElements]
            });

            setTimeout(() => {
                excalidrawAPI.scrollToContent(newElements, {
                    fitToViewport: false,
                    padding: 150
                });
            }, 100);

            setTimeout(() => {
                socket?.emit("whiteboard.update", {
                    sessionId: sessionId,
                    update: { elements: excalidrawAPI.getSceneElements() }
                });
            }, 500);

            toast.success(`Inserted ${manipulative.label}`);
        } catch (err) {
            console.error("Failed to insert manipulative:", err);
            toast.error("Insertion failed");
        }
    };

    const switchSlide = useCallback(async (index: number, overrideSlides?: string[], skipEmit = false) => {
        if (!excalidrawAPI) return;
        const targetSlides = overrideSlides || slides;
        if (!targetSlides[index]) return;

        // 1. Save current annotations
        const currentElements = excalidrawAPI.getSceneElements();
        // Filter out existing slide images
        const annotationsOnly = currentElements.filter((el: any) => el.type !== 'image' || !el.fileId?.startsWith('slide_'));
        
        setSlideAnnotations(prev => {
            const next = { ...prev, [slideRef.current]: annotationsOnly };
            annotationsRef.current = next;
            return next;
        });

        // 2. Clear scene COMPLETELY
        excalidrawAPI.updateScene({ elements: [], appState: { isLoading: true } });

        // 3. Insert new slide image
        await importImageToExcalidraw(targetSlides[index], `slide_${index}`);

        // 4. Restore annotations for new slide
        const nextAnnotations = annotationsRef.current[index] || [];
        const currentScene = excalidrawAPI.getSceneElements();
        
        excalidrawAPI.updateScene({ 
            elements: [...currentScene, ...nextAnnotations],
            appState: { isLoading: false }
        });

        setCurrentSlideIndex(index);
        slideRef.current = index;
        
        if (!skipEmit) {
            socket?.emit('whiteboard.slideChange', { sessionId, index });
        }
    }, [excalidrawAPI, slides, socket, sessionId, importImageToExcalidraw]);

    // Render a PDF file locally using pdf.js → PNG slides on the canvas
    const renderPdfLocally = (file: File) => {
        toast.info('Processing PDF...', { duration: 3000 });
        const fileReader = new FileReader();
        fileReader.onload = async function () {
            try {
                const typedarray = new Uint8Array(this.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                const newSlides: string[] = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    toast.info(`Processing page ${i} / ${pdf.numPages}…`, { id: 'pdf-progress', duration: 60000 });
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    await page.render({ canvasContext: context!, viewport, canvas }).promise;
                    newSlides.push(canvas.toDataURL('image/png'));
                    // Release GPU texture immediately — prevents memory build-up on large PDFs
                    canvas.width = 0;
                    canvas.height = 0;
                    // Yield to the event loop so the UI stays responsive
                    await new Promise(r => setTimeout(r, 0));
                }
                toast.dismiss('pdf-progress');

                setSlides(newSlides);
                setCurrentSlideIndex(0);
                setSlideAnnotations({});

                if (newSlides.length > 0) {
                    await importImageToExcalidraw(newSlides[0], 'slide_0');
                }
                toast.success(`Loaded ${newSlides.length} page${newSlides.length !== 1 ? 's' : ''}`);
            } catch (err) {
                console.error('[PDF] Render failed:', err);
                toast.error('Failed to render PDF. Is the file a valid PDF?');
            } finally {
                setUploadingSlides(false);
            }
        };
        fileReader.readAsArrayBuffer(file);
    };

    // Handle slide upload
    const handleSlideUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !sessionId) return;

        const name = file.name.toLowerCase();

        // PPT/PPTX cannot be rendered in the browser — block early
        if (name.endsWith('.ppt') || name.endsWith('.pptx')) {
            toast.error('PowerPoint files cannot be rendered directly. Please export your slides as a PDF first, then upload the PDF.', { duration: 8000 });
            return;
        }

        setUploadingSlides(true);

        // PDFs are rendered locally via pdf.js — the backend only returns the raw
        // binary as base64 (data:application/pdf) which Excalidraw cannot display.
        if (name.endsWith('.pdf')) {
            renderPdfLocally(file);
            return; // setUploadingSlides(false) handled inside renderPdfLocally
        }

        // For regular images (png, jpg, webp, svg) — use backend route
        try {
            const formData = new FormData();
            formData.append('file', file);
            const token = localStorage.getItem('K12_TOKEN');

            const res = await api.post(`/sessions/${sessionId}/slides`, formData, {
                timeout: 60000,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.data.success && excalidrawAPI && res.data.base64) {
                // Verify the backend returned an image MIME type before inserting
                const mime: string = res.data.mimeType || '';
                if (!mime.startsWith('image/')) {
                    toast.error(`Cannot display file type "${mime}". Upload a PNG, JPG, or PDF instead.`);
                    return;
                }
                await importImageToExcalidraw(res.data.base64, `slide_${Date.now()}`);
                toast.success('Image inserted');
            }
        } catch (err: any) {
            console.error('Failed to upload slide', err);
            const msg = err.code === 'ECONNABORTED' ? 'Upload timed out (60s). Try a smaller file.' : 'Failed to upload slides';
            toast.error(msg);
        } finally {
            setUploadingSlides(false);
        }
    };

    useEffect(() => {
        if (!excalidrawAPI || !socket || !sessionId) return;

        // Listens for pen access updates
        const handlePenAccess = (payload: any) => {
            // Tutors always have pen access — they are never in view mode
            if (user?.role === 'tutor') {
                excalidrawAPI?.updateScene({ appState: { viewModeEnabled: false } });
                return;
            }

            // Student logic
            if (payload.studentId === user?.id || (user?.role === 'student')) {
                const isNowGranted = !!payload.hasAccess;
                setHasPenAccess(isNowGranted);
                
                if (isNowGranted) {
                    toast.success('Pen access granted by tutor');
                    excalidrawAPI?.updateScene({ appState: { viewModeEnabled: false } });
                } else {
                    toast.info('Pen access removed');
                    excalidrawAPI?.updateScene({ appState: { viewModeEnabled: true } });
                }
            }
        };

        // Listens for confetti
        const handleConfetti = () => {
            const isYoungStudent = user?.role === 'student' && studentData.grade > 0 && studentData.grade <= 6;
            const isTutor = user?.role === 'tutor';
            
            if (isTutor || isYoungStudent) {
                const config = {
                    particleCount: 200,
                    spread: 120,
                    startVelocity: 55,
                    scalar: 2.5,
                    ticks: 300,
                    zIndex: 9999
                };

                // Fire from left
                confetti({
                    ...config,
                    origin: { x: 0.2, y: 0.6 }
                });
                // Fire from right
                confetti({
                    ...config,
                    origin: { x: 0.8, y: 0.6 }
                });
            }
        };

        // Collaborative Cursor Handling
        const handlePointerUpdate = (payload: any) => {
            if (payload.userId === user?.id) return;
            
            setCollaborators(prev => {
                const next = new Map(prev);
                next.set(payload.userId, {
                    pointer: payload.pointer,
                    button: payload.button,
                    username: payload.username,
                    selectedElementIds: payload.selectedElementIds,
                });
                return next;
            });

            if (excalidrawAPI) {
                excalidrawAPI.updateScene({ collaborators: collaborators });
            }
        };

        // Sync Slide Navigation — use slideRef.current to avoid stale closure
        const handleSlideChange = (payload: any) => {
            if (user?.role !== 'tutor' && payload.index !== slideRef.current) {
                switchSlide(payload.index, undefined, true);
            }
        };

        // Named handler so socket.off can actually remove it
        const handleReceiveUpdate = (data: any) => {
            if (whiteboardRef.current.isUpdating) return;
            whiteboardRef.current.isUpdating = true;
            const remoteElements = Array.isArray(data) ? data : (data.elements || []);
            if (JSON.stringify(excalidrawAPI.getSceneElements()) !== JSON.stringify(remoteElements)) {
                excalidrawAPI.updateScene({ elements: remoteElements });
            }
            requestAnimationFrame(() => { whiteboardRef.current.isUpdating = false; });
        };

        // Receives heavy file payloads separately
        const handleRemoteFiles = (remoteFiles: any) => {
            if (remoteFiles && Object.keys(remoteFiles).length > 0) {
                excalidrawAPI.addFiles(Object.values(remoteFiles));
            }
        };

        // When a student joins mid-session they emit whiteboard.requestSync;
        // the tutor responds with the full current scene.
        const handleSyncRequest = () => {
            if (user?.role !== 'tutor') return;
            const elements = excalidrawAPI.getSceneElements();
            const files = excalidrawAPI.getFiles();
            socket.emit('whiteboard.update', { sessionId, update: { elements } });
            socket.emit('whiteboard.syncFiles', { sessionId, files });
        };

        socket.on('whiteboard.receiveUpdate', handleReceiveUpdate);
        socket.on('whiteboard.receiveFiles', handleRemoteFiles);
        socket.on('whiteboard.penAccessUpdated', handlePenAccess);
        socket.on('whiteboard.confettiFired', handleConfetti);
        socket.on('whiteboard.pointerUpdate', handlePointerUpdate);
        socket.on('whiteboard.slideChanged', handleSlideChange);
        socket.on('whiteboard.syncRequest', handleSyncRequest);

        // Polling Listeners
        socket.on('poll:launched', (data: any) => {
            setActivePoll(data);
            setStudentSelection(null);
            setPollResults(null);
            setFinalPollResults(null);
        });

        socket.on('poll:results', (data: any) => {
            if (user?.role === 'tutor') {
                setPollResults(data);
            }
        });

        socket.on('poll:closed', (data: any) => {
            setActivePoll(null);
            setFinalPollResults(data);
            setTimeout(() => setFinalPollResults(null), 3000);
        });

        return () => {
            socket.off('whiteboard.receiveUpdate', handleReceiveUpdate);
            socket.off('whiteboard.receiveFiles', handleRemoteFiles);
            socket.off('whiteboard.penAccessUpdated', handlePenAccess);
            socket.off('whiteboard.confettiFired', handleConfetti);
            socket.off('whiteboard.pointerUpdate', handlePointerUpdate);
            socket.off('whiteboard.slideChanged', handleSlideChange);
            socket.off('whiteboard.syncRequest', handleSyncRequest);
            socket.off('poll:launched');
            socket.off('poll:results');
            socket.off('poll:closed');
        };
    }, [excalidrawAPI, socket, sessionId, user?.role, hasPenAccess, studentData.grade, switchSlide]);

    // Stable onChange registration — separate effect so it never re-stacks
    useEffect(() => {
        if (!excalidrawAPI || !socket || !sessionId) return;
        if (user?.role !== 'tutor' && !hasPenAccess) return;

        const lastSyncedFiles = { current: '' };

        const unsubscribe = excalidrawAPI.onChange((elements: any[], _appState: any, files: any) => {
            if (whiteboardRef.current.isUpdating) return;

            socket.emit('whiteboard.update', { sessionId, update: { elements } });

            const filesString = JSON.stringify(files);
            if (filesString !== lastSyncedFiles.current) {
                lastSyncedFiles.current = filesString;
                socket.emit('whiteboard.syncFiles', { sessionId, files });
            }
        });

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, [excalidrawAPI, socket, sessionId, user?.role, hasPenAccess]);

    // Students/parents request the current whiteboard state when their canvas is ready.
    // The tutor's handleSyncRequest handler responds with the full scene + files.
    useEffect(() => {
        if (!excalidrawAPI || !socket || !sessionId) return;
        if (user?.role === 'tutor') return;
        socket.emit('whiteboard.requestSync', { sessionId });
    }, [excalidrawAPI, socket, sessionId, user?.role]);

    // Fetch Daily.co Room & Token
    useEffect(() => {
        if (hasJoined && sessionId) {
            setVideoLoading(true);
            const token = localStorage.getItem('K12_TOKEN');

            api.get(`/sessions/${sessionId}/daily-token`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setDailyRoomUrl(res.data.roomUrl);
                    setDailyToken(res.data.token);
                    setVideoLoading(false);
                })
                .catch(err => {
                    console.error('[Daily] Failed to get token:', err);
                    toast.error('Failed to join video session. Please try again.');
                    setVideoLoading(false);
                });
        }
    }, [hasJoined, sessionId]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading session...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-background">
            {/* JOIN OVERLAY */}
            {!hasJoined && (
                <div className="absolute inset-0 z-50 bg-linear-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-md flex items-center justify-center">
                    <div className="text-center max-w-md px-6">
                        <div className="mb-8">
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                                <span className="text-4xl">🎓</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {booking?.subject?.name || 'Tutoring Session'}
                            </h1>
                            <p className="text-white/70">Ready to start your session?</p>
                        </div>

                        <button
                            onClick={() => setHasJoined(true)}
                            className="w-full py-4 px-8 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-2xl shadow-2xl shadow-green-500/25 transition-all transform hover:scale-105 active:scale-95"
                        >
                            🚀 Join Session
                        </button>
                        <p className="text-white/50 text-sm mt-4">Session ID: {sessionId.slice(0, 8)}...</p>
                    </div>
                </div>
            )}

            {/* 1. BASE LAYER: EXCALIDRAW WHITEBOARD (offset below HUD bar) */}
            <div className={`absolute top-[52px] left-0 right-0 bottom-0 z-0 ${user?.role === 'student' || user?.role === 'parent' ? (hasPenAccess ? '' : 'pointer-events-none') : ''}`}>
                {ExcalidrawComp ? (
                    <ExcalidrawComp
                        excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                        zenModeEnabled={false}
                        gridModeEnabled={false}
                        viewModeEnabled={user?.role === 'student' || user?.role === 'parent' ? !hasPenAccess : false}
                        theme="light"
                        name="K12 Board"
                        onPointerUpdate={onPointerUpdate}
                        initialData={{
                            appState: { viewBackgroundColor: '#ffffff', currentItemFontFamily: 1, theme: 'light', zenModeEnabled: false, viewModeEnabled: user?.role === 'student' || user?.role === 'parent' ? !hasPenAccess : false },
                        }}
                        UIOptions={{
                            canvasActions: { loadScene: false, saveToActiveFile: false, export: { saveFileToDisk: true }, saveAsImage: true, toggleTheme: false },
                            tools: { image: true },
                            dockedSidebarBreakpoint: 0,
                        }}
                        libraryReturnUrl={undefined}
                        onLibraryChange={() => {}}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-text-secondary bg-gray-50">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-medium">Loading Canvas...</p>
                    </div>
                )}
            </div>

            {/* DAILY.CO VIDEO OVERLAY */}
            {hasJoined && dailyRoomUrl && dailyToken && (
                <div
                    className="fixed z-50 bg-black rounded-2xl border-2 border-purple-500/50 shadow-2xl overflow-hidden"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        width: isExpanded ? '80vw' : '400px',
                        height: isExpanded ? '80vh' : '300px',
                        transition: 'width 0.3s, height 0.3s'
                    }}
                >
                    <div
                        onMouseDown={handleMouseDown}
                        className="absolute top-0 left-0 right-0 h-10 bg-linear-to-r from-purple-600 to-indigo-600 cursor-move flex items-center justify-between px-4 z-10"
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">Session Room</span>
                            <span className="text-sm font-black text-white flex items-center gap-2">
                                {booking?.students?.first_name || 'Student'}&apos;s Classroom
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-white hover:bg-white/20 rounded px-3 py-1 text-sm transition-colors"
                            >
                                {isExpanded ? '🗕' : '🗖'}
                            </button>
                        </div>
                    </div>
                    <iframe
                        src={`${dailyRoomUrl}?t=${dailyToken}`}
                        allow="camera; microphone; fullscreen; speaker; display-capture"
                        style={{ width: '100%', height: '100%', border: 'none', paddingTop: '40px' }}
                    />
                </div>
            )}

            {/* Loading Overlay for Video */}
            {hasJoined && videoLoading && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                        <p className="font-bold text-lg">Connecting to video session...</p>
                    </div>
                </div>
            )}

            {/* ── TOP HUD BAR ─────────────────────────────────────────────── */}
            <div className="absolute top-0 left-0 right-0 h-[52px] z-20 bg-black/80 backdrop-blur-xl border-b border-white/8 flex items-center px-4 gap-3">
                {/* Left: live indicator + subject */}
                <div className="flex items-center gap-2">
                    <div className="relative shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 relative z-10" />
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-60" />
                    </div>
                    <span className="text-white text-xs font-bold truncate">
                        {booking?.subject?.name || 'Session'}
                    </span>
                </div>

                {/* Right: timer + reactions + end */}
                <div className="flex items-center gap-2 ml-auto">
                    <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10 transition-all duration-500 tabular-nums ${
                        timeRemaining <= 5 * 60
                            ? 'bg-red-600/90 text-white animate-pulse'
                            : timeRemaining <= 10 * 60
                            ? 'bg-amber-500/90 text-white'
                            : 'bg-white/10 text-white'
                    }`}>
                        <Timer size={13} />
                        <span className="font-bold text-xs tracking-tight">{formatTime(timeRemaining)}</span>
                    </div>

                    <div className="flex gap-0.5 bg-white/8 rounded-lg p-0.5 border border-white/8">
                        {['👍', '🎉', '💡', '❓'].map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => sendReaction(emoji)}
                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/20 transition-all text-base active:scale-90"
                            >
                                {emoji}
                            </button>
                        ))}
                        <button
                            onClick={() => socket?.emit('whiteboard.triggerConfetti', { sessionId })}
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-pink-500 text-white transition-all"
                            title="Confetti"
                        >
                            <Smile size={15} />
                        </button>
                    </div>

                    {user?.role === 'tutor' && (
                        <button
                            onClick={() => setShowAttendance(!showAttendance)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-white/10 bg-white/10 hover:bg-white/20 text-white transition-all"
                            title="Attendance"
                        >
                            📝
                        </button>
                    )}

                    <button
                        onClick={() => {
                            if (user?.role === 'tutor') {
                                setShowNoteModal(true);
                            } else if (user?.role === 'parent') {
                                router.push('/parent/dashboard');
                            } else {
                                router.push('/students/dashboard');
                            }
                        }}
                        className="bg-red-500/90 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                        <LogOut size={13} />
                        <span className="hidden sm:inline">End</span>
                    </button>
                </div>
            </div>

            {/* ── STUDENT SNAPSHOT (tutor only, collapsible) ───────────────── */}
            {user?.role === 'tutor' && !snapshotHidden && (
                <div className="absolute top-[60px] left-2 z-10">
                    <button
                        onClick={() => setSnapshotExpanded(v => !v)}
                        className="flex items-center gap-2 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl px-2.5 py-1.5 text-white hover:bg-black/80 transition-all"
                    >
                        <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center text-xs font-black shrink-0">
                            {studentData.name.charAt(0)}
                        </div>
                        <div className="text-left">
                            <div className="text-xs font-bold leading-none">{studentData.name}</div>
                            <div className="text-[10px] text-green-400 leading-none mt-0.5">● Active</div>
                        </div>
                        <ChevronRight size={12} className={`text-white/30 transition-transform duration-200 ${snapshotExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {snapshotExpanded && (
                        <div className="mt-1">
                            <StudentSnapshotCard
                                studentName={studentData.name}
                                interests={studentData.interests}
                                recentProgress={studentData.recentProgress}
                                struggleAreas={studentData.struggleAreas}
                            />
                            <button
                                onClick={() => { setSnapshotHidden(true); setSnapshotExpanded(false); }}
                                className="mt-1 text-[10px] text-white/20 hover:text-white/50 transition-colors w-full text-right pr-1"
                            >
                                Hide ×
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── TUTOR TOOLS STRIP (right side, vertical) ─────────────────── */}
            {user?.role === 'tutor' && (
                <div className="absolute top-[60px] right-2 z-50 pointer-events-auto">
                    <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 flex flex-col gap-1.5 items-center">
                        <span className="text-white/20 text-[8px] font-black tracking-widest pt-0.5 pb-1">TOOLS</span>

                        <label className="cursor-pointer w-9 h-9 rounded-lg bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transition-all" title="Upload PDF / Slides">
                            {uploadingSlides ? <span className="animate-spin text-sm">⏳</span> : <FileUp size={16} />}
                            <input type="file" accept=".pdf,image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={handleSlideUpload} disabled={uploadingSlides} />
                        </label>

                        <button
                            onClick={() => setShowAssetLibrary(!showAssetLibrary)}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all relative ${showAssetLibrary ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'}`}
                            title="Asset Library"
                        >
                            <Library size={16} />
                            {showLibraryTip && (
                                <>
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-black" />
                                    <div className="absolute right-12 top-0 bg-green-600 text-white text-[10px] font-black px-3 py-2 rounded-xl whitespace-nowrap shadow-2xl animate-in fade-in slide-in-from-right-2 duration-300 pointer-events-none">
                                        Click to open Manipulatives & Assets
                                        <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-green-600 rotate-45" />
                                    </div>
                                </>
                            )}
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 text-[10px] font-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap border border-white/10 pointer-events-none shadow-xl">ASSET LIBRARY</span>
                        </button>

                        <button
                            onClick={() => {
                                socket?.emit('whiteboard.togglePenAccess', {
                                    sessionId,
                                    studentId: booking?.students?.id || 'student1',
                                    hasAccess: !hasPenAccess
                                });
                                setHasPenAccess(!hasPenAccess);
                            }}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all border ${
                                hasPenAccess ? 'bg-green-600 border-green-500/50' : 'bg-white/10 hover:bg-white/20 border-white/10'
                            }`}
                            title={hasPenAccess ? 'Revoke Pen' : 'Grant Pen'}
                        >
                            <PenTool size={16} />
                        </button>

                        <button
                            onClick={() => setShowPollModal(true)}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all bg-white/10 hover:bg-white/20 border border-white/10"
                            title="Quick Check"
                        >
                            <BarChart size={16} />
                        </button>

                        {slides.length > 0 && (
                            <>
                                <div className="w-5 h-px bg-white/10 my-0.5" />
                                <button
                                    onClick={() => switchSlide(currentSlideIndex - 1)}
                                    disabled={currentSlideIndex === 0}
                                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-25 transition-all"
                                    title="Previous slide"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-white/40 text-[9px] font-bold tabular-nums">
                                    {currentSlideIndex + 1}/{slides.length}
                                </span>
                                <button
                                    onClick={() => switchSlide(currentSlideIndex + 1)}
                                    disabled={currentSlideIndex === slides.length - 1}
                                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-25 transition-all"
                                    title="Next slide"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* 3. OVERLAY LAYER: CHAT SIDEBAR */}
            <div className="absolute right-4 bottom-24 z-50 w-80 pointer-events-auto">
                <SessionChat
                    key={booking?.sessions?.[0]?.id || sessionId}
                    sessionId={booking?.sessions?.[0]?.id || sessionId}
                    socket={socket}
                />
            </div>

            {/* ── PDF THUMBNAIL STRIP ──────────────────────────────────────── */}
            {slides.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-[68px] z-10 bg-black/88 backdrop-blur-xl border-t border-white/6 flex items-center gap-2 px-3 overflow-x-auto">
                    <span className="text-white/25 text-[9px] font-black tracking-widest shrink-0 mr-1">SLIDES</span>
                    {slides.map((slide, index) => (
                        <button
                            key={index}
                            onClick={() => switchSlide(index)}
                            className={`shrink-0 w-[44px] h-[44px] rounded-md overflow-hidden border-2 transition-all ${
                                index === currentSlideIndex
                                    ? 'border-white scale-105 shadow-lg shadow-purple-500/30'
                                    : 'border-white/15 hover:border-white/40 opacity-60 hover:opacity-100'
                            }`}
                            title={`Slide ${index + 1}`}
                        >
                            <img src={slide} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                    <span className="ml-auto text-white/25 text-[9px] font-semibold shrink-0 tabular-nums">
                        {currentSlideIndex + 1} / {slides.length}
                    </span>
                </div>
            )}

            {/* ASSET LIBRARY PANEL (TUTOR ONLY) - Hidden on Mobile */}
            {user?.role === 'tutor' && showAssetLibrary && (
                <div className="absolute left-4 top-[60px] bottom-24 w-72 hidden md:flex bg-white/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl rounded-2xl p-4 overflow-y-auto flex-col pointer-events-auto z-50">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg text-purple-900 leading-none">Library</h2>
                        <button onClick={() => setShowAssetLibrary(false)} className="text-gray-400 hover:text-gray-600">
                             <X size={16} />
                        </button>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-xl mb-4 shrink-0">
                        <button 
                            onClick={() => setLibraryTab('assets')}
                            className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${libraryTab === 'assets' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Assets
                        </button>
                        <button 
                            onClick={() => setLibraryTab('manipulatives')}
                            className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${libraryTab === 'manipulatives' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Manipulatives
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        {libraryTab === 'assets' ? (
                            <div className="grid grid-cols-1 gap-3">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 ml-1">Uploaded Assets</p>
                                {mockLibraryAssets.map(asset => (
                                    <div 
                                        key={asset.id}
                                        className="border rounded-xl cursor-pointer overflow-hidden hover:ring-2 hover:ring-purple-400 transition-all bg-gray-50 flex flex-col group"
                                        onClick={() => importImageToExcalidraw(asset.url)}
                                    >
                                        <div className="relative overflow-hidden h-24">
                                            <img src={asset.url} alt={asset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        </div>
                                        <div className="p-2 text-[10px] font-bold text-center text-gray-700 bg-white">
                                            {asset.label}
                                        </div>
                                    </div>
                                ))}
                                {mockLibraryAssets.length === 0 && (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
                                        <p className="text-xs text-gray-400">No assets uploaded yet</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {Object.entries(MANIPULATIVES_DATA).map(([grade, items]) => (
                                    <div key={grade} className="border-b border-gray-100 last:border-0 pb-2">
                                        <button 
                                            onClick={() => setExpandedSections(prev => ({ ...prev, [grade]: !prev[grade] }))}
                                            className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 rounded-lg px-2 transition-colors"
                                        >
                                            <span className="text-[11px] font-black text-purple-900 uppercase tracking-widest">
                                                {grade === 'k-1' ? 'Grades K–1' : grade === '2-3' ? 'Grades 2–3' : 'Grades 4–6'}
                                            </span>
                                            {expandedSections[grade] ? <ChevronDown size={14} className="text-purple-400" /> : <ChevronRight size={14} className="text-purple-400" />}
                                        </button>
                                        
                                        {expandedSections[grade] && (
                                            <div className="grid grid-cols-2 gap-2 mt-2 px-1">
                                                {items.map(item => (
                                                    <div key={item.id} className="relative group">
                                                        <button
                                                            onClick={() => insertManipulative(item)}
                                                            title={item.label}
                                                            className="w-full flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-purple-300 hover:bg-white hover:shadow-lg hover:shadow-purple-500/10 transition-all active:scale-95"
                                                        >
                                                            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">{item.thumbnail}</span>
                                                            <span className="text-[9px] font-black text-gray-700 text-center leading-tight group-hover:text-purple-600 transition-colors">{item.label}</span>
                                                        </button>
                                                        {item.id.includes('dice') && (
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const roll = Math.floor(Math.random() * 6) + 1;
                                                                    const rolledItem = {
                                                                        ...item,
                                                                        elements: [
                                                                            item.elements[0], // the box
                                                                            ...DICE_FACES[roll as keyof typeof DICE_FACES]
                                                                        ],
                                                                        label: `Dice Rolled (${roll})`
                                                                    };
                                                                    insertManipulative(rolledItem);
                                                                    toast.success(`🎲 Rolled a ${roll}!`);
                                                                }}
                                                                className="absolute top-1 right-1 bg-purple-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                            >
                                                                ROLL
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ATTENDANCE TRACKER OVERLAY */}
            <AttendanceTracker
                isOpen={showAttendance}
                onClose={() => setShowAttendance(false)}
                sessionId={sessionId}
                students={sessionRoster}
                onSave={saveAttendance}
            />

            {/* END SESSION NOTE MODAL (TUTOR ONLY) */}
            {showNoteModal && (
                <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10">
                        <div className="p-6">
                            <h2 className="text-2xl font-black text-white mb-2">Wrap Up Session</h2>
                            <p className="text-sm text-white/60 mb-6">
                                Please leave a quick note for the parents about {booking?.students?.first_name || 'the student'}&apos;s progress today.
                            </p>

                            <div className="relative">
                                <textarea
                                    value={sessionNote}
                                    onChange={(e) => setSessionNote(e.target.value.slice(0, 500))}
                                    placeholder="e.g. Alice did great with fractions today! We should focus more on long division next time..."
                                    className="w-full h-40 p-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-purple-500 focus:ring-0 transition-all text-sm text-white placeholder:text-white/20 resize-none"
                                />
                                <div className="absolute bottom-3 right-3 text-[10px] font-bold text-white/40">
                                    {500 - sessionNote.length} characters remaining
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 flex gap-3 border-t border-white/10">
                            <button
                                onClick={() => router.push('/tutor/dashboard')}
                                className="flex-1 px-4 py-3 text-sm font-bold text-white/40 hover:text-white/70 transition-colors"
                            >
                                Not now, just end
                            </button>
                            <button
                                onClick={async () => {
                                    setSubmittingNote(true);
                                    try {
                                        await api.patch(`/sessions/${sessionId}/tutor-note`, { note: sessionNote });
                                        toast.success('Note sent to parents!');
                                        router.push('/tutor/dashboard');
                                    } catch (error) {
                                        toast.error('Failed to save note');
                                        setSubmittingNote(false);
                                    }
                                }}
                                disabled={submittingNote}
                                className="flex-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold font-sm shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all"
                            >
                                {submittingNote ? 'Saving...' : 'End & Add Note'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* WRAP UP CAPSULE */}
            {showWrapUp && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce cursor-pointer" onClick={() => setShowWrapUp(false)}>
                    <div className="bg-orange-500 border-2 border-orange-400 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                        <span className="text-xl">⏰</span>
                        <p className="font-bold text-sm">
                            10 minutes remaining! Time to wrap up and ask final questions.
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowWrapUp(false);
                            }}
                            className="ml-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* FLOATING REACTIONS */}
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                {reactions.map(r => (
                    <div
                        key={r.id}
                        className="absolute bottom-0 text-4xl animate-float-up"
                        style={{ 
                            left: `${r.x}%`,
                            fontSize: '64px',
                            animationDelay: `${r.delay || 0}s`
                        }}
                    >
                        {r.emoji}
                    </div>
                ))}
            </div>

            {/* QUICK CHECK / POLL MODAL (TUTOR ONLY) */}
            {showPollModal && (
                <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-black text-white">Push a Quick Check</h2>
                                <button onClick={() => setShowPollModal(false)} className="text-white/40 hover:text-white/70">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <label className="block text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1.5 ml-1">Question (Max 120 chars)</label>
                            <input 
                                type="text"
                                maxLength={120}
                                value={pollQuestion}
                                onChange={(e) => setPollQuestion(e.target.value)}
                                placeholder="e.g. What is the square root of 64?"
                                className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-purple-500 focus:ring-0 transition-all text-sm text-white placeholder:text-white/20 mb-4"
                            />

                            <label className="block text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1.5 ml-1">Options (Min 2)</label>
                            <div className="space-y-2 mb-6">
                                {['A', 'B', 'C', 'D'].map((label, idx) => (
                                    <div key={label} className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-purple-400/60">{label}</div>
                                        <input 
                                            type="text"
                                            value={pollOptions[idx]}
                                            onChange={(e) => {
                                                const newOpts = [...pollOptions];
                                                newOpts[idx] = e.target.value;
                                                setPollOptions(newOpts);
                                            }}
                                            placeholder={`Option ${label}`}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-purple-500 focus:ring-0 transition-all text-sm text-white placeholder:text-white/20"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    const validOptions = pollOptions.filter(o => o.trim().length > 0);
                                    if (!pollQuestion.trim() || validOptions.length < 2) {
                                        toast.error("Enter a question and at least 2 options");
                                        return;
                                    }
                                    socket?.emit('poll:launch', { 
                                        sessionId, 
                                        question: pollQuestion, 
                                        options: validOptions,
                                        userId: user?.id
                                    });
                                    setShowPollModal(false);
                                    setPollQuestion('');
                                    setPollOptions(['', '', '', '']);
                                }}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                            >
                                🚀 Launch Poll
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TUTOR ACTIVE POLL RESULTS PANEL */}
            {user?.role === 'tutor' && activePoll && (
                <div className="absolute top-[60px] left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
                    <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-5 animate-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Live Poll Active</span>
                            </div>
                            <span className="text-[10px] font-bold text-white/40">{pollResults?.totalResponses || 0} Responses</span>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-4">{activePoll.question}</h3>
                        
                        <div className="space-y-2 mb-6">
                            {activePoll.options.map((opt, idx) => {
                                const count = pollResults?.results[idx] || 0;
                                const total = pollResults?.totalResponses || 0;
                                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={idx} className="relative h-8 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                                        <div 
                                            className="absolute inset-y-0 left-0 bg-purple-500/20 border-r border-purple-500/30 transition-all duration-500 ease-out" 
                                            style={{ width: `${pct}%` }} 
                                        />
                                        <div className="absolute inset-0 px-3 flex items-center justify-between text-[11px] font-medium">
                                            <span className="text-white truncate pr-4">{opt}</span>
                                            <span className="text-purple-400 font-bold">{count} ({pct}%)</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <button
                            onClick={() => socket?.emit('poll:close', { sessionId, userId: user?.id })}
                            className="w-full py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        >
                            Close Poll & Show Results
                        </button>
                    </div>
                </div>
            )}

            {/* STUDENT POLL OVERLAY */}
            {user?.role === 'student' && activePoll && (
                <div className="fixed inset-0 z-40 bg-purple-900/40 backdrop-blur-lg flex items-center justify-center p-6 pb-24">
                    <div className="bg-gray-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
                        <div className="p-8 md:p-10 text-center">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <BarChart className="text-purple-400" size={32} />
                            </div>
                            <h2 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-2">Quick Check!</h2>
                            <h3 className="text-2xl font-black text-white mb-8 leading-tight">{activePoll.question}</h3>
                            
                            {studentSelection === null ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {activePoll.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setStudentSelection(idx);
                                                socket?.emit('poll:respond', { sessionId, userId: user.id, optionIndex: idx });
                                            }}
                                            className="p-5 bg-white/5 hover:bg-purple-600 text-white border-2 border-white/10 hover:border-purple-400 rounded-2xl text-left font-bold transition-all transform active:scale-[0.98] group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-purple-500 shadow-sm flex items-center justify-center text-sm font-black text-purple-400 group-hover:text-white transition-colors">
                                                    {['A', 'B', 'C', 'D'][idx]}
                                                </div>
                                                {opt}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-10">
                                    <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Smile size={24} />
                                    </div>
                                    <p className="text-lg font-bold text-white">Answer submitted!</p>
                                    <p className="text-sm text-white/50 mt-1">Waiting for the tutor to show results...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* FINAL RESULTS POPUP (FOR EVERYONE) */}
            {finalPollResults && (
                <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
                    <div className="bg-gray-900 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl">📊</span>
                            </div>
                            <h2 className="text-xs font-black text-green-500 uppercase tracking-widest mb-2">Poll Results</h2>
                            <h3 className="text-xl font-bold text-white mb-6">{finalPollResults.question}</h3>
                            
                            <div className="space-y-2 text-left">
                                {finalPollResults.options.map((opt, idx) => {
                                    const count = finalPollResults.results[idx] || 0;
                                    const total = finalPollResults.totalResponses || 0;
                                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                    return (
                                        <div key={idx} className="relative h-10 bg-white/5 rounded-xl overflow-hidden border border-white/10">
                                            <div 
                                                className="absolute inset-y-0 left-0 bg-green-500/20 border-r border-green-500/30 transition-all duration-700 ease-out" 
                                                style={{ width: `${pct}%` }} 
                                            />
                                            <div className="absolute inset-0 px-4 flex items-center justify-between text-xs font-bold">
                                                <span className="text-white truncate pr-4">{opt}</span>
                                                <span className="text-green-400">{count} ({pct}%)</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Closed by tutor</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes float-up {
                    0% { transform: translateY(10vh) scale(0.5); opacity: 0; }
                    10% { opacity: 1; transform: translateY(5vh) scale(1.2); }
                    80% { opacity: 1; transform: translateY(-70vh) scale(1); }
                    100% { transform: translateY(-110vh) scale(0.8); opacity: 0; }
                }
                .animate-float-up {
                    animation: float-up 4s ease-out forwards;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .z-9999 { z-index: 9999; }
            `}</style>
        </div>
    );
}