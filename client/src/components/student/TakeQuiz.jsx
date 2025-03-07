import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const { backendUrl, getToken } = useContext(AppContext);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(`${backendUrl}/api/user/quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchQuiz();
  }, [quizId, backendUrl, getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/quiz/${quizId}/submit`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setScore(data.score);
        toast.success(`Your score: ${data.score}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!quiz) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5 w-full">
        <h2 className="text-lg font-medium">{quiz.title}</h2>
        <p>{quiz.description}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {quiz.questions.map((question, index) => (
            <div key={question._id} className="space-y-2">
              <p>{question.questionText}</p>
              {question.options.map((option, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={(e) => {
                      const updatedAnswers = [...answers];
                      updatedAnswers[index] = { questionId: question._id, selectedAnswer: e.target.value };
                      setAnswers(updatedAnswers);
                    }}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TakeQuiz;