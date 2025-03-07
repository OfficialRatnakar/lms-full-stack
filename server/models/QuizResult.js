// models/QuizResult.js
import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedAnswer: { type: String },
        isCorrect: { type: Boolean },
      },
    ],
  },
  { timestamps: true }
);

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;