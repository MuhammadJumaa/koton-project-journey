import { useEffect, useState } from 'react';
import styles from './FloatingReaction.module.css';

interface FloatingReactionProps {
  emoji: string;
  id: string;
  onComplete: (id: string) => void;
}

export function FloatingReaction({ emoji, id, onComplete }: FloatingReactionProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete(id), 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [id, onComplete]);

  return (
    <div className={`${styles.floatingReaction} ${!isVisible ? styles.fadeOut : ''}`}>
      <span className={styles.emoji}>{emoji}</span>
    </div>
  );
}
