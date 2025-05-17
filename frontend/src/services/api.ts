import axios from 'axios';
import { Category, Question, QuizResult } from '../types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const api = {
  async getCategories(): Promise<{ data: Category[] }> {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  async getQuiz(
    category: number, 
    difficulty: string, 
    amount: number
  ): Promise<{ data: Question[] }> {
    const response = await apiClient.get('/quiz', {
      params: { category, difficulty, amount },
    });
    return response.data;
  },

  async submitQuiz(submission: { 
    answers: Array<{ questionId: string; selectedAnswer: string }> 
  }): Promise<{ data: QuizResult }> {
    const response = await apiClient.post('/quiz/score', submission);
    return response.data;
  },
};