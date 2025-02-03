import axios from 'axios';
import Kitchen from './Admin/Manageorder/Kitchen/Kitchen';
import { BASE_URL } from '@/config';

// Define the base URL for your backend
export const BASE_URL_LOCAL = `${BASE_URL}/api/`;

// Create an Axios instance with the base URL and default headers
const axiosInstance = axios.create({
  baseURL: BASE_URL_LOCAL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to include the auth token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define all your endpoints here
export const endpoints = {
  auth: {
    registerAdmin: '/admin/register',
    login: '/admin/login',
    forgotPassword: '/admin/forgot-password',
    verifyOtp: '/admin/verify-otp',
    resendOtp: '/admin/resend-otp',
    resetPassword: '/admin/reset-password',
    getAdmin: '/admin/',
    updateAdmin: '/admin/update'
  },
  restaurant: {
    getRestaurant: '/restaurant/',
    create: '/restaurant/',
  },
  profile: {
    getAdmin: '/admin/',
  },
  user: {
    signup: '/customer/userSignup',
  },
  order: {
    getPlacedOrder: '/place-order/',
    acceptOrder: '/order/accept-order',
    cashPayment: '/place-order/accept-cash-payment',
    declineCashPayment: '/place-order/decline-cash-payment',
    initiatePayment: '/place-order/initiate-payment',
    paymentCallback: '/place-order/payment-callback',

  },
  category: {
    getCategories: '/category/',
    addCategory: '/category/',
    updateCategory: '/category/update/', // Example: /category/update/:id
    deleteCategory: '/category/delete/', // Example: /category/delete/:id
  },
  item: {
    getItems: '/product/getAllItems',
    addItem: '/product/addItem',
    updateItem: '/product/editItem', // Example: /product/editItem/:id
    deleteItem: '/product/deleteItem', // Example: /product/deleteItem/:id
    searchItems: '/product/search', // Example: /product/search?query=...
  },
  cart: {
    getCart: '/cart/',
    addToCart: '/cart/add',
    removeFromCart: '/cart/remove', // Example: /cart/remove/:id
    updateCart: '/cart/update', // Example: /cart/update/:id
  },
  payment: {
    createPayment: '/payment/create',
    verifyPayment: '/payment/verify',
  },
  Catgegory:{
    getCategory: '/category/'
  },
      product:{
        getTredingProduct:'/product/getAllItems'
      },
      Notifications: {
        getNotifications: 'notifications/',
        clear:'notifications/clear'
      },
      Kitchen: {
        getPendingOrders: '/kitchen/pending-order', // Endpoint to get pending orders
        acceptOrder: '/kitchen/accept-order', // Endpoint to accept an order
        deliverOrder: '/kitchen/deliver-order',
        isprogress: '/kitchen/is-progress-order', // Endpoint to deliver an order
      },
}

export default axiosInstance;