import axiosInstance, { endpoints } from './axios';

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get(endpoints.category.getCategories);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch categories');
  }
};

// Fetch all items
export const fetchItems = async () => {
  try {
    const response = await axiosInstance.get(endpoints.item.getItems);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch items');
  }
};

// Search items by name
export const searchItems = async (query) => {
  try {
    const response = await axiosInstance.get(endpoints.item.getItems, {
      params: { search: query },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search items');
  }
};