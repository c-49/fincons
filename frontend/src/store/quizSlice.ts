import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuizState, Category, Question, QuizResult, Difficulty } from '../types';
import { api } from '../services/api';

const initialState: QuizState = {
  status: 'idle',
  categories: [],
  questions: [],
  answers: {},
  selectedCategory: null,
  selectedDifficulty: 'easy',
  questionCount: 5,
  result: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'quiz/fetchCategories',
  async () => {
    const response = await api.getCategories();
    return response.data;
  }
);

export const fetchQuiz = createAsyncThunk(
  'quiz/fetchQuiz',
  async ({ category, difficulty, amount }: { 
    category: number; 
    difficulty: Difficulty; 
    amount: number; 
  }) => {
    const response = await api.getQuiz(category, difficulty, amount);
    return response.data;
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submitQuiz',
  async (answers: Record<string, string>) => {
    const answersArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId,
      selectedAnswer,
    }));
    
    const response = await api.submitQuiz({ answers: answersArray });
    return response.data;
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<number>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state.selectedDifficulty = action.payload;
    },
    setQuestionCount: (state, action: PayloadAction<number>) => {
      state.questionCount = action.payload;
    },
    setAnswer: (state, action: PayloadAction<{ questionId: string; answer: string }>) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },
    resetQuiz: (state) => {
      state.status = 'idle';
      state.questions = [];
      state.answers = {};
      state.result = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
        state.status = 'selecting';
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch categories';
      })
      
    // Fetch quiz
    builder
      .addCase(fetchQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action: PayloadAction<Question[]>) => {
        state.loading = false;
        state.questions = action.payload;
        state.answers = {};
        state.status = 'taking';
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch quiz';
      })
      
    // Submit quiz
    builder
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action: PayloadAction<QuizResult>) => {
        state.loading = false;
        state.result = action.payload;
        state.status = 'viewing-results';
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to submit quiz';
      });
  },
});

export const {
  setSelectedCategory,
  setSelectedDifficulty,
  setQuestionCount,
  setAnswer,
  resetQuiz,
  clearError,
} = quizSlice.actions;

export default quizSlice.reducer;