import React, { useEffect, useState } from "react";
import {
  MdDashboard,
  MdOutlineRestaurantMenu,
  MdWindow,
  MdOutlineQrCodeScanner,
  MdLogout,
  MdExpandMore,
} from "react-icons/md";
import {
  FaBoxOpen,
  FaClipboardList,
  FaSearch,
  FaEye,
  FaHome,
} from "react-icons/fa";
import {
  IoMdCheckmarkCircle,
  IoMdLogOut,
  IoMdCloseCircle,
} from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import {
  fetchOrders,
  getAdminData,
  cashPayment,
  declineCashPayment,
} from "../../../api/manageMenuApi.jsx"; // Import the API functions

const ParcelOrder = () => {
  const [manageOrderOpen, setManageOrderOpen] = useState(false);
  const [PaymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("request");
  const [selectedOrder, setSelectedOrder] = useState(null); // For selected order details
  const [showModal, setShowModal] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [adminData, setAdminData] = useState({});

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleManageOrder = () => setManageOrderOpen(!manageOrderOpen);
  const togglePaymentHistory = () => setPaymentHistoryOpen(!PaymentHistoryOpen);

  const handleViewBill = (order) => {
    setSelectedOrder(order); // Set the selected order details
    setShowModal(true); // Open the modal
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
    setSelectedOrder(null); // Reset selected order
  };

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case "request":
        return "Request For Payment";
      case "progress":
        return "In Progress";
      case "delivered":
        return "Delivered";
      default:
        return "";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Adjust this depending on where your user data is stored
    navigate("/login"); // Or any other page
  };

  const handlenavigateprofile = () => {
    navigate("/Profilepage");
  };

  useEffect(() => {
    // Fetch orders
    const fetchData = async () => {
      try {
        const ordersResponse = await fetchOrders();
        setOrders(ordersResponse);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    // Fetch admin data
    const fetchAdmin = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login"); // Redirect to login if no token
        return;
      }

      try {
        const adminResponse = await getAdminData(token);
        if (adminResponse.success) {
          setAdminData(adminResponse.data);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
    fetchAdmin();
  }, [navigate]);

  const handleCashPayment = async (userId) => {
    try {
      const response = await cashPayment(userId);
      if (response.success) {
        alert('Cash payment processed successfully');
        // Optionally, you can refresh the orders list or update the UI
        const updatedOrders = await fetchOrders();
        setOrders(updatedOrders);
      } else {
        alert('Failed to process cash payment');
      }
    } catch (error) {
      console.error('Error processing cash payment:', error);
      alert('An error occurred while processing cash payment');
    }
  };
  
  const handleDeclineCashPayment = async (userId) => {
    try {
      const response = await declineCashPayment(userId);
      if (response.success) { 
        alert('Cash payment declined successfully');
        const updatedOrders = await fetchOrders();
        setOrders(updatedOrders);
      } else {
        alert(response.message || 'Failed to decline cash payment');
      }
    } catch (error) {
      console.error('Error declining cash payment:', error);
      alert('An error occurred while declining cash payment');
    }
  };
  // Filter orders based on status
  const filteredOrders = (status, paymentStatus = null, excludePaymentStatus = null) => {
    return orders.filter((order) => {
      const statusMatch = order.status === status;
      const paymentStatusMatch = paymentStatus ? order.paymentStatus === paymentStatus : true;
      const excludePaymentStatusMatch = excludePaymentStatus ? order.paymentStatus !== excludePaymentStatus : true;
      return statusMatch && paymentStatusMatch && excludePaymentStatusMatch;
    });
  };
  return (
    <>
      {/* Tabs */}
      <div className="flex">
        <button
          onClick={() => setActiveTab("request")}
          className={`px-4 sm:text-xs md:text-base py-2 rounded-ss-lg ${
            activeTab === "request"
              ? "border-b-2 border-yellow-500 text-[#CA923D] bg-[linear-gradient(180deg,_#2D303E_0%,_#422F11_162.79%)]"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Request For Payment
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`px-4 sm:text-xs md:text-base py-2 ${
            activeTab === "progress"
              ? "border-b-2 border-yellow-500 text-[#CA923D] bg-[linear-gradient(180deg,_#2D303E_0%,_#422F11_162.79%)]"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setActiveTab("delivered")}
          className={`px-4 sm:text-xs md:text-base py-2 ${
            activeTab === "delivered"
              ? "border-b-2 border-yellow-500 text-[#CA923D] bg-[linear-gradient(180deg,_#2D303E_0%,_#422F11_162.79%)]"
              : "bg-gray-700 text-gray-300"
          } rounded-e-lg rounded-ee-none`}
        >
          Delivered
        </button>
      </div>

      {/* Tab Content */}
      <div>
      {activeTab === "request" && (
  <div
    className="overflow-auto rounded-ss-none rounded-xl p-4"
    style={{ backgroundColor: "#1F1D2B" }}
  >
    <h1 className="text-2xl font-semibold m-5">Parcel Order</h1>
    <div className="overflow-x-scroll md:overflow-x-hidden sm:w-[567px] md:w-full lg:w-full 2xl:w-full t-data px-5 pb-5 rounded-lg">
      <table className="w-full table-auto text-sm text-left">
        <thead>
          <tr
            className="text-white text-center"
            style={{ backgroundColor: "#CA923D" }}
          >
            <th className="px-6 py-3 rounded-tl-xl">Customer Name</th>
            <th className="px-6 py-3">Items Name</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Time</th>
            <th className="px-6 py-3">Customer Phone</th>
            <th className="px-6 py-3">Quantity</th>
            <th className="px-6 py-3">Total Bill</th>
            <th className="px-6 py-3 rounded-tr-xl">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders("Pending", "pending").length > 0 ? (
            filteredOrders("Pending", "pending").map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-700 hover:bg-gray-700 text-center text-[#ABBBC2]"
              >
                {/* Customer Name */}
                <td className="px-6 py-4">
                  {order.userId ? order.userId.name : "Unknown User"}
                </td>

                {/* Items Name - Combine all item names */}
                <td className="px-6 py-4">
                  {order.items
                    .map((item) =>
                      item.itemId
                        ? item.itemId.itemName
                        : "Unknown Item"
                    )
                    .join(", ")}
                </td>

                {/* Order Date */}
                <td className="px-6 py-4">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>

                {/* Order Time */}
                <td className="px-6 py-4">
                  <span className="bg-[#2D303E] px-2 py-2 rounded-full">
                    {new Date(order.orderDate).toLocaleTimeString()}
                  </span>
                </td>

                {/* Customer Phone */}
                <td className="px-6 py-4">
                  {order.userId ? order.userId.phone : "N/A"}
                </td>

                {/* Total Quantity */}
                <td className="px-6 py-4">
                  {order.items.reduce(
                    (sum, item) => sum + (item.quantity || 0),
                    0
                  )}
                </td>

                {/* Total Bill */}
                <td className="px-6 py-4">
                  <span className="px-4 py-1 bg-[#252836] text-[#39973D] rounded-full">
                    ₹ {order.grandTotal}{" "}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 flex space-x-2 justify-center">
                <button className="text-white" onClick={() => handleCashPayment(order.userId._id)}>
                    {/* <IoMdCheckmarkCircle /> */}
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="40"
                        height="40"
                        rx="10"
                        fill="#2D303E"
                      />
                      <path
                        d="M24.19 10H15.81C12.17 10 10 12.17 10 15.81V24.18C10 27.83 12.17 30 15.81 30H24.18C27.82 30 29.99 27.83 29.99 24.19V15.81C30 12.17 27.83 10 24.19 10ZM24.78 17.7L19.11 23.37C18.97 23.51 18.78 23.59 18.58 23.59C18.38 23.59 18.19 23.51 18.05 23.37L15.22 20.54C14.93 20.25 14.93 19.77 15.22 19.48C15.51 19.19 15.99 19.19 16.28 19.48L18.58 21.78L23.72 16.64C24.01 16.35 24.49 16.35 24.78 16.64C25.07 16.93 25.07 17.4 24.78 17.7Z"
                        fill="#39973D"
                      />
                    </svg>
                  </button>
                  <button className="text-white" onClick={() => handleDeclineCashPayment(order.userId._id)}>
                    {/* <IoMdCloseCircle /> */}
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="40"
                        height="40"
                        rx="10"
                        fill="#2D303E"
                      />
                      <path
                        d="M24.19 10H15.81C12.17 10 10 12.17 10 15.81V24.18C10 27.83 12.17 30 15.81 30H24.18C27.82 30 29.99 27.83 29.99 24.19V15.81C30 12.17 27.83 10 24.19 10ZM23.36 22.3C23.65 22.59 23.65 23.07 23.36 23.36C23.21 23.51 23.02 23.58 22.83 23.58C22.64 23.58 22.45 23.51 22.3 23.36L20 21.06L17.7 23.36C17.55 23.51 17.36 23.58 17.17 23.58C16.98 23.58 16.79 23.51 16.64 23.36C16.35 23.07 16.35 22.59 16.64 22.3L18.94 20L23.36 22.3Z"
                        fill="#E74C3C"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-4 text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}
        {activeTab === "progress" && (
          <div
            className="overflow-auto rounded-ss-none rounded-xl p-4"
            style={{ backgroundColor: "#1F1D2B" }}
          >
            <h1 className="text-2xl font-semibold m-5">Parcel Order</h1>
            <div className="overflow-x-scroll md:overflow-x-hidden sm:w-[567px] md:w-full lg:w-full 2xl:w-full t-data px-5 pb-5 rounded-lg">
              <table className="w-full table-auto text-sm text-center">
                <thead>
                  <tr
                    className="text-white"
                    style={{ backgroundColor: "#CA923D" }}
                  >
                    <th className="px-6 py-3 rounded-tl-xl">Customer Name</th>
                    <th className="px-6 py-3">Items Name</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Customer Phone</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">Total Bill</th>
                    <th className="px-6 py-3 rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders("isProgress").length > 0 ? (
                    filteredOrders("isProgress").map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-700 hover:bg-gray-700 text-center text-[#ABBBC2]"
                      >
                        {/* Customer Name */}
                        <td className="px-6 py-4">{order.userId?.name}</td>

                        {/* Items Name - Combine all item names */}
                        <td className="px-6 py-4">
                          {order.items
                            .map((item) => item.itemId?.itemName)
                            .join(", ")}
                        </td>

                        {/* Order Date */}
                        <td className="px-6 py-4">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>

                        {/* Order Time */}
                        <td className="px-6 py-4">
                          <span className="bg-[#2D303E] px-2 py-2 rounded-full">
                            {new Date(order.orderDate).toLocaleTimeString()}
                          </span>
                        </td>

                        {/* Customer Phone */}
                        <td className="px-6 py-4">{order.userId?.phone}</td>

                        {/* Total Quantity */}
                        <td className="px-6 py-4">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </td>

                        {/* Total Bill */}
                        <td className="px-6 py-4">
                          <span className="px-4 py-1 bg-[#252836] text-[#39973D] rounded-full">
                            ₹{order.grandTotal}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 flex space-x-2 justify-center">
                          <button
                            className=" text-white"
                            onClick={() => handleViewBill(order)}
                          >
                            {/* <FaEye /> */}
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="40"
                                height="40"
                                rx="10"
                                fill="#2D303E"
                              />
                              <path
                                d="M29.25 17.15C26.94 13.52 23.56 11.43 20 11.43C18.22 11.43 16.49 11.95 14.91 12.92C13.33 13.9 11.91 15.33 10.75 17.15C9.75 18.72 9.75 21.27 10.75 22.84C13.06 26.48 16.44 28.56 20 28.56C21.78 28.56 23.51 28.04 25.09 27.07C26.67 26.09 28.09 24.66 29.25 22.84C30.25 21.28 30.25 18.72 29.25 17.15ZM20 24.04C17.76 24.04 15.96 22.23 15.96 20C15.96 17.77 17.76 15.96 20 15.96C22.24 15.96 24.04 17.77 24.04 20C24.04 22.23 22.24 24.04 20 24.04Z"
                                fill="#5678E9"
                              />
                              <path
                                d="M19.9999 17.14C18.4299 17.14 17.1499 18.42 17.1499 20C17.1499 21.57 18.4299 22.85 19.9999 22.85C21.5699 22.85 22.8599 21.57 22.8599 20C22.8599 18.43 21.5699 17.14 19.9999 17.14Z"
                                fill="#5678E9"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === "delivered" && (
          <div
            className="overflow-auto rounded-ss-none rounded-xl p-4"
            style={{ backgroundColor: "#1F1D2B" }}
          >
            <h1 className="text-2xl font-semibold m-5">Parcel Order</h1>
            <div className="overflow-x-scroll md:overflow-x-hidden sm:w-[567px] md:w-full lg:w-full 2xl:w-full t-data px-5 pb-5 rounded-lg">
              <table className="w-full table-auto text-sm text-left">
                <thead>
                  <tr
                    className="text-white text-center"
                    style={{ backgroundColor: "#CA923D" }}
                  >
                    <th className="px-6 py-3 rounded-tl-xl">Customer Name</th>
                    <th className="px-6 py-3">Items Name</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Customer Phone</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">Total Bill</th>
                    <th className="px-6 py-3 rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders("isDelivered").length > 0 ? (
                    filteredOrders("isDelivered").map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-700 hover:bg-gray-700 text-center text-[#ABBBC2]"
                      >
                        {/* Customer Name */}
                        <td className="px-6 py-4">{order.userId?.name}</td>

                        {/* Items Name - Combine all item names */}
                        <td className="px-6 py-4">
                          {order.items
                            .map((item) => item.itemId?.itemName)
                            .join(", ")}
                        </td>

                        {/* Order Date */}
                        <td className="px-6 py-4">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>

                        {/* Order Time */}
                        <td className="px-6 py-4">
                          {new Date(order.orderDate).toLocaleTimeString()}
                        </td>

                        {/* Customer Phone */}
                        <td className="px-6 py-4">{order.userId?.phone}</td>

                        {/* Total Quantity */}
                        <td className="px-6 py-4">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </td>

                        {/* Total Bill */}
                        <td className="px-6 py-4">
                          <span className="px-4 py-1 bg-[#252836] text-[#39973D] rounded-full">
                            ₹{order.grandTotal}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 flex space-x-2 justify-center">
                          <button
                            className=" text-white"
                            onClick={() => handleViewBill(order)}
                          >
                            {/* <FaEye /> */}
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="40"
                                height="40"
                                rx="10"
                                fill="#2D303E"
                              />
                              <path
                                d="M29.25 17.15C26.94 13.52 23.56 11.43 20 11.43C18.22 11.43 16.49 11.95 14.91 12.92C13.33 13.9 11.91 15.33 10.75 17.15C9.75 18.72 9.75 21.27 10.75 22.84C13.06 26.48 16.44 28.56 20 28.56C21.78 28.56 23.51 28.04 25.09 27.07C26.67 26.09 28.09 24.66 29.25 22.84C30.25 21.28 30.25 18.72 29.25 17.15ZM20 24.04C17.76 24.04 15.96 22.23 15.96 20C15.96 17.77 17.76 15.96 20 15.96C22.24 15.96 24.04 17.77 24.04 20C24.04 22.23 22.24 24.04 20 24.04Z"
                                fill="#5678E9"
                              />
                              <path
                                d="M19.9999 17.14C18.4299 17.14 17.1499 18.42 17.1499 20C17.1499 21.57 18.4299 22.85 19.9999 22.85C21.5699 22.85 22.8599 21.57 22.8599 20C22.8599 18.43 21.5699 17.14 19.9999 17.14Z"
                                fill="#5678E9"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal for viewing bill */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
          <div className="bg-[#252836] text-white p-6 rounded-lg max-w-sm w-full shadow-lg">
            {/* Header Section */}
            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
              <h2 className="text-lg font-semibold">Parcel Payment Bill</h2>
              <button
                onClick={closeModal}
                className="text-red-500 font-semibold text-xl"
              >
                &times;
              </button>
            </div>

            {/* Bill Details Section */}
            <div className="mt-4 text-sm">
              <div className="flex justify-between mb-2">
                <p>
                  <strong>Bill No:</strong>GRTHR
                  {orders.findIndex(
                    (order) => order._id === selectedOrder._id
                  ) !== -1
                    ? orders.findIndex(
                        (order) => order._id === selectedOrder._id
                      ) + 1
                    : "N/A"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedOrder.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-between mb-2">
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(selectedOrder.orderDate).toLocaleTimeString()}
                </p>
                <p>
                  <strong>Customer:</strong> {selectedOrder.userId.phone}
                </p>
              </div>
              <div className="flex justify-between mb-2">
                <p>
                  <strong>Name:</strong> {selectedOrder.userId.name}
                </p>
                <p>
                  <strong>Payment:</strong>{" "}
                  <span className="text-green-500">
                    {selectedOrder.paymentMethod}
                  </span>
                </p>
              </div>
            </div>

            {/* Table Header */}
            <div className="mt-4 border-t border-gray-700 pt-2">
              <div className="flex justify-between text-gray-400 text-sm">
                <p className="min-w-[150px]">Items Names</p>
                <p className="min-w-[60px]">Qty</p>
                <p className="min-w-[80px] text-right">Amount</p>
              </div>
              <div className="border-b border-gray-700 my-2"></div>

              {/* Table Content */}
              <div className="text-sm">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between mb-1">
                    <p className="min-w-[150px]">{item.itemId.itemName}</p>
                    <p className="min-w-[60px]">{item.quantity}</p>
                    <p className="min-w-[80px] text-right">
                      {item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section */}
            <div className="mt-4 text-sm">
              <div className="flex justify-between mb-1 font-semibold">
                <p>Total Amount</p>
                <p> {selectedOrder.totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-1">
                <p>SGST 3%</p>
                <p>₹ {(selectedOrder.totalAmount * 0.030).toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-1">
                <p>CGST 3%</p>
                <p>₹ {(selectedOrder.totalAmount * 0.030).toFixed(2)}</p>
              </div>
            </div>

            {/* Grand Total */}
            <div className="mt-4 border-t border-gray-700 pt-2 text-sm font-semibold">
              <div className="flex justify-between">
                <p>Grand Total Amount</p>
                <p>
                  ₹{" "}
                  {(
                    // selectedOrder.totalAmount +
                    // selectedOrder.totalAmount * 0.05
                    selectedOrder.grandTotal
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ParcelOrder;
