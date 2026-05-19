import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  isActive: boolean;
  lastActiveAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    refreshToken: { type: String, required: true },
    device: { type: String, default: 'Unknown Device' },
    browser: { type: String, default: 'Unknown Browser' },
    os: { type: String, default: 'Unknown OS' },
    ipAddress: { type: String },
    location: { type: String, default: 'Unknown Location' },
    isActive: { type: Boolean, default: true },
    lastActiveAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<ISession>('Session', SessionSchema);
