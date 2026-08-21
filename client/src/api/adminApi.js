import axiosInstance from './axiosInstance';

export const fetchAdminStats = async () => {
  const response = await axiosInstance.get('/admin/stats');
  return response.data;
};

export const fetchAdminUsers = async (params) => {
  const response = await axiosInstance.get('/admin/users', { params });
  return response.data;
};

export const fetchPendingInstructors = async () => {
  const response = await axiosInstance.get('/admin/instructors/pending');
  return response.data;
};

export const approveInstructor = async (id) => {
  const response = await axiosInstance.patch(`/admin/instructors/${id}/approve`);
  return response.data;
};

export const rejectInstructor = async (id) => {
  const response = await axiosInstance.patch(`/admin/instructors/${id}/reject`);
  return response.data;
};

export const updateUserRole = async (id, payload) => {
  const response = await axiosInstance.put(`/admin/users/${id}/role`, payload);
  return response.data;
};
