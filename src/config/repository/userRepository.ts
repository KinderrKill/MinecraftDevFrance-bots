import { User } from '../../domain/leveling/user';
import userModel from '../models/user.model';

export default class UserReposiroty {
  constructor() {}

  async getAll() {
    return await userModel.find();
  }

  async getById(id: string) {
    return await userModel.findOne({ id: id });
  }

  async createUser(user: User) {
    return await userModel.create({
      id: user.getId(),
      displayName: user.getDisplayName(),
      level: user.getLevel(),
      experience: user.getExperience(),
      sendedMessage: user.getSendedMessage(),
    });
  }

  async modifyUser(id: string, user: User) {
    return await userModel.findOneAndUpdate({ id }, user, { new: true });
  }
}
