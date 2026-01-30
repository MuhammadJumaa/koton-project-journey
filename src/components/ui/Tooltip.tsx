import React, { useState } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`${styles.tooltip} ${styles[position]}`}>
          {content}
          <div className={`${styles.arrow} ${styles[`arrow${position.charAt(0).toUpperCase() + position.slice(1)}`]}`} />
        </div>
      )}
    </div>
  );
};
