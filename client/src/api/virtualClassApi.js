import axiosInstance from './axiosInstance';

export const fetchStudentClasses = async () => {
  const response = await axiosInstance.get('/classes/student');
  return response.data;
};

export const fetchInstructorClasses = async () => {
  const response = await axiosInstance.get('/classes/instructor');
  return response.data;
};

export const createVirtualClass = async (classData) => {
  const response = await axiosInstance.post('/classes', classData);
  return response.data;
};

export const joinVirtualClass = async (code) => {
  const response = await axiosInstance.post('/classes/join', { code });
  return response.data;
};

export const fetchClassById = async (id) => {
  const response = await axiosInstance.get(`/classes/${id}`);
  return response.data;
};

export const addClassAnnouncement = async (id, title, content) => {
  const response = await axiosInstance.post(`/classes/${id}/announcements`, { title, content });
  return response.data;
};

export const deleteVirtualClass = async (id) => {
  const response = await axiosInstance.delete(`/classes/${id}`);
  return response.data;
};
