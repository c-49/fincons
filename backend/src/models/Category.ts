import mongoose, { Document, Schema } from 'mongoose';
import { Category as ICategory } from '../types';

interface CategoryDocument extends ICategory, Document {}

const categorySchema = new Schema<CategoryDocument>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true }
});

export const CategoryModel = mongoose.model<CategoryDocument>('Category', categorySchema);