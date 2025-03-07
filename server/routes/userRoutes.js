import express from 'express'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses,
    getQuiz,
    submitQuiz,
    getQuizResults} from '../controllers/userController.js';
import { protectStudent } from '../middlewares/authMiddleware.js';

const userRouter = express.Router()


userRouter.get('/data', getUserData)
userRouter.post('/purchase', purchaseCourse)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/update-course-progress', updateUserCourseProgress)
userRouter.post('/get-course-progress', getUserCourseProgress)
userRouter.post('/add-rating', addUserRating)
userRouter.get('/:quizId', protectStudent, getQuiz);
userRouter.post('/:quizId/submit', protectStudent, submitQuiz);
userRouter.get('/results/:studentId', protectStudent, getQuizResults);

export default userRouter;