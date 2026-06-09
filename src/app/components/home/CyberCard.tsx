'use client';
import React from 'react';
import styles from './CyberCard.module.css';

interface CyberCardProps {
  step: number;
  title: string;
  description: string;
  icon: string;
}

const CyberCard = ({ step, title, description, icon }: CyberCardProps) => {
  return (
    <div>
      <div className={`${styles.container} ${styles.noselect}`}>
        <div className={styles.canvas}>
          <div className={`${styles.tracker} ${styles.tr1}`} />
          <div className={`${styles.tracker} ${styles.tr2}`} />
          <div className={`${styles.tracker} ${styles.tr3}`} />
          <div className={`${styles.tracker} ${styles.tr4}`} />
          <div className={`${styles.tracker} ${styles.tr5}`} />
          <div className={`${styles.tracker} ${styles.tr6}`} />
          <div className={`${styles.tracker} ${styles.tr7}`} />
          <div className={`${styles.tracker} ${styles.tr8}`} />
          <div className={`${styles.tracker} ${styles.tr9}`} />
          <div className={`${styles.tracker} ${styles.tr10}`} />
          <div className={`${styles.tracker} ${styles.tr11}`} />
          <div className={`${styles.tracker} ${styles.tr12}`} />
          <div className={`${styles.tracker} ${styles.tr13}`} />
          <div className={`${styles.tracker} ${styles.tr14}`} />
          <div className={`${styles.tracker} ${styles.tr15}`} />
          <div className={`${styles.tracker} ${styles.tr16}`} />
          <div className={`${styles.tracker} ${styles.tr17}`} />
          <div className={`${styles.tracker} ${styles.tr18}`} />
          <div className={`${styles.tracker} ${styles.tr19}`} />
          <div className={`${styles.tracker} ${styles.tr20}`} />
          <div className={`${styles.tracker} ${styles.tr21}`} />
          <div className={`${styles.tracker} ${styles.tr22}`} />
          <div className={`${styles.tracker} ${styles.tr23}`} />
          <div className={`${styles.tracker} ${styles.tr24}`} />
          <div className={`${styles.tracker} ${styles.tr25}`} />
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardGlare} />
              <div className={styles.cyberLines}>
                <span /><span /><span /><span />
              </div>
              <p className={styles.prompt}>STEP {step}</p>
              <div className={styles.title}>
                {title}
                <div className="text-4xl mt-2">{icon}</div>
              </div>
              <div className={styles.glowingElements}>
                <div className={styles.glow1} />
                <div className={styles.glow2} />
                <div className={styles.glow3} />
              </div>
              <div className={styles.subtitle}>
                <span>{description}</span>
              </div>
              <div className={styles.cardParticles}>
                <span /><span /><span /> <span /><span /><span />
              </div>
              <div className={styles.cornerElements}>
                <span /><span /><span /><span />
              </div>
              <div className={styles.scanLine} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CyberCard;
