import { levelingManager } from '../index';
import { SlashCommand } from '../types';
import { GuildMember, Interaction, SlashCommandBuilder } from 'discord.js';
import { User } from '../domain/leveling/user';

export const command: SlashCommand = {
  cooldown: 30,
  name: 'level',
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Consulter votre progression ou celle des utilisateurs.')
    .addStringOption((option) =>
      option
        .setName('function')
        .setDescription('fonction')
        .addChoices({ name: 'ma progression', value: 'consult' }, { name: 'classement des joueurs', value: 'top' })
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const user = levelingManager.getUserById(interaction.member.id);
    if (user === undefined) {
      await interaction.reply({ content: 'Impossible de trouver les données du joueur !', ephemeral: true });
    } else {
      const inputFunction = interaction.options.getString('function');
      if (inputFunction === 'consult') {
        await interaction.reply({ embeds: [getConsultEmbedMessage(interaction.member, user)] });
      } else if (inputFunction === 'top') {
        await interaction.reply({ embeds: [getTopEmbedMessage(interaction)] });
      } else {
        await interaction.reply({ content: 'Aucune fonction de défini pour la commande !', ephemeral: true });
      }
    }
  },
};

function getConsultEmbedMessage(member: GuildMember, user: User) {
  return {
    type: 'rich',
    title: `Récapitulatif de progression 📈`,
    description: `<@${
      member.id
    }> est niveau **${user.getLevel()}**.\nNiveau d'expérience actuel: **${user.getExperience()}/${levelingManager.getExperienceForNextLevel(
      user.getLevel()
    )}**\nMessages envoyés: ${user.getSendedMessage()}`,
    color: 0xfbff00,
    thumbnail: {
      url: `${member.displayAvatarURL()}`,
      height: 0,
      width: 0,
    },
  };
}

function getTopEmbedMessage(interaction: Interaction) {
  const sortedUser = levelingManager
    .getUsers()
    .sort((userA, userB) => userB.getExperience() - userA.getExperience())
    .slice(0, 10);

  const sortedUserField = [
    {
      name: '\u200b',
      value: '\u200b',
    },
  ];

  sortedUser.map((user, index) => {
    sortedUserField.push({
      name:
        `${index + 1}] ${user.getDisplayName()}` +
        ` ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}`,
      value: `Niveau: **${user.getLevel()}** | Experience: **${user.getExperience()}/${levelingManager.getExperienceForNextLevel(
        user.getLevel()
      )}**\n Messages envoyés: **${user.getSendedMessage()}**`,
    });
  });

  return {
    type: 'rich',
    title: `Classement des meilleurs membres du serveur 🏆`,
    description: ``,
    color: 0xfbff00,
    fields: sortedUserField,
  };
}
