// models/Quiz.js
import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    educator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  },
  { timestamps: true }
);

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;