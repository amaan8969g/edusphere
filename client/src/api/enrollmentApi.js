import axiosInstance from './axiosInstance';

export const enrollCourse = async (courseId) => {
  const response = await axiosInstance.post(`/enrollments/courses/${courseId}/enroll`);
  return response.data;
};

export const fetchMyEnrollments = async () => {
  const response = await axiosInstance.get('/enrollments/my-enrollments');
  return response.data;
};

export const toggleCompleteLesson = async (courseId, lessonId) => {
  const response = await axiosInstance.post(`/enrollments/courses/${courseId}/lessons/${lessonId}/complete`);
  return response.data;
};
