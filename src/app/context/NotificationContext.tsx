'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthContext } from './AuthContext';

interface NotificationPayload {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'loud';
    title: string;
    message: string;
    timestamp: Date;
    playAudio?: boolean;
    onClick?: () => void;
}

interface NotificationContextType {
    notifications: NotificationPayload[];
    addNotification: (notification: Omit<NotificationPayload, 'id' | 'timestamp'>) => void;
    dismissNotification: (id: string) => void;
    socket: Socket | null;
}

type BookingCreatedPayload = { studentName?: string };
type BookingAllocatedPayload = { tutorName?: string };
type TutorAllocationPayload = { studentName?: string; scheduledTime?: string };
type ParentSessionNotePayload = { childId?: string; studentName?: string; tutorName?: string };
type BookingFallbackPayload = {
    message?: string;
    studentName?: string;
    subjectName?: string;
    claimUrl?: string;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuthContext();
    const userId = user?.sub || user?.id;
    const role = user?.role;
    const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize notification sound
    useEffect(() => {
        // Use the hosted sound we verified earlier
        audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    }, []);

    const playSound = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => console.error("Audio play failed", err));
        }
    }, []);

    const addNotification = useCallback((notif: Omit<NotificationPayload, 'id' | 'timestamp'>) => {
        const newNotif = {
            ...notif,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
        };

        setNotifications(prev => [newNotif, ...prev]);

        if (notif.playAudio || notif.type === 'loud') {
            playSound();
        }
    }, [playSound]);

    const dismissNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Socket Connection
    useEffect(() => {
        if (!userId) return;

        const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.studyhours.com').replace(/\/$/, '');

        // Start with polling and let Socket.IO upgrade to websocket. This avoids
        // browser-level websocket errors during auth hydration and proxy warmups.
        const socketInstance = io(API_URL, {
            query: { userId, role },
            transports: ['polling', 'websocket'],
            upgrade: true,
            withCredentials: true,
            timeout: 10000,
        });

        socketInstance.on('connect', () => {
            setSocket(socketInstance);

            // Join a personal room based on user ID for targeted alerts
            socketInstance.emit('join_personal_room', { userId });
        });

        socketInstance.on('connect_error', (err) => {
            console.error('[Notification] Socket Connection Error:', err);
            console.error('[Notification] Failed to connect to:', API_URL);
        });

        socketInstance.on('disconnect', () => {
            setSocket(current => current === socketInstance ? null : current);
        });

        // ---------------- EVENTS ----------------

        // 1. ADMIN: New Session Booking
        // Event: 'booking:created'
        socketInstance.on('booking:created', (data: BookingCreatedPayload) => {
            if (role === 'admin') {
                addNotification({
                    type: 'info',
                    title: 'New Booking Received',
                    message: `${data.studentName || 'A student'} just booked a session!`,
                    playAudio: true
                });
            }
        });

        // 2. STUDENT: Tutor Allocated
        // Event: 'booking:allocated'
        socketInstance.on('booking:allocated', (data: BookingAllocatedPayload) => {
            // Check if this notification is for me (if broadcasted loosely)
            // Ideally backend sends to "student-userId" room.
            if (role === 'student') {
                addNotification({
                    type: 'success',
                    title: 'Tutor Assigned!',
                    message: `${data.tutorName || 'A Tutor'} is going to take your session.`,
                    playAudio: true
                });
            }
        });

        // 3. TUTOR: Session Allocated (LOUD)
        // Event: 'booking:assigned_to_me' (more specific) or 'booking:allocated'
        socketInstance.on('booking:assigned_to_me', (data: TutorAllocationPayload) => {
            if (role === 'tutor') {
                addNotification({
                    type: 'loud', // Special generic type for modal
                    title: 'New Session Allocation',
                    message: `Please take session of ${data.studentName} at ${data.scheduledTime}.`,
                    playAudio: true
                });
            }
        });

        // 4. PARENT: Session Note Added
        socketInstance.on('session:note_added', (data: ParentSessionNotePayload) => {
            if (role === 'parent') {
                addNotification({
                    type: 'success',
                    title: 'New Session Report!',
                    message: `Tutor ${data.tutorName || 'Your tutor'} has left a note for ${data.studentName || 'your child'}'s last session.`,
                    playAudio: true,
                    onClick: () => {
                        window.location.href = `/parent/dashboard?childId=${data.childId}&showHistory=true`;
                    }
                });
            }
        });

        // 5. TUTOR: 15-Minute Fallback Notification (Unclaimed Booking)
        // Event: 'booking:unclaimed_fallback'
        socketInstance.on('booking:unclaimed_fallback', (data: BookingFallbackPayload) => {
            if (role === 'tutor') {
                addNotification({
                    type: 'warning',
                    title: '⏰ Unclaimed Session Available',
                    message: data.message || `A session with ${data.studentName} (${data.subjectName}) is still available!`,
                    playAudio: true,
                    onClick: () => {
                        if (data.claimUrl) {
                            window.location.href = data.claimUrl;
                        } else {
                            window.location.href = '/tutor/dashboard';
                        }
                    }
                });
            }
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [addNotification, userId, role]);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, dismissNotification, socket }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used within NotificationProvider");
    return context;
};
