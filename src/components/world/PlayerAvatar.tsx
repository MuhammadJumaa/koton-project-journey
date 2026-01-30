import styles from './PlayerAvatar.module.css';

interface PlayerAvatarProps {
  name: string;
  avatar: string;
  currentStep: number;
  isCurrentPlayer?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function PlayerAvatar({
  name,
  avatar,
  currentStep,
  isCurrentPlayer = false,
  size = 'medium'
}: PlayerAvatarProps) {
  return (
    <div className={`${styles.container} ${styles[size]} ${isCurrentPlayer ? styles.current : ''}`}>
      <div className={styles.avatarWrapper}>
        <span className={styles.avatar}>{avatar}</span>
        {isCurrentPlayer && <div className={styles.glow} />}
      </div>
      <span className={styles.name}>{name}</span>
      <span className={styles.step}>Step {currentStep}</span>
    </div>
  );
}

// Mini version for displaying on map nodes
interface MapAvatarProps {
  avatar: string;
  name: string;
  isCurrentPlayer?: boolean;
}

export function MapAvatar({ avatar, name, isCurrentPlayer = false }: MapAvatarProps) {
  return (
    <div className={`${styles.mapAvatar} ${isCurrentPlayer ? styles.mapAvatarCurrent : ''}`}>
      <span className={styles.mapAvatarEmoji}>{avatar}</span>
      <span className={styles.mapAvatarName}>{name}</span>
    </div>
  );
}
