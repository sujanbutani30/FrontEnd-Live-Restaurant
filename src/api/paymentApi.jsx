import axiosInstance, { endpoints } from '../axios';

export const initiateRazorpayPayment = async (userId) => {
  const response = await axiosInstance.post(endpoints.order.initiatePayment, { userId });
  return response.data;
};

export const handleRazorpayCallback = async (userId, razorpayPaymentId) => {
  const response = await axiosInstance.post(endpoints.order.paymentCallback, { userId, razorpayPaymentId });
  return response.data;
};

export const handleCashPayment = async (userId) => {
  const response = await axiosInstance.post(endpoints.order.cashPayment, { userId });
  return response.data;
};