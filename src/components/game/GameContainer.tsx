import { useState } from 'react';
import styles from './GameContainer.module.css';
import { useWorld } from '../../context/WorldContext';
import { WorldMap, PlayersPanel, TreasureScreen } from '../world';
import { Button } from '../ui/Button';
import { TOTAL_STEPS } from '../../data/steps';

type Screen = 'intro' | 'world' | 'treasure';

export const GameContainer: React.FC = () => {
  const {
    playerName,
    completedSteps,
    joinWorld,
    resetProgress,
    isConnecting,
    error,
  } = useWorld();

  const [currentScreen, setCurrentScreen] = useState<Screen>(
    playerName ? 'world' : 'intro'
  );
  const [nameInput, setNameInput] = useState(playerName);

  const isAllComplete = completedSteps.length === TOTAL_STEPS;

  // Check for completion and show treasure screen
  const handleShowTreasure = () => {
    if (isAllComplete) {
      setCurrentScreen('treasure');
    }
  };

  const handleStartJourney = async () => {
    if (nameInput.trim()) {
      await joinWorld(nameInput.trim());
      setCurrentScreen('world');
    }
  };

  const handleBackToMap = () => {
    setCurrentScreen('world');
  };

  const handleRestart = () => {
    resetProgress();
    setCurrentScreen('intro');
    setNameInput('');
  };

  // Intro screen
  if (currentScreen === 'intro') {
    return (
      <div className={styles.container}>
        <div className={styles.introScreen}>
          <div className={styles.logo}>🗺️</div>
          <h1 className={styles.title}>Koton Proje Yolculuğu</h1>
          <p className={styles.subtitle}>
            Koton DX WebApp projesi oluşturmanın 11 adımını iş arkadaşlarınızla birlikte öğrenin!
          </p>

          <div className={styles.nameForm}>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="Adınızı girin..."
              className={styles.nameInput}
              onKeyPress={e => e.key === 'Enter' && handleStartJourney()}
              disabled={isConnecting}
            />
            <Button
              onClick={handleStartJourney}
              variant="primary"
              size="large"
              disabled={!nameInput.trim() || isConnecting}
            >
              {isConnecting ? 'Katılınıyor...' : 'Yolculuğa Başla'}
            </Button>
          </div>

          {error && (
            <p className={styles.errorMessage}>{error}</p>
          )}

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📚</span>
              <span>11 Öğrenme Adımı</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>👥</span>
              <span>Birlikte Öğren</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🏆</span>
              <span>Sertifika Kazan</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Treasure/completion screen
  if (currentScreen === 'treasure') {
    return (
      <TreasureScreen
        onBackToMap={handleBackToMap}
        onRestart={handleRestart}
      />
    );
  }

  // World map screen
  return (
    <div className={styles.worldContainer}>
      <WorldMap />
      <PlayersPanel />

      {/* Show treasure button when complete */}
      {isAllComplete && (
        <button className={styles.treasureButton} onClick={handleShowTreasure}>
          🏆 Sertifikayı Görüntüle
        </button>
      )}
    </div>
  );
};
