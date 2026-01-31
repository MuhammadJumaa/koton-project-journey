import { useWorld } from '../../context/WorldContext';
import { TOTAL_STEPS } from '../../data/steps';
import styles from './TreasureScreen.module.css';

interface TreasureScreenProps {
  onBackToMap: () => void;
  onRestart: () => void;
}

export function TreasureScreen({ onBackToMap, onRestart }: TreasureScreenProps) {
  const { playerName, avatar } = useWorld();

  const currentDate = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={styles.container}>
      <div className={styles.confetti}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className={styles.confettiPiece}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#667eea', '#764ba2', '#38ef7d', '#ffc107', '#ff6b6b'][
                Math.floor(Math.random() * 5)
              ]
            }}
          />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.trophyWrapper}>
          <span className={styles.trophy}>🏆</span>
          <div className={styles.sparkles}>✨</div>
        </div>

        <h1 className={styles.title}>Tebrikler!</h1>
        <p className={styles.subtitle}>Koton Proje Yolculuğunu tamamladınız!</p>

        <div className={styles.certificate}>
          <div className={styles.certificateHeader}>
            <span className={styles.certificateStar}>⭐</span>
            <h2>Tamamlama Sertifikası</h2>
            <span className={styles.certificateStar}>⭐</span>
          </div>

          <div className={styles.certificateBody}>
            <p className={styles.certText}>Bu belge</p>
            <div className={styles.playerBadge}>
              <span className={styles.certAvatar}>{avatar}</span>
              <span className={styles.certName}>{playerName}</span>
            </div>
            <p className={styles.certText}>adlı kişinin</p>
            <p className={styles.certSteps}>{TOTAL_STEPS} Adımın</p>
            <p className={styles.certText}>tamamını öğrendiğini ve Koton DX WebApp Projesi oluşturmaya hazır olduğunu onaylar</p>
            <p className={styles.certDate}>{currentDate}</p>
          </div>

          <div className={styles.signatures}>
            <div className={styles.signatureItem}>
              <div className={styles.signatureLine}>
                <span className={styles.signature}>Murat Karakaş</span>
              </div>
              <p className={styles.signatureName}>MURAT KARAKAŞ</p>
              <p className={styles.signatureTitle}>Yazılım Geliştirme Grup Müdürü</p>
            </div>
            <div className={styles.signatureItem}>
              <div className={styles.signatureLine}>
                <span className={styles.signature}>Yasin Mataracı</span>
              </div>
              <p className={styles.signatureName}>YASİN MATARACI</p>
              <p className={styles.signatureTitle}>Yazılım Yöneticisi</p>
            </div>
            <div className={styles.signatureItem}>
              <div className={styles.signatureLine}>
                <span className={styles.signature}>Nurettin Bozak</span>
              </div>
              <p className={styles.signatureName}>NURETTİN BOZAK</p>
              <p className={styles.signatureTitle}>Yazılım Yöneticisi</p>
            </div>
          </div>

          <div className={styles.certificateSeal}>
            <span>KOTON</span>
            <span>DX</span>
          </div>
        </div>

        <div className={styles.achievements}>
          <div className={styles.achievement}>
            <span className={styles.achievementIcon}>📚</span>
            <span>Tüm Adımlar Öğrenildi</span>
          </div>
          <div className={styles.achievement}>
            <span className={styles.achievementIcon}>🎯</span>
            <span>Proje Ustası</span>
          </div>
          <div className={styles.achievement}>
            <span className={styles.achievementIcon}>🚀</span>
            <span>Geliştirmeye Hazır</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={onBackToMap}>
            📍 Haritaya Dön
          </button>
          <button className={styles.secondaryButton} onClick={onRestart}>
            🔄 Baştan Başla
          </button>
        </div>
      </div>
    </div>
  );
}
