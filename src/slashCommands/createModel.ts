import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from './../types.d';
const embedMessage = {
  type: 'rich',
  title: `Modèle de demande d'aide`,
  description: `Veuillez copier & coller le texte ci-dessous pour effectuer une demande d'aide conforme !`,
  color: 0xff00d4,
  fields: [
    {
      name: '\u200B',
      value: `\`\`\`\n**Version du jeu :**\n**Problèmes rencontrés :**\n**Erreurs dans la console :** (Si présente)\n\n**Code : ** (Si necessaire) \nA METTRE ENTRE BACKTICK : \n\n\` \` \`java\n\` \` \`\n\n(Sans les espaces entre les backtick \`)\nSi votre code est trop gros, veuillez utiliser : https://hastebin.skyra.pw/\n\`\`\`\n\nMerci de bien vouloir respecter ce shéma afin de faciliter la compréhension de votre bug ainsi que l'aide à fournir !`,
    },
  ],
};

export const command: SlashCommand = {
  cooldown: 60,
  name: 'model',
  data: new SlashCommandBuilder()
    .setName('model')
    .setDescription(
      "Affiche un modèle de demande d'aide afin de correctement rédiger votre message."
    )
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('type')
        .addChoices({ name: 'mcp', value: 'mcp' })
        .setRequired(true)
    ),
  execute: async (interaction) => {
    //const inputUser = interaction.options.getUser('type');

    await interaction.reply({ embeds: [embedMessage], ephemeral: true });
  },
};
