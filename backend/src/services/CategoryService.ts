import { CategoryModel } from '../models/Category';
import { Category } from '../types';

export class CategoryService {
  async getAllCategories(): Promise<Category[]> {
    return CategoryModel.find().sort({ id: 1 }).exec();
  }

  async createCategory(category: Category): Promise<Category> {
    const newCategory = new CategoryModel(category);
    return newCategory.save();
  }

  async createMultipleCategories(categories: Category[]): Promise<Category[]> {
    return CategoryModel.insertMany(categories);
  }
}