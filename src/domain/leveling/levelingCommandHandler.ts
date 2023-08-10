import { CommandInteraction } from 'discord.js';
import { LevelingManager } from './levelingManager';
export class LevelingCommandHandler {
  private levelingManager: LevelingManager;

  constructor(levelingManager: LevelingManager) {
    this.levelingManager = levelingManager;
  }

  addLevel(interaction: CommandInteraction, userId: string, amount: number) {}
}
