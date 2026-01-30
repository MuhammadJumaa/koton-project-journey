import { useState } from 'react';
import { steps, Step, TOTAL_STEPS } from '../../data/steps';
import { useWorld } from '../../context/WorldContext';
import { StepPopup } from './StepPopup';
import { MapAvatar } from './PlayerAvatar';
import styles from './WorldMap.module.css';

interface StepNodeProps {
  step: Step;
  status: 'locked' | 'available' | 'completed';
  playersAtStep: Array<{ name: string; avatar: string; isCurrentPlayer: boolean }>;
  onClick: () => void;
}

function StepNode({ step, status, playersAtStep, onClick }: StepNodeProps) {
  const isClickable = status === 'available' || status === 'completed';

  return (
    <div
      className={`${styles.stepNode} ${styles[status]}`}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className={styles.nodeCircle}>
        {status === 'completed' ? (
          <span className={styles.checkmark}>✓</span>
        ) : status === 'locked' ? (
          <span className={styles.lock}>🔒</span>
        ) : (
          <span className={styles.stepNumber}>{step.id}</span>
        )}
      </div>
      <span className={styles.stepTitle}>{step.title}</span>

      {/* Players at this step */}
      {playersAtStep.length > 0 && (
        <div className={styles.playersAtStep}>
          {playersAtStep.slice(0, 3).map((player, index) => (
            <MapAvatar
              key={index}
              avatar={player.avatar}
              name={player.name}
              isCurrentPlayer={player.isCurrentPlayer}
            />
          ))}
          {playersAtStep.length > 3 && (
            <span className={styles.morePlayersCount}>+{playersAtStep.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}

export function WorldMap() {
  const { playerName, avatar, completedSteps, players, completeStep, socketId } = useWorld();
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);

  const getStepStatus = (stepId: number): 'locked' | 'available' | 'completed' => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === 1 || completedSteps.includes(stepId - 1)) return 'available';
    return 'locked';
  };

  const getPlayersAtStep = (stepId: number) => {
    return players
      .filter((p) => p.currentStep === stepId)
      .map((p) => ({
        name: p.name,
        avatar: p.avatar,
        isCurrentPlayer: p.socketId === socketId
      }));
  };

  const handleStepClick = (step: Step) => {
    const status = getStepStatus(step.id);
    if (status !== 'locked') {
      setSelectedStep(step);
    }
  };

  const handleCompleteStep = () => {
    if (selectedStep && !completedSteps.includes(selectedStep.id)) {
      completeStep(selectedStep.id);
    }
    setSelectedStep(null);
  };

  const progressPercentage = Math.round((completedSteps.length / TOTAL_STEPS) * 100);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Koton Proje Oluşturma Yolculuğu</h1>
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className={styles.progressText}>
            {completedSteps.length}/{TOTAL_STEPS} Adım Tamamlandı
          </span>
        </div>
      </header>

      <div className={styles.mapContainer}>
        {/* Row 1: Steps 1-5 */}
        <div className={styles.row}>
          {steps.slice(0, 5).map((step, index) => (
            <div key={step.id} className={styles.nodeWrapper}>
              <StepNode
                step={step}
                status={getStepStatus(step.id)}
                playersAtStep={getPlayersAtStep(step.id)}
                onClick={() => handleStepClick(step)}
              />
              {index < 4 && <div className={styles.connector} />}
            </div>
          ))}
        </div>

        {/* Vertical connector between rows */}
        <div className={styles.verticalConnector} />

        {/* Row 2: Steps 6-10 */}
        <div className={styles.row}>
          {steps.slice(5, 10).map((step, index) => (
            <div key={step.id} className={styles.nodeWrapper}>
              <StepNode
                step={step}
                status={getStepStatus(step.id)}
                playersAtStep={getPlayersAtStep(step.id)}
                onClick={() => handleStepClick(step)}
              />
              {index < 4 && <div className={styles.connector} />}
            </div>
          ))}
        </div>

        {/* Vertical connector to final step */}
        <div className={styles.verticalConnector} />

        {/* Row 3: Step 11 (Final) */}
        <div className={styles.finalRow}>
          <StepNode
            step={steps[10]}
            status={getStepStatus(11)}
            playersAtStep={getPlayersAtStep(11)}
            onClick={() => handleStepClick(steps[10])}
          />
          <div className={styles.treasure}>🏆</div>
        </div>
      </div>

      {/* Player info */}
      <div className={styles.playerInfo}>
        <span className={styles.playerAvatar}>{avatar}</span>
        <span className={styles.playerName}>{playerName}</span>
      </div>

      {/* Step popup */}
      {selectedStep && (
        <StepPopup
          step={selectedStep}
          isCompleted={completedSteps.includes(selectedStep.id)}
          onComplete={handleCompleteStep}
          onClose={() => setSelectedStep(null)}
        />
      )}
    </div>
  );
}
