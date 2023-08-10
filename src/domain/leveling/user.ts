import { ModifiableData } from '../modifiableData';
import { Warn } from '../warn';

export class User extends ModifiableData {
  private id: string;
  private displayName: string;
  private level: number;
  private experience: number;
  private sendedMessage: number;
  private warns: Warn[];

  constructor(
    id: string,
    displayName: string,
    level: number,
    experience: number,
    sendedMessage: number,
    warn?: Warn[]
  ) {
    super();
    this.id = id;
    this.displayName = displayName;
    this.level = level;
    this.experience = experience;
    this.sendedMessage = sendedMessage;
    this.warns = warn ? warn : [];
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

  addWarn(authorId: string, reason: string) {
    this.warns.push(new Warn(authorId, reason));
    this.setIsModified();
  }

  getWarns() {
    return this.warns;
  }
}
