"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBoxOpen, FaClipboardList, FaSearch } from "react-icons/fa";
import {
  MdWindow,
  MdOutlineRestaurantMenu,
  MdOutlineQrCodeScanner,
  MdExpandMore,
} from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { deliverOrder } from "../../../api/kitchenApi"; // Import API functions
import axiosInstance from "../../../axios";
import { endpoints } from "../../../axios";
import { BASE_URL } from '@/config';

export default function Deliver() {
  const [manageOrderOpen, setManageOrderOpen] = useState(false);
  const [PaymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [adminData, setAdminData] = useState({});
  const navigate = useNavigate();

  const handlenavigateprofile = () => {
    navigate("/Profilepage");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get(`${BASE_URL}/api/v1/adminedit/getadmin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setAdminData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching admin data:", error);
      });
  }, []);

  const toggleManageOrder = () => {
    setManageOrderOpen(!manageOrderOpen);
  };

  const togglePaymentHistory = () => {
    setPaymentHistoryOpen(!PaymentHistoryOpen);
  };

  const handleDelivered = async (orderId) => {
    try {
      console.log("Delivering order:", orderId); // Debugging
      const response = await deliverOrder(orderId); // Call the API to update the status
      console.log("API Response:", response); // Debugging
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error delivering order:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(endpoints.Kitchen.isprogress);
      if (!response.data) throw new Error("No data received");
      console.log("Fetched Orders:", response.data); // Log the fetched data
      setOrders(response.data.orders); // Extract the orders array from the response
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const calculatePendingOrders = () => {
    return orders.filter((order) => order.status !== "isDelivered").length;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <main className="flex-1 ml-0 sm:w-svw p-6 bg-gray-900">
        {/* Delivery Dashboard Content */}
        <div className="bg-slate-900 text-white p-4">
          <div
            className="rounded-lg p-5 flex justify-between items-center mb-6"
            style={{ backgroundColor: "#1F1D2B" }}
          >
            <h1 className="text-2xl font-semibold">Order Lists</h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Order Pending :</span>
              <span className="text-green-500 text-2xl font-bold">
                {calculatePendingOrders()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {orders.map((order, index) => (
              <div
                key={order._id || index}
                className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
              >
                <div className="bg-slate-700 p-3 flex justify-between items-center">
                  <span className="text-gray-300">Order Type</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.orderType === "Onsite"
                        ? "bg-[#5678E9] text-white"
                        : "bg-[#39973D] text-white"
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
                      {order.userId?.name || "Anonymous"}
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
                          {item.itemId ? item.itemId.itemName : "Unknown Item"} ({item.quantity})
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
                  {order.items.some(
                    (item) => item.customizations.length > 0
                  ) && (
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
                  <div className="flex justify-between">
                    {order.status !== "isDelivered" && (
                      <p className="text-yellow-500 mt-3 flex">
                        <GoDotFill className="mt-1 text-lg" /> in progress
                      </p>
                    )}

                    {order.status !== "isDelivered" && (
                      <button
                        className={`w-24 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mt-2`}
                        onClick={() => handleDelivered(order._id)}
                      >
                        Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}