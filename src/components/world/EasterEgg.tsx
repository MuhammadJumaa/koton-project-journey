import { useState } from 'react';
import { EasterEgg as EasterEggType } from '../../data/easterEggs';
import styles from './EasterEgg.module.css';

interface EasterEggProps {
  egg: EasterEggType;
  isFound: boolean;
  onClick: () => void;
}

export function EasterEgg({ egg, isFound, onClick }: EasterEggProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (isFound) {
    return null; // Don't render found eggs
  }

  return (
    <button
      className={`${styles.easterEgg} ${isHovered ? styles.hovered : ''}`}
      style={{ top: egg.position.top, left: egg.position.left }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Hidden item: ${egg.icon}`}
    >
      <span className={styles.icon}>{egg.icon}</span>
    </button>
  );
}
