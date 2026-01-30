// Shared world management for collaborative learning

class WorldManager {
  constructor() {
    // Single shared world - all players join the same world
    this.players = new Map(); // socketId -> player data
  }

  // Add a player to the world
  addPlayer(socketId, name, avatar, currentStep = 1, completedSteps = []) {
    const player = {
      socketId,
      name,
      avatar,
      currentStep,
      completedSteps,
      joinedAt: Date.now(),
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

    return player;
  }

  // Reset a player's progress
  resetProgress(socketId) {
    const player = this.players.get(socketId);
    if (!player) return null;

    player.completedSteps = [];
    player.currentStep = 1;

    return player;
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
