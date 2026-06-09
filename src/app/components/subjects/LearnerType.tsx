import React from 'react';
import { Compass, Medal, Rocket } from 'lucide-react';
import styles from './LearnerType.module.css';

const cards = [
    {
        title: 'Remediation Path',
        label: 'Needs Support?',
        description: 'We build confidence by revisiting foundational gaps and using scaffolded learning techniques to bring students up to speed efficiently.',
        features: ['Confidence Building', 'Gap Analysis'],
        Icon: Compass,
        color: '#f97316',
        className: styles.remediationPath,
    },
    {
        title: 'Mastery Path',
        label: 'On Track?',
        description: 'We reinforce school learning with rigorous practice and conceptual deepening, ensuring students excel in exams and assessments.',
        features: ['Exam Excellence', 'Conceptual Depth'],
        Icon: Medal,
        color: '#0ea5e9',
        className: styles.masteryPath,
    },
    {
        title: 'Challenge Path',
        label: 'Advanced Learner?',
        description: 'We challenge high achievers with university-level concepts, critical thinking projects, and competitive exam preparation.',
        features: ['University Prep', 'Critical Thinking'],
        Icon: Rocket,
        color: '#8b5cf6',
        className: styles.challengePath,
    },
];

export default function LearnerType() {
    return (
        <section className="mb-32">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-deep-navy dark:text-white mb-4">Tailored for Every Learner</h2>
                <p className="text-lg text-text-secondary">We meet students exactly where they are.</p>
            </div>
            <div>
                <div className={styles.grid}>
                    {cards.map((card, index) => {
                        const Icon = card.Icon;
                        return (
                            <div key={index} className={`${styles.card} ${card.className}`}>
                                <div className={styles.content}>
                                    <div className={styles.iconWrapper} style={{ color: card.color }}>
                                        <Icon size={28} />
                                    </div>
                                    <p className={styles.heading}>{card.title}</p>
                                    <p className={styles.label} style={{ color: card.color }}>{card.label}</p>
                                    <p className={styles.para}>{card.description}</p>
                                    <ul className={styles.tags}>
                                        {card.features.map((feature, i) => (
                                            <li key={i} style={{ backgroundColor: `${card.color}15`, color: card.color }}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
