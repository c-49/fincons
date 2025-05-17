import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setAnswer } from '../store/quizSlice';
import { selectAnswerForQuestion } from '../store/selectors';
import { Question } from '../types';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, questionNumber }) => {
  const dispatch = useAppDispatch();
  const selectedAnswer = useAppSelector(selectAnswerForQuestion(question._id));

  const handleAnswerSelect = (answer: string) => {
    dispatch(setAnswer({ questionId: question._id, answer }));
  };

  // Clean answer rendering without complex conditions
  const renderAnswer = (answer: string, index: number) => {
    const isSelected = selectedAnswer === answer;
    const answerLabel = String.fromCharCode(65 + index); // A, B, C, D

    return (
      <label
        key={answer}
        className={`answer-option ${isSelected ? 'selected' : ''}`}
      >
        <input
          type="radio"
          name={`question-${question._id}`}
          value={answer}
          checked={isSelected}
          onChange={() => handleAnswerSelect(answer)}
        />
        <span className="answer-label">{answerLabel}.</span>
        <span className="answer-text">{answer}</span>
      </label>
    );
  };

  return (
    <div className="quiz-question">
      <h3>Question {questionNumber}</h3>
      <p className="question-text">{question.question}</p>
      <div className="answers">
        {question.incorrect_answers.map(renderAnswer)}
      </div>
    </div>
  );
};