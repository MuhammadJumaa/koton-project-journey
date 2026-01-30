import { useWorld } from '../../context/WorldContext';
import { TOTAL_STEPS } from '../../data/steps';
import styles from './PlayersPanel.module.css';

export function PlayersPanel() {
  const { players, socketId } = useWorld();

  const getProgressPercentage = (completedSteps: number[]) => {
    return Math.round((completedSteps.length / TOTAL_STEPS) * 100);
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>
        Çevrimiçi Oyuncular
        <span className={styles.count}>{players.length}</span>
      </h3>

      <div className={styles.playerList}>
        {players.map((player) => {
          const isCurrentPlayer = player.socketId === socketId;
          const progress = getProgressPercentage(player.completedSteps);

          return (
            <div
              key={player.socketId}
              className={`${styles.playerCard} ${isCurrentPlayer ? styles.current : ''}`}
            >
              <div className={styles.playerHeader}>
                <span className={styles.avatar}>{player.avatar}</span>
                <div className={styles.playerInfo}>
                  <span className={styles.name}>
                    {player.name}
                    {isCurrentPlayer && <span className={styles.youBadge}>Sen</span>}
                  </span>
                  <span className={styles.step}>
                    Adım {player.currentStep} / {TOTAL_STEPS}
                  </span>
                </div>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className={styles.progressText}>%{progress} tamamlandı</span>

              {player.completedSteps.length === TOTAL_STEPS && (
                <div className={styles.completedBadge}>🏆 Tamamlandı!</div>
              )}
            </div>
          );
        })}

        {players.length === 0 && (
          <p className={styles.noPlayers}>Henüz çevrimiçi oyuncu yok...</p>
        )}
      </div>
    </div>
  );
}
