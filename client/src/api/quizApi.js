import axiosInstance from './axiosInstance';

export const fetchQuizByLesson = async (lessonId) => {
  const response = await axiosInstance.get(`/quizzes/lessons/${lessonId}`);
  return response.data;
};

export const fetchQuizById = async (quizId) => {
  const response = await axiosInstance.get(`/quizzes/${quizId}`);
  return response.data;
};

export const fetchAptitudeQuizzes = async () => {
  const response = await axiosInstance.get('/quizzes/aptitude');
  return response.data;
};

export const fetchAptitudeQuizByCategory = async (category) => {
  const response = await axiosInstance.get(`/quizzes/aptitude/${category}`);
  return response.data;
};

export const createCustomQuiz = async (quizData) => {
  const response = await axiosInstance.post('/quizzes', quizData);
  return response.data;
};

export const fetchInstructorQuizzes = async () => {
  const response = await axiosInstance.get('/quizzes/instructor');
  return response.data;
};

export const submitQuiz = async (quizId, answers, securityMetrics = {}) => {
  const response = await axiosInstance.post(`/quizzes/${quizId}/submit`, {
    answers,
    tabSwitchesCount: securityMetrics.tabSwitchesCount || 0,
    timeSpentSeconds: securityMetrics.timeSpentSeconds || 0,
    autoSubmitted: !!securityMetrics.autoSubmitted,
  });
  return response.data;
};
