// backend/src/models/Question.ts
import mongoose, { Document, Schema } from 'mongoose';
import { Question as IQuestion } from '../types';

interface QuestionDocument extends IQuestion, Document {}

const questionSchema = new Schema<QuestionDocument>({
  category: { type: Number, required: true },
  type: { type: String, required: true, enum: ['multiple'] },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  question: { type: String, required: true },
  correct_answer: { type: String, required: true },
  incorrect_answers: [{ type: String, required: true }]
});

// Index for efficient querying
questionSchema.index({ category: 1, difficulty: 1 });

export const QuestionModel = mongoose.model<QuestionDocument>('Question', questionSchema);