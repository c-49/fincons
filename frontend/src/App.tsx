import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { fetchCategories, clearError } from './store/quizSlice';
import { selectQuizStatus, selectLoading, selectError } from './store/selectors';
import { CategorySelector } from './components/CategorySelector';
import { QuizContainer } from './components/QuizContainer';
import { QuizResults } from './components/QuizResults';
import { LoadingSpinner, ErrorMessage } from './components/utility-components';
import './App.css';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectQuizStatus);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Clean component rendering using object mapping instead of if/else
  const ComponentMap = {
    idle: LoadingSpinner,
    selecting: CategorySelector,
    taking: QuizContainer,
    'viewing-results': QuizResults,
  };

  const CurrentComponent = ComponentMap[status];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Trivia Quiz Challenge</h1>
      </header>

      <main className="app-main">
        {error ? (
          <ErrorMessage 
            message={error} 
            onDismiss={() => dispatch(clearError())}
          />
        ) : (
          <CurrentComponent />
        )}
        
        {loading && status !== 'idle' && (
          <div className="loading-overlay">
            <LoadingSpinner />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;