import mongoose, { Document, Schema } from 'mongoose';

export interface IRelationshipTuple extends Document {
  object: string; // e.g., 'document:doc123', 'folder:fld456'
  relation: string; // e.g., 'viewer', 'editor', 'owner', 'parent'
  subject: string; // e.g., 'user:user789', 'group:eng#member', 'user:user789#owner'
  createdAt: Date;
}

const RelationshipTupleSchema: Schema = new Schema({
  object: { type: String, required: true, index: true },
  relation: { type: String, required: true, index: true },
  subject: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Ensure uniqueness for relationship tuples
RelationshipTupleSchema.index({ object: 1, relation: 1, subject: 1 }, { unique: true });

const RelationshipTuple = mongoose.models.RelationshipTuple || mongoose.model<IRelationshipTuple>('RelationshipTuple', RelationshipTupleSchema);

export default RelationshipTuple;
