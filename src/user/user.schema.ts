import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

export interface User extends Document {
  userName: string;
  userEmail: string;
  userPassword: string;
  isAdmin: boolean;
}
