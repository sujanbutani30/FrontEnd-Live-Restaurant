import axiosInstance, { endpoints } from '../axios';

export const login = async (email, password) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.login, { email, password });
      console.log(response.data);
      
      return response;

    } catch (error) {
      throw error;
    }
  };

export const otpverify = async (data) => {
    try {
        const response = await axiosInstance.post(endpoints.otpverify, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


// Register a new admin
export const registerAdmin = async (data) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.registerAdmin, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // Fetch restaurants
  export const fetchRestaurants = async () => {
    try {
      const response = await axiosInstance.get(endpoints.restaurant.getRestaurant);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // Create a new restaurant
  export const createRestaurant = async (data) => {
    try {
      const response = await axiosInstance.post(endpoints.restaurant.create, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const forgotPassword = async (emailOrPhone) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.forgotPassword, { email: emailOrPhone });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const verifyOtp = async (email, otp) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.verifyOtp, { email, otp });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // Resend OTP
  export const resendOtp = async (email) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.resendOtp, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const resetPassword = async (email, newPassword) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.resetPassword, { email, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const userSignup = async (userData) => {
    try {
      const response = await axiosInstance.post(endpoints.user.signup, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };



  export const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(endpoints.order.getPlacedOrder);
    
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // Fetch Admin Data
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
  