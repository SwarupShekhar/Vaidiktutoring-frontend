'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

import Image from 'next/image';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const BlogSection = () => {
  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs-student'],
    queryFn: async () => {
      const res = await api.get('/blogs?status=PUBLISHED&limit=3');
      return res.data?.data ?? res.data ?? [];
    },
    staleTime: 5 * 60_000,
  });

  if (!blogs.length) return null;

  return (
    <motion.div variants={itemVariants} className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <BookOpen size={20} className="text-green-500" /> From the Blog
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {blogs.slice(0, 3).map((b: any) => (
          <a key={b.id} href={`/blog/${b.slug}`}
            className="group bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all">
            {b.image_url && (
              <div className="h-36 overflow-hidden relative">
                <Image 
                  src={b.image_url} 
                  alt={b.image_alt || b.title} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
              </div>
            )}
            <div className="p-4">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{b.category}</span>
              <h3 className="font-bold text-foreground mt-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{b.title}</h3>
              <p className="text-xs text-text-secondary mt-1 line-clamp-2">{b.excerpt}</p>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
};
