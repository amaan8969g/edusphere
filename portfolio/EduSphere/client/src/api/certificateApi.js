import axiosInstance from './axiosInstance';

export const fetchCourseCertificate = async (courseId) => {
  const response = await axiosInstance.get(`/certificates/course/${courseId}`);
  return response.data;
};

export const fetchMyCertificates = async () => {
  const response = await axiosInstance.get('/certificates/my-certificates');
  return response.data;
};

export const fetchCertificateQR = async (courseId) => {
  const response = await axiosInstance.get(`/certificates/course/${courseId}/qr`);
  return response.data;
};


