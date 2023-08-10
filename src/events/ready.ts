import { ActivityType, Client, Events } from 'discord.js';
import { isDevMode } from '..';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(`🌠 Logged in as ${client.user?.tag} | DevMode: ${isDevMode}`);

    client.user.setPresence({
      activities: [{ name: `les membres du discord`, type: ActivityType.Watching }],
      status: 'online',
    });
  },
};

export default event;
