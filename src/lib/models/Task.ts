import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Complete';
  dueDate: Date;
  assignedTo: string; // User ID or Client ID
  relatedLead: mongoose.Types.ObjectId; // ID of related Lead/Partner
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['To Do', 'In Progress', 'Review', 'Complete'], 
    default: 'To Do' 
  },
  dueDate: { type: Date, required: false },
  assignedTo: { type: String, required: true },
  relatedLead: { type: Schema.Types.ObjectId, ref: 'Lead', required: false },
}, { timestamps: true });

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
