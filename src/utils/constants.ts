import { GuildMember } from 'discord.js';

export const BOT_NAME = '🤖 MDF-BOT-DEV';
export const BOT_COLOR = '#ffbf2f';

export const ROLE = {
  ADMIN: '746345267304988733',
  MODERATOR: '1138924437534687280',
  MEMBER: '1138140857640435862',
  MEMBER_SILVER: '1138475544871174284',
  MEMBER_GOLD: '1138475676769464404',
  MEMBER_DIAMOND: '1138475757685964902',
  MEMBER_EMERALD: '1138475854133997578',
  MEMBER_OBSIDIAN: '1138842584689684633',
} as const;

export function isAdmin(member: GuildMember): boolean {
  return member.roles.cache.get(ROLE.ADMIN) !== undefined;
}

export function isModerator(member: GuildMember): boolean {
  return member.roles.cache.get(ROLE.MODERATOR) !== undefined || member.roles.cache.get(ROLE.ADMIN) !== undefined;
}

export const CHANNEL = {
  MEMBER_COUNT: '743264361501556786',
  WELCOME_HALL: '1138811375771209798',
  LEVEL_NOTIF: '1138837775702032494',
  SUGGESTION: '1138963928433565717',
} as const;

export const BUTTON_ID = {
  CONFIRM_RULES: 'confirm_rules',
} as const;

export const LEVELING_TABLE = [
  0, // Niveau 0
  100, // Niveau 1
  300, // Niveau 2
  600, // Niveau 3
  1000, // Niveau 4
  1500, // Niveau 5
  2100, // Niveau 6
  2800, // Niveau 7
  3600, // Niveau 8
  4500, // Niveau 9
  5500, // Niveau 10
  6600, // Niveau 11
  7800, // Niveau 12
  9100, // Niveau 13
  10500, // Niveau 14
  12000, // Niveau 15
  13600, // Niveau 16
  15300, // Niveau 17
  17100, // Niveau 18
  19000, // Niveau 19
  21000, // Niveau 20
  23100, // Niveau 21
  25300, // Niveau 22
  27600, // Niveau 23
  30000, // Niveau 24
  32500, // Niveau 25
  35100, // Niveau 26
  37800, // Niveau 27
  40600, // Niveau 28
  43500, // Niveau 29
  46500, // Niveau 30
  49600, // Niveau 31
  52800, // Niveau 32
  56100, // Niveau 33
  59500, // Niveau 34
  63000, // Niveau 35
  66600, // Niveau 36
  70300, // Niveau 37
  74100, // Niveau 38
  78000, // Niveau 39
  82000, // Niveau 40
  86100, // Niveau 41
  90300, // Niveau 42
  94600, // Niveau 43
  99000, // Niveau 44
  103500, // Niveau 45
  108100, // Niveau 46
  112800, // Niveau 47
  117600, // Niveau 48
  122500, // Niveau 49
  127500, // Niveau 50
] as const;
