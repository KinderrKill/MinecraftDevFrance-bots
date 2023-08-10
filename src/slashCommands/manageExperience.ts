import { levelingManager } from './../index';
import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from './../types';

export const command: SlashCommand = {
  name: 'manage_exp',
  data: new SlashCommandBuilder()
    .setName('manage_exp')
    .setDescription("Gestion de l'expérience des utilisateurs")
    .addUserOption((option) => option.setName('utilisateur').setDescription('utilisateur').setRequired(true))
    .addStringOption((option) =>
      option
        .setName('function')
        .setDescription('fonction')
        .addChoices({ name: 'ajouter', value: 'add' }, { name: 'retirer', value: 'remove' })
        .setRequired(true)
    )
    .addNumberOption((option) => option.setName('montant').setDescription('montant').setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
  execute: async (interaction) => {
    const inputUser = interaction.options.getUser('utilisateur');

    const user = levelingManager.getUserById(inputUser.id);
    if (user === undefined) {
      await interaction.reply({ content: 'Impossible de trouver les données du joueur !', ephemeral: true });
    } else {
      const inputFunction = interaction.options.getString('function');
      const inputAmount = interaction.options.getNumber('montant');

      if (inputFunction === 'add') {
        levelingManager.addExperienceTo(interaction, user.getId(), inputAmount);
        await interaction.reply({
          content: `${inputAmount} points d'expériences ajouté à l'utilisateur ${inputUser.displayName}`,
          ephemeral: true,
        });
      } else if (inputFunction === 'remove') {
        levelingManager.removeExperienceTo(interaction, user.getId(), inputAmount);
        await interaction.reply({
          content: `${inputAmount} points d'expériences retiré à l'utilisateur ${inputUser.displayName}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({ content: 'Aucune fonction de défini pour la commande !', ephemeral: true });
      }
    }
  },
};
