// manageMenuApi.js
import { BASE_URL } from '@/config';
import axiosInstance, { endpoints } from '../axios';

// Fetch all orders
export const fetchOrders = async () => {
  try {
    const response = await axiosInstance.get(endpoints.order.getPlacedOrder);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Accept an order
export const acceptOrder = async (orderId) => {
  try {
    const response = await axiosInstance.patch(`${endpoints.order.acceptOrder}/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch admin data
export const fetchAdminData = async (token) => {
  try {
    const response = await axiosInstance.get(endpoints.auth.getAdmin, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get admin data
export const getAdminData = async (token) => {
  try {
    const response = await axiosInstance.get(endpoints.auth.getAdmin, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Existing functions...
export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get(endpoints.category.getCategories);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addCategory = async (formData) => {
  try {
    const response = await axiosInstance.post(endpoints.category.addCategory, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchItems = async () => {
  try {
    const response = await axiosInstance.get(endpoints.item.getItems);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateItem = async (itemId, updatedItem) => {
  try {
    const response = await axiosInstance.put(`${endpoints.item.updateItem}/${itemId}`, updatedItem);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    const response = await axiosInstance.delete(`${endpoints.item.deleteItem}/${itemId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cashPayment = async (userId ) => {
  try {
    const response = await axiosInstance.post(endpoints.order.cashPayment, {
      userId : userId , // Pass the orderId in the request body
    });
    console.log("Fetching Data:", response);
    return response.data;
  } catch (error) {
    console.error('Error processing cash payment:', error);
    throw error;
  }
};

export const declineCashPayment = async (userId ) => {
  try {
    const response = await axiosInstance.post(endpoints.order.declineCashPayment, {
      userId : userId , // Pass the orderId in the request body
    });
    return response.data;
  } catch (error) {
    console.error('Error declining cash payment:', error);
    throw error;
  }
};

export const fetchParcelPaymentHistory = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${BASE_URL}/api/place-order/payment-history/parcel`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.json();
};

export const fetchOnsitePaymentHistory = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${BASE_URL}/api/place-order/payment-history/onsite`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.json();
};