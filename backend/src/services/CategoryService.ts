import { CategoryModel } from '../models/Category';
import { Category } from '../types';

export class CategoryService {
  async getAllCategories(): Promise<Category[]> {
    const categories = await CategoryModel.find().sort({ id: 1 }).lean().exec();
    // Convert Mongoose documents to our Category interface
    return categories.map(doc => ({
      id: doc.id,
      name: doc.name
    }));
  }

  async createCategory(category: Category): Promise<Category> {
    const newCategory = new CategoryModel(category);
    const savedCategory = await newCategory.save();
    // Convert Mongoose document to our Category interface
    return {
      id: savedCategory.id,
      name: savedCategory.name
    };
  }

  async createMultipleCategories(categories: Category[]): Promise<Category[]> {
    const savedCategories = await CategoryModel.insertMany(categories);
    // Convert Mongoose documents to our Category interface
    return savedCategories.map(doc => ({
      id: doc.id,
      name: doc.name
    }));
  }
}