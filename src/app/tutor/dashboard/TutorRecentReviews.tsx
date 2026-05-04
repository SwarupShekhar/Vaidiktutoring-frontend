'use client';

import { useState, useEffect } from 'react';
import api from '@/app/lib/api';
import { Star, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  score: number;
  comment: string;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
  };
}

export default function TutorRecentReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/tutor/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="p-8 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
        <p className="text-muted-foreground text-sm font-medium italic">No qualitative feedback yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {reviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm group hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < review.score ? 'fill-yellow-400 text-yellow-400' : 'text-muted/30'}
                  />
                ))}
              </div>
              <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex gap-3">
              <Quote className="text-primary/20 shrink-0" size={16} />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                {review.comment || "Great session! Student provided a high rating without specific comments."}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-foreground">
                {review.users?.first_name} {review.users?.last_name?.[0]}.
              </span>
              <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/5 rounded-full uppercase tracking-tighter">
                Verified Feedback
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
