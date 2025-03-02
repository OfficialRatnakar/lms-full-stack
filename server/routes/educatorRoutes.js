import express from 'express';
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
  deleteCourse, // Add this
  updateCourse, // Add this
  getCourseById,
} from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router();

// Add Educator Role
educatorRouter.get('/update-role', updateRoleToEducator);

// Add Courses
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse);

// Get Educator Courses
educatorRouter.get('/courses', protectEducator, getEducatorCourses);

// Get Educator Dashboard Data
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData);

// Get Educator Students Data
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData);

// Delete Course
educatorRouter.delete('/courses/:courseId', protectEducator, deleteCourse);

// Update Course
educatorRouter.put('/courses/:courseId', upload.single('image'), protectEducator, updateCourse);

educatorRouter.get('/courses/:courseId', protectEducator, getCourseById);
export default educatorRouter;