import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setSelectedCategory, setSelectedDifficulty, setQuestionCount, fetchQuiz } from '../store/quizSlice';
import { selectCategories, selectSelectedCategory, selectSelectedDifficulty, selectQuestionCount, selectLoading } from '../store/selectors';
import { Difficulty } from '../types';

export const CategorySelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const selectedDifficulty = useAppSelector(selectSelectedDifficulty);
  const questionCount = useAppSelector(selectQuestionCount);
  const loading = useAppSelector(selectLoading);

  // Clean, declarative handlers
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedCategory(parseInt(e.target.value)));
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedDifficulty(e.target.value as Difficulty));
  };

  const handleQuestionCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setQuestionCount(parseInt(e.target.value)));
  };

  const handleStartQuiz = () => {
    if (selectedCategory) {
      dispatch(fetchQuiz({
        category: selectedCategory,
        difficulty: selectedDifficulty,
        amount: questionCount,
      }));
    }
  };

  // Clean validation using ternary
  const canStartQuiz = selectedCategory && !loading;

  return (
    <div className="category-selector">
      <h2>Select Quiz Options</h2>
      
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={selectedCategory ?? ''}
          onChange={handleCategoryChange}
          disabled={loading}
        >
          <option value="">Select a category...</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={selectedDifficulty}
          onChange={handleDifficultyChange}
          disabled={loading}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="questionCount">Number of Questions:</label>
        <select
          id="questionCount"
          value={questionCount}
          onChange={handleQuestionCountChange}
          disabled={loading}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      <button
        onClick={handleStartQuiz}
        disabled={!canStartQuiz}
        className="start-quiz-btn"
      >
        {loading ? 'Loading...' : 'Start Quiz'}
      </button>
    </div>
  );
};