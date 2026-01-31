import { useEffect, useState } from 'react';
import { EasterEgg } from '../../data/easterEggs';
import styles from './EasterEggModal.module.css';

interface EasterEggModalProps {
  egg: EasterEgg;
  onClose: () => void;
}

export function EasterEggModal({ egg, onClose }: EasterEggModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (egg.type === 'animation') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [egg.type]);

  const getTypeLabel = () => {
    switch (egg.type) {
      case 'joke': return 'Espri';
      case 'fact': return 'Bilgi';
      case 'achievement': return 'Basari';
      case 'animation': return 'Surpriz';
      default: return '';
    }
  };

  const getTypeColor = () => {
    switch (egg.type) {
      case 'joke': return '#ffc107';
      case 'fact': return '#64b5f6';
      case 'achievement': return '#38ef7d';
      case 'animation': return '#f06292';
      default: return '#667eea';
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {showConfetti && (
          <div className={styles.confettiContainer}>
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className={styles.confetti}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce'][Math.floor(Math.random() * 5)],
                }}
              />
            ))}
          </div>
        )}

        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.iconContainer}>
          <span className={styles.bigIcon}>{egg.icon}</span>
        </div>

        <span className={styles.typeLabel} style={{ backgroundColor: getTypeColor() }}>
          {getTypeLabel()}
        </span>

        <h2 className={styles.title}>{egg.title}</h2>

        <p className={styles.content}>{egg.content}</p>

        <button className={styles.closeButtonMain} onClick={onClose}>
          Harika!
        </button>
      </div>
    </div>
  );
}
