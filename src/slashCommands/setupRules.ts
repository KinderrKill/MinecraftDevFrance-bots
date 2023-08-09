import { BUTTON_ID, isAdmin } from '../utils/constants';
import { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } from 'discord.js';
import { SlashCommand } from '../types';

const confirm = new ButtonBuilder()
  .setCustomId(BUTTON_ID.CONFIRM_RULES)
  .setLabel('Accepter le réglement')
  .setStyle(ButtonStyle.Success);

const embedMessage = {
  type: 'rich',
  title: `Règlement de MinecraftDevFrance`,
  description: `Veuillez lire et accepter le règlement afin d'accéder au contenu du discord.\nTout manquement à celui-ci entrainera des sanctions.`,
  color: 0xffbf2f,
  fields: [
    {
      name: '\u200b',
      value: '\u200b',
      inline: false,
    },
    {
      name: `🛑 - Version 1.7.10`,
      value: `Toutes demandes d'aide pour des versions inférieures à la 1.8 sont interdites.\nConformément à l'EULA établit par Mojang.\n\n`,
      inline: false,
    },
    {
      name: '\u200b',
      value: '\u200b',
      inline: false,
    },
    {
      name: `🤑 - Ventes/Commandes`,
      value: `La vente de biens et/ou de services ne sont pas autorisés.`,
      inline: false,
    },
    {
      name: '\u200b',
      value: '\u200b',
      inline: false,
    },
    {
      name: `📨 - Messages Privés`,
      value: `L'envoi de messages privés à des membres à des fins publicitaires est interdit.\nUtiliser le salon dédié à cela ou contacter-nous via les tickets.`,
      inline: false,
    },
    {
      name: '\u200b',
      value: '\u200b',
      inline: false,
    },
    {
      name: `💢 - Mentions/Pings`,
      value: `Évitez les mentions ou pings sauf dans les cas nécessaires (réponses à des questions, réactions, etc.).`,
      inline: false,
    },
    {
      name: '\u200b',
      value: '\u200b',
      inline: false,
    },
    {
      name: `🔞 - Contenus`,
      value: `Toute forme de contenu haineux, raciste, ou NSFW, même implicite, est strictement interdite.\nSous toute cette forme (Pseudo / Photo de profil) nous seront intransigeant avec cela.`,
      inline: false,
    },
    {
      name: '\u200b',
      value: '\u200b',
      inline: false,
    },
    {
      name: `📝 - Règlement Discord`,
      value: `Vous devez aussi respectez l'ensemble des règles de Discord. Vous pouvez les consulter ici : [Règles Discord](https://support.discord.com/hc/fr)`,
    },
    {
      name: '\u200b',
      value: '\u200b',
      inline: false,
    },
  ],
  footer: {
    text: `Règlement mis à jour le 08/08/2023`,
  },
};

export const command: SlashCommand = {
  name: 'setup_rules_action',
  data: new SlashCommandBuilder()
    .setName('setup_rules_action')
    .setDescription(
      'Déploi le message pour attribuer le rang membre aux personnes ayant confirmé la lecture des règles'
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
  execute: async (interaction) => {
    if (!isAdmin(interaction.member)) return;

    await interaction.reply({
      embeds: [embedMessage],
      components: [new ActionRowBuilder().addComponents(confirm)],
    });
  },
};
