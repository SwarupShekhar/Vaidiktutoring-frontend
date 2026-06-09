'use client';
import React from 'react';
import Link from 'next/link';
import styles from './SubjectCard.module.css';

interface Subject {
    id: string;
    title: string;
    description: string;
    icon: string;
    subTopics: string[];
    gradient: string;
}

interface SubjectCardProps {
    subject: Subject;
    index: number;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
    return (
        <Link href={`/search?subject=${subject.id}`} className="block h-full">
            <div style={{ height: '100%' }}>
                <div className={styles.card}>
                    <div className={styles.content}>
                        <div className={styles.iconWrapper}>
                            <span className="text-3xl">{subject.icon}</span>
                        </div>
                        <h3 className={styles.heading}>{subject.title}</h3>
                        <p className={styles.para}>{subject.description}</p>
                        
                        <div className={styles.topicsWrapper}>
                            <p className={styles.topicsLabel}>Popular Topics</p>
                            <div className={styles.topics}>
                                {subject.subTopics.slice(0, 3).map((topic: string, i: number) => (
                                    <span key={i} className={styles.topicTag}>{topic}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
