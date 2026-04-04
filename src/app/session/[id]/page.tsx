'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import SessionChat from '@/app/components/SessionChat';
import api from '@/app/lib/api';
// import { DailyProvider } from '@daily-co/daily-react'; // Not used directly, using iframe
import AttendanceTracker from '@/app/components/session/AttendanceTracker';
import SessionFlowBar, { SessionPhase } from '@/app/components/session/SessionFlowBar';
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
    PenTool
} from 'lucide-react';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version || '5.6.205'}/build/pdf.worker.min.mjs`;
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
        console.log('Saving attendance:', records);
        // api.post(`/sessions/${sessionId}/attendance`, records);
        alert('Attendance saved!');
    };

    // Video Card State
    const [position, setPosition] = useState({ x: 8, y: 280 });
    const [isExpanded, setIsExpanded] = useState(false);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const startPos = useRef({ x: 0, y: 0 });

    // Whiteboard Enhancements State
    const [hasPenAccess, setHasPenAccess] = useState(false);
    const [uploadingSlides, setUploadingSlides] = useState(false);
    const [showAssetLibrary, setShowAssetLibrary] = useState(false);

    // Session HUD State
    const [sessionPhase, setSessionPhase] = useState<SessionPhase>('WARM_CONNECT');
    const [snapshotExpanded, setSnapshotExpanded] = useState(false);
    const [snapshotHidden, setSnapshotHidden] = useState(false);
    
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

    const slideRef = useRef(0);
    const annotationsRef = useRef<Record<number, any[]>>({});

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
            console.log('[Attention] Socket connected');
            newSocket.emit('joinSession', { sessionId, userId: user.id });
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

    const handlePhaseChange = (phase: SessionPhase) => {
        setSessionPhase(phase);
        socket?.emit('whiteboard.phaseChange', { sessionId, phase });
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

        // Use high-resolution scaling for the image (800x600 minimum)
        const elementId = `img_${fileId}`;
        const targetWidth = 800; 
        const targetHeight = 600;
        const appState = excalidrawAPI.getAppState();
        const centerX = (appState.width / 2 - appState.scrollX) / appState.zoom;
        const centerY = (appState.height / 2 - appState.scrollY) / appState.zoom;
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

        // Center on the new image
        setTimeout(() => {
            excalidrawAPI.scrollToContent(excalidrawAPI.getSceneElements().filter((e: any) => e.id === elementId), {
                fitToViewport: true,
                padding: 20
            });
        }, 100);
    }, [excalidrawAPI]);

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

    // Handle slide upload
    const handleSlideUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !sessionId) return;
        
        // PPT Warning
        if (file.name.toLowerCase().endsWith('.ppt') || file.name.toLowerCase().endsWith('.pptx')) {
            toast.info('For best results, please export PPT to PDF before uploading.', { duration: 5000 });
        }

        setUploadingSlides(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const token = localStorage.getItem('K12_TOKEN');
            
            const res = await api.post(`/sessions/${sessionId}/slides`, formData, {
                timeout: 60000, // Explicit 60s timeout for large PDF/Slides
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` 
                }
            });
            
            if (res.data.success && excalidrawAPI) {
                // Return value is binary base64 directly from backend (for smaller images or fast response)
                if (res.data.base64) {
                    await importImageToExcalidraw(res.data.base64, `slide_${Date.now()}`);
                    toast.success('Image/Slide inserted');
                } 
                // Local PDF conversion fallback for legacy or high-quality needs
                else if (file.name.toLowerCase().endsWith('.pdf')) {
                    toast.info('Processing multi-page PDF locally...', { duration: 3000 });
                    const fileReader = new FileReader();
                    fileReader.onload = async function() {
                        try {
                            const typedarray = new Uint8Array(this.result as ArrayBuffer);
                            const pdf = await pdfjsLib.getDocument(typedarray).promise;
                            const newSlides: string[] = [];
                            
                            for (let i = 1; i <= pdf.numPages; i++) {
                                const page = await pdf.getPage(i);
                                const viewport = page.getViewport({ scale: 1.5 });
                                const canvas = document.createElement('canvas');
                                const context = canvas.getContext('2d');
                                canvas.height = viewport.height;
                                canvas.width = viewport.width;
                                
                                await page.render({ canvasContext: context!, viewport: viewport, canvas: canvas }).promise;
                                newSlides.push(canvas.toDataURL('image/png'));
                            }
                            
                            setSlides(newSlides);
                            setCurrentSlideIndex(0);
                            setSlideAnnotations({});
                            
                            // Insert first page automatically
                            if (newSlides.length > 0) {
                                await importImageToExcalidraw(newSlides[0], 'page_1');
                            }
                            toast.success(`Loaded ${newSlides.length} pages`);
                        } catch (err) {
                            console.error('[PDF] Local render failed:', err);
                            toast.error('Failed to render PDF pages locally');
                        }
                    };
                    fileReader.readAsArrayBuffer(file);
                }
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
        
        console.log('[Collab] Initializing Whiteboard sync via Socket.io');

        // Receives update from Tutor
        const handleRemoteUpdate = (remoteData: any) => {
            if (whiteboardRef.current.isUpdating) return;
            
            whiteboardRef.current.isUpdating = true;
            
            // remoteData could be an array (old payload format) or an object { elements, files }
            const remoteElements = Array.isArray(remoteData) ? remoteData : (remoteData.elements || []);
            const remoteFiles = !Array.isArray(remoteData) && remoteData.files ? remoteData.files : null;
            
            // 1. Add files to Excalidraw so images can render
            if (remoteFiles && Object.keys(remoteFiles).length > 0) {
                 excalidrawAPI.addFiles(Object.values(remoteFiles));
            }
            
            // 2. Update the scene elements
            if (JSON.stringify(excalidrawAPI.getSceneElements()) !== JSON.stringify(remoteElements)) {
                excalidrawAPI.updateScene({ elements: remoteElements });
            }
            
            requestAnimationFrame(() => {
                whiteboardRef.current.isUpdating = false;
            });
        };

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

        // Sync Slide Navigation
        const handleSlideChange = (payload: any) => {
            if (payload.index !== currentSlideIndex) {
                // For non-tutors, we force the slide change
                if (user?.role !== 'tutor') {
                    // Trigger visual switch (skipEmit=true to avoid echo)
                    switchSlide(payload.index, undefined, true);
                }
            }
        };

        // Receives dedicated element updates
        const handleRemoteElementUpdate = (remoteElements: any[]) => {
            if (whiteboardRef.current.isUpdating) return;
            whiteboardRef.current.isUpdating = true;
            
            if (JSON.stringify(excalidrawAPI.getSceneElements()) !== JSON.stringify(remoteElements)) {
                excalidrawAPI.updateScene({ elements: remoteElements });
            }
            
            setTimeout(() => { whiteboardRef.current.isUpdating = false; }, 100);
        };

        // Receives heavy file payloads separately
        const handleRemoteFiles = (remoteFiles: any) => {
            if (remoteFiles && Object.keys(remoteFiles).length > 0) {
                 excalidrawAPI.addFiles(Object.values(remoteFiles));
            }
        };

        socket.on('whiteboard.receiveUpdate', (data: any) => {
            const elements = Array.isArray(data) ? data : (data.elements || []);
            handleRemoteElementUpdate(elements);
        });
        socket.on('whiteboard.receiveFiles', handleRemoteFiles);

        socket.on('whiteboard.penAccessUpdated', handlePenAccess);
        socket.on('whiteboard.confettiFired', handleConfetti);
        socket.on('whiteboard.pointerUpdate', handlePointerUpdate);
        socket.on('whiteboard.slideChanged', handleSlideChange);

        const handleRemotePhase = ({ phase }: { phase: SessionPhase }) => {
            setSessionPhase(phase);
        };
        socket.on('whiteboard.phaseChange', handleRemotePhase);

        // Track last synced files to avoid re-syncing heavy data
        const lastSyncedFiles = { current: '' };

        // Sends updates separated by type
        if (user?.role === 'tutor' || hasPenAccess) {
            excalidrawAPI.onChange((elements: any[], appState: any, files: any) => {
                if (whiteboardRef.current.isUpdating) return;

                // 1. Sync light elements for drawing strokes
                socket.emit('whiteboard.update', {
                    sessionId,
                    update: { elements }
                });

                // 2. Sync heavy files ONLY when changed (not on every stroke)
                const filesString = JSON.stringify(files);
                if (filesString !== lastSyncedFiles.current) {
                    lastSyncedFiles.current = filesString;
                    socket.emit('whiteboard.syncFiles', {
                        sessionId,
                        files
                    });
                }
            });
        }

        return () => {
            socket.off('whiteboard.receiveUpdate', handleRemoteUpdate);
            socket.off('whiteboard.penAccessUpdated', handlePenAccess);
            socket.off('whiteboard.confettiFired', handleConfetti);
            socket.off('whiteboard.pointerUpdate', handlePointerUpdate);
            socket.off('whiteboard.slideChanged', handleSlideChange);
            socket.off('whiteboard.phaseChange');
        };
    }, [excalidrawAPI, socket, sessionId, user?.role, hasPenAccess, studentData.grade, currentSlideIndex, switchSlide]);



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
                    alert('Failed to join video session. Please try again.');
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
                            canvasActions: { loadScene: false, saveToActiveFile: false, export: { saveFileToDisk: true }, saveAsImage: true, toggleTheme: false }
                        }}
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
                        <span className="text-white text-sm font-bold">📹 Live Session</span>
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
                <div className="flex items-center gap-2 min-w-[140px]">
                    <div className="relative shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 relative z-10" />
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-60" />
                    </div>
                    <span className="text-white text-xs font-bold truncate">
                        {booking?.subject?.name || 'Session'}
                    </span>
                </div>

                {/* Centre: session flow bar (tutor-controlled, both see state) */}
                <div className="flex-1 flex items-center justify-center">
                    <SessionFlowBar
                        currentPhase={sessionPhase}
                        onPhaseChange={user?.role === 'tutor' ? handlePhaseChange : () => {}}
                        variant="hud"
                    />
                </div>

                {/* Right: timer + reactions + end */}
                <div className="flex items-center gap-2 min-w-[200px] justify-end">
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
                            if (user?.role === 'tutor') router.push('/tutor/dashboard');
                            else if (user?.role === 'parent') router.push('/parent/dashboard');
                            else router.push('/students/dashboard');
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
                <div className="absolute top-[60px] right-2 z-10">
                    <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 flex flex-col gap-1.5 items-center">
                        <span className="text-white/20 text-[8px] font-black tracking-widest pt-0.5 pb-1">TOOLS</span>

                        <label className="cursor-pointer w-9 h-9 rounded-lg bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transition-all" title="Upload PDF / Slides">
                            {uploadingSlides ? <span className="animate-spin text-sm">⏳</span> : <FileUp size={16} />}
                            <input type="file" accept=".pdf,.ppt,.pptx" className="hidden" onChange={handleSlideUpload} disabled={uploadingSlides} />
                        </label>

                        <button
                            onClick={() => setShowAssetLibrary(!showAssetLibrary)}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all ${showAssetLibrary ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'}`}
                            title="Asset Library"
                        >
                            <Library size={16} />
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
                <div className="absolute left-4 top-[60px] bottom-24 w-64 hidden md:flex bg-white/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl rounded-2xl p-4 overflow-y-auto flex-col gap-4 pointer-events-auto z-40">
                    <h2 className="font-bold text-lg text-purple-900 border-b pb-2">Asset Library</h2>
                    <p className="text-xs text-text-secondary">Click to insert into canvas</p>
                    <div className="grid grid-cols-1 gap-3">
                        {mockLibraryAssets.map(asset => (
                            <div 
                                key={asset.id}
                                className="border rounded-xl cursor-pointer overflow-hidden hover:ring-2 hover:ring-purple-400 transition-all bg-gray-50 flex flex-col"
                                onClick={() => importImageToExcalidraw(asset.url)}
                            >
                                <img src={asset.url} alt={asset.label} className="w-full h-24 object-cover" />
                                <div className="p-2 text-xs font-bold text-center text-gray-700 bg-white">
                                    {asset.label}
                                </div>
                            </div>
                        ))}
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