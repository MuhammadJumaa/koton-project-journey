import { Step } from '../../data/steps';
import styles from './StepPopup.module.css';

interface StepPopupProps {
  step: Step;
  isCompleted: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export function StepPopup({ step, isCompleted, onComplete, onClose }: StepPopupProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.header}>
          <span className={styles.stepNumber}>Adım {step.id}</span>
          {isCompleted && <span className={styles.completedBadge}>Tamamlandı</span>}
        </div>

        <h2 className={styles.title}>{step.title}</h2>

        <p className={styles.description}>{step.description}</p>

        <div className={styles.hintBox}>
          <span className={styles.hintIcon}>💡</span>
          <span className={styles.hintText}>{step.hint}</span>
        </div>

        {step.link && (
          <a
            href={step.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            🔗 Auth Portal'da Aç
          </a>
        )}

        <div className={styles.actions}>
          {isCompleted ? (
            <button className={styles.completedButton} disabled>
              ✓ Zaten Tamamlandı
            </button>
          ) : (
            <button className={styles.completeButton} onClick={onComplete}>
              ✅ Anladım!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
