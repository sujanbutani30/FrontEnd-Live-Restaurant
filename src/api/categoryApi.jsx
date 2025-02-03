import axiosInstance, { endpoints } from '../axios';

export const fetchCategory = async () => {
    try {
      const response = await axiosInstance.get(endpoints.Catgegory.getCategory);
      // console.log(response,"response-----------------");
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const fetchTredingProduct = async () => {
    try {
      const response = await axiosInstance.get(endpoints.product.getTredingProduct);
      // console.log(response,"response-----------------");
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };