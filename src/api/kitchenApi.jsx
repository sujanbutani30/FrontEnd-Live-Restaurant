import axiosInstance from "../axios";

const KITCHEN_ENDPOINTS = {
    getPendingOrders: "/kitchen/pending-order", // Endpoint to get pending orders
    acceptOrder: "/kitchen/accept-order", // Endpoint to accept an order
    deliverOrder: "/kitchen/deliver-order", // Endpoint to deliver an order
};

export const getPendingOrders = async () => {
    try {
        const response = await axiosInstance.get(
            KITCHEN_ENDPOINTS.getPendingOrders
        );
        console.log("Pending orders response:", response.data); // Log the response
        return response.data;
    } catch (error) {
        console.error(
            "Error fetching pending orders:",
            error.response ? error.response.data : error.message
        );
        throw new Error(
            error.response
                ? error.response.data.message
                : "Failed to fetch orders"
        );
    }
};

export const acceptOrder = async (orderId) => {
    try {
        const response = await axiosInstance.put(
            `${KITCHEN_ENDPOINTS.acceptOrder}/${orderId}`,
            {
                orderAccepted: true, // Update the order status to "in progress"
                status: "in progress", // Ensure this is the correct status field
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error accepting order:", error);
        throw error;
    }
};

export const deliverOrder = async (orderId) => {
    try {
        const response = await axiosInstance.put(
            `/kitchen/deliver-order/${orderId}`,
            {
                status: "isDelivered", // Update the order status to "delivered"
            }
        );
        console.log("Delivered order response:", response.data); // Log the response
        return response.data;
    } catch (error) {
        console.error("Error delivering order:", error);
        throw error;
    }
}