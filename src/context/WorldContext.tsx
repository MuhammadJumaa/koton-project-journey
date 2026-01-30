import { createContext, useContext, useReducer, useCallback, useEffect, useRef, ReactNode } from 'react';
import { connectSocket, getSocket, disconnectSocket, isConnected } from '../utils/socket';
import { getRandomAvatar, TOTAL_STEPS } from '../data/steps';

// Types
export interface Player {
  socketId: string;
  name: string;
  avatar: string;
  currentStep: number;
  completedSteps: number[];
}

interface WorldState {
  // Connection
  isConnected: boolean;
  isConnecting: boolean;
  socketId: string;
  error: string | null;

  // Player
  playerName: string;
  avatar: string;

  // Progress (local)
  currentStep: number;
  completedSteps: number[];

  // World
  players: Player[];
}

type WorldAction =
  | { type: 'SET_CONNECTING'; payload: boolean }
  | { type: 'SET_CONNECTED'; payload: { socketId: string } }
  | { type: 'SET_DISCONNECTED' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_PLAYER_INFO'; payload: { name: string; avatar: string } }
  | { type: 'SET_WORLD_STATE'; payload: { players: Player[] } }
  | { type: 'PLAYER_JOINED'; payload: Player }
  | { type: 'PLAYER_LEFT'; payload: string }
  | { type: 'STEP_COMPLETED'; payload: { socketId: string; stepId: number; newStep: number; completedSteps: number[] } }
  | { type: 'LOCAL_STEP_COMPLETED'; payload: { stepId: number } }
  | { type: 'RESET_PROGRESS' }
  | { type: 'LOAD_SAVED_STATE'; payload: { completedSteps: number[]; currentStep: number; playerName: string; avatar: string } };

const initialState: WorldState = {
  isConnected: false,
  isConnecting: false,
  socketId: '',
  error: null,
  playerName: '',
  avatar: getRandomAvatar(),
  currentStep: 1,
  completedSteps: [],
  players: [],
};

function worldReducer(state: WorldState, action: WorldAction): WorldState {
  switch (action.type) {
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload, error: null };

    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        socketId: action.payload.socketId,
      };

    case 'SET_DISCONNECTED':
      return {
        ...state,
        isConnected: false,
        socketId: '',
        players: [],
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isConnecting: false };

    case 'SET_PLAYER_INFO':
      return {
        ...state,
        playerName: action.payload.name,
        avatar: action.payload.avatar,
      };

    case 'SET_WORLD_STATE':
      return { ...state, players: action.payload.players };

    case 'PLAYER_JOINED':
      // Avoid duplicates
      if (state.players.some(p => p.socketId === action.payload.socketId)) {
        return state;
      }
      return { ...state, players: [...state.players, action.payload] };

    case 'PLAYER_LEFT':
      return {
        ...state,
        players: state.players.filter(p => p.socketId !== action.payload),
      };

    case 'STEP_COMPLETED': {
      const updatedPlayers = state.players.map(p =>
        p.socketId === action.payload.socketId
          ? {
              ...p,
              currentStep: action.payload.newStep,
              completedSteps: action.payload.completedSteps,
            }
          : p
      );
      return { ...state, players: updatedPlayers };
    }

    case 'LOCAL_STEP_COMPLETED': {
      const newCompletedSteps = [...state.completedSteps, action.payload.stepId].sort((a, b) => a - b);
      const newCurrentStep = action.payload.stepId < TOTAL_STEPS ? action.payload.stepId + 1 : TOTAL_STEPS;
      return {
        ...state,
        completedSteps: newCompletedSteps,
        currentStep: newCurrentStep,
      };
    }

    case 'RESET_PROGRESS':
      return {
        ...state,
        currentStep: 1,
        completedSteps: [],
      };

    case 'LOAD_SAVED_STATE':
      return {
        ...state,
        completedSteps: action.payload.completedSteps,
        currentStep: action.payload.currentStep,
        playerName: action.payload.playerName,
        avatar: action.payload.avatar,
      };

    default:
      return state;
  }
}

// Context
interface WorldContextValue extends WorldState {
  joinWorld: (name: string) => Promise<void>;
  completeStep: (stepId: number) => void;
  resetProgress: () => void;
  leaveWorld: () => void;
}

const WorldContext = createContext<WorldContextValue | null>(null);

// Storage key base - we'll append player name
const STORAGE_KEY_PREFIX = 'koton_learning_';

// Helper to get storage key for a player
const getStorageKey = (playerName: string) => `${STORAGE_KEY_PREFIX}${playerName.toLowerCase().trim()}`;

// Provider
export function WorldProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(worldReducer, initialState);
  const listenersSetup = useRef(false);

  // Save progress when it changes (only if we have a player name)
  useEffect(() => {
    if (state.playerName && (state.completedSteps.length > 0 || state.currentStep > 1)) {
      const storageKey = getStorageKey(state.playerName);
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          completedSteps: state.completedSteps,
          currentStep: state.currentStep,
          playerName: state.playerName,
          avatar: state.avatar,
        })
      );
    }
  }, [state.completedSteps, state.currentStep, state.playerName, state.avatar]);

  // Setup socket listeners - called directly, not in useEffect
  const setupSocketListeners = useCallback((socket: ReturnType<typeof getSocket>) => {
    if (!socket || listenersSetup.current) return;

    const handleWorldState = ({ players }: { players: Player[] }) => {
      console.log('Received world-state:', players);
      dispatch({ type: 'SET_WORLD_STATE', payload: { players } });
    };

    const handlePlayerJoined = (player: Player) => {
      console.log('Player joined:', player);
      dispatch({ type: 'PLAYER_JOINED', payload: player });
    };

    const handlePlayerLeft = ({ socketId }: { socketId: string }) => {
      console.log('Player left:', socketId);
      dispatch({ type: 'PLAYER_LEFT', payload: socketId });
    };

    const handleStepCompleted = (data: { socketId: string; stepId: number; newStep: number; completedSteps: number[] }) => {
      console.log('Step completed:', data);
      dispatch({ type: 'STEP_COMPLETED', payload: data });
    };

    const handleDisconnect = () => {
      console.log('Disconnected from server');
      listenersSetup.current = false;
      dispatch({ type: 'SET_DISCONNECTED' });
    };

    socket.on('world-state', handleWorldState);
    socket.on('player-joined', handlePlayerJoined);
    socket.on('player-left', handlePlayerLeft);
    socket.on('step-completed', handleStepCompleted);
    socket.on('disconnect', handleDisconnect);

    listenersSetup.current = true;
    console.log('Socket listeners setup complete');
  }, []);

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off('world-state');
        socket.off('player-joined');
        socket.off('player-left');
        socket.off('step-completed');
        socket.off('disconnect');
      }
      listenersSetup.current = false;
    };
  }, []);

  const joinWorld = useCallback(async (name: string) => {
    dispatch({ type: 'SET_CONNECTING', payload: true });

    // Load saved progress for THIS player (if exists)
    const storageKey = getStorageKey(name);
    const saved = localStorage.getItem(storageKey);

    let completedSteps: number[] = [];
    let currentStep = 1;
    let avatar = state.avatar;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.completedSteps && Array.isArray(parsed.completedSteps)) {
          completedSteps = parsed.completedSteps;
          currentStep = parsed.currentStep || 1;
          avatar = parsed.avatar || state.avatar;
        }
      } catch (e) {
        console.error('Failed to load saved progress:', e);
      }
    }

    // Load the player's saved state
    dispatch({
      type: 'LOAD_SAVED_STATE',
      payload: {
        completedSteps,
        currentStep,
        playerName: name,
        avatar,
      },
    });

    try {
      if (!isConnected()) {
        await connectSocket();
      }

      const socket = getSocket();
      if (!socket) {
        throw new Error('Socket not available');
      }

      // IMPORTANT: Setup listeners BEFORE emitting join-world
      setupSocketListeners(socket);

      dispatch({ type: 'SET_CONNECTED', payload: { socketId: socket.id } });

      // Now emit join-world - listeners are ready to receive world-state
      socket.emit('join-world', {
        name,
        avatar,
        currentStep,
        completedSteps,
      });

      console.log('Emitted join-world for:', name);
    } catch (error) {
      console.error('Join world error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to connect to server. Playing in offline mode.' });
    }
  }, [state.avatar, setupSocketListeners]);

  const completeStep = useCallback((stepId: number) => {
    // Don't complete if already completed or not the next step
    if (state.completedSteps.includes(stepId)) return;
    if (stepId !== 1 && !state.completedSteps.includes(stepId - 1)) return;

    // Update local state
    dispatch({ type: 'LOCAL_STEP_COMPLETED', payload: { stepId } });

    // Emit to server if connected
    if (state.isConnected) {
      const socket = getSocket();
      if (socket) {
        socket.emit('complete-step', { stepId });
      }
    }
  }, [state.completedSteps, state.isConnected]);

  const resetProgress = useCallback(() => {
    dispatch({ type: 'RESET_PROGRESS' });

    // Remove this player's saved progress
    if (state.playerName) {
      const storageKey = getStorageKey(state.playerName);
      localStorage.removeItem(storageKey);
    }

    // Notify server if connected
    if (state.isConnected) {
      const socket = getSocket();
      if (socket) {
        socket.emit('reset-progress');
      }
    }
  }, [state.isConnected, state.playerName]);

  const leaveWorld = useCallback(() => {
    disconnectSocket();
    listenersSetup.current = false;
    dispatch({ type: 'SET_DISCONNECTED' });
  }, []);

  const value: WorldContextValue = {
    ...state,
    joinWorld,
    completeStep,
    resetProgress,
    leaveWorld,
  };

  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>;
}

// Hook
export function useWorld(): WorldContextValue {
  const context = useContext(WorldContext);
  if (!context) {
    throw new Error('useWorld must be used within a WorldProvider');
  }
  return context;
}
