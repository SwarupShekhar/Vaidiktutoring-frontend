'use client';

import React from 'react';
import styles from './InteractiveCard.module.css';

interface InteractiveCardProps {
    children: React.ReactNode;
    variant?: 'purple' | 'green' | 'blue' | 'orange';
}

const InteractiveCard = ({ children, variant = 'purple' }: InteractiveCardProps) => {
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <div className={styles.card}>
                <div className={styles.blobs}>
                    <div className={`${styles.two} ${variant === 'orange' ? styles.twoOrange : ''}`} />
                    <div className={`${styles.three} ${variant === 'orange' ? styles.threeOrange : ''}`} />
                </div>
                <div className={styles.one}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default InteractiveCard;
