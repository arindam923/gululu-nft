import mongoose, { Schema } from 'mongoose';

// Define the interface for the burn record
export interface IBurnRecord {
  walletAddress: string;
  nftDetails: {
    contractAddress: string;
    tokenId: string;
    name?: string;
    symbol?: string;
    tokenUri?: string;
    media?: string;
  };
  pointsReceived: number;
  burnedAt: Date;
}

// Define the schema
const BurnRecordSchema = new Schema<IBurnRecord>(
  {
    walletAddress: { type: String, required: true, index: true },
    nftDetails: {
      contractAddress: { type: String, required: true },
      tokenId: { type: String, required: true },
      name: { type: String },
      symbol: { type: String },
      tokenUri: { type: String },
      media: { type: String },
    },
    pointsReceived: { type: Number, required: true },
    burnedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create and export the model
export const BurnRecord = mongoose.models.BurnRecord || mongoose.model<IBurnRecord>('BurnRecord', BurnRecordSchema);