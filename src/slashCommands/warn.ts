import { Embed, SlashCommandBuilder, EmbedBuilder, GuildMember, TextChannel } from 'discord.js';
import { CHANNEL, getChannel } from '../utils/constants';
import { isDevMode, levelingManager } from './../index';
import { SlashCommand } from './../types';

export const command: SlashCommand = {
  name: 'warn',
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Averti un joueur pour un comportement inaproprié')
    .addUserOption((option) =>
      option.setName('utilisateur').setDescription('utilisateur').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('raison').setDescription("raison de l'avertissement").setRequired(true)
    ),
  execute: async (interaction) => {
    const inputUser = interaction.options.getUser('utilisateur');
    if (inputUser === undefined) {
      await interaction.reply({
        content: "Impossible de trouver les données de l'utilisateur !",
        ephemeral: true,
      });
    } else {
      const inputReason = interaction.options.getString('raison');
      const target = levelingManager.getUserById(inputUser.id);
      if (target === undefined) {
        await interaction.reply({
          content: "Impossible de trouver les données de l'utilisateur !",
          ephemeral: true,
        });
        return;
      }
      target.addWarn(interaction.member.id, inputReason);

      const member: GuildMember = interaction.guild.members.cache.get(inputUser.id);
      member.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('Avertissement reçu !')
            .setFields({ name: 'Raison: ', value: `${inputReason}` }),
        ],
      });

      const logChannel = interaction.guild.channels.cache.get(
        getChannel(CHANNEL.STAFF_LOG, isDevMode)
      );
      if (logChannel instanceof TextChannel) {
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Avertissement effectué par ${interaction.member.displayName}`)
              .setFields([
                {
                  name: `Utilisateur : ${inputUser.displayName}`,
                  value: `Raison : ${inputReason}`,
                },
              ])
              .setThumbnail(member.displayAvatarURL()),
          ],
        });
      }

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Avertissement effectué par ${interaction.member.displayName}`)
            .setFields([
              {
                name: `Utilisateur : ${inputUser.displayName}`,
                value: `Raison : ${inputReason}`,
              },
            ])
            .setThumbnail(member.displayAvatarURL()),
        ],
        ephemeral: true,
      });
    }
  },
};
