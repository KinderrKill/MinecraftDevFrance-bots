import { levelingManager } from './../index';

export class Warn {
  private authorId: string;
  private reason: string;
  private date: number;

  constructor(authorId: string, reason: string, date?: number) {
    this.authorId = authorId;
    this.reason = reason;
    this.date = date ? date : Date.now();
  }

  getAuthor() {
    return levelingManager.getUserById(this.authorId);
  }

  getReason() {
    return this.reason;
  }

  getFormattedDate() {
    return new Date(this.date).toLocaleDateString('fr-FR');
  }
}
