import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { SlashCommand } from './../types';

export const command: SlashCommand = {
  cooldown: 30,
  name: 'suggest',
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Vous permet de suggerer un changement, amélioration sur le discord'),
  execute: async (interaction) => {
    const modal = new ModalBuilder().setCustomId('suggestModal').setTitle('suggestModal');

    const suggestInput = new TextInputBuilder()
      .setCustomId('suggestContent')
      .setLabel('Que suggerez-vous ?')
      .setPlaceholder('Votre texte ici')
      .setStyle(TextInputStyle.Paragraph);

    const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(suggestInput);

    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  },
};
