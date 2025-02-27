import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const CourseCard = ({ course }) => {
    if (!course) return null; // Prevents errors if course is null or undefined

    const { currency, calculateRating } = useContext(AppContext);

    return (
        <Link 
            onClick={() => scrollTo(0, 0)} 
            to={`/course/${course?._id || ''}`} 
            className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg"
        >
            {/* Course Thumbnail */}
            <img className="w-full h-48 object-cover" src={course?.courseThumbnail || assets.placeholder} alt="Course Thumbnail" />

            <div className="p-3 text-left">
                {/* Course Title */}
                <h3 className="text-base font-semibold">{course?.courseTitle || "Untitled Course"}</h3>

                {/* Educator Name */}
                <p className="text-gray-500">{course?.educator?.name || "Unknown Educator"}</p>

                {/* Ratings */}
                <div className="flex items-center space-x-2">
                    <p>{calculateRating(course) || 0}</p>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <img
                                key={i}
                                className="w-3.5 h-3.5"
                                src={i < Math.floor(calculateRating(course) || 0) ? assets.star : assets.star_blank}
                                alt="star"
                            />
                        ))}
                    </div>
                    <p className="text-gray-500">({course?.courseRatings?.length || 0})</p>
                </div>

                {/* Course Price with Discount Calculation */}
                <p className="text-base font-semibold text-gray-800">
                    {currency}{((course?.coursePrice || 0) - ((course?.discount || 0) * (course?.coursePrice || 0) / 100)).toFixed(2)}
                </p>
            </div>
        </Link>
    );
};

export default CourseCard;
