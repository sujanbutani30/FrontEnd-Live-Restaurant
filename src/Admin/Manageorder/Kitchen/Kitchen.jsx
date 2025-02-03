import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingOrders, acceptOrder } from "../../../api/kitchenApi"; // Import API functions

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch pending orders
  const fetchOrdersData = async () => {
    try {
      const response = await getPendingOrders(); // Get the full response
      setOrders(response.order); // Extract the orders array from the response
    } catch (error) {
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  // Handle accepting an order
  const acceptOrderHandler = async (orderId) => {
    try {
      await acceptOrder(orderId); // Update the order status to "in progress"
      fetchOrdersData(); // Refresh the orders list
      navigate("/deliver"); // Navigate to the deliver page
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-full md:h-screen bg-slate-900 text-white p-4">
      <div
        className="rounded-lg p-5 flex justify-between items-center mb-6"
        style={{ backgroundColor: "#1F1D2B" }}
      >
        <h1 className="text-2xl font-semibold">Order Lists</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Order Pending :</span>
          <span className="text-green-500 text-2xl font-bold">
            {orders.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {orders
          .filter((order) => !order.orderAccepted) // Filter pending orders
          .map((order, index) => (
            <div
              key={order._id || index}
              className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
            >
              <div className="bg-slate-700 p-3 flex justify-between items-center">
                <span className="text-gray-300">Order Type</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.orderType === "Onsite"
                      ? "bg-blue-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {order.orderType || "Unknown"}
                </span>
              </div>
              <div className="p-4 space-y-3">
                {order.orderType === "Onsite" && (
                  <div className="flex justify-between items-center">
                    <span className="text-white">Table No:</span>
                    <span className="bg-gray-700 text-gray-400 px-2 py-1 rounded-md text-sm">
                      {order.tableNumber || "N/A"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <label className="text-base text-white block">
                    Customer Name:
                  </label>
                  <p className="text-gray-400">
                    {order.userId
                      ? order.userId.name || "Anonymous"
                      : "Anonymous"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-base text-white block">
                    Item Quantity:
                  </label>
                  <p className="bg-gray-700 text-blue-400 px-2 py-1 rounded-md text-sm">
                    {order.items.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-base text-white block mb-1">
                    Item Name:
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {order.items.map((item, i) => (
                      <span
                        key={i}
                        className="bg-slate-700 text-gray-400 px-2 py-1 rounded-xl text-sm flex items-center"
                      >
                        {item.cookingRequest} ({item.quantity})
                      </span>
                    ))}
                  </div>
                </div>
                {order.cookingRequest && (
                  <div>
                    <label className="text-sm text-white block">
                      Cooking Request:
                    </label>
                    <p className="text-sm text-gray-400">
                      {order.cookingRequest}
                    </p>
                  </div>
                )}
                {order.items.some((item) => item.customizations.length > 0) && (
                  <div>
                    <label className="text-sm text-white block">
                      Customization:
                    </label>
                    <p className="text-sm text-gray-400">
                      {order.items
                        .flatMap((item) =>
                          item.customizations.map((custom, index) => {
                            const title = custom.title || "No Title";
                            const option = custom.option || "No Option";
                            return `(${index + 1}) ${title}: ${option}`;
                          })
                        )
                        .join(", ")}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => acceptOrderHandler(order._id)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black py-2 rounded-md mt-2 text-center block"
                >
                  Accept Order
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}