import { ROLE } from './constants';

export type Role = (typeof ROLE)[keyof typeof ROLE];
