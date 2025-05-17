import { Router } from 'express';
import { QuizController } from '../controllers/quizController';

const router = Router();
const quizController = new QuizController();

router.get('/', quizController.getQuiz);
router.post('/score', quizController.scoreQuiz);

export { router as quizRoutes };