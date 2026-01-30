const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { WorldManager } = require('./world');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
  },
});

const worldManager = new WorldManager();

// Cleanup inactive players every 30 minutes
setInterval(() => {
  worldManager.cleanup();
}, 30 * 60 * 1000);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    playersOnline: worldManager.getPlayerCount(),
  });
});

// API to get player count
app.get('/api/players', (req, res) => {
  res.json({
    count: worldManager.getPlayerCount(),
    players: worldManager.getAllPlayers().map(p => ({
      name: p.name,
      avatar: p.avatar,
      currentStep: p.currentStep,
      completedSteps: p.completedSteps.length,
    })),
  });
});

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Join the shared world
  socket.on('join-world', ({ name, avatar, currentStep, completedSteps }) => {
    const player = worldManager.addPlayer(
      socket.id,
      name,
      avatar,
      currentStep || 1,
      completedSteps || []
    );

    // Join the global "world" room
    socket.join('world');

    // Send current world state to the joining player
    socket.emit('world-state', {
      players: worldManager.getAllPlayers(),
    });

    // Notify all other players about the new player
    socket.to('world').emit('player-joined', player);

    console.log(`${name} (${avatar}) joined the world at step ${currentStep}`);
  });

  // Player completes a step
  socket.on('complete-step', ({ stepId }) => {
    const player = worldManager.completeStep(socket.id, stepId);

    if (player) {
      // Broadcast to all players (including sender)
      io.to('world').emit('step-completed', {
        socketId: socket.id,
        stepId,
        newStep: player.currentStep,
        completedSteps: player.completedSteps,
      });

      console.log(`${player.name} completed step ${stepId}, now at step ${player.currentStep}`);
    }
  });

  // Player resets their progress
  socket.on('reset-progress', () => {
    const player = worldManager.resetProgress(socket.id);

    if (player) {
      // Broadcast the reset
      io.to('world').emit('step-completed', {
        socketId: socket.id,
        stepId: 0,
        newStep: 1,
        completedSteps: [],
      });

      console.log(`${player.name} reset their progress`);
    }
  });

  // Player disconnects
  socket.on('disconnect', () => {
    const player = worldManager.removePlayer(socket.id);

    if (player) {
      // Notify all players
      io.to('world').emit('player-left', {
        socketId: socket.id,
      });

      console.log(`${player.name} left the world`);
    }

    console.log(`Player disconnected: ${socket.id}`);
  });

  // Leave world explicitly (before disconnect)
  socket.on('leave-world', () => {
    const player = worldManager.removePlayer(socket.id);

    if (player) {
      socket.leave('world');

      // Notify all players
      io.to('world').emit('player-left', {
        socketId: socket.id,
      });

      console.log(`${player.name} left the world`);
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  Koton Learning World Server`);
  console.log(`  Running on port ${PORT}`);
  console.log(`========================================`);
  console.log(`  Health check: http://localhost:${PORT}/health`);
  console.log(`  Players API:  http://localhost:${PORT}/api/players`);
  console.log(`========================================\n`);
});
