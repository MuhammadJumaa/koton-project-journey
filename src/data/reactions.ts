// Available emoji reactions for players

export interface Reaction {
  emoji: string;
  label: string;
}

export const reactions: Reaction[] = [
  { emoji: '👏', label: 'Bravo' },
  { emoji: '🎉', label: 'Kutlama' },
  { emoji: '🔥', label: 'Ates' },
  { emoji: '💪', label: 'Guc' },
  { emoji: '🚀', label: 'Roket' },
];
