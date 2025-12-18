'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthContext } from './AuthContext';

interface NotificationPayload {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'loud';
    title: string;
    message: string;
    timestamp: Date;
    playAudio?: boolean;
}

interface NotificationContextType {
    notifications: NotificationPayload[];
    addNotification: (notification: Omit<NotificationPayload, 'id' | 'timestamp'>) => void;
    dismissNotification: (id: string) => void;
    socket: Socket | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuthContext();
    const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize notification sound
    useEffect(() => {
        // Use the hosted sound we verified earlier
        audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    }, []);

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => console.error("Audio play failed", err));
        }
    };

    const addNotification = (notif: Omit<NotificationPayload, 'id' | 'timestamp'>) => {
        const newNotif = {
            ...notif,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
        };

        setNotifications(prev => [newNotif, ...prev]);

        if (notif.playAudio || notif.type === 'loud') {
            playSound();
        }
    };

    const dismissNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Socket Connection
    useEffect(() => {
        if (!user) return;

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://k-12-backend.onrender.com';
        // Connecting to root namespace (or /notifications if backend supports it)
        // For now, let's assume root or a general namespace. 
        // Based on session chat, backend uses namespaces strictly.
        // I will try connecting to '/notifications' first, if connection fails, maybe root.
        // BUT, usually app.gateway is on root.

        // Let's stick to root first as it's safer for global events unless specified.
        const socketInstance = io(API_URL, {
            query: { userId: user.sub || user.id, role: user.role },
            transports: ['websocket', 'polling'],
        });

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('[Notification] Connected to global socket:', socketInstance.id);
            // Join a personal room based on user ID for targeted alerts
            socketInstance.emit('join_personal_room', { userId: user.sub || user.id });
        });

        socketInstance.on('connect_error', (err) => {
            console.error('[Notification] Socket Connection Error:', err);
        });

        // Debug: Log any event received (wildcard not standard in client, but we can log specific ones)

        // ---------------- EVENTS ----------------

        // 1. ADMIN: New Session Booking
        // Event: 'booking:created'
        socketInstance.on('booking:created', (data: any) => {
            if (user.role === 'admin') {
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
        socketInstance.on('booking:allocated', (data: any) => {
            // Check if this notification is for me (if broadcasted loosely)
            // Ideally backend sends to "student-userId" room.
            if (user.role === 'student') {
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
        socketInstance.on('booking:assigned_to_me', (data: any) => {
            if (user.role === 'tutor') {
                addNotification({
                    type: 'loud', // Special generic type for modal
                    title: 'New Session Allocation',
                    message: `Please take session of ${data.studentName} at ${data.scheduledTime}.`,
                    playAudio: true
                });
            }
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [user]);

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
