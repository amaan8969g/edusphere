import axiosInstance from './axiosInstance';

export const fetchCourses = async (params) => {
  const response = await axiosInstance.get('/courses', { params });
  return response.data;
};

export const fetchCourseBySlug = async (idOrSlug) => {
  const response = await axiosInstance.get(`/courses/${idOrSlug}`);
  return response.data;
};

export const createCourse = async (formData) => {
  const response = await axiosInstance.post('/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateCourse = async (id, formData) => {
  const response = await axiosInstance.put(`/courses/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const togglePublishCourse = async (id) => {
  const response = await axiosInstance.patch(`/courses/${id}/toggle-publish`);
  return response.data;
};

export const fetchInstructorCourses = async () => {
  const response = await axiosInstance.get('/courses/instructor-courses');
  return response.data;
};

export const addModule = async (courseId, moduleData) => {
  const response = await axiosInstance.post(`/courses/${courseId}/modules`, moduleData);
  return response.data;
};

export const addLesson = async (moduleId, formData) => {
  const response = await axiosInstance.post(`/courses/modules/${moduleId}/lessons`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteModule = async (id) => {
  const response = await axiosInstance.delete(`/courses/modules/${id}`);
  return response.data;
};

export const deleteLesson = async (id) => {
  const response = await axiosInstance.delete(`/courses/lessons/${id}`);
  return response.data;
};
