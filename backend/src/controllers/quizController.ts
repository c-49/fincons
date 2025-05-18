import { Request, Response } from 'express';
import { QuestionService } from '../services/QuestionService';
import { QuizQuery, QuizSubmission, isDifficulty } from '../types';

export class QuizController {
  private questionService = new QuestionService();

  // Clean validation using type guards
  private validateQuizQuery = (query: any): QuizQuery | null => {
    const category = parseInt(query.category);
    const amount = parseInt(query.amount) || 5;
    const difficulty = query.difficulty;

    // Use ternary operators for simple validation
    return isNaN(category) || !isDifficulty(difficulty) 
      ? null 
      : { category, difficulty, amount };
  };

  getQuiz = async (req: Request, res: Response): Promise<void> => {
    const validatedQuery = this.validateQuizQuery(req.query);
    
    if (!validatedQuery) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid query parameters' 
      });
      return;
    }

    try {
      const questions = await this.questionService.getQuestionsByQuery(validatedQuery);
      
      // Check if we have enough questions
      if (questions.length < validatedQuery.amount) {
        res.status(404).json({
          success: false,
          error: `Not enough questions available for this category and difficulty. Found ${questions.length} of ${validatedQuery.amount} required.`
        });
        return;
      }
      
      const sanitizedQuestions = questions.map(({ correct_answer, ...question }) => question);
      
      res.json({ success: true, data: sanitizedQuestions });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch quiz questions' 
      });
    }
  };

  scoreQuiz = async (req: Request, res: Response): Promise<void> => {
    const submission: QuizSubmission = req.body;

    // Simple validation
    if (!submission?.answers?.length) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid submission' 
      });
      return;
    }

    try {
      const result = await this.questionService.calculateScore(submission);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to score quiz' 
      });
    }
  };
}