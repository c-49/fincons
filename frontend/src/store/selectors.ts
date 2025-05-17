import { RootState } from './index';

export const selectQuizStatus = (state: RootState) => state.quiz.status;
export const selectCategories = (state: RootState) => state.quiz.categories;
export const selectQuestions = (state: RootState) => state.quiz.questions;
export const selectAnswers = (state: RootState) => state.quiz.answers;
export const selectSelectedCategory = (state: RootState) => state.quiz.selectedCategory;
export const selectSelectedDifficulty = (state: RootState) => state.quiz.selectedDifficulty;
export const selectQuestionCount = (state: RootState) => state.quiz.questionCount;
export const selectQuizResult = (state: RootState) => state.quiz.result;
export const selectLoading = (state: RootState) => state.quiz.loading;
export const selectError = (state: RootState) => state.quiz.error;

// Computed selectors
export const selectAllAnswered = (state: RootState) => {
  const { questions, answers } = state.quiz;
  return questions.length > 0 && questions.every(q => answers[q._id]);
};

export const selectCurrentQuestion = (index: number) => (state: RootState) => 
  state.quiz.questions[index];

export const selectAnswerForQuestion = (questionId: string) => (state: RootState) =>
  state.quiz.answers[questionId];

export const selectIsQuizComplete = (state: RootState) =>
  state.quiz.status === 'viewing-results';

export const selectScoreColor = (state: RootState) => {
  const result = state.quiz.result;
  if (!result) return 'gray';
  
  const percentage = (result.score / result.total) * 100;
  return percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red';
};