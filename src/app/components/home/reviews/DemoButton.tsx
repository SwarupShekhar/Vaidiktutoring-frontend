'use client';
import React from 'react';
import styles from './DemoButton.module.css';

const DemoButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div>
      <button className={styles.uiverse} onClick={onClick}>
        <div className={styles.wrapper}>
          <span>Book Your Demo Class Today!</span>
          <div className={`${styles.circle} ${styles.circle12}`} />
          <div className={`${styles.circle} ${styles.circle11}`} />
          <div className={`${styles.circle} ${styles.circle10}`} />
          <div className={`${styles.circle} ${styles.circle9}`} />
          <div className={`${styles.circle} ${styles.circle8}`} />
          <div className={`${styles.circle} ${styles.circle7}`} />
          <div className={`${styles.circle} ${styles.circle6}`} />
          <div className={`${styles.circle} ${styles.circle5}`} />
          <div className={`${styles.circle} ${styles.circle4}`} />
          <div className={`${styles.circle} ${styles.circle3}`} />
          <div className={`${styles.circle} ${styles.circle2}`} />
          <div className={`${styles.circle} ${styles.circle1}`} />
        </div>
      </button>
    </div>
  );
}

export default DemoButton;
