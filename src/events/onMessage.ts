import { Channel, EmbedBuilder, Events, GuildMember, Message, Role, TextChannel } from 'discord.js';
import { isDevMode, levelingManager } from '../index.js';
import { User } from '../domain/leveling/user.js';
import { CHANNEL, ROLE, getRole, getChannel } from '../utils/constants.js';
import { BotEvent } from './../types.js';

const MIN_LENGHT_PER_MESSAGE = 50;
const EXP_PER_MESSAGE = 20;
const MAX_LEVEL = 50;

const event: BotEvent = {
  name: Events.MessageCreate,
  once: false,
  execute(message: Message) {
    if (message.author.bot) return;
    const user = levelingManager.registerOrGetUser(message.author.id, message.author.displayName);
    user.incrementSendedMessage();

    verifyCode(message);

    const expCategoryId = isDevMode
      ? ['1138824826149163079']
      : ['1138950712768864358', '1138950869145104447'];
    const channel = message.guild.channels.cache.get(message.channelId);

    if (
      expCategoryId.find((id) => id === channel.parentId) &&
      message.content.length >= MIN_LENGHT_PER_MESSAGE
    ) {
      if (user.getLevel() >= MAX_LEVEL) return;

      const userLevelUp = levelingManager.addExperienceTo(null, user.getId(), EXP_PER_MESSAGE);

      if (userLevelUp) {
        const channel = message.client.channels.cache.get(
          getChannel(CHANNEL.LEVEL_NOTIF, isDevMode)
        );

        const userLevel = user.getLevel();
        if (userLevel === 10) {
          const role = message.guild.roles.cache.get(getRole(ROLE.MEMBER_SILVER, isDevMode));
          sendLevelUpEmbedMessageWithRankUnlock(channel, message.member, user, role);
          message.member.roles.add(role);
        } else if (userLevel === 20) {
          const role = message.guild.roles.cache.get(getRole(ROLE.MEMBER_GOLD, isDevMode));
          sendLevelUpEmbedMessageWithRankUnlock(channel, message.member, user, role);
          message.member.roles.add(role);
        } else if (userLevel === 30) {
          const role = message.guild.roles.cache.get(getRole(ROLE.MEMBER_DIAMOND, isDevMode));
          sendLevelUpEmbedMessageWithRankUnlock(channel, message.member, user, role);
          message.member.roles.add(role);
        } else if (userLevel === 40) {
          const role = message.guild.roles.cache.get(getRole(ROLE.MEMBER_EMERALD, isDevMode));
          sendLevelUpEmbedMessageWithRankUnlock(channel, message.member, user, role);
          message.member.roles.add(role);
        } else if (userLevel === 50) {
          const role = message.guild.roles.cache.get(getRole(ROLE.MEMBER_OBSIDIAN, isDevMode));
          sendLevelUpEmbedMessageWithRankUnlock(channel, message.member, user, role);
          message.member.roles.add(role);
        } else {
          sendLevelUpEmbedMessage(channel, message.member, user);
        }
      }
    }
  },
};

export default event;

async function verifyCode(message: Message) {
  const codeIndicators = [';', '{', '}', '(', ')', '=', '+', '-', '*', '/'];
  const containsCode = codeIndicators.some((indicator) => message.content.includes(indicator));

  const codeBlockPattern = /```[\s\S]*?```/g;
  const codeBlockMatches = message.content.match(codeBlockPattern);

  const inlineCodePattern = /`[^`]+`/g;
  const inlineCodeMatches = message.content.match(inlineCodePattern);

  const inlineCodeThreshold = 3;

  if (containsCode) {
    if (inlineCodeMatches && inlineCodeMatches.length >= inlineCodeThreshold) {
      try {
        await message.reply({
          content:
            'Il semble que vous ayez inclus beaucoup de code en brut. Veuillez utiliser des blocs de code avec les ``` (backticks) pour une meilleure lisibilité.',
        });
      } catch (error) {
        console.error(`Error sending message: ${error}`);
      }
    } else if (codeBlockMatches && codeBlockMatches.length === 0) {
      try {
        await message.reply({
          content:
            'Veuillez utiliser des blocs de code avec les ``` (backticks) pour formater correctement votre code.',
        });
        await message.react('❗');
      } catch (error) {
        console.error(`Error sending message: ${error}`);
      }
    }
  }
}

function sendLevelUpEmbedMessage(chanel: Channel, member: GuildMember, user: User) {
  if (chanel instanceof TextChannel) {
    chanel.send({
      content: `Félicitation <@${member.id}> !`,
      embeds: [
        new EmbedBuilder()
          .setColor(0xffbf2f)
          .setTitle(`Félicitation <@${member.id}> 🎉`)
          .setFields({
            name: '\u200b',
            value: `Tu viens de passer au **niveau ${user.getLevel()}** !`,
          }),
      ],
    });
  }
}

function sendLevelUpEmbedMessageWithRankUnlock(
  chanel: Channel,
  member: GuildMember,
  user: User,
  role: Role
) {
  if (chanel instanceof TextChannel) {
    chanel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0xffbf2f)
          .setTitle(`Félicitation <@${member.id}> 🎉`)
          .setFields(
            {
              name: '\u200b',
              value: `Tu viens de passer au **niveau ${user.getLevel()}** !`,
            },
            {
              name: '\u200b',
              value: `\n\nNous sommes honorés de te promouvoir au rang <@&${role.id}>\nEn reconnaissance de ton activité sur le serveur !`,
            }
          ),
      ],
    });
  }
}
