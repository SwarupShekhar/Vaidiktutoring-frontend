'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import SessionChat from '@/app/components/SessionChat';
import api from '@/app/lib/api';
// import { DailyProvider } from '@daily-co/daily-react'; // Not used directly, using iframe
import AttendanceTracker from '@/app/components/session/AttendanceTracker';
import { io, Socket } from 'socket.io-client';
import confetti from 'canvas-confetti';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from 'sonner';
import { 
    ChevronLeft, 
    ChevronRight, 
    PenTool, 
    Library, 
    FileUp, 
    LogOut,
    Timer,
    Smile
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
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isExpanded, setIsExpanded] = useState(false);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const startPos = useRef({ x: 0, y: 0 });

    // Whiteboard Enhancements State
    const [hasPenAccess, setHasPenAccess] = useState(false);
    const [uploadingSlides, setUploadingSlides] = useState(false);
    const [showAssetLibrary, setShowAssetLibrary] = useState(false);
    
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

        // Calculate center of viewport for placement
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
                    id: `img_${fileId}`,
                    fillStyle: 'hachure',
                    strokeWidth: 1,
                    strokeStyle: 'solid',
                    roughness: 1,
                    opacity: 100,
                    angle: 0,
                    x: centerX - 200, // Offset to center 400px width
                    y: centerY - 150, // Offset to center 300px height
                    strokeColor: 'transparent',
                    backgroundColor: 'transparent',
                    width: 400,
                    height: 300,
                    seed: Math.floor(Math.random() * 1000000000),
                    groupIds: [],
                    roundness: null,
                    boundElements: [],
                    updated: Date.now(),
                    link: null,
                    locked: true,
                    fileId: fileId,
                    status: 'saved',
                }
            ]
        });
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

        // Listens for pen access changes
        const handlePenAccess = (payload: any) => {
            if (user?.id === payload.studentId || user?.role === 'student') {
                const isNowGranted = payload.hasAccess;
                setHasPenAccess(isNowGranted);
                
                if (isNowGranted) {
                    toast.success('Pen access granted by tutor');
                    excalidrawAPI.updateScene({ appState: { viewModeEnabled: false } });
                } else {
                    toast.info('Pen access removed');
                    excalidrawAPI.updateScene({ appState: { viewModeEnabled: true } });
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

            {/* 1. BASE LAYER: EXCALIDRAW WHITEBOARD */}
            <div className={`absolute inset-0 z-0 ${user?.role === 'student' || user?.role === 'parent' ? (hasPenAccess ? '' : 'pointer-events-none') : ''}`}>
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

            {/* FIXED OVERLAYS */}
            {/* Fixed Timer Block */}
            <div 
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-9999 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl border-2 backdrop-blur-xl transition-all duration-500 scale-110 ${
                    timeRemaining <= 5 * 60 
                    ? 'bg-red-600 border-red-400 text-white animate-pulse' 
                    : timeRemaining <= 10 * 60 
                        ? 'bg-amber-500 border-amber-300 text-white' 
                        : 'bg-black/80 border-white/20 text-white'
                }`}
                title="Time Remaining"
            >
                <Timer size={20} className={timeRemaining <= 5 * 60 ? 'animate-spin-slow' : ''} />
                <span className="font-black text-xl tracking-tighter tabular-nums">
                    {formatTime(timeRemaining)}
                </span>
            </div>

            {/* 2. OVERLAY LAYER: FLOATING HEADER */}
            <div className="absolute top-16 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                <div className="bg-glass/90 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-lg pointer-events-auto flex items-center gap-4 max-w-sm">
                    <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse relative z-10" />
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-(--color-text-primary)">
                            {booking?.subject?.name || 'Session'}
                        </h1>
                        <p className="text-xs text-text-secondary">ID: {sessionId.slice(0, 8)}...</p>
                    </div>
                </div>

                <div className="flex gap-3 items-center pointer-events-auto">
                    {/* Reaction Buttons - Collapsible on Mobile */}
                    <div className="flex flex-wrap gap-1 bg-white/10 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                        {['👍', '🎉', '💡', '❓'].map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => sendReaction(emoji)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors text-white text-lg"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>

                    {/* Tutor Whiteboard Controls */}
                    {user?.role === 'tutor' && (
                        <div className="flex flex-wrap gap-2">
                            {/* Slide Navigation Overlay */}
                            {slides.length > 0 && (
                                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-lg">
                                    <button 
                                        onClick={() => switchSlide(currentSlideIndex - 1)}
                                        disabled={currentSlideIndex === 0}
                                        className="p-2 hover:bg-white/10 disabled:opacity-30 transition-colors text-white"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="px-3 text-xs font-black text-white border-x border-white/10">
                                        {currentSlideIndex + 1} / {slides.length}
                                    </span>
                                    <button 
                                        onClick={() => switchSlide(currentSlideIndex + 1)}
                                        disabled={currentSlideIndex === slides.length - 1}
                                        className="p-2 hover:bg-white/10 disabled:opacity-30 transition-colors text-white"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => setShowAssetLibrary(!showAssetLibrary)}
                                className={`flex p-2 rounded-xl text-sm font-bold shadow-lg transition-all border border-white/10 ${showAssetLibrary ? 'bg-purple-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'}`}
                                title="Library"
                            >
                                <Library size={20} />
                            </button>
                            <label className="cursor-pointer p-2 rounded-xl text-sm font-bold shadow-lg transition-all border border-white/10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center gap-2" title="Upload PPT/PDF">
                                {uploadingSlides ? <span className="animate-spin">⏳</span> : <FileUp size={20} />}
                                <input type="file" accept=".pdf,.ppt,.pptx" className="hidden" onChange={handleSlideUpload} disabled={uploadingSlides} />
                            </label>
                            <button
                                onClick={() => {
                                    socket?.emit('whiteboard.togglePenAccess', {
                                        sessionId,
                                        studentId: booking?.students?.id || 'student1',
                                        hasAccess: !hasPenAccess
                                    });
                                    setHasPenAccess(!hasPenAccess);
                                }}
                                className={`p-2 rounded-xl text-sm font-bold shadow-lg transition-all border border-white/10 ${hasPenAccess ? 'bg-green-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'}`}
                                title={hasPenAccess ? 'Revoke Pen' : 'Grant Pen'}
                            >
                                <PenTool size={20} />
                            </button>
                            <button
                                onClick={() => socket?.emit('whiteboard.triggerConfetti', { sessionId })}
                                className="flex p-2 rounded-xl text-sm font-bold shadow-lg transition-all border border-white/10 bg-pink-500/90 hover:bg-pink-600 text-white backdrop-blur-md"
                                title="Celebration"
                            >
                                <Smile size={20} />
                            </button>
                        </div>
                    )}

                    {/* Attendance Button (TUTOR ONLY) */}
                    {user?.role === 'tutor' && (
                        <button
                            onClick={() => setShowAttendance(!showAttendance)}
                            className="flex px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all border border-white/10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
                        >
                            📝 Attendance
                        </button>
                    )}

                    <button
                        onClick={() => {
                            if (user?.role === 'tutor') router.push('/tutor/dashboard');
                            else if (user?.role === 'parent') router.push('/parent/dashboard');
                            else router.push('/students/dashboard');
                        }}
                        className="bg-red-500/90 hover:bg-red-600 backdrop-blur-md text-white p-2 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                    >
                        <LogOut size={20} />
                        <span className="hidden sm:inline">End Session</span>
                    </button>
                </div>
            </div>

            {/* 3. OVERLAY LAYER: CHAT SIDEBAR */}
            <div className="absolute right-4 bottom-24 z-50 w-80 pointer-events-auto">
                <SessionChat
                    key={booking?.sessions?.[0]?.id || sessionId}
                    sessionId={booking?.sessions?.[0]?.id || sessionId}
                    socket={socket}
                />
            </div>

            {/* ASSET LIBRARY PANEL (TUTOR ONLY) - Hidden on Mobile */}
            {user?.role === 'tutor' && showAssetLibrary && (
                <div className="absolute left-4 top-32 bottom-24 w-64 hidden md:flex bg-white/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl rounded-2xl p-4 overflow-y-auto flex-col gap-4 pointer-events-auto z-40">
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