import React, { useState, useEffect } from "react";
import {
  MdDashboard,
  MdOutlineRestaurantMenu,
  MdOutlineQrCodeScanner,
  MdLogout,
  MdExpandMore,
  MdWindow,
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
  IoMdCloseCircle,
  IoMdLogOut,
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
  fetchRestaurants,
} from "../../../api/authApi"; // Import API functions

const OnsiteOrder = () => {
  const [manageOrderOpen, setManageOrderOpen] = useState(false);
  const [PaymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("progress");
  const [selectedOrder, setSelectedOrder] = useState(null); // For selected order details
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [adminData, setAdminData] = useState({});
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Add isOpen to state
  const [loading, setLoading] = useState(true); // Loading state

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleManageOrder = () => setManageOrderOpen(!manageOrderOpen);
  const togglePaymentHistory = () => setPaymentHistoryOpen(!PaymentHistoryOpen);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Adjust this depending on where your user data is stored
    navigate("/login"); // Or any other page
  };

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

  const handlenavigateprofile = () => {
    navigate("/Profilepage");
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case "progress":
        return "In Progress";
      case "delivered":
        return "Order History";
      default:
        return "";
    }
  };

  // Fetch Admin Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const adminResponse = await getAdminData(token);
        console.log("Admin Response:", adminResponse);
        if (adminResponse.success) {
          setAdminData(adminResponse.data);
        }

        const restaurantResponse = await fetchRestaurants();
        console.log("Restaurant Response:", restaurantResponse);
        setRestaurants(restaurantResponse);

        const ordersResponse = await fetchOrders();
        console.log("Orders Response:", ordersResponse);
        setOrders(ordersResponse);
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <>
      {/* Tabs */}
      <div className="flex">
        <button
          onClick={() => setActiveTab("progress")}
          className={`px-4 py-2 rounded-ss-lg ${
            activeTab === "progress"
              ? "border-b-2 border-yellow-500 text-[#CA923D] bg-[linear-gradient(180deg,_#2D303E_0%,_#422F11_162.79%)]"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setActiveTab("delivered")}
          className={`px-4 py-2 ${
            activeTab === "delivered"
              ? "border-b-2 border-yellow-500 text-[#CA923D] bg-[linear-gradient(180deg,_#2D303E_0%,_#422F11_162.79%)]"
              : "bg-gray-700 text-gray-300"
          } rounded-e-lg rounded-ee-none`}
        >
          Order History
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "progress" && (
          <div
            className="overflow-auto rounded-ss-none rounded-r-lg rounded-bl-lg"
            style={{ backgroundColor: "#1F1D2B" }}
          >
            <h1 className="text-2xl font-semibold m-5">Onsite Order</h1>
            <div className="m-6 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 ">
              {orders.filter((order) => order.status === "Done").length > 0 ? (
                orders
                  .filter((order) => order.status === "Done")
                  .map((order) => (
                    <div
                      key={order._id}
                      className="bg-[#252836] p-4 rounded-lg shadow-md space-y-2"
                      style={{ border: "1px solid #ffffff38" }}
                    >
                      <div className="flex items-center justify-between">
                        <h2
                          className="text-xl font-semibold"
                          style={{ color: "#CA8631" }}
                        >
                          ₹
                          {new Intl.NumberFormat("en-IN").format(
                            order.totalAmount
                          )}
                        </h2>
                        <button className="bg-[#CA8631] text-white text-xs px-3 py-1 rounded-full">
                          Bill Paid
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          className="text-blue-500 text-md"
                          style={{ color: "#5678E9" }}
                          onClick={() => handleViewBill(order)}
                        >
                          View Bill
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-white text-lg">
                  No orders found with status "Done".
                </div>
              )}
            </div>
            <h1 className="text-2xl font-semibold m-3">Occupied</h1>
            <div className="m-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {/* Occupied Tables */}
              {orders.filter((order) => order.status === "Done").length > 0 ? (
                orders
                  .filter((order) => order.status === "Done")
                  .map((order) => (
                    <div
                      key={order._id}
                      className="bg-[#252836] p-4 rounded-lg shadow-md space-y-2"
                      style={{ border: "1px solid #ffffff38" }}
                    >
                      <div className="flex items-center justify-between">
                        <h2
                          className="text-lg font-semibold"
                          style={{ color: "white" }}
                        >
                          Total Items:{" "}
                          <span style={{ color: "#CA923D" }}>
                            {order.items.length}
                          </span>
                        </h2>
                        <button
                          className="bg-[#CA8631] text-white text-md px-3 py-1 rounded"
                          style={{ backgroundColor: "#2D303E" }}
                        >
                          <FaEye
                            style={{ color: "#5678E9" }}
                            onClick={() => handleViewBill(order)}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3
                          className="text-md font-semibold"
                          style={{ color: "white" }}
                        >
                          Total Bill:{" "}
                          <span style={{ color: "#CA923D" }}>
                            ₹
                            {new Intl.NumberFormat("en-IN").format(
                              order.totalAmount
                            )}
                          </span>
                        </h3>
                        <p
                          className="text-gray-600 text-xl font-bold"
                          style={{ color: "#463D37", fontSize: "25px" }}
                        >
                          {order._id.toString().padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-white text-lg">
                  No orders found with status "Done".
                </div>
              )}
            </div>
            <h1 className="text-2xl font-semibold m-3">Vacate</h1>
            <div className="m-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Vacant Tables */}
              {[...Array(Math.max(0, 16 - orders.length))].map((_, index) => (
                <div
                  key={index}
                  className="bg-[#252836] p-4 rounded-lg shadow-md text-center text-gray-400 flex items-center justify-between"
                  style={{ border: "1px solid #ffffff38" }}
                >
                  <h3
                    className="text-md font-semibold"
                    style={{ color: "#ABBBC2" }}
                  >
                    Table No
                  </h3>
                  <p
                    className="text-gray-600 text-xl font-bold"
                    style={{ color: "#463D37", fontSize: "25px" }}
                  >
                    {index + orders.length + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "delivered" && (
          <div
            className="overflow-auto rounded-ss-none rounded-xl p-4"
            style={{ backgroundColor: "#1F1D2B" }}
          >
            <h1 className="text-2xl font-semibold m-5">Onsite Orde</h1>
            <div className="overflow-x-scroll md:overflow-x-hidden sm:w-[567px] md:w-full lg:w-full 2xl:w-full t-data px-5 pb-5">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr
                    className="text-white text-center "
                    style={{ backgroundColor: "#CA923D" }}
                  >
                    <th className="px-6 py-3 rounded-tl-xl">Customer Name</th>
                    <th className="px-6 py-3">Customer Phone</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Time</th>
                    
                    <th className="px-6 py-3">Total Amount</th>
                    <th className="px-6 py-3 rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => {
                      // Check if userId is not null
                      const userName = order.userId ? order.userId.name : "N/A";
                      const userPhone = order.userId
                        ? order.userId.phone
                        : "N/A";

                      return (
                        <tr
                          key={order._id}
                          className="border-b text-center text-[#ABBBC2] border-gray-700 hover:bg-gray-700"
                        >
                          <td className="px-6 py-4">{userName}</td>
                          <td className="px-6 py-4">{userPhone}</td>
                          <td className="px-6 py-4">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(order.orderDate).toLocaleTimeString()}
                          </td>
                        
                          <td className="px-6 py-4">{order.totalAmount}</td>
                          <td className="px-6 py-4 flex space-x-2">
                            <button
                              className=" text-white"
                              onClick={() => handleViewBill(order)}
                            >
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
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No orders found
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
                <p>SGST 2.5%</p>
                <p>₹ {(selectedOrder.totalAmount * 0.025).toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-1">
                <p>CGST 2.5%</p>
                <p>₹ {(selectedOrder.totalAmount * 0.025).toFixed(2)}</p>
              </div>
            </div>

            {/* Grand Total */}
            <div className="mt-4 border-t border-gray-700 pt-2 text-sm font-semibold">
              <div className="flex justify-between">
                <p>Grand Total Amount</p>
                <p>
                  ₹{" "}
                  {(
                    selectedOrder.totalAmount +
                    selectedOrder.totalAmount * 0.05
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

export default OnsiteOrder;
