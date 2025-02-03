import axiosInstance from "../axios";
// Define the endpoint for fetching dashboard counts
const DASHBOARD_ENDPOINTS = {
    getCounts: "/dashboard/counts", // Adjust the endpoint as per your backend
};

// Function to fetch dashboard counts
export const getDashboardCounts = async () => {
    try {
        const response = await axiosInstance.get(DASHBOARD_ENDPOINTS.getCounts);
        return response.data; // Return the data from the response
    } catch (error) {
        console.error("Error fetching dashboard counts:", error);
        throw error; // Re-throw the error to handle it in the component
    }
};

const GETPARCEL_ENDPOINTS = {
    getOrderCounts: "/dashboard/order-counts", // Adjust the endpoint as per your backend
};

// Function to fetch order counts
export const getOrderCounts = async () => {
    try {
        const response = await axiosInstance.get(
            GETPARCEL_ENDPOINTS.getOrderCounts
        );
        return response.data; // Return the data from the response
    } catch (error) {
        console.error("Error fetching order counts:", error);
        throw error; // Re-throw the error to handle it in the component
    }
};

const CUSTOMER_VISIT_ENDPOINTS = {
    getCustomerVisit: "/dashboard/counts/date", // Adjust the endpoint as per your backend
};

// Function to fetch customer visit data
export const getCustomerVisit = async () => {
    try {
        const response = await axiosInstance.get(
            CUSTOMER_VISIT_ENDPOINTS.getCustomerVisit
        );
        return response.data; // Return the data from the response
    } catch (error) {
        console.error("Error fetching customer visit data:", error);
        throw error; // Re-throw the error to handle it in the component
    }
};

const TRENDING_DISHES_ENDPOINTS = {
    getTrendingDishes: "/dashboard/popular-dishes",
};

// Function to fetch customer visit data
export const getTrendingDishes = async (filter) => {
    try {
        const response = await axiosInstance.get(
            `${TRENDING_DISHES_ENDPOINTS.getTrendingDishes}?filter=${filter}` // Pass the filter as a query parameter
          );
        return response.data;
    } catch (error) {
        console.error("Error fetching trending dishes:", error);
        throw error;
    }
};

const DISH_DETAILS_ENDPOINT = {
    getDishDetails: "/product/getDishDetails", // Adjust the endpoint as per your backend
};

// Function to fetch dish details by dishId
export const getDishDetails = async (dishId) => {
    try {
        const response = await axiosInstance.get(
            `${DISH_DETAILS_ENDPOINT.getDishDetails}/${dishId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching dish details:", error);
        throw error;
    }
};
