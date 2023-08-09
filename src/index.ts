import { readdirSync } from 'fs';
import { join } from 'path';
import { SlashCommand } from './types';
import { GatewayIntentBits, Client, Collection } from 'discord.js';
import * as dotenv from 'dotenv';
import { LevelingManager } from './domain/leveling/levelingManager';
import { connectToDB, saveModifiedData } from './config/database';
import UserRepository from './config/repository/userRepository';
import cron from 'node-cron';

dotenv.config();
connectToDB();

export const userRepository = new UserRepository();
export const levelingManager = new LevelingManager(userRepository);

levelingManager.onLoad();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.slashCommands = new Collection<string, SlashCommand>();

const handlersDir = join(__dirname, './handlers');

readdirSync(handlersDir).forEach((handler) => {
  require(`${handlersDir}/${handler}`)(client);
});

cron.schedule('0 2 * * *', async () => {
  saveModifiedData();
});

process.on('exit', async () => {
  saveModifiedData();
});

client.login(process.env.TOKEN).catch((err) => {
  console.error('[Login Error]', err);
  process.exit(1);
});
