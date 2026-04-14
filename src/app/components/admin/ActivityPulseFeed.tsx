'use client';

import React, { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { 
    UserPlus, 
    Mail, 
    Calendar, 
    AlertCircle, 
    CheckCircle2, 
    ArrowRightLeft,
    ShieldAlert,
    LogIn,
    PlayCircle,
    CheckCircle,
    XCircle
} from 'lucide-react';

interface ActivityItem {
    id: string;
    action: string;
    created_at: string;
    details: any;
}

export default function ActivityPulseFeed() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchActivity = async () => {
        try {
            const res = await api.get('/admin/recent-activity');
            setActivities(res.data || []);
        } catch (e) {
            console.error('Failed to fetch activity logs', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
        const interval = setInterval(fetchActivity, 15000); // 15 sec refresh
        return () => clearInterval(interval);
    }, []);

    const getIcon = (action: string) => {
        switch (action) {
            case 'USER_SIGNED_UP_UNVERIFIED': return <UserPlus className="text-blue-500" size={16} />;
            case 'TUTOR_NUDGED': return <Mail className="text-purple-500" size={16} />;
            case 'SESSION_CREATED': return <Calendar className="text-green-500" size={16} />;
            case 'TUTOR_ALLOCATED': return <ArrowRightLeft className="text-indigo-500" size={16} />;
            case 'ADMIN_ROLE_FIXED': return <ShieldAlert className="text-red-500" size={16} />;
            case 'USER_LOGGED_IN': return <LogIn className="text-blue-400" size={16} />;
            case 'SESSION_JOINED': return <PlayCircle className="text-emerald-500" size={16} />;
            case 'SESSION_COMPLETED': return <CheckCircle className="text-green-600" size={16} />;
            case 'SESSION_CANCELLED': return <XCircle className="text-red-500" size={16} />;
            case 'EMAIL_VERIFIED': return <CheckCircle2 className="text-emerald-500" size={16} />;
            default: return <Activity className="text-gray-500" size={16} />;
        }
    };

    const formatAction = (action: string) => {
        return action.replace(/_/g, ' ').toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading && activities.length === 0) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-gray-100 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.length === 0 ? (
                <p className="text-xs text-center text-text-secondary opacity-50 py-4">No recent activity detected.</p>
            ) : (
                activities.map((item) => (
                    <div key={item.id} className="group relative pl-6 pb-4 border-l border-white/10 last:pb-0">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm border border-white/20">
                            {getIcon(item.action)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-(--color-text-primary)">
                                {formatAction(item.action)}
                            </span>
                            <span className="text-[10px] text-text-secondary font-medium uppercase tracking-tighter opacity-60">
                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </span>
                            {item.details?.email && (
                                <span className="text-[11px] text-blue-500 truncate mt-0.5">
                                    {item.details.email}
                                </span>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

import { Activity } from 'lucide-react';
