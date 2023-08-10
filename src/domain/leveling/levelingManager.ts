import { Channel, EmbedBuilder, TextChannel, Role, ChatInputCommandInteraction } from 'discord.js';
import { CHANNEL, getChannel, getRole, LEVELING_TABLE, ROLE } from '../../utils/constants';
import { User } from './user';
import UserReposiroty from '../../config/repository/userRepository';
import { isDevMode, userRepository } from '../..';
import { Warn } from '../warn';

export class LevelingManager {
  private users: User[];
  private userRepository: UserReposiroty;

  constructor(userRepository: UserReposiroty) {
    this.users = [];
    this.userRepository = userRepository;
  }

  async onLoad() {
    const dbUsers = await this.userRepository.getAll();
    dbUsers.forEach((dbUser) => {
      const warns = dbUser.warns.map(
        (warnData) => new Warn(warnData.authorId, warnData.reason, warnData.date.getTime())
      );
      this.users.push(
        new User(
          dbUser.id,
          dbUser.displayName,
          dbUser.level,
          dbUser.experience,
          dbUser.sendedMessage,
          warns
        )
      );
    });

    console.log('[LevelingManager] Load ' + this.users.length + ' users');
  }

  registerOrGetUser(id: string, displayName: string): User {
    const user = this.getUserById(id);
    if (user !== undefined) {
      return user;
    }

    const newUser = new User(id, displayName, 1, 0, 0);
    this.users.push(newUser);

    userRepository.createUser(newUser);

    return newUser;
  }

  getUsers() {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.getId() === id);
  }

  /*
   * Return true if the user level up
   */
  addExperienceTo(
    interaction: ChatInputCommandInteraction,
    userId: string,
    amount: number
  ): boolean {
    const user = this.getUserById(userId);
    if (user === undefined) throw new Error(`User ${userId} is undefined !`);

    const oldExperience = user.getExperience();
    const newExperience = oldExperience + amount;

    const expForNextLevel = this.getExperienceForNextLevel(user.getLevel());
    user.setExperience(newExperience);

    if (newExperience >= expForNextLevel) {
      this.addLevelTo(interaction, userId, 1);
      return true;
    } else {
      return false;
    }
  }

  removeExperienceTo(interaction: ChatInputCommandInteraction, userId: string, amount: number) {
    const user = this.getUserById(userId);
    if (user === undefined) throw new Error(`User ${userId} is undefined !`);

    const oldExperience = user.getExperience();
    const newExperience = oldExperience - amount;

    const expForNextLevel = this.getExperienceForNextLevel(user.getLevel() - 1);

    if (newExperience < expForNextLevel) this.removeLevelTo(interaction, userId, 1);
    user.setExperience(newExperience);
  }

  addLevelTo(
    interaction: ChatInputCommandInteraction,
    userId: string,
    amount: number,
    byCommand?: boolean
  ) {
    const user = this.getUserById(userId);
    if (user === undefined) throw new Error(`User ${userId} is undefined !`);

    const oldLevel = user.getLevel();
    const newLevel = oldLevel + amount;
    user.setLevel(newLevel);

    if (interaction != null) {
      this.levelChangeEvent(user, interaction);
    }

    if (byCommand) {
      user.setExperience(this.getExperienceForNextLevel(newLevel));
    }
  }

  removeLevelTo(
    interaction: ChatInputCommandInteraction,
    userId: string,
    amount: number,
    byCommand?: boolean
  ) {
    const user = this.getUserById(userId);
    if (user === undefined) throw new Error(`User ${userId} is undefined !`);

    const oldLevel = user.getLevel();
    const newLevel = oldLevel - amount;
    user.setLevel(newLevel);
    if (interaction != null) {
      this.levelChangeEvent(user, interaction);
    }

    if (byCommand) {
      user.setExperience(this.getExperienceForNextLevel(newLevel));
    }
  }

  setLevelTo(
    interaction: ChatInputCommandInteraction,
    userId: string,
    amount: number,
    byCommand?: boolean
  ) {
    const user = this.getUserById(userId);
    if (user === undefined) throw new Error(`User ${userId} is undefined !`);

    user.setLevel(amount);
    if (interaction != null) {
      this.levelChangeEvent(user, interaction);
    }

    if (byCommand) {
      user.setExperience(this.getExperienceForNextLevel(amount));
    }
  }

  getExperienceForNextLevel(level: number) {
    return LEVELING_TABLE[level];
  }

  levelChangeEvent(user: User, interaction: ChatInputCommandInteraction) {
    const channel = interaction.guild.channels.cache.get(
      getChannel(CHANNEL.LEVEL_NOTIF, isDevMode)
    );

    const userLevel = user.getLevel();
    if (userLevel === 10) {
      const role = interaction.guild.roles.cache.get(getRole(ROLE.MEMBER_SILVER, isDevMode));
      this.sendLevelUpEmbedMessageWithRankUnlock(channel, user, role);
      interaction.guild.members.cache.get(user.getId()).roles.add(role);
    } else if (userLevel === 20) {
      const role = interaction.guild.roles.cache.get(getRole(ROLE.MEMBER_GOLD, isDevMode));
      this.sendLevelUpEmbedMessageWithRankUnlock(channel, user, role);
      interaction.guild.members.cache.get(user.getId()).roles.add(role);
    } else if (userLevel === 30) {
      const role = interaction.guild.roles.cache.get(getRole(ROLE.MEMBER_DIAMOND, isDevMode));
      this.sendLevelUpEmbedMessageWithRankUnlock(channel, user, role);
      interaction.guild.members.cache.get(user.getId()).roles.add(role);
    } else if (userLevel === 40) {
      const role = interaction.guild.roles.cache.get(getRole(ROLE.MEMBER_EMERALD, isDevMode));
      this.sendLevelUpEmbedMessageWithRankUnlock(channel, user, role);
      interaction.guild.members.cache.get(user.getId()).roles.add(role);
    } else if (userLevel === 50) {
      const role = interaction.guild.roles.cache.get(getRole(ROLE.MEMBER_OBSIDIAN, isDevMode));
      this.sendLevelUpEmbedMessageWithRankUnlock(channel, user, role);
      interaction.guild.members.cache.get(user.getId()).roles.add(role);
    } else {
      this.sendLevelUpEmbedMessage(channel, user);
    }
  }

  sendLevelUpEmbedMessage(chanel: Channel, user: User) {
    if (chanel instanceof TextChannel) {
      chanel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xffbf2f)
            .setTitle(`Niveau supérieur 🆙`)
            .setFields({
              name: '\u200b',
              value: `Félicitation <@${user.getId()}> 🎉\nTu viens de passer au **niveau ${user.getLevel()}** !`,
            }),
        ],
      });
    }
  }

  sendLevelUpEmbedMessageWithRankUnlock(chanel: Channel, user: User, role: Role) {
    if (chanel instanceof TextChannel) {
      chanel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xffbf2f)
            .setTitle(`Niveau supérieur 🆙`)
            .setFields(
              {
                name: '\u200b',
                value: `Félicitation <@${user.getId()}> 🎉\nTu viens de passer au **niveau ${user.getLevel()}** !`,
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
}
