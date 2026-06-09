'use client';
import React from 'react';
import styles from './ScheduleCard.module.css';

const ScheduleCard = () => {
    return (
        <div>
            <div className={styles.card}>
                <div className={styles.cardBorder} />
                <div>
                    <span className={styles.cardTitle}>Schedule a free demo</span>
                    <p className={styles.cardParagraph}>Try a 30-min demo with one of our tutors and see the learning plan.</p>
                </div>
                <hr className={styles.line} />
                <ul className={styles.cardList}>
                    <li className={styles.cardListItem}>
                        <span className={styles.check}>
                            <svg className={styles.checkSvg} fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fillRule="evenodd" />
                            </svg>
                        </span>
                        <span className={styles.listText}>Live Google Meet</span>
                    </li>
                    <li className={styles.cardListItem}>
                        <span className={styles.check}>
                            <svg className={styles.checkSvg} fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fillRule="evenodd" />
                            </svg>
                        </span>
                        <span className={styles.listText}>Curriculum aligned</span>
                    </li>
                    <li className={styles.cardListItem}>
                        <span className={styles.check}>
                            <svg className={styles.checkSvg} fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fillRule="evenodd" />
                            </svg>
                        </span>
                        <span className={styles.listText}>In-house tutors</span>
                    </li>
                </ul>
                <button className={styles.button}>Book demo</button>
            </div>
        </div>
    );
}

export default ScheduleCard;
