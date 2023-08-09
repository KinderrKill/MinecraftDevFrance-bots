import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  displayName: {
    type: String,
  },
  level: {
    type: Number,
    default: 1,
  },
  experience: {
    type: Number,
    default: 0,
  },
  sendedMessage: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('User', UserSchema, 'Users');
