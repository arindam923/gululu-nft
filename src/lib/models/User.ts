import mongoose, { Schema } from 'mongoose';

// Define the interface for the user
export interface IUser {
  walletAddress: string;
  points: number;
  updatedAt: Date;
}

// Define the schema
const UserSchema = new Schema<IUser>(
  {
    walletAddress: { type: String, required: true, unique: true, index: true },
    points: { type: Number, required: true, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create and export the model
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);