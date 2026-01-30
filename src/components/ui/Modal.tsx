import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  actions,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${styles[size]}`}
        onClick={e => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {showCloseButton && (
              <button className={styles.closeButton} onClick={onClose}>
                ✕
              </button>
            )}
          </div>
        )}
        <div className={styles.content}>{children}</div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
};

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  reward?: string;
  score?: number;
  onContinue: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  reward,
  score,
  onContinue,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small" showCloseButton={false}>
      <div className={styles.successContent}>
        <div className={styles.successIcon}>🎉</div>
        <h2 className={styles.successTitle}>{title}</h2>
        <p className={styles.successMessage}>{message}</p>
        {score !== undefined && (
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreLabel}>Puan</span>
            <span className={styles.scoreValue}>+{score}</span>
          </div>
        )}
        {reward && (
          <div className={styles.rewardDisplay}>
            <span className={styles.rewardLabel}>Ödül Kazanıldı</span>
            <span className={styles.rewardValue}>🏆 {reward}</span>
          </div>
        )}
        <Button onClick={onContinue} variant="success" fullWidth>
          Devam Et
        </Button>
      </div>
    </Modal>
  );
};

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hint: string;
}

export const HintModal: React.FC<HintModalProps> = ({ isOpen, onClose, hint }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="💡 İpucu" size="small">
      <p className={styles.hintText}>{hint}</p>
      <div className={styles.hintActions}>
        <Button onClick={onClose} variant="secondary">
          Anladım!
        </Button>
      </div>
    </Modal>
  );
};
