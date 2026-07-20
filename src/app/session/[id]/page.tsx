'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import dynamic from 'next/dynamic';
import api, { getFreshAuthToken, getAuthToken, ensureValidToken } from '@/app/lib/api';
// import { DailyProvider } from '@daily-co/daily-react'; // Not used directly, using iframe

const SessionChat = dynamic(() => import('@/app/components/SessionChat'), { ssr: false });
const AttendanceTracker = dynamic(() => import('@/app/components/session/AttendanceTracker'), { ssr: false });
const StudentSnapshotCard = dynamic(() => import('@/app/components/session/StudentSnapshotCard'), { ssr: false });
const VaultSidebar = dynamic(() => import('@/app/components/session/VaultSidebar'), { ssr: false });
const AttentionFrameworkPanel = dynamic(() => import('@/app/components/session/AttentionFrameworkPanel'), { ssr: false });
import { vaultApi, VaultAsset } from '@/app/lib/vault';
import { io, Socket } from 'socket.io-client';
import DailyIframe from '@daily-co/daily-js';

import { toast } from 'sonner';
import {
    Video,
    VideoOff,
    ClipboardList,
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
    X,
    Trash2,
    FileText,
    ShieldCheck,
    Maximize2,
    Minimize2
} from 'lucide-react';
import { MANIPULATIVES_DATA, DICE_FACES } from '../manipulatives-data';
import { throttle } from '@/app/lib/utils';
const Rnd = dynamic(() => import('react-rnd').then(mod => mod.Rnd), { ssr: false });



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

/**
 * Produce a clean, human "First L." display name.
 *
 * Handles the messy real-world inputs we actually get:
 *  - Proper split names  → formatDisplayName('Swarup', 'Shekhar') = 'Swarup S.'
 *  - Single first name    → formatDisplayName('Swarup')            = 'Swarup'
 *  - An email local-part accidentally stored as the name (e.g. test accounts
 *    signed up as `swarup.shekhar+9@gmail.com`, where `first_name` ends up as
 *    `swarup.shekhar+9`) → 'Swarup S.'  (strips the +tag / @domain, splits on
 *    . _ - and treats the second token as a surname initial).
 *  - Empty / undefined    → the provided fallback.
 *
 * NOTE: the real fix is upstream — the backend should store a proper
 * first_name/last_name instead of the email local-part. This is a defensive
 * display-layer cleanup so minors never see a raw login handle on the board.
 */
function formatDisplayName(first?: string | null, last?: string | null, fallback = 'Student'): string {
    const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
    const rawFirst = (first || '').trim();
    const rawLast = (last || '').trim();

    if (!rawFirst && !rawLast) return fallback;

    // Proper last name present → "First L."
    if (rawLast) {
        return `${cap(rawFirst)} ${rawLast.charAt(0).toUpperCase()}.`.trim();
    }

    // No last name: the first name may actually be an email local-part.
    const local = rawFirst.split('@')[0].split('+')[0];
    const tokens = local.split(/[._-]+/).filter(Boolean);
    if (tokens.length >= 2) {
        return `${cap(tokens[0])} ${tokens[1].charAt(0).toUpperCase()}.`;
    }
    return cap(tokens[0] || rawFirst) || fallback;
}

export default function SessionPage({ params }: SessionProps) {
    const { id: sessionId } = React.use(params);
    const { user, token, loading: authLoading } = useAuthContext();
    const router = useRouter();

    // Protect the route - redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {

            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Daily.co State
    // Students/parents auto-join straight into the session. Tutors first get a
    // record-the-session prompt (rendered below) and join from there.
    const [hasJoined, setHasJoined] = useState(false);

    // Entry-time token guard: never let anyone join on a dead JWT. If the token
    // can't be made valid (already expired, beyond the refresh window), send them
    // through a clean re-login that returns here — instead of limping into the
    // session unable to join with the whiteboard out of sync (the exact failure a
    // student hit). ensureValidToken refreshes Clerk/manual tokens where possible.
    const joinWithValidToken = useCallback(async () => {
        const status = await ensureValidToken();
        if (status === 'expired') {
            toast.error('Your session expired — please log in again to join.', { duration: 8000 });
            if (typeof window !== 'undefined') {
                router.push(`/login?redirect_url=${encodeURIComponent(window.location.pathname)}`);
            }
            return;
        }
        setHasJoined(true);
    }, [router]);

    // Auto-join everyone EXCEPT tutors (after validating their token). Tutors must
    // acknowledge the record prompt first, so we never auto-join them.
    useEffect(() => {
        if (user && user.role !== 'tutor') {
            joinWithValidToken();
        }
    }, [user, joinWithValidToken]);

    // Suppresses the tutor record prompt during end-of-session teardown
    // (hasJoined flips false right before the redirect fires).
    const [isEnding, setIsEnding] = useState(false);
    const [dailyRoomUrl, setDailyRoomUrl] = useState<string | null>(null);
    const [dailyToken, setDailyToken] = useState<string | null>(null);
    const [videoLoading, setVideoLoading] = useState(false);
    // Set when the backend denies access to this session (e.g. the logged-in tutor
    // is not the one assigned to this booking) — show a clear message instead of a
    // broken/looping session screen.
    const [accessDenied, setAccessDenied] = useState(false);
    const [booking, setBooking] = useState<BookingDetails | null>(null);


    // Attendance State
    const [showAttendance, setShowAttendance] = useState(false);
    
    // Dynamic Session Roster from booking details
    const sessionRoster = booking?.students ? (
        Array.isArray(booking.students)
            ? booking.students.map((student: any) => ({
                id: student.id,
                name: `${student.first_name} ${student.last_name || ''}`.trim()
            }))
            : [{
                id: (booking.students as any).id,
                name: `${(booking.students as any).first_name} ${(booking.students as any).last_name || ''}`.trim()
            }]
    ) : [];

    const saveAttendance = async (records: Record<string, 'present' | 'absent' | 'late'>) => {
        try {
            // Iterate over the records and save attendance for each student
            const promises = Object.entries(records).map(([studentId, status]) => {
                return api.post(`/sessions/${sessionId}/attendance`, {
                    studentId,
                    present: status === 'present' || status === 'late',
                    // Optional: we can add more logic here for 'late' if the backend supports it
                });
            });

            await Promise.all(promises);
            toast.success('Attendance records updated successfully!');
        } catch (err) {
            console.error('Failed to save attendance:', err);
            toast.error('Failed to save attendance records.');
        }
    };


    // Sidebar Panel State (Task 1)
    const [isPanelExpanded, setIsPanelExpanded] = useState(true);
    const [floatingPosition, setFloatingPosition] = useState({ x: 0, y: 0 });
    const [floatingSize, setFloatingSize] = useState({ width: 220, height: 165 });
    // True when a REMOTE participant is sharing their screen — drives auto-enlarging
    // the video panel so the viewer (e.g. the tutor) can read it without zooming.
    const [isScreenShareActive, setIsScreenShareActive] = useState(false);

    // Whiteboard Enhancements State
    const [uploadingSlides, setUploadingSlides] = useState(false);
    const [showAssetLibrary, setShowAssetLibrary] = useState(false);
    const [showVault, setShowVault] = useState(false);
    const [selectedVaultAsset, setSelectedVaultAsset] = useState<VaultAsset | null>(null);

    // Session HUD State
    const [snapshotExpanded, setSnapshotExpanded] = useState(false);
    const [snapshotHidden, setSnapshotHidden] = useState(false);

    // Note Modal State
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [sessionNote, setSessionNote] = useState('');
    const [submittingNote, setSubmittingNote] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSocketJoined, setIsSocketJoined] = useState(false);
    const activeSocketRef = useRef<Socket | null>(null);
    const sessionStartRef = useRef<number>(Date.now());
    const sessionDurationRef = useRef<number>(60);

    // Timer & Reactions State
    const [timeRemaining, setTimeRemaining] = useState(60 * 60);
    const [showWrapUp, setShowWrapUp] = useState(false);
    const [reactions, setReactions] = useState<{ id: string; emoji: string; x: number; delay?: number }[]>([]);

    // Whiteboard Multi-Slide State
    const [slides, setSlides] = useState<string[]>([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [vaultAssetActive, setVaultAssetActive] = useState<string | null>(null);
    const pendingSlideIndexRef = useRef<number | null>(null);
    const [slideAnnotations, setSlideAnnotations] = useState<Record<number, any[]>>({});
    const [collaborators, setCollaborators] = useState<Map<string, any>>(new Map());
    const [hasPenAccess, setHasPenAccess] = useState(false);
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

    // Sticker State
    const [showStickerPanel, setShowStickerPanel] = useState(false);
    const [incomingSticker, setIncomingSticker] = useState<{ type: string; id: string } | null>(null);
    const STICKERS = [
        "crown.png", "Diamond.png", "Dinosaur.png", "Flame.png", "Rainbow.png",
        "Rocket.png", "Shining Star.png", "Star.png", "Trophy.png", "Unicorn.png"
    ];
    // Map normalized key → original filename for rendering sticker images
    const STICKER_FILE_MAP: Record<string, string> = Object.fromEntries(
        STICKERS.map(f => [f.replace(/\.png$/i, '').toLowerCase().replace(/\s+/g, ''), f])
    ); // e.g. { "shiningstar": "Shining Star.png", "crown": "crown.png", ... }

    // Viewport Sync & Laser State
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isLaserMode, setIsLaserMode] = useState(false);
    const focusIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [followingTutor, setFollowingTutor] = useState(false);

    // Library Tab State
    const [libraryTab, setLibraryTab] = useState<'vault' | 'assets' | 'manipulatives'>('vault');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        'k-1': true,
        '2-3': false,
        '4-6': false
    });

    // Session Flow & Pedagogy State
    const [showAttentionPanel, setShowAttentionPanel] = useState(false);

    const slideRef = useRef(0);
    const annotationsRef = useRef<Record<number, any[]>>({});
    const [showLibraryTip, setShowLibraryTip] = useState(false);
    const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Daily call references
    const dailyContainerRef = useRef<HTMLDivElement>(null);
    const [isDailyContainerReady, setIsDailyContainerReady] = useState(false);
    const dailyCallRef = useRef<any>(null);

    useEffect(() => {
        if (!hasJoined) return;
        
        const updateTimer = () => {
            const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
            const totalDurationSeconds = sessionDurationRef.current * 60;
            const remaining = Math.max(0, totalDurationSeconds - elapsed);
            setTimeRemaining(remaining);
            
            if (remaining <= 300 && remaining > 0) { // 5 minutes left
                setShowWrapUp(true);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [hasJoined]);

    const [windowSize, setWindowSize] = useState({ 
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


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

    const primaryStudent = Array.isArray(booking?.students) ? booking.students[0] : (booking?.students as any);
    // Recording is only permitted when the child's parent has consented. The
    // backend independently enforces this on upload; here we drive the UI so the
    // tutor never sees a "record" instruction (and everyone sees an honest
    // recording/not-recording indicator) when consent is absent.
    const recordingAllowed = !!primaryStudent?.recording_consent_granted;
    const studentData = {
        name: primaryStudent ? formatDisplayName(primaryStudent.first_name, primaryStudent.last_name, 'Student') : 'Student',
        grade: primaryStudent?.grade ? parseInt(String(primaryStudent.grade).replace(/\D/g, '')) : 0,
        interests: primaryStudent?.interests || [],
        recentProgress: primaryStudent?.recent_focus || 'Waiting for initial session assessment.',
        struggleAreas: primaryStudent?.struggle_areas || []
    };

    // Initialize Shared Socket for Attention Events
    useEffect(() => {
        if (!user || !sessionId || !hasJoined) return;

        const API_URL = (process.env.NEXT_PUBLIC_API_URL || 
                        process.env.NEXT_PUBLIC_API_BASE_URL || 
                        'https://api.studyhours.com').replace(/\/$/, '');
        const SOCKET_URL = `${API_URL}/sessions`;



        // SECURITY: the backend authenticates the socket from this handshake token
        // (JWT) and ignores any client-supplied userId. Source the token the same
        // way authenticated HTTP requests do: the AuthContext-managed JWT, with the
        // manual_auth_token cookie as a fallback (matches admin dashboard socket).
        const newSocket = io(SOCKET_URL, {
            auth: (cb) => {
                getFreshAuthToken().then(freshToken => {
                    const fallbackToken = typeof document !== 'undefined'
                        ? document.cookie.match(/manual_auth_token=([^;]+)/)?.[1]
                        : undefined;
                    cb({ token: freshToken || fallbackToken || '' });
                });
            },
            query: { sessionId, userId: user.id },
            withCredentials: true
        });

        setSocket(newSocket);
        activeSocketRef.current = newSocket;
        setIsSocketJoined(false);

        newSocket.on('connect', () => {
            newSocket.emit('joinSession', { sessionId, userId: user.id }, (response: any) => {
                // Ignore acks from a socket that has already been replaced/torn down.
                if (activeSocketRef.current !== newSocket) return;

                if (response.success) {
                    setIsSocketJoined(true);
                    sessionStartRef.current = response.sessionStartTime;
                    sessionDurationRef.current = response.sessionDuration;

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
                    // Students/parents wait for the forceResync effect to request sync
                    // once their canvas + listeners are ready (avoids dropped state).
                }
            });
        });

        // Self-heal on auth failure: refresh the token once and let socket.io's
        // built-in reconnection retry with it (the auth callback re-runs on each
        // attempt). Only give up — and send the user to a clean re-login — when the
        // token is truly dead and can't be refreshed. Prevents a mid-session token
        // blip from silently killing whiteboard sync.
        let authHealAttempted = false;
        newSocket.on('connect_error', async (err) => {
            console.error('Socket connection error:', err);
            const msg = (err.message || '').toLowerCase();
            const isAuthError = msg.includes('unauthorized') || msg.includes('jwt') || msg.includes('expired');
            if (!isAuthError) return;

            if (!authHealAttempted) {
                authHealAttempted = true;
                const status = await ensureValidToken();
                if (status === 'ok') return; // fresh token in place; allow auto-reconnect
            }

            // Recovery failed — token is truly dead. Stop looping and re-login here.
            toast.error('Your session expired. Please log in again to reconnect.', { duration: 10000 });
            newSocket.disconnect();
            if (typeof window !== 'undefined') {
                router.push(`/login?redirect_url=${encodeURIComponent(window.location.pathname)}`);
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

        // 4. Listen for stickers
        newSocket.on('sticker:received', (payload: { stickerType: string; studentName: string }) => {


            // Show animation
            const id = Math.random().toString();
            setIncomingSticker({ type: payload.stickerType, id });

            if (user?.role === 'student' || user?.role === 'parent') {
                toast(`⭐ Great job! ${payload.studentName} received a sticker!`, { duration: 4000 });
                import('canvas-confetti').then(({ default: confetti }) => {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }).catch(err => console.error('Failed to load canvas-confetti:', err));
            }

            // Remove animation after duration
            setTimeout(() => {
                setIncomingSticker(null);
            }, 3000);
        });

        // 5. Listen for Normalized Viewport Sync
        newSocket.on('viewport:update', (payload: { centerX: number; centerY: number; zoom: number }) => {
            if (user?.role !== 'tutor') {
                const api = excalidrawAPIRef.current;
                if (!api) return;

                setFollowingTutor(true);
                
                const appState = api.getAppState();
                const zoom = payload.zoom;
                
                // Calculate scrollX/Y needed to put the payload.centerX/Y at the center of this user's viewport
                const scrollX = appState.width / 2 - payload.centerX * zoom;
                const scrollY = appState.height / 2 - payload.centerY * zoom;

                api.updateScene({
                    appState: {
                        scrollX,
                        scrollY,
                        zoom: { value: zoom }
                    }
                });

                // Reset following indicator after some time if no updates
                const timer = setTimeout(() => setFollowingTutor(false), 2000);
                return () => clearTimeout(timer);
            }
        });

        newSocket.on('disconnect', () => {
            if (activeSocketRef.current === newSocket) setIsSocketJoined(false);
        });

        return () => {
            if (activeSocketRef.current === newSocket) activeSocketRef.current = null;
            setIsSocketJoined(false);
            newSocket.disconnect();
        };
    }, [user, token, sessionId, hasJoined]);

    // Timer Logic
    useEffect(() => {
        if (!hasJoined || !booking) return;

        const interval = setInterval(() => {
            const startTime = sessionStartRef.current;
            const now = Date.now();

            // Derive remaining from dynamic session length
            const durationMs = (sessionDurationRef.current || 60) * 60 * 1000;
            const elapsedMs = now - startTime;
            const remaining = Math.max(0, Math.floor((durationMs - elapsedMs) / 1000));

            setTimeRemaining(prev => {
                if (remaining <= 10 * 60 && prev > 10 * 60) {
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

    // Fetch Booking Details
    useEffect(() => {
        if (sessionId) {
            api.get(`/bookings/${sessionId}`)
                .then(res => {

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

    // Pointer Updates - Throttled to 100ms to reduce socket traffic
    const onPointerUpdate = useCallback(throttle((payload: any) => {
        if (!socket || !sessionId) return;
        // Guard: only emit if pointer has valid coordinates
        if (!payload.pointer || typeof payload.pointer.x !== 'number') return;
        socket.emit('whiteboard.pointerUpdate', {
            sessionId,
            userId: user?.id,
            username: formatDisplayName(user?.first_name, (user as any)?.last_name, 'User'),
            pointer: payload.pointer,
            button: payload.button,
            selectedElementIds: payload.selectedElementIds,
            isLaserActive: isLaserMode && user?.role === 'tutor'
        });
    }, 100), [socket, sessionId, user?.id, user?.first_name, isLaserMode, user?.role]);

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
                    x: centerX - targetWidth / 2,
                    y: centerY - targetHeight / 2,
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

    // TASK 1: Unified captureSnapshot and handleEndSession functions
    const captureSnapshot = useCallback(async (): Promise<string | null> => {
        if (!excalidrawAPI) return null;
        try {
            const { exportToCanvas } = await import('@excalidraw/excalidraw');
            const canvas = await exportToCanvas({
                elements: excalidrawAPI.getSceneElements(),
                appState: excalidrawAPI.getAppState(),
                files: excalidrawAPI.getFiles(),
                exportPadding: 20
            });
            return canvas.toDataURL('image/jpeg', 0.8);
        } catch (error) {
            console.error('Failed to capture snapshot:', error);
            return null;
        }
    }, [excalidrawAPI]);

    const handleEndSession = useCallback(async () => {
        setIsEnding(true);
        try {
            // 1. Capture and post whiteboard snapshot (only for tutors/admins)
            if (user?.role === 'tutor' || user?.role === 'admin') {
                const snapshotUrl = await captureSnapshot();
                if (snapshotUrl) {
                    await api.post(`/sessions/${sessionId}/whiteboard-snapshot`, { snapshotUrl });
                }
            }

            // 2. Call backend to end the session
            await api.post(`/sessions/${sessionId}/end`);

            // 3. Clear session state
            setHasJoined(false);
            setDailyRoomUrl(null);
            setDailyToken(null);

            // 4. Show success toast
            toast.success('Session ended successfully');

            // 5. Redirect based on user role
            if (user?.role === 'tutor') {
                router.push('/tutor/dashboard');
            } else if (user?.role === 'parent') {
                router.push('/parent/dashboard');
            } else {
                router.push('/students/dashboard');
            }
        } catch (error) {
            console.error('Failed to end session:', error);
            toast.error('Failed to end session. Please try again.');
        } finally {
            setIsEnding(false);
        }
    }, [sessionId, captureSnapshot, user?.role, router]);

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

            const groupId = `group_${Math.random().toString(36).substring(2, 11)}`;
            const newElements: any[] = [];
            const time = Date.now();

            // Helper to create valid Excalidraw elements from simple definitions
            const normalizeElement = (el: any, localGroupId: string) => {
                const id = `${el.type}_${Math.random().toString(36).substring(2, 11)}`;
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
                        newElements.push({
                            ...base,
                            id: `text_${Math.random().toString(36).substring(2, 11)}`,
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
                            strokeColor: el.labelColor || el.strokeColor || "#1e293b",
                            version: 2,
                            versionNonce: Math.floor(Math.random() * 1000000000),
                            updated: time,
                            opacity: 100
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
                    const width = el.width || (el.text?.length || 1) * (fontSize * 0.6);
                    const height = el.height || fontSize * 1.2;
                    newElements.push({
                        ...base,
                        type: "text",
                        text: el.text || "",
                        fontSize,
                        fontFamily: el.fontFamily || 1,
                        textAlign: el.textAlign || "left",
                        verticalAlign: el.verticalAlign || "top",
                        width,
                        height,
                        // If center-aligned, ensure x corresponds to center by offsetting
                        x: el.textAlign === 'center' ? base.x - (width / 2) : base.x,
                        y: el.verticalAlign === 'middle' ? base.y - (height / 2) : base.y
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

    // Viewport Sync Effect
    useEffect(() => {
        if (!socket || user?.role !== 'tutor' || !isFocusMode) {
            if (focusIntervalRef.current) clearInterval(focusIntervalRef.current);
            return;
        }

        focusIntervalRef.current = setInterval(() => {
            const api = excalidrawAPIRef.current;
            if (!api) return;

            const appState = api.getAppState();
            const zoom = appState.zoom.value;
            
            // Calculate center of current viewport in scene coordinates
            const centerX = (appState.width / 2 - appState.scrollX) / zoom;
            const centerY = (appState.height / 2 - appState.scrollY) / zoom;

            socket.emit('viewport:sync', {
                sessionId,
                centerX,
                centerY,
                zoom
            });
        }, 500); // Increased frequency to 500ms for smoother sync

        return () => {
            if (focusIntervalRef.current) clearInterval(focusIntervalRef.current);
        };
    }, [isFocusMode, socket, sessionId, user?.role]);

    // Give Sticker Logic
    const giveSticker = (stickerType: string) => {
        if (!socket || user?.role !== 'tutor' || !booking?.students?.id) return;

        // Normalize filename → key (e.g. "Shining Star.png" → "shiningstar")
        const normalized = stickerType.replace(/\.png$/i, '').toLowerCase().replace(/\s+/g, '');

        socket.emit('sticker:give', {
            sessionId,
            studentId: booking.students.id,
            stickerType: normalized,
            studentName: booking.students.first_name || 'Student'
        });

        setShowStickerPanel(false);
        toast.success(`Sticker sent to ${booking.students.first_name}!`);
    };

    const switchSlide = useCallback(async (index: number, overrideSlides?: string[], skipEmit = false) => {
        if (!excalidrawAPI) return;
        const targetSlides = overrideSlides || slides;

        if (!targetSlides[index]) {
            console.warn(`[Slides] Slide ${index} not found in state. Slides length: ${targetSlides.length}. Setting as pending.`);
            if (user?.role !== 'tutor') {
                pendingSlideIndexRef.current = index;
                if (targetSlides.length === 0) {
                    toast.info("Loading slides from tutor...");
                }
            }
            return;
        }

        // Clear pending if we found it
        pendingSlideIndexRef.current = null;

        // 1. Save current annotations
        const currentElements = excalidrawAPI.getSceneElements();
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

        if (!skipEmit && socket) {
            socket.emit('whiteboard.slideChange', { sessionId, index });
        }
    }, [excalidrawAPI, slides, socket, sessionId, importImageToExcalidraw, user?.role]);


    // Render a PDF file locally using pdf.js → PNG slides on the canvas
    const renderPdfLocally = (file: File) => {
        toast.info('Processing PDF...', { duration: 3000 });
        const fileReader = new FileReader();
        fileReader.onload = async function () {
            try {
                // Dynamically import pdfjsLib to avoid SSR DOMMatrix reference errors
                const pdfjsLib = await import('pdfjs-dist');
                pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

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
                    // Switch to JPEG 80% to reduce sync payload size dramatically (often 5-10x smaller than PNG)
                    newSlides.push(canvas.toDataURL('image/jpeg', 0.8));
                    // Release GPU texture immediately — prevents memory build-up on large PDFs
                    canvas.width = 0;
                    canvas.height = 0;
                    // Yield to the event loop so the UI stays responsive
                    await new Promise(r => setTimeout(r, 0));
                }
                toast.dismiss('pdf-progress');

                setSlides(newSlides);
                // Broadcast slides individually if the array is large, or just hope the 100MB buffer handles it
                socket?.emit('whiteboard.syncSlides', { sessionId, slides: newSlides });
                setCurrentSlideIndex(0);
                setSlideAnnotations({});

                if (newSlides.length > 0) {
                    await importImageToExcalidraw(newSlides[0], 'slide_0');
                    // Emit slide change so students are notified which slide to show
                    socket?.emit('whiteboard.slideChange', { sessionId, index: 0 });
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
        // Reset the input value so the same file can be selected again
        e.target.value = '';
        
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

            // Auth is injected by the shared api client's interceptor — do not read
            // localStorage directly (that can send a stale token for a different user).
            const res = await api.post(`/sessions/${sessionId}/slides`, formData, {
                timeout: 60000,
                // axios v1 JSON-stringifies FormData when the instance default
                // Content-Type is application/json; null forces multipart w/ boundary.
                headers: { 'Content-Type': null }
            });

            if (res.data.success && excalidrawAPI && res.data.sasUrl) {
                // Verify the backend returned an image MIME type before inserting
                const mime: string = res.data.mimeType || '';
                if (!mime.startsWith('image/')) {
                    toast.error(`Cannot display file type "${mime}". Upload a PNG, JPG, or PDF instead.`);
                    return;
                }
                const imgFetch = await fetch(res.data.sasUrl);
                const imgBlob = await imgFetch.blob();
                const dataUrl = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(imgBlob);
                });
                await importImageToExcalidraw(dataUrl, `slide_${Date.now()}`);
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

    const handleVaultAssetSelect = async (asset: VaultAsset) => {
        try {
            setUploadingSlides(true);
            setSelectedVaultAsset(asset);
            
            // 1. Get SAS URL for the asset
            const assetData = await vaultApi.getAsset(asset.id);
            if (!assetData || !assetData.sasUrl) {
                toast.error('Failed to get access to vault asset');
                return;
            }

            // 2. Fetch the file through our server proxy to avoid CORS issues
            let fetchUrl = assetData.sasUrl;
            if (fetchUrl.includes('.blob.core.windows.net/')) {
                fetchUrl = `/api/vault/proxy?url=${encodeURIComponent(fetchUrl)}`;
            }
            const response = await fetch(fetchUrl);
            if (!response.ok) throw new Error(`Vault fetch failed: ${response.status}`);
            const blob = await response.blob();
            const file = new File([blob], asset.azure_blob_name, { type: asset.mime_type });

            // 3. Render if PDF
            if (asset.file_type === 'PDF' || asset.mime_type === 'application/pdf') {
                renderPdfLocally(file);
                toast.success(`Loading "${asset.title}" from Vault...`);
                
                // 3a. Load existing annotations for this session
                const existing = await vaultApi.getAnnotations(sessionId, asset.id);
                if (existing && existing.id) {
                    const savedState = existing.annotations_json as any;
                    if (savedState && savedState.slides) {
                        // Restore in-memory annotations for all slides
                        setSlideAnnotations(savedState.slides);
                        annotationsRef.current = savedState.slides;
                        
                        // Apply annotations for current slide (0) after a short delay
                        setTimeout(() => {
                            if (excalidrawAPI) {
                                const currentScene = excalidrawAPI.getSceneElements();
                                const slide0Annotations = savedState.slides[0] || [];
                                excalidrawAPI.updateScene({
                                    elements: [...currentScene, ...slide0Annotations]
                                });
                            }
                        }, 1500);
                    }
                }
                setVaultAssetActive(asset.id);
            } else {
                toast.error('Only PDF assets are currently supported for direct whiteboard rendering.');
            }

            // 4. Close vault sidebar for better focus
            setShowVault(false);
        } catch (error) {
            console.error('Vault asset selection failed', error);
            toast.error('Failed to load asset from vault');
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
                    excalidrawAPI?.updateScene({ appState: { viewModeEnabled: false, activeTool: { type: 'freedraw', customType: null, locked: false, lastActiveTool: null } } });
                } else {
                    toast.info('Pen access removed');
                    excalidrawAPI?.updateScene({ appState: { viewModeEnabled: true } });
                }
            }
        };

        // Listens for confetti
        const handleConfetti = async () => {
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

                try {
                    const confetti = (await import('canvas-confetti')).default;
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
                } catch (err) {
                    console.error('Failed to load canvas-confetti:', err);
                }
            }
        };

        // Collaborative Cursor Handling
        const handlePointerUpdate = (payload: any) => {
            if (payload.userId === user?.id) return;
            // Guard against missing pointer data — prevents "Cannot read 'x' of undefined"
            if (!payload.pointer || typeof payload.pointer.x !== 'number') return;

            setCollaborators(prev => {
                const next = new Map(prev);
                next.set(payload.userId, {
                    pointer: payload.pointer,
                    button: payload.button,
                    username: payload.username,
                    selectedElementIds: payload.selectedElementIds,
                    isLaserActive: payload.isLaserActive,
                    color: payload.isLaserActive ? "#ef4444" : undefined
                });
                // Use the freshly-built Map — not the stale closure value
                if (excalidrawAPI) {
                    excalidrawAPI.updateScene({ collaborators: next });
                }
                return next;
            });
        };

        // Sync Slide Navigation — use slideRef.current to avoid stale closure
        const handleSlideChange = (payload: any) => {
            if (user?.role !== 'tutor' && payload.index !== slideRef.current) {
                switchSlide(payload.index);
            }
        };

        // Optimized handler for real-time element sync
        const handleReceiveUpdate = (data: any) => {
            if (!excalidrawAPIRef.current) return;
            const remoteElements = Array.isArray(data) ? data : (data.elements || []);
            if (data === undefined || data === null) return;

            whiteboardRef.current.isUpdating = true;
            try {
                const localElements = excalidrawAPIRef.current.getSceneElements();
                const localMap = new Map(localElements.map((el: any) => [el.id, el]));

                // CRITICAL FIX: Robust merging logic
                // Only update elements if the remote version is strictly newer.
                // This prevents "flicker" and vanishing strokes when the student is drawing.
                const updatedElements = remoteElements.map((remoteEl: any) => {
                    const localEl: any = localMap.get(remoteEl.id);
                    if (!localEl) return remoteEl; // New element from tutor
                    
                    // If remote version is newer, use it.
                    // If versions are same, remote versionNonce can be a tie-breaker.
                    if (remoteEl.version > localEl.version || 
                       (remoteEl.version === localEl.version && remoteEl.versionNonce !== localEl.versionNonce)) {
                        return remoteEl;
                    }
                    return localEl; // Keep local version if it's newer
                });

                const remoteIds = new Set(remoteElements.map((el: any) => el.id));
                const studentOnlyElements = localElements.filter((el: any) => !remoteIds.has(el.id));

                const mergedElements = [...updatedElements, ...studentOnlyElements];

                excalidrawAPIRef.current.updateScene({
                    elements: mergedElements,
                    commitToHistory: false
                });
            } finally {
                setTimeout(() => {
                    whiteboardRef.current.isUpdating = false;
                }, 15);
            }
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
        socket.on('whiteboard.receiveSlides', (slidesArray: string[]) => {

            setSlides(slidesArray);

            // If we were waiting for a specific slide, switch to it now
            if (pendingSlideIndexRef.current !== null && slidesArray[pendingSlideIndexRef.current]) {

                switchSlide(pendingSlideIndexRef.current);
            }
        });
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

        socket.on('poll:closed', (results) => {
            setFinalPollResults(results);
            setActivePoll(null);
        });


        // Attention Events
        socket.on('session.attentionEvent.created', (event) => {

            // No flash needed, summary update handles the UI
        });

        return () => {
            socket.off('whiteboard.receiveUpdate', handleReceiveUpdate);
            socket.off('whiteboard.receiveFiles', handleRemoteFiles);
            socket.off('whiteboard.receiveSlides');
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

        const lastEmitTime = { current: 0 };
        const emitThrottle = 150; // ms

        const unsubscribe = excalidrawAPI.onChange((elements: any[], _appState: any, files: any) => {
            // 1. Skip if we are currently receiving a remote update
            if (whiteboardRef.current.isUpdating) return;

            // 2. Throttle element updates to ~20fps for performance
            const now = Date.now();
            if (now - lastEmitTime.current > emitThrottle) {
                socket.emit('whiteboard.update', { sessionId, update: { elements } });
                lastEmitTime.current = now;
            }

            // 3. Files are synced only whenever the file list changes (much rarer)
            const filesString = JSON.stringify(files);
            if (filesString !== lastSyncedFiles.current) {
                lastSyncedFiles.current = filesString;
                socket.emit('whiteboard.syncFiles', { sessionId, files });
            }

            // 4. Persistence for Vault Annotations (Tutor Only)
            if (user?.role === 'tutor' && vaultAssetActive) {
                // Throttle/Debounce saving to DB (once every 5 seconds or if idle)
                const saveKey = `vault_save_${vaultAssetActive}`;
                if (!(window as any)[saveKey]) {
                    (window as any)[saveKey] = setTimeout(async () => {
                        try {
                            // Extract current annotations (minus background slide)
                            const currentElements = excalidrawAPI.getSceneElements();
                            const annotationsOnly = currentElements.filter((el: any) => el.type !== 'image' || !el.fileId?.startsWith('slide_'));
                            
                            // Build the full state to save
                            const fullState = {
                                slides: {
                                    ...annotationsRef.current,
                                    [slideRef.current]: annotationsOnly
                                }
                            };
                            
                            await vaultApi.saveAnnotations(sessionId, vaultAssetActive, fullState);
                        } finally {
                            delete (window as any)[saveKey];
                        }
                    }, 5000);
                }
            }
        });

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, [excalidrawAPI, socket, sessionId, user?.role, hasPenAccess]);

    // Students/parents request the current whiteboard state when their canvas is ready.
    const forceResync = useCallback(() => {
        if (!socket || !sessionId) return;

        socket.emit('whiteboard.requestSync', { sessionId });
        toast.info('Syncing whiteboard state...');
    }, [socket, sessionId]);

    useEffect(() => {
        if (!excalidrawAPI || !socket || !sessionId || !isSocketJoined) return;
        if (user?.role === 'tutor') {
            const elements = excalidrawAPI.getSceneElements();
            const files = excalidrawAPI.getFiles();
            if (elements.length > 0) {
                socket.emit('whiteboard.update', { sessionId, update: { elements } });
                socket.emit('whiteboard.syncFiles', { sessionId, files });
            }
            return;
        }
        forceResync();
    }, [excalidrawAPI, socket, sessionId, user?.role, forceResync, isSocketJoined]);

    // Fetch Daily.co Room & Token
    useEffect(() => {
        if (hasJoined && sessionId) {
            setVideoLoading(true);

            // Auth is injected by the shared api client's interceptor — do not read
            // localStorage directly (that can send a stale token for a different user).
            api.get(`/sessions/${sessionId}/daily-token`)
                .then(res => {
                    setDailyRoomUrl(res.data.roomUrl);
                    setDailyToken(res.data.token);
                    // Wait for daily-js to join before hiding loader
                })
                .catch(err => {
                    console.error('[Daily] Failed to get token:', err);
                    if (err?.response?.status === 403) {
                        // Not authorized for this session — stop here and show a clear
                        // message rather than letting the video/chat keep retrying.
                        setAccessDenied(true);
                    } else {
                        toast.error('Failed to join video session. Please try again.');
                    }
                    setVideoLoading(false);
                });
        }
    }, [hasJoined, sessionId]);

    // Initialize Daily.co using daily-js
    useEffect(() => {
        if (!dailyRoomUrl || !dailyToken || !hasJoined) return;
        if (!dailyContainerRef.current) return;
        if (dailyCallRef.current) return; // already created

        const callObject = DailyIframe.createFrame(dailyContainerRef.current, {
            iframeStyle: {
                width: '100%',
                height: '100%',
                border: '0',
                position: 'absolute',
                inset: '0'
            },
            showLeaveButton: false,
            showFullscreenButton: true, // manual override if auto-enlarge misjudges
            activeSpeakerMode: false,
        });

        dailyCallRef.current = callObject;

        // Auto-enlarge the panel while a REMOTE participant is screen-sharing so the
        // viewer (tutor) can read the shared screen without zooming. Ignores the
        // local user's own share (they don't need their screen mirrored huge).
        const updateScreenShare = () => {
            try {
                const participants = callObject.participants();
                const remoteSharing = Object.entries(participants).some(([id, p]: [string, any]) => {
                    if (id === 'local') return false;
                    const s = p?.tracks?.screenVideo?.state;
                    return s === 'playable' || s === 'loading' || s === 'sendable' || p?.screen === true;
                });
                setIsScreenShareActive(remoteSharing);
            } catch { /* participants() not ready yet */ }
        };
        callObject.on('participant-updated', updateScreenShare);
        callObject.on('participant-joined', updateScreenShare);
        callObject.on('participant-left', updateScreenShare);
        callObject.on('track-started', updateScreenShare);
        callObject.on('track-stopped', updateScreenShare);

        callObject.join({ url: `${dailyRoomUrl}?t=${dailyToken}` }).then(() => {
            setVideoLoading(false);
        }).catch(err => {
            console.error("[Daily] Error joining call:", err);
            setVideoLoading(false);
        });

        return () => {
            if (callObject) {
                callObject.destroy().then(() => {
                    dailyCallRef.current = null;
                });
            }
        };
    }, [dailyRoomUrl, dailyToken, hasJoined, isDailyContainerReady]);

    // Effective video-panel geometry. Three modes, in priority order:
    //  1. remote screen-share  -> large centered overlay (tutor reads it easily)
    //  2. expanded             -> fixed 450px right-side panel
    //  3. floating             -> user-draggable/resizable thumbnail
    const videoPanel = useMemo(() => {
        if (isScreenShareActive) {
            const width = Math.min(windowSize.width - 60, 1280);
            const height = windowSize.height - 60;
            return {
                size: { width, height },
                position: { x: Math.max(20, (windowSize.width - width) / 2), y: 40 },
                locked: true,
            };
        }
        if (isPanelExpanded) {
            return {
                size: { width: 450, height: windowSize.height - 52 },
                position: { x: windowSize.width - 450, y: 52 },
                locked: true,
            };
        }
        return {
            size: { width: floatingSize.width, height: floatingSize.height },
            position: {
                x: floatingPosition.x || (windowSize.width - 240),
                y: floatingPosition.y || (windowSize.height - 320),
            },
            locked: false,
        };
    }, [isScreenShareActive, isPanelExpanded, windowSize, floatingSize, floatingPosition]);

    const exportAndSharePdf = useCallback(async () => {
        if (isExporting) return;

        setIsExporting(true);
        try {
            const { exportToCanvas } = await import('@excalidraw/excalidraw');
            const { default: jsPDF } = await import('jspdf');
            
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [800, 600] // Matching whiteboard aspect ratio
            });

            if (slides.length === 0) {
                toast.info("Generating session PDF...");
                
                // Export current view only
                const canvas = await exportToCanvas({
                    elements: excalidrawAPIRef.current.getSceneElements(),
                    appState: {
                        ...excalidrawAPIRef.current.getAppState(),
                        exportBackground: false,
                        viewBackgroundColor: '#ffffff',
                    },
                    files: excalidrawAPIRef.current.getFiles(),
                    exportPadding: 0,
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.9);
                pdf.addImage(imgData, 'JPEG', 0, 0, 800, 600);
            } else {
                // Store current state to restore later
                const originalSlide = currentSlideIndex;
                
                toast.info("Generating session PDF... please don't switch slides.");

                for (let i = 0; i < slides.length; i++) {
                    if (i > 0) pdf.addPage([800, 600], 'landscape');
                    
                    // 1. Explicitly switch slide and wait for its full render (loading image + annotations)
                    await switchSlide(i, undefined, true);
                    
                    // Extra buffer to ensure Excalidraw internal state is updated
                    await new Promise(r => setTimeout(r, 600)); 

                    // 2. Export current view
                    const canvas = await exportToCanvas({
                        elements: excalidrawAPIRef.current.getSceneElements(),
                        appState: {
                            ...excalidrawAPIRef.current.getAppState(),
                            exportBackground: false,
                            viewBackgroundColor: '#ffffff',
                        },
                        files: excalidrawAPIRef.current.getFiles(),
                        exportPadding: 0,
                    });

                    const imgData = canvas.toDataURL('image/jpeg', 0.9);
                    pdf.addImage(imgData, 'JPEG', 0, 0, 800, 600);
                }

                // Restore original slide
                await switchSlide(originalSlide, undefined, true);
            }

            // 3. Convert to blob and upload
            const pdfBlob = pdf.output('blob');
            const formData = new FormData();
            formData.append('file', pdfBlob, `Session_${sessionId}_Annotations.pdf`);
            
            await api.post(`/sessions/${sessionId}/shared-pdf`, formData, {
                // axios v1 JSON-stringifies FormData when the instance default
                // Content-Type is application/json; null forces multipart w/ boundary.
                headers: { 'Content-Type': null }
            });

            return true;
        } catch (error: any) {
            console.error("PDF Export failed", error);
            const status = error.response?.status;
            if (status === 404) {
                toast.error("Shared PDF upload failed: Session not found");
            } else if (status === 401 || status === 403) {
                toast.error("Permissions error: Try refreshing your session");
            } else {
                toast.error(`Export error: ${error.message || 'Check connection'}`);
            }
            throw error;
        } finally {
            setIsExporting(false);
        }
    }, [isExporting, slides.length, currentSlideIndex, switchSlide, sessionId]);

    // TASK 2: Listen for Daily.co's built-in end button via postMessage
    useEffect(() => {
        const handleDailyMessage = (event: MessageEvent) => {
            // FIX 2: Log all events to verify Daily.co's actual postMessage format


            // Check if the message is from Daily.co iframe
            if (event.data?.action === 'left-meeting' || event.data?.action === 'meeting-left') {

                handleEndSession();
            }
        };

        window.addEventListener('message', handleDailyMessage);
        return () => {
            window.removeEventListener('message', handleDailyMessage);
        };
    }, [handleEndSession]);

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
        <div className="app-session-root w-screen h-screen flex flex-col bg-background overflow-hidden">
            {/* Always-visible escape hatch. In the desktop app the in-iframe "Leave"
                (Daily) and the toolbar "End" can get clipped at the window edge or
                hidden, so this guarantees anyone can exit. Sits below the 32px titlebar. */}
            {hasJoined && (
              <button
                onClick={() => {
                  const dest = user?.role === 'tutor' ? '/tutor/dashboard'
                    : user?.role === 'parent' ? '/parent/dashboard'
                    : '/students/dashboard';
                  router.push(dest);
                }}
                className="fixed left-1/2 top-[40px] z-[9999] -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-900/30 transition-all hover:bg-red-600 active:scale-95"
                title="Leave session"
              >
                <LogOut size={14} /> Leave session
              </button>
            )}
            {/* Access denied — backend rejected this session (e.g. not the assigned tutor / not a participant). */}
            {accessDenied && (
                <div className="absolute inset-0 z-[60] bg-gray-950/97 flex items-center justify-center p-6">
                    <div className="w-full max-w-md bg-gray-900 border border-red-500/30 rounded-2xl p-8 text-white shadow-2xl text-center">
                        <h2 className="text-2xl font-bold mb-3">You don't have access to this session</h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            You either don't have access to this session, or the class hasn't opened yet (you can join 5 minutes early). If this is your session, please check the start time, or ensure you're signed in with the correct account.
                        </p>
                        <button
                            onClick={() => router.push(user?.role === 'tutor' ? '/tutor/dashboard' : user?.role === 'parent' ? '/parent/dashboard' : '/students/dashboard')}
                            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all"
                        >
                            Back to dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* Tutor-only pre-join prompt. Students auto-join (never see this).
                The message + instruction depend on whether the parent has consented
                to recording — we never tell a tutor to record a child whose parent
                hasn't opted in. */}
            {!hasJoined && user?.role === 'tutor' && !isEnding && (
                <div className="absolute inset-0 z-50 bg-gray-950/95 flex items-center justify-center p-6">
                    <div className={`w-full max-w-md bg-gray-900 border rounded-2xl p-8 text-white shadow-2xl ${recordingAllowed ? 'border-purple-500/30' : 'border-white/10'}`}>
                        {recordingAllowed ? (
                            <>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                        <Video className="text-amber-400" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold leading-tight">Record this session</h2>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-2">
                                    The parent has consented to recording. Please record this session so your student can review it afterwards.
                                </p>
                                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                                    After you join, click <strong className="text-white">Share Screen</strong> in the video panel and share <strong className="text-white">this browser tab</strong> — that captures both the video call and the whiteboard.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
                                        <VideoOff className="text-rose-400" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold leading-tight">Do not record</h2>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-2">
                                    This student's parent has <strong className="text-white">not</strong> consented to recording. Please run the class live but <strong className="text-white">do not record or screen-share to capture it</strong>.
                                </p>
                                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                                    The parent can enable recording anytime from Profile → Settings. Until then, uploads are blocked.
                                </p>
                            </>
                        )}
                        <button
                            onClick={joinWithValidToken}
                            className="w-full h-12 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            Got it — Join Session →
                        </button>
                    </div>
                </div>
            )}

            {/* Honest, always-visible recording status for everyone in the room —
                the two-party-consent notice. Green "recording may occur" when the
                parent has opted in; neutral "not recorded" otherwise. */}
            {hasJoined && (
                <div
                    className={`fixed right-3 top-[40px] z-[9999] inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-lg ${
                        recordingAllowed
                            ? 'bg-red-500/90 text-white shadow-red-900/30'
                            : 'bg-gray-800/90 text-gray-300 ring-1 ring-white/10'
                    }`}
                    title={recordingAllowed
                        ? 'The parent has consented — this session may be recorded for later review.'
                        : 'This session is not being recorded.'}
                >
                    {recordingAllowed ? (
                        <><span className="h-2 w-2 rounded-full bg-white animate-pulse" /> May be recorded</>
                    ) : (
                        <><VideoOff size={12} /> Not recorded</>
                    )}
                </div>
            )}

            {/* FLEX LAYOUT: Whiteboard + Sidebar Container */}
            <div className="flex-1 flex flex-row overflow-hidden mt-[52px]">
                {/* 1. BASE LAYER: EXCALIDRAW WHITEBOARD (left side) */}
                <div className={`flex-1 relative z-0 whiteboard-container ${isToolbarCollapsed ? "whiteboard-collapsed" : ""} ${user?.role === 'student' || user?.role === 'parent' ? (hasPenAccess ? '' : 'pointer-events-none') : ''}`}>
                {ExcalidrawComp ? (
                    <>
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
                            onLibraryChange={() => { }}
                        />

                        {/* Toolkit Collapse Toggle (Tutor Only) */}
                        {user?.role === 'tutor' && (
                            <button
                                onClick={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
                                className={`absolute left-2 top-12 z-60 w-6 h-12 flex items-center justify-center bg-gray-900 border border-white/10 rounded-full text-white/40 hover:text-white transition-all shadow-xl ${isToolbarCollapsed ? 'opacity-100' : 'opacity-20 hover:opacity-100'}`}
                                title={isToolbarCollapsed ? "Expand Tools" : "Collapse Tools"}
                            >
                                {isToolbarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                            </button>
                        )}

                        {/* LASER POINTER OVERLAY (Real-time collaborative) */}
                        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                            {Array.from(collaborators.entries()).map(([cid, collab]) => {
                                if (!collab.pointer || !collab.isLaserActive) return null;

                                const appState = excalidrawAPI?.getAppState();
                                if (!appState) return null;

                                const zoom = typeof appState.zoom === 'number' ? appState.zoom : (appState.zoom?.value ?? 1);
                                const x = collab.pointer.x * zoom + appState.scrollX;
                                const y = collab.pointer.y * zoom + appState.scrollY;

                                return (
                                    <div
                                        key={`laser-${cid}`}
                                        className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-red-500 shadow-[0_0_20px_6px_rgba(255,0,0,0.8),0_0_8px_2px_white] transition-all duration-75 ease-out opacity-100 animate-pulse"
                                        style={{ left: x, top: y }}
                                    />
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-text-secondary bg-gray-50">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-medium">Loading Canvas...</p>
                    </div>
                )}
            </div>

                {/* Daily.co sidebar panel - using width transition to prevent iframe unmounting/re-rendering */}
                <div 
                    className={`h-full border-l border-white/10 bg-black/80 flex flex-col transition-all duration-500 ease-in-out ${isPanelExpanded ? 'w-[450px] opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'}`} 
                    role="complementary" 
                    aria-label="Video session panel"
                >
                    {/* Inner wrapper to keep content size stable during transition */}
                    <div className="w-[450px] h-full flex flex-col flex-none">
                        {/* Header with title and collapse button */}
                        <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-linear-to-r from-purple-600 to-indigo-600 shrink-0">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Session Room</span>
                                <span className="text-xs font-bold text-white">
                                    {booking?.students?.first_name || 'Student'}&apos;s Classroom
                                </span>
                            </div>
                            <button
                                onClick={() => setIsPanelExpanded(false)}
                                className="text-white hover:bg-white/20 rounded p-1 transition-colors relative z-30 cursor-pointer"
                                title="Collapse video panel"
                                aria-label="Collapse video panel"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Video Panel Placeholder - The actual video is rendered in a stable Rnd container at the bottom of the JSX to prevent unmounting/re-rendering when toggling panel expansion */}
                        <div className="flex-1 relative bg-black flex items-center justify-center">
                            {!videoLoading && !isPanelExpanded && (
                                <div className="text-center p-8 opacity-50">
                                    <Video className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40 text-sm font-medium">Video minimized</p>
                                    <button 
                                        onClick={() => setIsPanelExpanded(true)}
                                        className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors"
                                    >
                                        Expand Video Panel
                                    </button>
                                </div>
                            )}
                            {videoLoading && (
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-3"></div>
                                    <p className="text-white/50 text-sm">Initializing video...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Overlay for Video removed to allow whiteboard access during Daily connect */}

            {/* ── TOP HUD BAR ─────────────────────────────────────────────── */}
            <div className="absolute top-0 left-0 right-0 h-[52px] z-20 bg-black/80 backdrop-blur-xl border-b border-white/8 flex items-center px-4 gap-3 overflow-x-auto no-scrollbar">
                {/* Left: live indicator + subject (shrinks/truncates first) */}
                <div className="flex items-center gap-2 min-w-0">
                    <div className="relative shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 relative z-10" />
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-60" />
                    </div>
                    <span className="text-white text-xs font-bold truncate">
                        {booking?.subject?.name || 'Session'}
                    </span>
                </div>

                <div className="flex-1 min-w-2" />

                {/* Right: timer + reactions + end (stays intact, never clipped) */}
                <div className="flex items-center gap-2 ml-auto shrink-0">
                    <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10 transition-all duration-500 tabular-nums ${timeRemaining <= 5 * 60
                            ? 'bg-red-600/90 text-white animate-pulse'
                            : timeRemaining <= 10 * 60
                                ? 'bg-amber-500/90 text-white'
                                : 'bg-white/10 text-white'
                        }`}>
                        <Timer size={13} />
                        <span className="font-bold text-xs tracking-tight">{formatTime(timeRemaining)}</span>
                    </div>

                    <div className="flex gap-1 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10 shadow-inner">
                        {['👍', '🎉', '💡', '❓'].map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => sendReaction(emoji)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 hover:scale-125 hover:-translate-y-1 transition-all duration-200 text-lg active:scale-95 group relative"
                            >
                                <span className="drop-shadow-sm">{emoji}</span>
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-[2px]" />
                            </button>
                        ))}
                        <button
                            onClick={() => socket?.emit('whiteboard.triggerConfetti', { sessionId })}
                            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-pink-500/20 hover:scale-125 hover:-translate-y-1 text-pink-400 transition-all duration-200 group"
                            title="Confetti"
                        >
                            <Smile size={18} className="group-hover:animate-bounce" />
                        </button>
                    </div>

                    {user?.role === 'tutor' && (
                        <button
                            onClick={async () => {
                                try {
                                    await exportAndSharePdf();
                                    toast.success("PDF Shared with student!");
                                } catch (error: any) {
                                    const errorMsg = error.response?.data?.message || error.message || 'Check connection';
                                    toast.error(`Failed to share PDF: ${errorMsg}`);
                                }
                            }}
                            disabled={isExporting}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                isExporting ? 'bg-orange-600 border-orange-500 text-white animate-pulse' : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600 hover:text-white'
                            }`}
                            title="Save & Share all slides as PDF"
                        >
                            {isExporting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileText size={14} />}
                            {isExporting ? 'Exporting...' : 'Save & Share PDF'}
                        </button>
                    )}

                    {user?.role === 'tutor' && (
                        <button
                            onClick={() => setShowAttendance(!showAttendance)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                showAttendance ? 'bg-purple-600 border-purple-500 text-white' : 'border-white/10 bg-white/10 hover:bg-white/20 text-white/70'
                            }`}
                            title="Attendance"
                        >
                            <ClipboardList size={14} />
                            <span className="hidden lg:inline">Attendance</span>
                        </button>
                    )}

                    {/* TASK 4: Wire unified End Session button to handleEndSession */}
                    <button
                        onClick={handleEndSession}
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
                <div className={`absolute top-[60px] z-50 pointer-events-auto transition-all duration-300 ${isPanelExpanded ? 'right-[460px] md:right-[460px]' : 'right-2'}`}>
                    <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 flex flex-col gap-1.5 items-center max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide shadow-xl">
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
                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all border ${hasPenAccess ? 'bg-green-600 border-green-500/50' : 'bg-white/10 hover:bg-white/20 border-white/10'
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

                        <div className="w-5 h-px bg-white/10 my-0.5" />

                        <button
                            onClick={() => {
                                const newLaserMode = !isLaserMode;
                                setIsLaserMode(newLaserMode);
                                if (excalidrawAPI) {
                                    excalidrawAPI.updateScene({ appState: { activeTool: { type: newLaserMode ? 'laser' : 'selection', customType: null } } });
                                }
                            }}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all border ${isLaserMode ? 'bg-red-500 border-red-400 animate-pulse' : 'bg-white/10 hover:bg-white/20 border-white/10'
                                }`}
                            title="Laser Pointer"
                        >
                            <div className={`w-3 h-3 rounded-full ${isLaserMode ? 'bg-white shadow-[0_0_10px_2px_rgba(255,100,100,0.8)]' : 'border-2 border-white/30'}`} />
                        </button>

                        <button
                            onClick={() => setIsFocusMode(!isFocusMode)}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all border ${isFocusMode ? 'bg-blue-600 border-blue-500' : 'bg-white/10 hover:bg-white/20 border-white/10'
                                }`}
                            title="Focus Mode (Sync Viewport)"
                        >
                            <Share2 size={16} className={isFocusMode ? 'animate-pulse' : ''} />
                        </button>

                        {/* Sticker and Attention framework temporarily removed as requested */}
                        {/*
                        <button
                            onClick={() => setShowStickerPanel(!showStickerPanel)}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all border ${showStickerPanel ? 'bg-orange-500 border-orange-400' : 'bg-white/10 hover:bg-white/20 border-white/10'
                                }`}
                            title="Give Sticker"
                        >
                            <Smile size={16} />
                        </button>

                        <button
                            onClick={() => setShowAttentionPanel(!showAttentionPanel)}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all border ${showAttentionPanel ? 'bg-purple-600 border-purple-400' : 'bg-white/10 hover:bg-white/20 border-white/10'}`}
                            title="Attention Framework"
                        >
                            <ShieldCheck size={16} />
                        </button>

                        {showStickerPanel && (
                            <div className="absolute right-12 top-0 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl flex flex-wrap gap-2 w-48 animate-in slide-in-from-right-2 duration-200">
                                <p className="w-full text-[10px] font-black text-white/50 uppercase tracking-widest mb-1 ml-1">Send a Sticker</p>
                                {STICKERS.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => giveSticker(s)}
                                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                    >
                                        <img src={`/stickers/${s}`} alt={s} className="w-8 h-8 object-contain" />
                                    </button>
                                ))}
                                <button
                                    onClick={forceResync}
                                    className="w-full mt-2 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Share2 size={12} />
                                    Force Resync
                                </button>
                            </div>
                        )}
                        */}

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

                        <div className="w-5 h-px bg-white/10 my-0.5" />

                        <button
                            onClick={() => setShowClearConfirm(true)}
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 transition-all bg-white/10 hover:bg-red-500/10 border border-white/10"
                            title="Clear Board"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* ATTENTION SIDEBAR (Tutor Only) */}
            {user?.role === 'tutor' && showAttentionPanel && (
                <div
                    className={`absolute bottom-24 z-50 flex flex-col gap-4 transition-all duration-300 pointer-events-auto ${isPanelExpanded ? 'left-4 w-[400px]' : 'left-4 w-80'}`}
                >
                    {showAttentionPanel && (
                        <div className="h-[450px] animate-in slide-in-from-left-4 duration-500 delay-100">
                            <AttentionFrameworkPanel 
                                sessionId={sessionId}
                                studentId={booking?.students?.id || ''}
                                tutorId={booking?.tutor?.id || ''}
                                socket={socket}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* 3. OVERLAY LAYER: CHAT SIDEBAR (Elevated z-index to stay above video panel) */}
            <div className={`absolute bottom-24 z-1000 w-80 pointer-events-none transition-all duration-300 ${isPanelExpanded ? 'right-[464px]' : 'right-4'}`}>
                <SessionChat
                    key={sessionId}
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
                            className={`shrink-0 w-[44px] h-[44px] rounded-md overflow-hidden border-2 transition-all ${index === currentSlideIndex
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
                    {user?.role === 'tutor' && (
                        <button 
                            onClick={() => {
                                if(window.confirm('Clear all slides?')) {
                                    setSlides([]);
                                    socket?.emit('whiteboard.syncSlides', { sessionId, slides: [] });
                                }
                            }}
                            className="ml-3 text-[9px] font-black text-red-500/50 hover:text-red-400 uppercase tracking-widest shrink-0"
                        >
                            CLEAR
                        </button>
                    )}
                </div>
            )}

            {/* ASSET LIBRARY PANEL (TUTOR ONLY) - Hidden on Mobile */}
            {user?.role === 'tutor' && showAssetLibrary && (
                <div className="absolute left-4 top-[60px] bottom-24 w-72 hidden md:flex bg-white/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl rounded-2xl p-4 overflow-y-auto flex-col pointer-events-auto z-50">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg text-purple-900 leading-none">Session Library</h2>
                        <button onClick={() => setShowAssetLibrary(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-xl mb-4 shrink-0 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setLibraryTab('vault')}
                            className={`flex-1 py-1.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${libraryTab === 'vault' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Materials
                        </button>
                        <button
                            onClick={() => setLibraryTab('assets')}
                            className={`flex-1 py-1.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${libraryTab === 'assets' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Session
                        </button>
                        <button
                            onClick={() => setLibraryTab('manipulatives')}
                            className={`flex-1 py-1.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${libraryTab === 'manipulatives' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Tools
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        {libraryTab === 'vault' ? (
                            <div className="flex flex-col h-full -mx-4 -mb-4 border-t border-gray-100">
                                <VaultSidebar 
                                    onSelectAsset={handleVaultAssetSelect} 
                                    selectedAssetId={selectedVaultAsset?.id}
                                    currentSubject={booking?.subject?.name}
                                />
                            </div>
                        ) : libraryTab === 'assets' ? (
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center justify-between mb-1 ml-1 pr-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Uploaded Assets</p>
                                    <button
                                        onClick={() => (document.getElementById('asset-upload-input') as HTMLInputElement)?.click()}
                                        className="text-[9px] font-black text-purple-600 hover:text-purple-800 uppercase tracking-widest flex items-center gap-1"
                                    >
                                        <FileUp size={10} />
                                        Upload
                                    </button>
                                    <input
                                        id="asset-upload-input"
                                        type="file"
                                        accept=".pdf,image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const name = file.name.toLowerCase();
                                                if (name.endsWith('.ppt') || name.endsWith('.pptx')) {
                                                    toast.error('PowerPoint files cannot be rendered directly. Please export your slides as a PDF first, then upload the PDF.', { duration: 8000 });
                                                    return;
                                                }
                                                if (name.endsWith('.pdf')) {
                                                    renderPdfLocally(file);
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    const url = event.target?.result as string;
                                                    setSlides(prev => {
                                                        const next = [...prev, url];
                                                        socket?.emit('whiteboard.syncSlides', { sessionId, slides: next });
                                                        return next;
                                                    });
                                                    toast.success("Image added to Assets library");
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                                {slides.map((url, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-xl cursor-pointer overflow-hidden hover:ring-2 hover:ring-purple-400 transition-all bg-gray-50 flex flex-col group"
                                        onClick={() => importImageToExcalidraw(url)}
                                    >
                                        <div className="relative h-24 bg-white flex items-center justify-center overflow-hidden">
                                            <img src={url} alt={`Slide ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        </div>
                                        <div className="p-2 text-[9px] font-black uppercase tracking-tight text-center text-gray-500 bg-white border-t">
                                            {`Slide ${index + 1}`}
                                        </div>
                                    </div>
                                ))}
                                {slides.length === 0 && (
                                    <div className="text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                                            <FileUp size={24} />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 leading-normal max-w-[140px] mx-auto uppercase tracking-wider">
                                            No assets uploaded yet. Upload an image or PDF slide to add it here.
                                        </p>
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
                                                {grade === 'k-1' ? 'Grades K–1' : grade === '2-3' ? 'Grades 2–3' : grade === '4-6' ? 'Grades 4–6' : grade === 'math' ? 'Advanced Math' : grade === 'physics' ? 'Physics' : grade === 'chemistry' ? 'Chemistry' : grade}
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
                                onClick={handleEndSession}
                                className="flex-1 px-4 py-3 text-sm font-bold text-white/40 hover:text-white/70 transition-colors"
                            >
                                Not now, just end
                            </button>
                            <button
                                onClick={async () => {
                                    setSubmittingNote(true);
                                    try {
                                        // FIX 1: Save note, then call unified handleEndSession
                                        await api.patch(`/sessions/${sessionId}/tutor-note`, { note: sessionNote });
                                        toast.success('Note saved!');
                                        try {
                                            await exportAndSharePdf();
                                            toast.success('Annotated PDF shared with student!');
                                        } catch (error: any) {
                                            console.error('Failed to export PDF:', error);
                                            const errorMsg = error.response?.data?.message || error.message || 'Check connection';
                                            toast.error(`Failed to share PDF: ${errorMsg}`);
                                        }
                                        await handleEndSession();
                                    } catch (error) {
                                        console.error('Failed to save note and end session:', error);
                                        toast.error('Failed to end session properly');
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
                    <div className="bg-gray-900 rounded-4xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
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
                    <div className="bg-gray-900 rounded-4xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
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
                
                @keyframes sticker-reveal {
                    0% { transform: scale(0) rotate(-20deg); opacity: 0; }
                    50% { transform: scale(1.5) rotate(10deg); opacity: 1; filter: drop-shadow(0 0 30px rgba(255,215,0,0.5)); }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                .animate-sticker-reveal {
                    animation: sticker-reveal 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }

                /* Collapsable Toolkit Styles */
                .whiteboard-collapsed .excalidraw .App-menu_top {
                    opacity: 0.1;
                    pointer-events: none;
                    transform: translateX(-100px);
                    transition: all 0.3s ease;
                }
                .whiteboard-collapsed .excalidraw .App-menu_top:hover {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateX(0);
                }
                .whiteboard-collapsed .excalidraw .island {
                    opacity: 0.1;
                    pointer-events: none;
                    transform: translateX(-100px);
                    transition: all 0.3s ease;
                }
                .whiteboard-collapsed .excalidraw .island:hover {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateX(0);
                }
            `}</style>

            {/* STICKER OVERLAY */}
            {incomingSticker && (
                <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-md rounded-full p-12 lg:p-20 relative animate-sticker-reveal">
                        <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-[80px] animate-pulse" />
                        <img
                            src={`/stickers/${STICKER_FILE_MAP[incomingSticker.type] || incomingSticker.type + '.png'}`}
                            alt="Sticker Reward"
                            className="w-48 h-48 lg:w-64 lg:h-64 object-contain relative z-10"
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                            <h2 className="text-3xl lg:text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                MARVELOUS! ⭐
                            </h2>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEWPORT SYNC INDICATOR (STUDENT ONLY) */}
            {followingTutor && user?.role !== 'tutor' && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-blue-600/90 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-blue-400/30 backdrop-blur-sm shadow-xl shadow-blue-500/20">
                        <div className="relative">
                            <Share2 size={14} className="animate-pulse" />
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-ping" />
                        </div>
                        <span className="text-xs font-black tracking-wider uppercase">Following Tutor</span>
                    </div>
                </div>
            )}

            {/* LASER POINTER OVERLAY */}
            <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
                {Array.from(collaborators.entries()).map(([cid, data]) => {
                    if (!data.isLaserActive || !data.pointer) return null;

                    // Simple coordinate mapping - assumes full screen whiteboard
                    // For more precision, we'd need to use scene coords -> viewport coords
                    // but since Excalidraw fills the container, basic mapping is a good start.
                    const appState = excalidrawAPI?.getAppState() || { zoom: { value: 1 }, scrollX: 0, scrollY: 0 };
                    const zoom = typeof appState.zoom === 'number' ? appState.zoom : (appState.zoom?.value ?? 1);
                    const x = (data.pointer.x * zoom) + appState.scrollX;
                    const y = (data.pointer.y * zoom) + appState.scrollY;

                    return (
                        <div
                            key={`laser-${cid}`}
                            className="absolute transition-all duration-75 ease-out"
                            style={{
                                left: x,
                                top: y,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <div className="relative">
                                <div className="w-4 h-4 bg-red-500 rounded-full blur-[2px] shadow-[0_0_15px_5px_rgba(239,68,68,0.8)]" />
                                <div className="absolute inset-0 w-4 h-4 bg-white rounded-full scale-/30" />
                                <div className="absolute -inset-4 border border-red-500/20 rounded-full animate-ping" />
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter whitespace-nowrap">
                                    {data.username}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CLEAR BOARD CONFIRMATION MODAL */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Trash2 className="text-red-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-2">Clear Board?</h3>
                        <p className="text-white/60 text-center text-sm mb-8">This will delete everything on the current slide. This action cannot be undone.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (!excalidrawAPI) return;
                                    const deletedElements = excalidrawAPI.getSceneElements().map((e: any) => ({ ...e, isDeleted: true }));
                                    excalidrawAPI.updateScene({ elements: deletedElements });
                                    socket?.emit('whiteboard.update', { sessionId, update: { elements: deletedElements } });
                                    setShowClearConfirm(false);
                                    toast.success("Board cleared");
                                }}
                                className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Unified Video Container - Using a single Rnd instance to prevent iframe unmounting/resetting */}
            {hasJoined && dailyRoomUrl && dailyToken && (
                <Rnd
                    size={videoPanel.size}
                    position={videoPanel.position}
                    onDragStop={(e, d) => {
                        if (!videoPanel.locked) {
                            setFloatingPosition({ x: d.x, y: d.y });
                        }
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        if (!videoPanel.locked) {
                            setFloatingSize({ width: parseInt(ref.style.width), height: parseInt(ref.style.height) });
                            setFloatingPosition(position);
                        }
                    }}
                    minWidth={videoPanel.locked ? videoPanel.size.width : 150}
                    minHeight={videoPanel.locked ? videoPanel.size.height : 120}
                    maxWidth={videoPanel.locked ? videoPanel.size.width : 800}
                    maxHeight={videoPanel.locked ? videoPanel.size.height : 600}
                    disableDragging={videoPanel.locked}
                    enableResizing={!videoPanel.locked}
                    style={{
                        zIndex: 100,
                        transition: videoPanel.locked ? 'all 0.4s ease-in-out' : 'none',
                    }}
                    className={isPanelExpanded || isScreenShareActive ? "" : "shadow-2xl"}
                >
                    <div className={`w-full h-full flex flex-col bg-black overflow-hidden border-white/10 ${isPanelExpanded ? 'border-l' : 'rounded-xl border-2 shadow-2xl overflow-hidden'}`}>
                        {/* Header for the video window */}
                        <div className={`flex items-center justify-between bg-linear-to-r from-purple-600 to-indigo-600 shrink-0 select-none ${isPanelExpanded ? 'h-12 px-4' : 'h-8 px-2 cursor-move'}`}>
                            <div className="flex flex-col">
                                <span className={isPanelExpanded ? "text-[10px] font-black text-white/40 uppercase tracking-[0.2em]" : "text-[8px] font-black text-white/40 uppercase"}>
                                    {isPanelExpanded ? "Session Room" : "Video"}
                                </span>
                                {isPanelExpanded && (
                                    <span className="text-xs font-bold text-white truncate max-w-[200px]">
                                        {booking?.students?.first_name || 'Student'}&apos;s Classroom
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                                    className="text-white hover:bg-white/20 rounded p-1 transition-colors"
                                    title={isPanelExpanded ? "Minimize" : "Maximize"}
                                >
                                    {isPanelExpanded ? <Minimize2 size={isPanelExpanded ? 16 : 12} /> : <Maximize2 size={12} />}
                                </button>
                                {isPanelExpanded && (
                                    <button
                                        onClick={() => setIsPanelExpanded(false)}
                                        className="text-white hover:bg-white/20 rounded p-1 transition-colors"
                                        title="Close panel"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* The Iframe itself - Managed by daily-js */}
                        <div className="flex-1 relative bg-black">
                            <div ref={(el) => {
                                dailyContainerRef.current = el;
                                if (el && !isDailyContainerReady) {
                                    setIsDailyContainerReady(true);
                                }
                            }} className="absolute inset-0 w-full h-full border-0" />
                            
                            {/* Loading state just in case */}
                            {videoLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </Rnd>
            )}
        </div>
    );
}