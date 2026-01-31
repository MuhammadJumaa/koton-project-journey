import { useState, useCallback } from 'react';
import { useWorld, Player } from '../../context/WorldContext';
import { TOTAL_STEPS } from '../../data/steps';
import { Leaderboard } from './Leaderboard';
import { ReactionPicker } from './ReactionPicker';
import { FloatingReaction } from './FloatingReaction';
import styles from './PlayersPanel.module.css';

export function PlayersPanel() {
  const { players, socketId, activeReactions, sendReaction, removeReaction } = useWorld();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const getProgressPercentage = (completedSteps: number[]) => {
    return Math.round((completedSteps.length / TOTAL_STEPS) * 100);
  };

  const handlePlayerClick = (player: Player) => {
    // Don't allow sending reactions to yourself
    if (player.socketId !== socketId) {
      setSelectedPlayer(player);
    }
  };

  const handleSelectReaction = (emoji: string) => {
    if (selectedPlayer) {
      sendReaction(selectedPlayer.socketId, emoji);
      setSelectedPlayer(null);
    }
  };

  const handleReactionComplete = useCallback((reactionId: string) => {
    removeReaction(reactionId);
  }, [removeReaction]);

  const getReactionsForPlayer = (playerSocketId: string) => {
    return activeReactions.filter(r => r.targetSocketId === playerSocketId);
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>
        Cevrimici Oyuncular
        <span className={styles.count}>{players.length}</span>
      </h3>

      <div className={styles.playerList}>
        {players.map((player) => {
          const isCurrentPlayer = player.socketId === socketId;
          const progress = getProgressPercentage(player.completedSteps);
          const playerReactions = getReactionsForPlayer(player.socketId);

          return (
            <div
              key={player.socketId}
              className={`${styles.playerCard} ${isCurrentPlayer ? styles.current : ''} ${!isCurrentPlayer ? styles.clickable : ''}`}
              onClick={() => handlePlayerClick(player)}
              role={!isCurrentPlayer ? 'button' : undefined}
              tabIndex={!isCurrentPlayer ? 0 : undefined}
            >
              {/* Floating reactions */}
              {playerReactions.map((reaction) => (
                <FloatingReaction
                  key={reaction.id}
                  id={reaction.id}
                  emoji={reaction.emoji}
                  onComplete={handleReactionComplete}
                />
              ))}

              <div className={styles.playerHeader}>
                <span className={styles.avatar}>{player.avatar}</span>
                <div className={styles.playerInfo}>
                  <span className={styles.name}>
                    {player.name}
                    {isCurrentPlayer && <span className={styles.youBadge}>Sen</span>}
                  </span>
                  <span className={styles.step}>
                    Adim {player.currentStep} / {TOTAL_STEPS}
                  </span>
                </div>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className={styles.progressText}>%{progress} tamamlandi</span>

              {player.completedSteps.length === TOTAL_STEPS && (
                <div className={styles.completedBadge}>🏆 Tamamlandi!</div>
              )}

              {!isCurrentPlayer && (
                <div className={styles.reactionHint}>Reaksiyon gondermek icin tikla</div>
              )}
            </div>
          );
        })}

        {players.length === 0 && (
          <p className={styles.noPlayers}>Henuz cevrimici oyuncu yok...</p>
        )}
      </div>

      <Leaderboard />

      {/* Reaction Picker Modal */}
      {selectedPlayer && (
        <ReactionPicker
          targetPlayerName={selectedPlayer.name}
          onSelectReaction={handleSelectReaction}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}
