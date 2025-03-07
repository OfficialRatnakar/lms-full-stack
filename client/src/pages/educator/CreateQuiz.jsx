import React, { useContext, useState } from 'react'; // Import useContext and useState
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateQuiz = () => {
  const { backendUrl, getToken } = useContext(AppContext); // Now useContext is defined
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    questions: [],
  });
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        { questionText: '', options: ['', '', '', ''], correctAnswer: '' },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      
      const { data } = await axios.post(
        `${backendUrl}/api/educator/quiz`,
        quizData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success('Quiz created successfully!');
        setQuizData({ title: '', description: '', questions: [] });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5 w-full">
        <h2 className="text-lg font-medium">Create Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Quiz Title</label>
            <input
              type="text"
              value={quizData.title}
              onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Quiz Description</label>
            <textarea
              value={quizData.description}
              onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {quizData.questions.map((question, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-gray-700">Question {index + 1}</label>
              <input
                type="text"
                placeholder="Question"
                value={question.questionText}
                onChange={(e) => {
                  const updatedQuestions = [...quizData.questions];
                  updatedQuestions[index].questionText = e.target.value;
                  setQuizData({ ...quizData, questions: updatedQuestions });
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              {question.options.map((option, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={option}
                  onChange={(e) => {
                    const updatedQuestions = [...quizData.questions];
                    updatedQuestions[index].options[i] = e.target.value;
                    setQuizData({ ...quizData, questions: updatedQuestions });
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              ))}
              <input
                type="text"
                placeholder="Correct Answer"
                value={question.correctAnswer}
                onChange={(e) => {
                  const updatedQuestions = [...quizData.questions];
                  updatedQuestions[index].correctAnswer = e.target.value;
                  setQuizData({ ...quizData, questions: updatedQuestions });
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Question
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;