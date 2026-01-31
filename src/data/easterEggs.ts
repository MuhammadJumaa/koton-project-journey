// Easter Eggs hidden across the map

export interface EasterEgg {
  id: string;
  icon: string;
  type: 'joke' | 'fact' | 'achievement' | 'animation';
  title: string;
  content: string;
  position: { top: string; left: string };
}

export const easterEggs: EasterEgg[] = [
  {
    id: 'coffee',
    icon: '☕',
    type: 'joke',
    title: 'Yazılımcı Kahvesi',
    content: 'Bir yazılımcıya neden "iyiyim" dediğinde şüpheleniriz? Çünkü "bug" demeden bir gün geçirmemiştir! ☕',
    position: { top: '15%', left: '5%' },
  },
  {
    id: 'tag',
    icon: '🏷️',
    type: 'fact',
    title: 'Koton Tarihi',
    content: 'Koton, 1988 yılında İstanbul\'da küçük bir mağaza olarak kuruldu ve bugün 30\'dan fazla ülkede faaliyet göstermektedir!',
    position: { top: '45%', left: '92%' },
  },
  {
    id: 'star',
    icon: '⭐',
    type: 'achievement',
    title: 'Gizli Kaşif',
    content: 'Tebrikler! Gizli yıldızı buldun! Bu seni resmi bir Koton Code Explorer yapıyor! 🎖️',
    position: { top: '70%', left: '8%' },
  },
  {
    id: 'balloon',
    icon: '🎈',
    type: 'animation',
    title: 'Parti Zamanı!',
    content: 'Woohoo! Balonu buldun! Şimdi konfetileri izle! 🎊',
    position: { top: '25%', left: '88%' },
  },
  {
    id: 'thread',
    icon: '🧵',
    type: 'fact',
    title: 'DX Ekibi Hakkında',
    content: 'Developer Experience (DX) ekibi, geliştiricilerin hayatını kolaylaştırmak için çalışır. Bu oyun da onların bir eseri! 💻',
    position: { top: '82%', left: '50%' },
  },
];

export const TOTAL_EASTER_EGGS = easterEggs.length;
