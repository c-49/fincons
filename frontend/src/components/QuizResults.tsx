import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { resetQuiz } from '../store/quizSlice';
import { selectQuizResult, selectScoreColor } from '../store/selectors';

export const QuizResults: React.FC = () => {
  const dispatch = useAppDispatch();
  const result = useAppSelector(selectQuizResult);
  const scoreColor = useAppSelector(selectScoreColor);

  const handleStartNewQuiz = () => {
    dispatch(resetQuiz());
  };

  if (!result) return null;

  const scorePercentage = Math.round((result.score / result.total) * 100);

  return (
    <div className="quiz-results">
      <h2>Quiz Results</h2>
      
      <div className={`score-summary ${scoreColor}`}>
        <div className="score-circle">
          <span className="score-text">
            {result.score}/{result.total}
          </span>
          <span className="score-percentage">
            {scorePercentage}%
          </span>
        </div>
      </div>

      <div className="results-list">
        <h3>Question Review</h3>
        {result.questions.map((q, index) => (
          <div key={index} className={`result-item ${q.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="question-number">
              Question {index + 1}
            </div>
            <div className="question-text">
              {q.question}
            </div>
            <div className="answers">
              <div className={`answer your-answer ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                Your answer: {q.selectedAnswer}
              </div>
              {!q.isCorrect && (
                <div className="answer correct-answer">
                  Correct answer: {q.correctAnswer}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="results-footer">
        <button onClick={handleStartNewQuiz} className="new-quiz-btn">
          Start New Quiz
        </button>
      </div>
    </div>
  );
};