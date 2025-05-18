export interface Question {
  _id?: string;
  category: number;
  type: 'multiple';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Category {
  id: number;
  name: string;
}

export interface QuizQuery {
  category: number;
  difficulty: 'easy' | 'medium' | 'hard';
  amount: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizSubmission {
  answers: QuizAnswer[];
}

export interface QuizResult {
  score: number;
  total: number;
  questions: Array<{
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

// Type guards and utility functions
export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export const QUESTION_TYPES = ['multiple'] as const;

export type Difficulty = typeof DIFFICULTIES[number];

export const isDifficulty = (value: any): value is Difficulty =>
  DIFFICULTIES.includes(value);

export const isValidQuestionType = (value: any): value is 'multiple' =>
  QUESTION_TYPES.includes(value);