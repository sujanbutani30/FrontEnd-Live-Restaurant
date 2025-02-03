import React, { useState, useEffect, useRef } from "react";
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
  FaRegMoneyBillAlt,
  FaTimes,
  FaCalendarAlt,
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
import moment from "moment";
import {
  fetchOrders,
  getAdminData,
  fetchParcelPaymentHistory,
} from "../../../api/manageMenuApi"; // Import the API functions

const PaymentParcel = () => {
  const [manageOrderOpen, setManageOrderOpen] = useState(false);
  const [manageHistoryOpen, setManageHistoryOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("request");
  const [selectedOrder, setSelectedOrder] = useState(null); // For selected order details
  const [showModal, setShowModal] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [PaymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Month");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedOption1, setSelectedOption1] = useState("Month");
  const [adminData, setAdminData] = useState({});
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const togglePaymentHistory = () => {
    setPaymentHistoryOpen(!PaymentHistoryOpen);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const openDateModal = () => setIsDateModalOpen(true);
  const closeDateModal = () => setIsDateModalOpen(false);
  const toggleDropdown1 = () => setIsOpen(!isOpen);

  const handleOptionClick1 = (option) => {
    setSelectedOption1(option);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Adjust this depending on where your user data is stored
    navigate("/login"); // Or any other page
  };

  useEffect(() => {
    // Fetch admin data
    const token = localStorage.getItem("authToken");
    console.log(token);

    getAdminData(token)
      .then((response) => {
        if (response.success) {
          setAdminData(response.data); // Set admin data to the state
        }
      })
      .catch((error) => {
        console.error("Error fetching admin data:", error);
      });
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    if (option === "Custom Date") {
      openDateModal();
    } else {
      filterOrdersByDateRange(option);
    }
  };

  const toggleManageOrder = () => setManageOrderOpen(!manageOrderOpen);
  const toggleManageHistory = () => setManageHistoryOpen(!manageHistoryOpen);

  const handleViewBill = (order) => {
    setSelectedOrder(order); // Set the selected order details
    setShowModal(true); // Open the modal
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
    setSelectedOrder(null); // Reset selected order
  };

  // Create a ref for the date input
  const dateInputRef = useRef(null);
  const dateInputRef1 = useRef(null);
  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  // Function to focus on the date input when the icon is clicked
  const handleIconClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker(); // For browsers that support showPicker()
      dateInputRef.current.focus(); // For general focus
    }
  };
  const handleIconClick1 = () => {
    if (dateInputRef1.current) {
      dateInputRef1.current.showPicker(); // For browsers that support showPicker()
      dateInputRef1.current.focus(); // For general focus
    }
  };

  const handlenavigateprofile = () => {
    navigate("/Profilepage");
  };

  useEffect(() => {
    // Fetch parcel payment history from the API
    const fetchData = async () => {
      try {
        const response = await fetchParcelPaymentHistory(); // Call the API
        setOrders(response); // Set the fetched data to the state
        setFilteredOrders(response); // Initialize filtered orders with all orders

        // Calculate total customers and total bill
        const uniqueCustomers = new Set(
          response.map((order) => order.userId?._id).filter((id) => id != null)
        );
        setTotalCustomers(uniqueCustomers.size);

        const totalBill = response.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        setTotalBill(totalBill);
      } catch (error) {
        console.error("Error fetching parcel payment history:", error);
      }
    };

    fetchData();
  }, []);

  const filterOrdersByDateRange = (range) => {
    const today = moment();
    let filtered = [];

    switch (range) {
      case "Day":
        filtered = orders.filter((order) =>
          moment(order.orderDate).isSame(today, "day")
        );
        break;
      case "Week":
        filtered = orders.filter((order) =>
          moment(order.orderDate).isSame(today, "week")
        );
        break;
      case "Month":
        filtered = orders.filter((order) =>
          moment(order.orderDate).isSame(today, "month")
        );
        break;
      case "Custom Date":
        if (fromDate && toDate) {
          filtered = orders.filter((order) =>
            moment(order.orderDate).isBetween(fromDate, toDate, null, "[]")
          );
        }
        break;
      default:
        filtered = orders;
        break;
    }

    setFilteredOrders(filtered);
  };

  const handleCustomDateFilter = () => {
    filterOrdersByDateRange("Custom Date");
    closeDateModal();
  };

  return (
    <>
      <div
        className="rounded-lg p-5 sm:hidden md:flex mb-4 flex justify-between items-center"
        style={{ backgroundColor: "#1F1D2B" }}
      >
        <h2 className="text-xl font-semibold text-white">Payment Details</h2>
        <div className="flex items-center space-x-3">
          <span>
            Total Customer :{" "}
            <strong className="text-green-400 text-xl">{totalCustomers}</strong>
          </span>
          <span>
            | Total Bill :{" "}
            <strong className="text-green-400 text-xl">{totalBill}</strong>
          </span>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-gray-200 bg-gray-800 border border-gray-600 rounded-md px-4 py-2 flex items-center justify-between w-40"
            >
              {selectedOption}
              <svg
                className="w-4 h-4 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
                <ul>
                  {["Month", "Week", "Day", "Custom Date"].map((option) => (
                    <li
                      key={option}
                      onClick={() => handleOptionClick(option)}
                      className="px-4 py-2 text-gray-300 cursor-pointer hover:bg-gray-700 flex items-center"
                    >
                      <span
                        className={`mr-2 w-4 h-4 rounded-full border-2 ${
                          selectedOption === option
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-500"
                        }`}
                      />
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Date Modal */}
      {isDateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#252836] rounded-lg p-6 w-[300px] sm:w-[400px] md:w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">Custom Date</h3>

              <button
                onClick={closeDateModal}
                style={{ backgroundColor: "#E74C37" }}
                className="rounded-full p-1"
              >
                <FaTimes className="text-black-400" />
              </button>
            </div>
            <hr style={{ color: "#999393" }} />
            <div className="flex flex-col space-y-4 mt-4">
              <div>
                <label className="text-gray-300 text-sm">From</label>
                <div className="relative">
                  <input
                    type="date"
                    placeholder="DD/MM/YYYY"
                    ref={dateInputRef} // Assign ref to the input
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full h-10 p-2 bg-gray-800 rounded-md text-gray-300 placeholder-gray-400 focus:outline-none"
                    style={{
                      backgroundColor: "#2D303E",
                      border: "1px solid #999393",
                    }}
                  />
                  <FaCalendarAlt
                    onClick={handleIconClick} // Call the function on icon click
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-sm">To</label>
                <div className="relative">
                  <input
                    type="date"
                    placeholder="DD/MM/YYYY"
                    ref={dateInputRef1} // Assign ref to the input
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full h-10 p-2 bg-gray-800 rounded-md text-gray-300 placeholder-gray-400 focus:outline-none"
                    style={{
                      backgroundColor: "#2D303E",
                      border: "1px solid #999393",
                    }}
                  />
                  <FaCalendarAlt
                    onClick={handleIconClick1} // Call the function on icon click
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCustomDateFilter}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <section
        className="bg-gray-800 p-6 rounded-lg"
        style={{ backgroundColor: "#2D303E" }}
      >
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold ">Parcel Order</h1>
        </div>
        <div className="overflow-x-auto rounded-t-lg">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-white" style={{ backgroundColor: "#CA923D" }}>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Customer Phone</th>
                <th className="px-6 py-3">Items Name</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Total Bill</th>
                <th className="px-6 py-3">Payment Type</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-white text-lg"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const userId = order.userId || {};
                  return (
                    <tr
                      key={order._id}
                      className="border-b border-gray-700 hover:bg-gray-700"
                      style={{ backgroundColor: "#1F1D2B" }}
                    >
                      <td className="px-6 py-4">{userId.name || "Unknown"}</td>
                      <td className="px-6 py-4">{userId.phone || "Unknown"}</td>
                      <td className="px-6 py-4">
                        {order.items
                          .map((item) =>
                            item.itemId ? item.itemId.itemName : "Unknown"
                          )
                          .join(", ")}
                      </td>
                      <td className="px-6 py-4">
                        {order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                      </td>
                      <td className="px-6 py-4 text-green-500">
                        {order.totalAmount}
                      </td>
                      <td className="px-6 py-4 text-green-500">
                        <div className="flex items-center">
                          {order.paymentMethod === "Online" ? (
                            <div className="flex items-center px-4 py-1 rounded-full text-white bg-[#1F3746] space-x-2">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M18.3334 9.1415V10.8582C18.3334 11.3165 17.9667 11.6915 17.5 11.7082H15.8667C14.9667 11.7082 14.1417 11.0498 14.0667 10.1498C14.0167 9.62484 14.2167 9.13317 14.5667 8.7915C14.875 8.47484 15.3 8.2915 15.7667 8.2915H17.5C17.9667 8.30817 18.3334 8.68317 18.3334 9.1415Z"
                                  fill="#1ECBE1"
                                />
                                <path
                                  d="M17.0584 12.9582H15.8667C14.2834 12.9582 12.9501 11.7665 12.8167 10.2498C12.7417 9.38317 13.0584 8.5165 13.6917 7.89984C14.2251 7.34984 14.9667 7.0415 15.7667 7.0415H17.0584C17.3001 7.0415 17.5001 6.8415 17.4751 6.59984C17.2917 4.57484 15.9501 3.1915 13.9584 2.95817C13.7584 2.92484 13.5501 2.9165 13.3334 2.9165H5.83342C5.60008 2.9165 5.37508 2.93317 5.15841 2.9665C3.03341 3.23317 1.66675 4.8165 1.66675 7.08317V12.9165C1.66675 15.2165 3.53341 17.0832 5.83342 17.0832H13.3334C15.6667 17.0832 17.2751 15.6248 17.4751 13.3998C17.5001 13.1582 17.3001 12.9582 17.0584 12.9582ZM10.8334 8.12484H5.83342C5.49175 8.12484 5.20841 7.8415 5.20841 7.49984C5.20841 7.15817 5.49175 6.87484 5.83342 6.87484H10.8334C11.1751 6.87484 11.4584 7.15817 11.4584 7.49984C11.4584 7.8415 11.1751 8.12484 10.8334 8.12484Z"
                                  fill="#1ECBE1"
                                />
                              </svg>
                              <span className="text-sm text-[#18D8FF]">
                                Online
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center px-4 py-1 rounded-full text-white bg-[#35383C] space-x-2">
                              <svg
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M16.475 5.53359C16.1167 3.72526 14.7751 2.93359 12.9084 2.93359H5.59172C3.39172 2.93359 1.92505 4.03359 1.92505 6.60026V10.8919C1.92505 12.7419 2.68338 13.8253 3.93338 14.2919C4.11672 14.3586 4.31672 14.4169 4.52505 14.4503C4.85838 14.5253 5.21672 14.5586 5.59172 14.5586H12.9167C15.1167 14.5586 16.5834 13.4586 16.5834 10.8919V6.60026C16.5834 6.20859 16.55 5.85859 16.475 5.53359ZM5.10838 10.0003C5.10838 10.3419 4.82505 10.6253 4.48338 10.6253C4.14172 10.6253 3.85838 10.3419 3.85838 10.0003V7.50026C3.85838 7.15859 4.14172 6.87526 4.48338 6.87526C4.82505 6.87526 5.10838 7.15859 5.10838 7.50026V10.0003ZM9.25005 10.9503C8.03338 10.9503 7.05005 9.96693 7.05005 8.75026C7.05005 7.53359 8.03338 6.55026 9.25005 6.55026C10.4667 6.55026 11.45 7.53359 11.45 8.75026C11.45 9.96693 10.4667 10.9503 9.25005 10.9503ZM14.6334 10.0003C14.6334 10.3419 14.35 10.6253 14.0084 10.6253C13.6667 10.6253 13.3834 10.3419 13.3834 10.0003V7.50026C13.3834 7.15859 13.6667 6.87526 14.0084 6.87526C14.35 6.87526 14.6334 7.15859 14.6334 7.50026V10.0003Z"
                                  fill="#AFD19A"
                                />
                                <path
                                  d="M19.0834 9.09958V13.3912C19.0834 15.9579 17.6167 17.0662 15.4084 17.0662H8.09172C7.46672 17.0662 6.90838 16.9746 6.42505 16.7912C6.03338 16.6496 5.69172 16.4412 5.41672 16.1746C5.26672 16.0329 5.38338 15.8079 5.59172 15.8079H12.9084C15.9917 15.8079 17.8251 13.9746 17.8251 10.8996V6.59958C17.8251 6.39958 18.0501 6.27458 18.1917 6.42458C18.7584 7.02458 19.0834 7.89958 19.0834 9.09958Z"
                                  fill="#AFD19A"
                                />
                              </svg>
                              <span className="text-sm text-[#AFD19A]">
                                Cash
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          className="p-2 rounded text-white"
                          style={{ backgroundColor: "#5678E9" }}
                          onClick={() => handleViewBill(order)}
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

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
                  {moment(selectedOrder.orderDate).format("DD/MM/YYYY")}
                </p>
              </div>
              <div className="flex justify-between mb-2">
                <p>
                  <strong>Time:</strong>{" "}
                  {moment(selectedOrder.orderDate).format("HH:mm")}
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

export default PaymentParcel;