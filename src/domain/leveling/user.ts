import { ModifiableData } from '../modifiableData';

export class User extends ModifiableData {
  private id: string;
  private displayName: string;
  private level: number;
  private experience: number;
  private sendedMessage: number;

  constructor(id: string, displayName: string, level: number, experience: number, sendedMessage: number) {
    super();
    this.id = id;
    this.displayName = displayName;
    this.level = level;
    this.experience = experience;
    this.sendedMessage = sendedMessage;
  }

  getId() {
    return this.id;
  }

  getDisplayName() {
    return this.displayName;
  }

  setLevel(level: number) {
    this.level = level;
    this.setIsModified();
  }

  getLevel() {
    return this.level;
  }

  setExperience(experience: number) {
    this.experience = experience;
    this.setIsModified();
  }

  getExperience() {
    return this.experience;
  }

  incrementSendedMessage() {
    this.sendedMessage += 1;
  }

  getSendedMessage() {
    return this.sendedMessage;
  }
}
