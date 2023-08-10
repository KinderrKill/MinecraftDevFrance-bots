import { SlashCommandBuilder } from 'discord.js';
import { saveModifiedData } from '../config/database';
import { SlashCommand } from './../types';

export const command: SlashCommand = {
  name: 'savedata',
  data: new SlashCommandBuilder().setName('savedata').setDescription('Force la sauvegarde des données.'),
  execute: async (interaction) => {
    saveModifiedData();
    await interaction.reply({
      content: 'Sauvegarde manuelle effectuée !',
      ephemeral: true,
    });
  },
};
