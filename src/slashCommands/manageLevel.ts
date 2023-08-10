import { levelingManager } from './../index';
import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from './../types';

export const command: SlashCommand = {
  name: 'manage_lvl',
  data: new SlashCommandBuilder()
    .setName('manage_lvl')
    .setDescription('Gestion des niveaux des utilisateurs')
    .addUserOption((option) =>
      option.setName('utilisateur').setDescription('utilisateur').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('fonction')
        .setDescription('fonction')
        .addChoices(
          { name: 'ajouter', value: 'add' },
          { name: 'retirer', value: 'remove' },
          { name: 'définir', value: 'set' }
        )
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName('montant').setDescription('montant').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
  execute: async (interaction) => {
    const inputUser = interaction.options.getUser('utilisateur');
    const inputFunction = interaction.options.getString('fonction');
    const inputAmount = interaction.options.getNumber('montant');

    const user = levelingManager.getUserById(inputUser.id);
    if (user === undefined) {
      await interaction.reply({
        content: 'Impossible de trouver les données du joueur !',
        ephemeral: true,
      });
    } else {
      if (inputFunction === 'add') {
        levelingManager.addLevelTo(interaction, user.getId(), inputAmount);
        await interaction.reply({
          content: `Le niveau de l'utilisateur ${inputUser.displayName} a été augmenté de ${inputAmount}`,
          ephemeral: true,
        });
      } else if (inputFunction === 'remove') {
        levelingManager.removeLevelTo(interaction, user.getId(), inputAmount);
        await interaction.reply({
          content: `Le niveau de l'utilisateur ${inputUser.displayName} a été réduit de ${inputAmount}`,
          ephemeral: true,
        });
      } else if (inputFunction === 'set') {
        levelingManager.setLevelTo(interaction, user.getId(), inputAmount);
        await interaction.reply({
          content: `Le niveau de l'utilisateur ${inputUser.displayName} a été défini sur ${inputAmount}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'Aucune fonction de défini pour la commande !',
          ephemeral: true,
        });
      }
    }
  },
};
