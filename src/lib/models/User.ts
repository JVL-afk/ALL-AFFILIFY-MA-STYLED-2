import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  subscription: {
    status: 'active' | 'inactive' | 'cancelled';
    plan: 'basic' | 'pro' | 'enterprise';
    startDate: Date;
    endDate: Date | null;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  crmStats: {
    totalLeads: number;
    totalTasks: number;
    totalProposals: number;
    totalClients: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  avatar: { type: String, default: '' },
  subscription: {
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'cancelled'], 
      default: 'inactive' 
    },
    plan: { 
      type: String, 
      enum: ['basic', 'pro', 'enterprise'], 
      default: 'basic' 
    },
    startDate: { type: Date, default: new Date() },
    endDate: { type: Date, default: null },
    stripeCustomerId: { type: String, default: '' },
    stripeSubscriptionId: { type: String, default: '' },
  },
  crmStats: {
    totalLeads: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 0 },
    totalProposals: { type: Number, default: 0 },
    totalClients: { type: Number, default: 0 },
  },
}, { timestamps: true });

// Index for email lookups
UserSchema.index({ email: 1 });
// Index for subscription status queries
UserSchema.index({ 'subscription.status': 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
