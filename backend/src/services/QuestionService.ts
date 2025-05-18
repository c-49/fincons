import { QuestionModel } from '../models/Question';
import { Question, QuizQuery, QuizResult, QuizSubmission } from '../types';

export class QuestionService {
  // Clean, functional approach - no complex conditionals
  async getQuestionsByQuery(query: QuizQuery): Promise<Question[]> {
    const questions = await QuestionModel
      .aggregate([
        { $match: { category: query.category, difficulty: query.difficulty } },
        { $sample: { size: query.amount } }
      ])
      .exec();

    // Randomize answer order using functional approach
    return questions.map(this.randomizeAnswers);
  }

  private randomizeAnswers = (question: Question): Question => {
    const allAnswers = [question.correct_answer, ...question.incorrect_answers];
    const shuffled = allAnswers.sort(() => Math.random() - 0.5);
    
    return {
      ...question,
      incorrect_answers: shuffled
    };
  };

  async calculateScore(submission: QuizSubmission): Promise<QuizResult> {
    const questionIds = submission.answers.map(a => a.questionId);
    const questions = await QuestionModel
      .find({ _id: { $in: questionIds } })
      .lean()
      .exec();

    const questionMap = new Map(questions.map(q => [q._id!.toString(), q]));
    
    const results = submission.answers.map(answer => {
      const question = questionMap.get(answer.questionId);
      const isCorrect = question?.correct_answer === answer.selectedAnswer;
      
      return {
        question: question?.question ?? '',
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question?.correct_answer ?? '',
        isCorrect
      };
    });

    const score = results.filter(r => r.isCorrect).length;

    return {
      score,
      total: submission.answers.length,
      questions: results
    };
  }
}