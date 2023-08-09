import { levelingManager, userRepository } from './../index';
import mongoose, { ConnectOptions } from 'mongoose';

const CONNECT_TIMEOUT_MS = 3000;
const SOCKET_TIMOUT_MS = 20000;

export function connectToDB() {
  mongoose.set('strictQuery', false);
  mongoose
    .connect(process.env.MONGO_URL, {
      connectTimeoutMS: CONNECT_TIMEOUT_MS,
      socketTimeoutMS: SOCKET_TIMOUT_MS,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => {
      console.log('[MongoDB] Connected to DB.');
    })
    .catch((err) => console.log('[MongoDB] Error pending connexion: ', err));
}

export function saveModifiedData() {
  const users = levelingManager.getUsers().filter((user) => user.isModified());

  users.forEach((user) => {
    userRepository.modifyUser(user.getId(), user);
  });
}
