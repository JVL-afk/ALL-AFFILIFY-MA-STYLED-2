import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  portalId: string; // Unique ID for public portal access
  associatedLeads: string[]; // IDs of Leads/Partners
  portalAccess: boolean;
  portalPassword?: string; // Hashed password for portal access
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  portalId: { type: String, unique: true, required: true },
  associatedLeads: [{ type: String }],
  portalAccess: { type: Boolean, default: true },
  portalPassword: { type: String, default: null },
}, { timestamps: true });

const Client = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

export default Client;
