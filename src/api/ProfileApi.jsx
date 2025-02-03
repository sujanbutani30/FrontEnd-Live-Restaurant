import axiosInstance, { endpoints } from '../axios';

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

  export const updatePassword = async (token, userId, oldPassword, newPassword) => {
    try {
      const response = await axiosInstance.post(
        endpoints.auth.resetPassword,
        {
          id: userId,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getAdminById = async (adminId) => {
    try {
      const response = await axiosInstance.get(`${endpoints.auth.getAdmin}${adminId}`); 
      console.log('getAdmin  Response:', response);   
        return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const updateAdmin = async (adminId, updatedAdminData) => {
    try {
      const response = await axiosInstance.put(endpoints.auth.updateAdmin,
        updatedAdminData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
