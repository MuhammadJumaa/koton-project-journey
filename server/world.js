// Shared world management for collaborative learning

class WorldManager {
  constructor() {
    // Single shared world - all players join the same world
    this.players = new Map(); // socketId -> player data
  }

  // Add a player to the world
  addPlayer(socketId, name, avatar, currentStep = 1, completedSteps = [], startedAt = null, completedAt = null) {
    const TOTAL_STEPS = 11;
    const isCompleted = completedSteps.length === TOTAL_STEPS;

    const player = {
      socketId,
      name,
      avatar,
      currentStep,
      completedSteps,
      joinedAt: Date.now(),
      startedAt: startedAt || Date.now(),
      completedAt: isCompleted ? (completedAt || Date.now()) : null,
      totalTimeMs: isCompleted && startedAt ? (completedAt || Date.now()) - startedAt : null,
    };

    this.players.set(socketId, player);
    return player;
  }

  // Remove a player from the world
  removePlayer(socketId) {
    const player = this.players.get(socketId);
    if (player) {
      this.players.delete(socketId);
      return player;
    }
    return null;
  }

  // Get a player by socket ID
  getPlayer(socketId) {
    return this.players.get(socketId);
  }

  // Get all players as array
  getAllPlayers() {
    return Array.from(this.players.values());
  }

  // Get player count
  getPlayerCount() {
    return this.players.size;
  }

  // Update player progress when they complete a step
  completeStep(socketId, stepId) {
    const player = this.players.get(socketId);
    if (!player) return null;

    // Add to completed steps if not already completed
    if (!player.completedSteps.includes(stepId)) {
      player.completedSteps.push(stepId);
      player.completedSteps.sort((a, b) => a - b);
    }

    // Update current step (next step or same if all done)
    const TOTAL_STEPS = 11;
    if (stepId < TOTAL_STEPS) {
      player.currentStep = stepId + 1;
    } else {
      player.currentStep = TOTAL_STEPS;
    }

    // Mark completion time if all steps are done
    if (player.completedSteps.length === TOTAL_STEPS && !player.completedAt) {
      player.completedAt = Date.now();
      player.totalTimeMs = player.completedAt - player.startedAt;
    }

    return player;
  }

  // Reset a player's progress
  resetProgress(socketId) {
    const player = this.players.get(socketId);
    if (!player) return null;

    player.completedSteps = [];
    player.currentStep = 1;
    player.startedAt = Date.now();
    player.completedAt = null;
    player.totalTimeMs = null;

    return player;
  }

  // Get leaderboard sorted by progress (descending), then by time (ascending)
  getLeaderboard() {
    const players = this.getAllPlayers();
    const TOTAL_STEPS = 11;

    return players
      .map((p) => ({
        socketId: p.socketId,
        name: p.name,
        avatar: p.avatar,
        progress: Math.round((p.completedSteps.length / TOTAL_STEPS) * 100),
        completedSteps: p.completedSteps.length,
        totalTimeMs: p.totalTimeMs,
        isCompleted: p.completedSteps.length === TOTAL_STEPS,
      }))
      .sort((a, b) => {
        // First sort by progress (descending)
        if (b.progress !== a.progress) {
          return b.progress - a.progress;
        }
        // Then by completion time (ascending) - only for completed players
        if (a.isCompleted && b.isCompleted && a.totalTimeMs && b.totalTimeMs) {
          return a.totalTimeMs - b.totalTimeMs;
        }
        // Completed players come before non-completed
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? -1 : 1;
        }
        return 0;
      });
  }

  // Update player info (name or avatar)
  updatePlayer(socketId, updates) {
    const player = this.players.get(socketId);
    if (!player) return null;

    if (updates.name) player.name = updates.name;
    if (updates.avatar) player.avatar = updates.avatar;

    return player;
  }

  // Cleanup inactive players (optional - older than 2 hours)
  cleanup() {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    for (const [socketId, player] of this.players) {
      if (player.joinedAt < twoHoursAgo) {
        this.players.delete(socketId);
      }
    }
  }
}

module.exports = { WorldManager };
