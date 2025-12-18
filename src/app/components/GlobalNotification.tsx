'use client';
import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function GlobalNotification() {
    const { notifications, dismissNotification } = useNotification();

    return (
        <div className="fixed z-[9999] pointer-events-none flex flex-col items-end gap-2 p-4 top-4 right-4 w-full max-w-sm">
            <AnimatePresence>
                {notifications.map((notif) => {
                    const isLoud = notif.type === 'loud';

                    // LOUD NOTIFICATION (Modal-like overlay, centered)
                    if (isLoud) {
                        return (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="fixed inset-0 flex items-center justify-center bg-black/60 pointer-events-auto backdrop-blur-sm p-4 z-[10000]"
                            >
                                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full border-2 border-purple-500 text-center relative overflow-hidden">
                                    {/* Pulsing background effect */}
                                    <div className="absolute inset-0 bg-purple-500/10 animate-pulse pointer-events-none" />

                                    <div className="relative z-10">
                                        <div className="text-6xl mb-4">🔔</div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{notif.title}</h2>
                                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{notif.message}</p>

                                        <button
                                            onClick={() => dismissNotification(notif.id)}
                                            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:scale-105"
                                        >
                                            Acknowledge
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }

                    // STANDARD TOAST
                    return (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className={`pointer-events-auto w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border-l-4 p-4 flex gap-3 items-start backdrop-blur-md bg-opacity-95
                                ${notif.type === 'success' ? 'border-green-500' :
                                    notif.type === 'error' ? 'border-red-500' :
                                        notif.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'}`}
                        >
                            <div className="text-2xl">
                                {notif.type === 'success' ? '✅' :
                                    notif.type === 'error' ? '❌' :
                                        notif.type === 'warning' ? '⚠️' : 'ℹ️'}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{notif.title}</h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-2">{notif.timestamp.toLocaleTimeString()}</p>
                            </div>
                            <button
                                onClick={() => dismissNotification(notif.id)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
