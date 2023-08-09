import { SlashCommand } from './utils/types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      CLIENT_ID: string;
      TOKEN: string;
      CLIENT_DEV_ID: string;
      TOKEN_DEV: string;
      MONGO_URL: string;
    }
  }
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
  }
}

export interface BotEvent {
  name: string;
  once?: boolean | false;
  execute: (...args) => void;
}

export interface SlashCommand {
  name: string;
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}

export {};
