import { BASE_URL } from "@/config";
import axios from "axios";

const BASE_URL = `${BASE_URL}/api`;

// Function to add a new item
export const addItem = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/product/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to fetch categories (if needed)
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/category/`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to fetch items (if needed)
export const fetchItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/product/getAllItems`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};