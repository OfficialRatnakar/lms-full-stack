import { v2 as cloudinary } from 'cloudinary';
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express';

// Create a quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const educator = req.auth.userId;

    // Validate input
    if (!educator) {
      return res.status(400).json({ success: false, message: "Educator ID is missing or invalid." });
    }
    if (!title || !description || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Title, description, and at least one valid question are required." });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(educator)) {
      return res.status(400).json({ success: false, message: "Invalid educator ID." });
    }

    // Create questions
    const createdQuestions = await Question.insertMany(questions);
    if (!createdQuestions || createdQuestions.length === 0) {
      return res.status(400).json({ success: false, message: "Questions could not be created." });
    }

    // Get question IDs
    const questionIds = createdQuestions.map((q) => q._id);

    // Create quiz
    const quiz = new Quiz({
      title,
      description,
      educator,
      questions: questionIds,
    });

    await quiz.save();

    res.status(201).json({ success: true, message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating quiz", error: error.message });
  }
};




// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator',
      },
    });

    res.json({ success: true, message: 'You can publish a course now' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add New Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: 'Thumbnail Not Attached' });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();

    res.json({ success: true, message: 'Course Added' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });

    const totalCourses = courses.length;
    const courseIds = courses.map((course) => course._id);

    // Calculate total earnings from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    });

    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    // Collect unique enrolled student IDs with their course titles
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        'name imageUrl'
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Enrolled Students Data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;

    // Fetch all courses created by the educator
    const courses = await Course.find({ educator });

    // Get the list of course IDs
    const courseIds = courses.map((course) => course._id);

    // Fetch purchases with user and course data
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    })
      .populate('userId', 'name imageUrl')
      .populate('courseId', 'courseTitle');

    // Enrolled students data
    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const educatorId = req.auth.userId;

    // Find the course and ensure it belongs to the educator
    const course = await Course.findOne({ _id: courseId, educator: educatorId });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found or unauthorized' });
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Course
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const educatorId = req.auth.userId;
    const { courseTitle, coursePrice, discount } = req.body;

    // Find the course and ensure it belongs to the educator
    const course = await Course.findOne({ _id: courseId, educator: educatorId });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found or unauthorized' });
    }

    // Update course details
    course.courseTitle = courseTitle;
    course.coursePrice = coursePrice;
    course.discount = discount;

    // Handle image upload if provided
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path);
      course.courseThumbnail = imageUpload.secure_url;
    }

    await course.save();

    res.json({ success: true, message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseById = async (req, res) => {
    try {
      const { courseId } = req.params;
      const educatorId = req.auth.userId;
  
      // Find the course and ensure it belongs to the educator
      const course = await Course.findOne({ _id: courseId, educator: educatorId });
  
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found or unauthorized' });
      }
  
      res.json({ success: true, course });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };