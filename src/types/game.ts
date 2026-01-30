// World and Step types for Koton Learning Journey

export type StepStatus = 'locked' | 'available' | 'completed';

export interface Step {
  id: number;
  title: string;
  description: string;
  hint: string;
  link?: string;
}

export interface Player {
  socketId: string;
  name: string;
  avatar: string;
  currentStep: number;
  completedSteps: number[];
}

export interface WorldState {
  players: Player[];
}
