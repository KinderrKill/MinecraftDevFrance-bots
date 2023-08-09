import { levelingManager, userRepository } from './../index';
import {
  Events,
  Interaction,
  ButtonInteraction,
  GuildMember,
  TextChannel,
  EmbedBuilder,
  Guild,
  AttachmentBuilder,
  ModalSubmitInteraction,
} from 'discord.js';
import { CHANNEL } from '../utils/constants';
import { BotEvent } from '../types';
import { BUTTON_ID, ROLE } from '../utils/constants';
import { User } from '../domain/leveling/user';

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction) {
    if (interaction.isButton && interaction instanceof ButtonInteraction) {
      const buttonInteraction = interaction as ButtonInteraction;

      // Confirm rules function
      if (buttonInteraction.customId === BUTTON_ID.CONFIRM_RULES) handleConfirmRules(buttonInteraction);
      return;
    }

    if (interaction.isModalSubmit() && interaction instanceof ModalSubmitInteraction) {
      const modalSubmit = interaction as ModalSubmitInteraction;

      if (modalSubmit.customId === 'suggestModal') {
        await handleSuggestModal(modalSubmit);
        return;
      }
    }
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.slashCommands.get(interaction.commandName);

    if (!command) return;

    await command.execute(interaction);
  },
};

export default event;

function handleConfirmRules(interaction: ButtonInteraction) {
  const role = interaction.guild.roles.cache.get(ROLE.MEMBER);

  if (!role) {
    return interaction.reply({ content: '[HandleConfirmRules] Role not found', ephemeral: true });
  }

  const member = interaction.guild.members.cache.get(interaction.member.user.id);

  if (member.roles.cache.get(role.id)) {
    return interaction.reply({ content: 'Vous avez déjà validé la lecture du réglement !', ephemeral: true });
  }

  member.roles.add(role);

  levelingManager.registerOrGetUser(member.id, member.displayName);

  interaction.guild.channels.cache.get(CHANNEL.MEMBER_COUNT).setName('Membres : ' + (role.members.size + 1));

  sendWelcomeEmbedMessage(interaction, member);

  return interaction.reply({ content: 'Vous êtes maintenant membre de ce discord !', ephemeral: true });
}

async function sendWelcomeEmbedMessage(interaction: ButtonInteraction, member: GuildMember) {
  const chanel = interaction.client.channels.cache.get(CHANNEL.WELCOME_HALL);
  if (chanel instanceof TextChannel) {
    const message = await chanel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x000000)
          .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
          .addFields({
            name: '\u200B',
            value: `Un nouveau membre viens de nous rejoindre :sparkles:\nBienvenue à toi **${member.displayName}**, si tu as des questions n'hésite pas !`,
          }),
      ],
    });

    message.react('👋');
  }
}

async function handleSuggestModal(interaction: ModalSubmitInteraction) {
  console.log(interaction);

  const suggestContent = interaction.fields.getTextInputValue('suggestContent');
  console.log({ suggestContent });

  const suggestionChannel = interaction.guild.channels.cache.get(CHANNEL.SUGGESTION) as TextChannel;

  const embedMessage = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.displayName,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTitle('Nouvelle suggestion 💡 ')
    .setDescription(suggestContent)
    .setColor(0x04fbff);

  const message = await suggestionChannel.send({ embeds: [embedMessage] });
  message.react('👍');
  message.react('👎');

  await interaction.reply({
    content: `Votre suggestion à bien été prise en compte, vous la retrouverez ici <#${CHANNEL.SUGGESTION}>`,
    ephemeral: true,
  });
}
