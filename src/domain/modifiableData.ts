export abstract class ModifiableData {
  modified: boolean;

  constructor() {
    this.modified = false;
  }

  isModified() {
    return this.modified;
  }

  setIsModified() {
    this.modified = true;
  }
}
