import axiosInstance from './axiosInstance';

export const fetchArticles = async (category = '', search = '') => {
  const params = {};
  if (category) params.category = category;
  if (search) params.search = search;
  const response = await axiosInstance.get('/articles', { params });
  return response.data;
};

export const fetchArticleBySlug = async (slug) => {
  const response = await axiosInstance.get(`/articles/${slug}`);
  return response.data;
};

export const createArticle = async (articleData) => {
  const response = await axiosInstance.post('/articles', articleData);
  return response.data;
};

export const deleteArticle = async (id) => {
  const response = await axiosInstance.delete(`/articles/${id}`);
  return response.data;
};
