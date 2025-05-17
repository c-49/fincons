export interface Question {
  _id: string;
  category: number;
  type: 'multiple';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  incorrect_answers: string[];
}

export interface Category {
  id: number;
  name: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
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

export type QuizStatus = 'idle' | 'selecting' | 'taking' | 'viewing-results';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizState {
  status: QuizStatus;
  categories: Category[];
  questions: Question[];
  answers: Record<string, string>;
  selectedCategory: number | null;
  selectedDifficulty: Difficulty;
  questionCount: number;
  result: QuizResult | null;
  loading: boolean;
  error: string | null;
}