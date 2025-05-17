import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { submitQuiz } from '../store/quizSlice';
import { selectQuestions, selectAnswers, selectAllAnswered, selectLoading } from '../store/selectors';
import { QuizQuestion } from './QuizQuestion';

export const QuizContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const questions = useAppSelector(selectQuestions);
  const answers = useAppSelector(selectAnswers);
  const allAnswered = useAppSelector(selectAllAnswered);
  const loading = useAppSelector(selectLoading);

  const handleSubmit = () => {
    dispatch(submitQuiz(answers));
  };

  // Clean progress calculation
  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Quiz in Progress</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p>
          {Object.keys(answers).length} of {questions.length} questions answered
        </p>
      </div>

      <div className="questions">
        {questions.map((question, index) => (
          <QuizQuestion
            key={question._id}
            question={question}
            questionNumber={index + 1}
          />
        ))}
      </div>

      <div className="quiz-footer">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || loading}
          className="submit-quiz-btn"
        >
          {loading ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};