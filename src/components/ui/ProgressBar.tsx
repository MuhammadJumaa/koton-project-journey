import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'success' | 'warning' | 'xp';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showPercentage = true,
  size = 'medium',
  variant = 'default',
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={styles.container}>
      {label && (
        <div className={styles.labelContainer}>
          <span className={styles.label}>{label}</span>
          {showPercentage && (
            <span className={styles.percentage}>{percentage}%</span>
          )}
        </div>
      )}
      <div className={`${styles.track} ${styles[size]}`}>
        <div
          className={`${styles.fill} ${styles[variant]}`}
          style={{ width: `${percentage}%` }}
        >
          <div className={styles.shine} />
        </div>
      </div>
      {!label && showPercentage && (
        <span className={styles.percentageInline}>{percentage}%</span>
      )}
    </div>
  );
};
