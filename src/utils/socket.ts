// Socket.io client wrapper
// Note: socket.io-client needs to be installed: npm install socket.io-client

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SocketType = any;

let socket: SocketType = null;

export const getSocket = (): SocketType => {
  return socket;
};

export const connectSocket = async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Dynamic import of socket.io-client
      const { io } = await import('socket.io-client');

      if (socket?.connected) {
        resolve();
        return;
      }

      socket = io(SOCKET_URL, {
        autoConnect: false,
        transports: ['websocket', 'polling'],
      });

      socket.connect();

      socket.on('connect', () => {
        console.log('Connected to multiplayer server');
        resolve();
      });

      socket.on('connect_error', (error: Error) => {
        console.error('Connection error:', error);
        reject(error);
      });
    } catch (err) {
      console.error('Failed to load socket.io-client:', err);
      reject(err);
    }
  });
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
  }
};

export const isConnected = (): boolean => {
  return socket?.connected ?? false;
};
