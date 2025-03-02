import React from "react";
import { Link, Outlet } from "react-router-dom";
import Footer from '../../components/student/Footer';

const StudentDashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-lg font-bold mb-4">Student Dashboard</h2>
          <ul>
            <li className="mb-2">
              <Link
                to="/my-enrollments"
                className="hover:text-gray-400 transition duration-200"
              >
              My Enrollments
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/messages"
                className="hover:text-gray-400 transition duration-200"
              >
                Messages
              </Link>
            </li>
          </ul>
        </div>

       
      </div>
      <Footer/>
    </div>
  );
};

export default StudentDashboard;