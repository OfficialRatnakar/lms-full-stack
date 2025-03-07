import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const QuizHistory = () => {
  const { backendUrl, getToken, user } = useContext(AppContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const { data } = await axios.get(`${backendUrl}/api/user/quiz/results/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [backendUrl, getToken, user]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5 w-full">
        <h2 className="text-lg font-medium">Quiz History</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed md:table-auto w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Quiz Title</th>
                <th className="px-4 py-3 font-semibold">Score</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {results.map((result, index) => (
                <tr key={index} className="border-b border-gray-500/20">
                  <td className="px-4 py-3">{result.quiz.title}</td>
                  <td className="px-4 py-3">
                    {result.score} / {result.totalQuestions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuizHistory;