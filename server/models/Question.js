// models/Question.js
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);

export default Question;