import { reactions } from '../../data/reactions';
import styles from './ReactionPicker.module.css';

interface ReactionPickerProps {
  targetPlayerName: string;
  onSelectReaction: (emoji: string) => void;
  onClose: () => void;
}

export function ReactionPicker({ targetPlayerName, onSelectReaction, onClose }: ReactionPickerProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.picker} onClick={(e) => e.stopPropagation()}>
        <p className={styles.label}>
          <span className={styles.targetName}>{targetPlayerName}</span> icin reaksiyon sec
        </p>
        <div className={styles.emojiGrid}>
          {reactions.map((reaction) => (
            <button
              key={reaction.emoji}
              className={styles.emojiButton}
              onClick={() => onSelectReaction(reaction.emoji)}
              title={reaction.label}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
