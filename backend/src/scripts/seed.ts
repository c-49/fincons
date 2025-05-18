import axios from 'axios';
import { DatabaseConnection } from '../database/connection';
import { QuestionModel } from '../models/Question';
import { CategoryModel } from '../models/Category';
import { Question, Category } from '../types';

class DatabaseSeeder {
  private db = DatabaseConnection.getInstance();
  private categoriesWithQuestions: number[] = [];

  async seed(): Promise<void> {
    console.log('🌱 Starting database seeding...');
    
    try {
      await this.db.connect();
      await this.clearDatabase();
      await this.seedCategories();
      await this.seedQuestions();
      // Update categories to only keep those with questions
      await this.updateCategories();
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    } finally {
      await this.db.disconnect();
    }
  }

  private async clearDatabase(): Promise<void> {
    console.log('🧹 Clearing existing data...');
    await QuestionModel.deleteMany({});
    await CategoryModel.deleteMany({});
  }

  private async seedCategories(): Promise<void> {
    console.log('📚 Seeding categories...');
    
    const response = await axios.get('https://opentdb.com/api_category.php');
    const categories: Category[] = response.data.trivia_categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name
    }));

    await CategoryModel.insertMany(categories);
    console.log(`✨ Inserted ${categories.length} categories`);
  }

  private async seedQuestions(): Promise<void> {
    console.log('❓ Seeding questions...');
    
    const categories = await CategoryModel.find().exec();
    const difficulties = ['easy', 'medium', 'hard'] as const;
    
    let totalQuestions = 0;

    for (const category of categories) {
      let hasQuestions = false;
      
      for (const difficulty of difficulties) {
        try {
          const url = `https://opentdb.com/api.php?amount=50&category=${category.id}&difficulty=${difficulty}&type=multiple`;
          const response = await axios.get(url);
          
          // Check if we received valid questions
          if (response.data.response_code === 0 && response.data.results.length > 0) {
            const questions: Question[] = response.data.results.map((q: any) => ({
              category: category.id,
              type: 'multiple',
              difficulty,
              question: this.decodeHtml(q.question),
              correct_answer: this.decodeHtml(q.correct_answer),
              incorrect_answers: q.incorrect_answers.map((a: string) => this.decodeHtml(a))
            }));

            await QuestionModel.insertMany(questions);
            totalQuestions += questions.length;
            console.log(`  📝 ${category.name} (${difficulty}): ${questions.length} questions`);
            
            // Mark this category as having questions
            hasQuestions = true;
          } else {
            console.warn(`⚠️  No questions available for ${category.name} (${difficulty})`);
          }

          // Rate limiting to avoid overwhelming the API
          await this.sleep(1000);
        } catch (error) {
          console.warn(`⚠️  Failed to fetch questions for ${category.name} (${difficulty})`);
        }
      }
      
      // Add category ID to our list if it has questions
      if (hasQuestions) {
        this.categoriesWithQuestions.push(category.id);
      }
    }

    console.log(`🎯 Total questions inserted: ${totalQuestions}`);
    console.log(`🗂️  Categories with questions: ${this.categoriesWithQuestions.length} of ${categories.length}`);
  }

  private async updateCategories(): Promise<void> {
    console.log('🔄 Updating categories to only include those with questions...');
    
    // Delete categories that don't have any questions
    const result = await CategoryModel.deleteMany({ 
      id: { $nin: this.categoriesWithQuestions } 
    });
    
    console.log(`🗑️  Removed ${result.deletedCount} categories without questions`);
    
    // Log the remaining categories
    const remainingCategories = await CategoryModel.find().lean();
    console.log(`📊 Remaining categories: ${remainingCategories.length}`);
    remainingCategories.forEach(cat => {
      console.log(`  - ${cat.name} (ID: ${cat.id})`);
    });
  }

  private decodeHtml(html: string): string {
    return html
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the seeder
const seeder = new DatabaseSeeder();
seeder.seed()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });