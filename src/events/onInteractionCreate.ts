import { isDevMode, levelingManager, userRepository } from './../index';
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
  Collection,
} from 'discord.js';
import { CHANNEL, getChannel, getRole } from '../utils/constants';
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

    const { cooldowns } = interaction.client;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        return interaction.reply({
          content: `S'il vous plait, vous avez déjà executé la commande \`${command.data.name}\`. Vous pourrez la refaire dans <t:${expiredTimestamp}:R>.`,
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    await command.execute(interaction);
  },
};

export default event;

function handleConfirmRules(interaction: ButtonInteraction) {
  const role = interaction.guild.roles.cache.get(getRole(ROLE.MEMBER, isDevMode));

  if (!role) {
    return interaction.reply({ content: '[HandleConfirmRules] Role not found', ephemeral: true });
  }

  const member = interaction.guild.members.cache.get(interaction.member.user.id);

  if (member.roles.cache.get(role.id)) {
    return interaction.reply({ content: 'Vous avez déjà validé la lecture du réglement !', ephemeral: true });
  }

  member.roles.add(role);

  levelingManager.registerOrGetUser(member.id, member.displayName);

  interaction.guild.channels.cache
    .get(getChannel(CHANNEL.MEMBER_COUNT, isDevMode))
    .setName('Membres : ' + (role.members.size + 1));

  sendWelcomeEmbedMessage(interaction, member);

  return interaction.reply({ content: 'Vous êtes maintenant membre de ce discord !', ephemeral: true });
}

async function sendWelcomeEmbedMessage(interaction: ButtonInteraction, member: GuildMember) {
  const chanel = interaction.client.channels.cache.get(getChannel(CHANNEL.WELCOME_HALL, isDevMode));
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
  const suggestContent = interaction.fields.getTextInputValue('suggestContent');

  const suggestionChannel = interaction.guild.channels.cache.get(
    getChannel(CHANNEL.SUGGESTION, isDevMode)
  ) as TextChannel;

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
    content: `Votre suggestion à bien été prise en compte, vous la retrouverez ici <#${getChannel(
      CHANNEL.SUGGESTION,
      isDevMode
    )}>`,
    ephemeral: true,
  });
}
