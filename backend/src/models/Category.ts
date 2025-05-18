import mongoose, { Document, Schema } from 'mongoose';
import { Category as ICategory } from '../types';

// Use Omit to avoid conflict between Document _id and Category id
type CategoryDocument = Document & Omit<ICategory, 'id'>;

const categorySchema = new Schema<CategoryDocument>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true }
});

export const CategoryModel = mongoose.model<CategoryDocument>('Category', categorySchema);