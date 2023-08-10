import { SlashCommandBuilder, EmbedBuilder, Guild, GuildMember } from 'discord.js';
import { Warn } from '../domain/warn';
import { levelingManager } from './../index';
import { SlashCommand } from './../types';

export const command: SlashCommand = {
  name: 'consultwarn',
  data: new SlashCommandBuilder()
    .setName('consultwarn')
    .setDescription("Consultation des avertissements d'un utilisateur")
    .addUserOption((option) => option.setName('utilisateur').setDescription('utilisateur').setRequired(true)),
  execute: async (interaction) => {
    const inputUser = interaction.options.getUser('utilisateur');
    if (inputUser === undefined) {
      await interaction.reply({ content: "Impossible de trouver les données de l'utilisateur !", ephemeral: true });
    } else {
      const target = levelingManager.getUserById(inputUser.id);
      if (target === undefined) {
        await interaction.reply({
          content: "Impossible de trouver les données de l'utilisateur !",
          ephemeral: true,
        });
        return;
      }

      const member: GuildMember = interaction.guild.members.cache.get(inputUser.id);
      if (member === undefined) {
        await interaction.reply({ content: "Impossible de trouver les données de l'utilisateur !", ephemeral: true });
      } else {
        const warns: Warn[] = target.getWarns();
        const convertedWarns = [];

        //${item.getFormattedDate()} par ${item.getAuthor().getDisplayName()} item.getReason()
        warns.forEach((item: Warn) => {
          convertedWarns.push({
            name: `Le ${item.getFormattedDate()} par ${item.getAuthor().getDisplayName()}`,
            value: `Raison: ${item.getReason()}`,
          });
        });
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
              .setTitle(`${warns.length} avertissement(s)`)
              .setFields(convertedWarns),
          ],
        });
      }
    }
  },
};
