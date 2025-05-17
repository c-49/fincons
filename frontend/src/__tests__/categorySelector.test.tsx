import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { CategorySelector } from '../components/CategorySelector';
import { setSelectedCategory, setSelectedDifficulty, fetchQuiz } from '../store/quizSlice';

// Mock Redux store
const mockStore = configureStore([]);

// Mock actions
jest.mock('../store/quizSlice', () => ({
  setSelectedCategory: jest.fn(() => ({ type: 'quiz/setSelectedCategory' })),
  setSelectedDifficulty: jest.fn(() => ({ type: 'quiz/setSelectedDifficulty' })),
  setQuestionCount: jest.fn(() => ({ type: 'quiz/setQuestionCount' })),
  fetchQuiz: jest.fn(() => ({ type: 'quiz/fetchQuiz' })),
}));

describe('CategorySelector', () => {
  let store: any;

  beforeEach(() => {
    // Initial state
    const initialState = {
      quiz: {
        categories: [
          { id: 9, name: 'General Knowledge' },
          { id: 10, name: 'Books' },
        ],
        selectedCategory: null,
        selectedDifficulty: 'easy',
        questionCount: 5,
        loading: false,
      },
    };

    store = mockStore(initialState);
  });

  it('renders category dropdown with options', () => {
    // Arrange
    render(
      <Provider store={store}>
        <CategorySelector />
      </Provider>
    );

    // Act & Assert
    expect(screen.getByText('Select Quiz Options')).toBeInTheDocument();
    expect(screen.getByLabelText('Category:')).toBeInTheDocument();
    
    const categorySelect = screen.getByLabelText('Category:');
    expect(categorySelect).toHaveValue('');

    // Should have a default option and 2 categories
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Select a category...');
    expect(options[1]).toHaveTextContent('General Knowledge');
  });

  it('dispatches setSelectedCategory when category changes', () => {
    // Arrange
    render(
      <Provider store={store}>
        <CategorySelector />
      </Provider>
    );

    // Act
    const categorySelect = screen.getByLabelText('Category:');
    fireEvent.change(categorySelect, { target: { value: '9' } });

    // Assert
    expect(setSelectedCategory).toHaveBeenCalledWith(9);
    expect(store.getActions()).toEqual([{ type: 'quiz/setSelectedCategory' }]);
  });

  it('dispatches fetchQuiz when start button is clicked', () => {
    // Arrange
    const storeWithCategory = mockStore({
      quiz: {
        categories: [
          { id: 9, name: 'General Knowledge' },
          { id: 10, name: 'Books' },
        ],
        selectedCategory: 9,
        selectedDifficulty: 'easy',
        questionCount: 5,
        loading: false,
      },
    });

    render(
      <Provider store={storeWithCategory}>
        <CategorySelector />
      </Provider>
    );

    // Act
    const startButton = screen.getByText('Start Quiz');
    fireEvent.click(startButton);

    // Assert
    expect(fetchQuiz).toHaveBeenCalledWith({
      category: 9,
      difficulty: 'easy',
      amount: 5,
    });
    expect(storeWithCategory.getActions()).toEqual([{ type: 'quiz/fetchQuiz' }]);
  });

  it('disables start button when no category selected', () => {
    // Arrange
    render(
      <Provider store={store}>
        <CategorySelector />
      </Provider>
    );

    // Act & Assert
    const startButton = screen.getByText('Start Quiz');
    expect(startButton).toBeDisabled();
  });
});