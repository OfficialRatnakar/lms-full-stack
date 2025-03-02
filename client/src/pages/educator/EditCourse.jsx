import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditCourse = () => {
  const { courseId } = useParams();
  const { backendUrl, getToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);

  // Fetch course details
  const fetchCourse = async () => {
    try {
      const token = await getToken();

      // Log the course ID and URL for debugging
      console.log('Fetching course with ID:', courseId);
      console.log('URL:', `${backendUrl}/api/educator/courses/${courseId}`);

      const { data } = await axios.get(`${backendUrl}/api/educator/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourse(data.course);
        setCourseTitle(data.course.courseTitle);
        setCoursePrice(data.course.coursePrice);
        setDiscount(data.course.discount);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId, backendUrl, getToken]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('courseTitle', courseTitle);
      formData.append('coursePrice', coursePrice);
      formData.append('discount', discount);
      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.put(
        `${backendUrl}/api/educator/courses/${courseId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        navigate('/educator/my-courses');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h1>Edit Course</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="Course Title"
          required
        />
        <input
          type="number"
          value={coursePrice}
          onChange={(e) => setCoursePrice(e.target.value)}
          placeholder="Course Price"
          required
        />
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="Discount"
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditCourse;