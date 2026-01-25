import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Won' | 'Lost';
  source: string;
  campaigns: string[]; // IDs of related AFFILIFY campaigns/websites
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Proposal Sent', 'Won', 'Lost'], 
    default: 'New' 
  },
  source: { type: String, default: 'Manual Entry' },
  campaigns: [{ type: String }],
  notes: { type: String, default: '' },
}, { timestamps: true });

const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
