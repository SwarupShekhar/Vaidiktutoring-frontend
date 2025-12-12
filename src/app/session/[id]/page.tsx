'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';

interface SessionProps {
    params: Promise<{ id: string }>;
}

export default function SessionPage({ params }: SessionProps) {
    const { id: sessionId } = React.use(params);
    const jitsiRef = useRef<HTMLDivElement | null>(null);
    const [meetReady, setMeetReady] = useState(false);
    const [messages, setMessages] = useState<{ id: string, from: string, text: string }[]>([]);
    const [text, setText] = useState('');
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunks = useRef<Blob[]>([]);

    // Excalidraw API & Collab
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const [ExcalidrawComp, setExcalidrawComp] = useState<any>(null);

    useEffect(() => {
        import('@excalidraw/excalidraw').then((mod) => setExcalidrawComp(() => mod.Excalidraw));

        // lazy load Jitsi script if not provided in layout
        // Note: We added it to layout.tsx via next/script, so window.JitsiMeetExternalAPI might be ready.
        const checkJitsi = () => {
            // @ts-ignore
            if (typeof window !== 'undefined' && window.JitsiMeetExternalAPI) {
                setMeetReady(true);
            } else {
                // Fallback if layout script hasn't loaded yet or fail check
                const s = document.createElement('script');
                s.src = 'https://meet.jit.si/external_api.js';
                s.onload = () => setMeetReady(true);
                document.head.appendChild(s);
            }
        };
        checkJitsi();
    }, []);

    // Yjs Collaboration Logic
    useEffect(() => {
        if (!excalidrawAPI || !sessionId) return;

        // Dynamic import to avoid SSR issues with y-websocket
        (async () => {
            const Y = await import('yjs');
            const { WebsocketProvider } = await import('y-websocket');

            // Connect to local WS server (requires running y-websocket-server separately)
            // npx y-websocket
            const ydoc = new Y.Doc();
            const provider = new WebsocketProvider('ws://localhost:1234', `k12-session-${sessionId}`, ydoc);
            const ymap = ydoc.getMap('excalidraw-state');

            // Sync Excalidraw -> Yjs
            // Note: A full robust sync requires handling 'change' events carefully. 
            // For this Minimum Viable implementation, we will log connection.
            // In a real app, use 'y-excalidraw' or similar binding library.

            provider.on('status', (event: any) => {
                console.log('[Collab] WS Status:', event.status);
            });

            // Cleanup
            return () => {
                provider.disconnect();
                ydoc.destroy();
            };
        })();
    }, [excalidrawAPI, sessionId]);

    useEffect(() => {
        // @ts-ignore
        if (!meetReady || !jitsiRef.current || !window.JitsiMeetExternalAPI) return;
        const domain = 'meet.jit.si';
        const options = {
            roomName: `k12-session-${sessionId}`,
            width: '100%',
            height: '100%',
            parentNode: jitsiRef.current,
            interfaceConfigOverwrite: { SHOW_JITSI_WATERMARK: false },
            configOverwrite: { prejoinPageEnabled: false },
        };
        // @ts-ignore
        const apiObj = new window.JitsiMeetExternalAPI(domain, options);

        // Example: receive events and store
        apiObj.addEventListener('videoConferenceJoined', (ev: any) => {
            console.log('joined', ev);
        });

        return () => {
            try { apiObj.dispose(); } catch (e) { }
        };
    }, [meetReady, sessionId]);

    // Use real backend API
    useEffect(() => {
        (async () => {
            try {
                // Hit backend endpoints
                const chatRes = await api.get(`/sessions/${sessionId}/messages`);
                if (chatRes.data) {
                    setMessages(chatRes.data || []);
                }
            } catch (e) {
                console.warn('session fetch failed', e);
            }
        })();
    }, [sessionId]);

    async function sendMessage() {
        if (!text) return;
        try {
            const res = await api.post(`/sessions/${sessionId}/messages`, { text });
            if (res.data) {
                setMessages((m) => [...m, res.data]);
                setText('');
            }
        } catch (e) { console.error(e); }
    }

    // Recording: capture screen (or camera+mic)
    async function startRecording() {
        try {
            // capture display
            // permission: user must accept screen capture
            const stream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true, audio: true });
            const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm';
            const mr = new MediaRecorder(stream, { mimeType: mime });
            recordedChunks.current = [];
            mr.ondataavailable = (e) => { if (e.data.size) recordedChunks.current.push(e.data); };
            mr.onstop = async () => {
                const blob = new Blob(recordedChunks.current, { type: mime });
                // upload to backend
                const fd = new FormData();
                fd.append('file', blob, `session-${sessionId}-${Date.now()}.webm`);
                try {
                    await api.post(`/sessions/${sessionId}/recordings`, fd, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    alert('Recording uploaded');
                } catch (err) { console.error(err); alert('Upload failed'); }
            };
            mediaRecorderRef.current = mr;
            mr.start(1000);
            setRecording(true);
        } catch (err) {
            console.error('screen capture failed', err);
            alert('Screen capture permission denied or unsupported');
        }
    }

    function stopRecording() {
        try { mediaRecorderRef.current?.stop(); setRecording(false); } catch { }
    }

    return (
        <div className="max-w-[1600px] mx-auto p-4 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Session <span className="text-blue-500">{sessionId.slice(0, 8)}</span></h2>

                <div className="flex gap-2">
                    {!recording ? (
                        <button onClick={startRecording} className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white" /> Record
                        </button>
                    ) : (
                        <button onClick={stopRecording} className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition border border-red-500 animate-pulse">
                            Stop
                        </button>
                    )}
                    <a href={`/sessions/${sessionId}/invite.ics`} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        Invite
                    </a>
                </div>
            </div>

            <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
                {/* LEFT: VIDEO + CHAT */}
                <div className="w-1/3 flex flex-col gap-4">
                    <div className="flex-1 rounded-xl shadow-lg bg-black/90 overflow-hidden relative">
                        <div ref={jitsiRef} className="w-full h-full" />
                    </div>

                    <div className="h-1/3 min-h-[250px] bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
                        <div className="p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-medium text-gray-700 dark:text-gray-200 text-sm">
                            Session Chat
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {messages.map((m, i) => (
                                <div key={m.id || i} className="flex flex-col">
                                    <span className="text-[10px] text-gray-400">{m.from}</span>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-sm text-gray-800 dark:text-gray-200">{m.text}</div>
                                </div>
                            ))}
                        </div>
                        <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex gap-2">
                            <input
                                className="flex-1 px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Say something..."
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button onClick={sendMessage} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Send</button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: WHITEBOARD */}
                <div className="flex-1 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white relative">
                    {ExcalidrawComp ? (
                        <ExcalidrawComp
                            theme="light"
                            excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                            UIOptions={{
                                canvasActions: { loadScene: false, saveToActiveFile: false }
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">Loading Whiteboard...</div>
                    )}
                </div>
            </div>
        </div>
    );
}