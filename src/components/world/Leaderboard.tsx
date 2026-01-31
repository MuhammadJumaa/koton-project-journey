import { useWorld } from '../../context/WorldContext';
import styles from './Leaderboard.module.css';

function formatTime(ms: number | null): string {
  if (!ms) return '-';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getRankEmoji(rank: number): string {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return `${rank}.`;
  }
}

export function Leaderboard() {
  const { leaderboard, socketId } = useWorld();

  if (leaderboard.length === 0) {
    return null;
  }

  return (
    <div className={styles.leaderboard}>
      <h4 className={styles.title}>Liderlik Tablosu</h4>
      <div className={styles.list}>
        {leaderboard.slice(0, 10).map((entry, index) => {
          const isCurrentPlayer = entry.socketId === socketId;
          const rank = index + 1;

          return (
            <div
              key={entry.socketId}
              className={`${styles.entry} ${isCurrentPlayer ? styles.current : ''}`}
            >
              <span className={styles.rank}>{getRankEmoji(rank)}</span>
              <span className={styles.avatar}>{entry.avatar}</span>
              <span className={styles.name}>
                {entry.name}
                {isCurrentPlayer && <span className={styles.youBadge}>Sen</span>}
              </span>
              <span className={styles.progress}>{entry.progress}%</span>
              {entry.isCompleted && entry.totalTimeMs && (
                <span className={styles.time}>
                  <span className={styles.bolt}>⚡</span>
                  {formatTime(entry.totalTimeMs)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
