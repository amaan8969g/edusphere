import axiosInstance from './axiosInstance';

export const askAITutor = async (payload) => {
  const response = await axiosInstance.post('/ai/ask', payload);
  return response.data;
};

export const generateQuizFromNotes = async (payload) => {
  const response = await axiosInstance.post('/ai/generate-quiz', payload);
  return response.data;
};

export const saveConversation = async (payload) => {
  const response = await axiosInstance.post('/ai/conversations', payload);
  return response.data;
};

export const fetchConversations = async () => {
  const response = await axiosInstance.get('/ai/conversations');
  return response.data;
};
