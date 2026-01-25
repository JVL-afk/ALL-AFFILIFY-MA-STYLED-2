import mongoose, { Document, Schema } from 'mongoose';

export interface IProposal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  clientId: string; // Email or ID of the client
  status: 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected';
  content: string; // Markdown or rich text content
  price: number;
  signature?: {
    client: string;
    date: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProposalSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  clientId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected'], 
    default: 'Draft' 
  },
  content: { type: String, required: true },
  price: { type: Number, required: true },
  signature: {
    client: String,
    date: Date,
  },
}, { timestamps: true });

const Proposal = mongoose.models.Proposal || mongoose.model<IProposal>('Proposal', ProposalSchema);

export default Proposal;
