'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';

interface SessionProps {
    params: Promise<{ id: string }>;
}

export default function SessionPage({ params }: SessionProps) {
    const { id: sessionId } = React.use(params);
    const { user } = useAuthContext();
    const jitsiRef = useRef<HTMLDivElement | null>(null);
    const jitsiApiRef = useRef<any>(null);
    const [meetReady, setMeetReady] = useState(false);
    const [jitsiLoading, setJitsiLoading] = useState(true);
    const router = useRouter();

    // Excalidraw API & Collab
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const [ExcalidrawComp, setExcalidrawComp] = useState<any>(null);

    useEffect(() => {
        import('@excalidraw/excalidraw').then((mod) => setExcalidrawComp(() => mod.Excalidraw));

        // lazy load Jitsi script
        const checkJitsi = () => {
            // @ts-ignore
            if (typeof window !== 'undefined' && window.JitsiMeetExternalAPI) {
                setMeetReady(true);
            } else {
                const s = document.createElement('script');
                s.src = 'https://meet.jit.si/external_api.js';
                s.onload = () => setMeetReady(true);
                document.head.appendChild(s);
            }
        };
        checkJitsi();
    }, []);

    // Yjs Collaboration Logic (for Excalidraw sync)
    useEffect(() => {
        if (!excalidrawAPI || !sessionId) return;

        (async () => {
            const Y = await import('yjs');
            const { WebsocketProvider } = await import('y-websocket');

            const ydoc = new Y.Doc();
            const provider = new WebsocketProvider('ws://localhost:1234', `k12-session-${sessionId}`, ydoc);

            provider.on('status', (event: any) => {
                console.log('[Collab] WS Status:', event.status);
            });

            return () => {
                provider.disconnect();
                ydoc.destroy();
            };
        })();
    }, [excalidrawAPI, sessionId]);

    // Initialize Jitsi with seamless auto-join
    useEffect(() => {
        // @ts-ignore
        if (!meetReady || !jitsiRef.current || !window.JitsiMeetExternalAPI) return;

        // Cleanup previous instance if any
        if (jitsiApiRef.current) {
            try { jitsiApiRef.current.dispose(); } catch (e) { }
        }

        const domain = 'meet.jit.si';
        const displayName = user?.first_name
            ? `${user.first_name} ${user.last_name || ''}`.trim()
            : 'Guest';

        const options = {
            roomName: `K12Session${sessionId.replace(/-/g, '').slice(0, 16)}`,
            width: '100%',
            height: '100%',
            parentNode: jitsiRef.current,
            userInfo: {
                displayName: displayName,
            },
            // Comprehensive config to skip lobby and auto-join
            configOverwrite: {
                prejoinPageEnabled: false,
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                disableDeepLinking: true,
                enableWelcomePage: false,
                enableClosePage: false,
                disableInviteFunctions: true,
                doNotStoreRoom: true,
                hideConferenceSubject: true,
                hideConferenceTimer: false,
                subject: 'Tutoring Session',
                enableLobbyChat: false,
                hideLobbyButton: true,
            },
            // Clean interface without Jitsi branding
            interfaceConfigOverwrite: {
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                SHOW_BRAND_WATERMARK: false,
                BRAND_WATERMARK_LINK: '',
                SHOW_POWERED_BY: false,
                SHOW_PROMOTIONAL_CLOSE_PAGE: false,
                HIDE_INVITE_MORE_HEADER: true,
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                MOBILE_APP_PROMO: false,
                DISABLE_PRESENCE_STATUS: true,
                GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
                DISPLAY_WELCOME_FOOTER: false,
                DISPLAY_WELCOME_PAGE_ADDITIONAL_CARD: false,
                DISPLAY_WELCOME_PAGE_CONTENT: false,
                DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
                RECENT_LIST_ENABLED: false,
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'desktop', 'fullscreen',
                    'raisehand', 'tileview', 'hangup', 'chat'
                ],
                SETTINGS_SECTIONS: ['devices', 'language'],
                VIDEO_QUALITY_LABEL_DISABLED: true,
            },
        };

        // @ts-ignore
        const apiObj = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = apiObj;

        apiObj.addEventListener('videoConferenceJoined', (ev: any) => {
            console.log('[Jitsi] Joined conference:', ev);
            setJitsiLoading(false);
        });

        apiObj.addEventListener('readyToClose', () => {
            console.log('[Jitsi] Meeting ended');
            router.push('/students/dashboard');
        });

        // Hide loading after a timeout in case event doesn't fire
        const timeout = setTimeout(() => setJitsiLoading(false), 5000);

        return () => {
            clearTimeout(timeout);
            try { apiObj.dispose(); } catch (e) { }
        };
    }, [meetReady, sessionId, user, router]);

    return (
        <div className="min-h-screen bg-[var(--color-background)] p-4 md:p-6">
            <div className="max-w-[1800px] mx-auto h-[calc(100vh-100px)] flex flex-col">

                {/* HEADER */}
                <div className="bg-glass rounded-2xl p-4 mb-4 border border-white/20 shadow-sm flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <div>
                            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                                Live Tutoring Session
                            </h1>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Session ID: {sessionId.slice(0, 8)}...
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Recording feature - Hidden until backend is ready */}
                        {/* 
                        <button className="px-4 py-2 rounded-xl bg-red-500 text-white">
                            Record
                        </button>
                        */}
                        <button
                            onClick={() => router.push('/students/dashboard')}
                            className="px-4 py-2 rounded-xl bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm font-medium border border-[var(--color-border)] hover:bg-[var(--color-border)] transition-all"
                        >
                            Exit Session
                        </button>
                    </div>
                </div>

                {/* MAIN CONTENT - Two column layout */}
                <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">

                    {/* LEFT COLUMN: VIDEO */}
                    <div className="w-[450px] flex-shrink-0 flex flex-col">

                        {/* VIDEO CONTAINER */}
                        <div className="flex-1 rounded-2xl overflow-hidden relative bg-gray-900 shadow-xl border border-gray-800">
                            {/* Loading overlay */}
                            {jitsiLoading && (
                                <div className="absolute inset-0 bg-gray-900 z-20 flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="text-white font-medium">Connecting to video...</p>
                                    <p className="text-gray-400 text-sm mt-1">Please allow camera & mic access</p>
                                </div>
                            )}
                            <div ref={jitsiRef} className="w-full h-full" />
                        </div>

                        {/* Info card below video */}
                        <div className="mt-4 bg-glass rounded-xl p-4 border border-white/20">
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                <span className="font-medium text-[var(--color-text-primary)]">💡 Tip:</span> Use the whiteboard on the right to collaborate with your tutor in real-time.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: WHITEBOARD */}
                    <div className="flex-1 rounded-2xl overflow-hidden bg-white shadow-xl border border-[var(--color-border)] relative">
                        {ExcalidrawComp ? (
                            <ExcalidrawComp
                                theme="light"
                                excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                                UIOptions={{
                                    canvasActions: { loadScene: false, saveToActiveFile: false }
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)]">
                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="font-medium">Loading Whiteboard...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}