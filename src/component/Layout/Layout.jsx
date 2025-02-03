import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../../socket";
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
  FaBox,
  FaChair,
} from "react-icons/fa";
import {
  IoMdCheckmarkCircle,
  IoMdCloseCircle,
  IoMdLogOut,
} from "react-icons/io";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { GoDotFill } from "react-icons/go";
import { getAdminById } from "@/api/ProfileApi";
import { BASE_URL } from '../../config';

const Layout = () => {
  const [manageOrderOpen, setManageOrderOpen] = useState(false);
  const [manageHistoryOpen, setManageHistoryOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // For selected order details
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Month");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [PaymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const togglePaymentHistory = () => setPaymentHistoryOpen(!PaymentHistoryOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const openDateModal = () => setIsDateModalOpen(true);
  const closeDateModal = () => setIsDateModalOpen(false);

  const [selectedOption1, setSelectedOption1] = useState("Month");
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown1 = () => setIsOpen(!isOpen);

  const handleOptionClick1 = (option) => {
    setSelectedOption1(option);
    setIsOpen(false);
  };

  const handleLogout = () => {
    // Clear user data from localStorage or sessionStorage
    localStorage.removeItem("authToken"); // Adjust this depending on where your user data is stored

    // Optionally make an API request to invalidate session if necessary
    // await axios.post('https://restaurants-customer-dashboard.onrender.com/api/v1/auth/logout'); // Optional backend call

    // Redirect user to login or home page after logout
    navigate("/login"); // Or any other page
  };

  const [adminData, setAdminData] = useState({});
  useEffect(() => {
    // Fetch admin data
    const token = localStorage.getItem("authToken");
    console.log(token);
    const adminId = localStorage.getItem("adminId");

    const fetchAdminData = async () => {
      try {
        const response = await getAdminById(adminId); // Fetch data by ID
        console.log("API Response:", response);

        if (response.success) {
          setAdminData(response.data); // Set the admin data
        } else {
          console.error("API response was not successful.");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    if (option === "Custom Date") {
      openDateModal();
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

  const orders = [];

  const handlenavigateprofile = () => {
    navigate("/Profilepage");
  };

  const getPageName = (pathname) => {
    switch (pathname) {
      case "/AddItems":
        return "Add Items";
      case "/dashboard":
        return "Dashboard";
      case "/qrcode":
        return "Qr Code";
      case "/createqrcode":
        return "Create Qr Code";
      case "/TermsAndConditions":
        return "Terms And Conditions";
      case "/ChangePassword":
        return "Change Password";
      case "/Profilepage":
        return "Profile";
      case "/editprofile":
        return "Edit Profile";
      case "/onsiteorder":
        return "Onsite Order";
      case "/parcelorder":
        return "Parcel Order";
      case "/edititem":
        return "Edit Item";
      case "/additems":
        return "Add Item";
      case "/managemenu":
        return "Manage Menu";
      case "/paymentonsite":
        return "Payment Onsite";
      case "/paymentparcel":
        return "Payment Parcel";
      // Add more cases as needed
      default:
        return "Dashboard";
    }
  };

  // Automatically open the submenu if the current route matches a submenu item
  useEffect(() => {
    const submenuOrderItems = ["/parcelorder", "/onsiteorder"];
    const submenuPaymentItems = ["/paymentparcel", "/paymentonsite"];

    if (submenuOrderItems.includes(location.pathname)) {
      setManageOrderOpen(true);
    }
    if (submenuPaymentItems.includes(location.pathname)) {
      setPaymentHistoryOpen(true);
    }
  }, [location.pathname]);

  // Check if the current route is a submenu item
  const isSubmenuItemActive = (submenuItems) => {
    return submenuItems.some((item) => location.pathname === item);
  };

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchNotifications();

    // Listen for new notifications
    socket.on("newNotification", (notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off("newNotification");
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/notifications`,
        {
          withCredentials: true,
        }
      );
      // Filter notifications where isDeleted is false
      const filteredNotifications = response.data.filter(notification => !notification.isDeleted);
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/notifications/clear`, {
        withCredentials: true,
      });
      setNotifications([]); // Clear notifications from state
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const convertToIndianTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    });
  };

  return (
    <div
      className="flex min-h-screen bg-gray-900 text-white"
      style={
        ["/AddItems", "/PaymentOnsite", "/PaymentParcel"].includes(
          location.pathname
        )
          ? { backgroundColor: "#0B0F1F" }
          : {}
      }
    >
      {/* Sidebar */}
      <aside className="w-[280px] fixed top-0 left-0 h-screen hidden lg:flex bg-gray-800 py-6 px-6 flex-col items-center">
        <div className="flex flex-col items-center mb-8 border-b border-[#2E2B40] pb-5">
          <img
            src="./assets/images/rms-logo.png"
            alt="Logo"
            className="w-[216px] rounded-full mb-2"
          />
        </div>

        <nav className="flex flex-col space-y-3 w-full">
          <div className="pb-4">
            <a
              href="/dashboard"
              className="flex items-center p-2 rounded-md text-[16px] text-white font-semibold hover:bg-gray-700 w-full"
            >
              <MdWindow className="mr-2 w-[22px] h-[20px] text-yellow-500" />
              Dashboard
            </a>
          </div>
          <div className="pb-4">
            <button
              className="flex items-center p-2 rounded-md text-[16px] text-white font-semibold hover:bg-gray-700 w-full"
              onClick={toggleManageOrder}
              style={
                isSubmenuItemActive(["/parcelorder", "/onsiteorder"])
                  ? { backgroundColor: "#374151" }
                  : {}
              }
            >
              <FaBoxOpen className="mr-2 w-[22px] h-[20px] text-yellow-500" />
              Manage Order
              <MdExpandMore
                className={`ml-auto text-[22px] transform ${
                  manageOrderOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {manageOrderOpen && (
              <div className="ml-8 mt-2 space-y-2">
                <a
                  href="/parcelorder"
                  className="flex items-center p-2 rounded-md text-[14px] text-white font-normal hover:bg-gray-700"
                  style={
                    location.pathname === "/parcelorder"
                      ? { color: "#CA923D", fontWeight: 500 }
                      : {}
                  }
                >
                  Parcel Order
                </a>
                <a
                  href="/onsiteorder"
                  className="flex items-center p-2 rounded-md text-[14px] text-white font-normal hover:bg-gray-700"
                  style={
                    location.pathname === "/onsiteorder"
                      ? { color: "#CA923D", fontWeight: 500 }
                      : {}
                  }
                >
                  Onsite Order
                </a>
              </div>
            )}
          </div>

          <div className="pb-4">
            <a
              href="/managemenu"
              className="flex items-center p-2 rounded-md text-[16px] text-white font-semibold hover:bg-gray-700 w-full"
            >
              <MdOutlineRestaurantMenu className="mr-2 w-[22px] h-[20px] text-yellow-500" />
              Manage Menu
            </a>
          </div>

          <div className="pb-4">
            <button
              className="flex items-center p-2 rounded-md text-[16px] text-white font-semibold hover:bg-gray-700 w-full"
              onClick={togglePaymentHistory}
              style={
                isSubmenuItemActive(["/paymentparcel", "/paymentonsite"])
                  ? { backgroundColor: "#374151" }
                  : {}
              }
            >
              <FaClipboardList className="mr-2 w-[22px] h-[20px] text-yellow-500" />
              PaymentHistory
              <MdExpandMore
                className={`ml-auto text-[22px] transform ${
                  PaymentHistoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {PaymentHistoryOpen && (
              <div className="ml-8 mt-2 space-y-2">
                <a
                  href="/paymentparcel"
                  className="flex items-center p-2 rounded-md text-[14px] text-white font-normal hover:bg-gray-700"
                  style={
                    location.pathname === "/paymentparcel"
                      ? { color: "#CA923D", fontWeight: 500 }
                      : {}
                  }
                >
                  Parcel Order
                </a>
                <a
                  href="/paymentonsite"
                  className="flex items-center p-2 rounded-md text-[14px] text-white font-normal hover:bg-gray-700"
                  style={
                    location.pathname === "/paymentonsite"
                      ? { color: "#CA923D", fontWeight: 500 }
                      : {}
                  }
                >
                  Onsite Order
                </a>
              </div>
            )}
          </div>

          <div className="pb-2">
            <a
              href="/qrcode"
              className="flex items-center p-2 rounded-md text-[16px] text-white font-semibold hover:bg-gray-700 w-full"
            >
              <MdOutlineQrCodeScanner className="mr-2 w-[22px] h-[20px] text-yellow-500" />
              QR Codes
            </a>
          </div>
        </nav>
        <button
          className="w-full flex justify-center items-center px-3 py-3 mt-auto bg-[#E74C3C] rounded-lg text-[16px] text-white font-medium"
          onClick={handleLogout}
        >
          <IoMdLogOut className="mr-2 text-[22px] h-[20px] text-white" />
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] md:ml-0 p-6 sm:px-4 bg-gray-900">
        {/* Header */}
        <header className="flex justify-between sm:justify-normal md:justify-between items-center mb-6 pb-4 ">
          {/* Welcome Text */}
          <h2 className="text-xl font-semibold text-white sm:hidden xl:flex">
            Welcome Back 👋
            <br />
            <span className="text-gray-400 font-normal text-lg">
              {getPageName(location.pathname)}
            </span>
          </h2>

          <button
            id="toggleButton"
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <BsThreeDotsVertical style={{ fontSize: "20px" }} />
          </button>
          <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
            />

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <DialogPanel
                    transition
                    className="pointer-events-auto relative w-screen max-w-md sm:w-full transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                  >
                    <TransitionChild>
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          {/* <XMarkIcon aria-hidden="true" className="h-6 w-6" /> */}
                        </button>
                      </div>
                    </TransitionChild>
                    <div className="flex h-full flex-col overflow-y-scroll  py-6 shadow-xl  bg-gray-800 p-4 items-center">
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col items-center mb-8">
                          {/* Centered Image */}
                          <img
                            src="./assets/images/Frame 1000005156.png"
                            alt="Logo"
                            className="h-20 rounded-full mb-2"
                          />
                        </div>

                        <nav className="flex flex-col space-y-3 w-full">
                          <a
                            href="/dashboard"
                            className="flex items-center p-2 pb-3 rounded-md text-gray-300 hover:bg-gray-700 w-full"
                          >
                            <MdWindow className="mr-2 w-[20px] h-[20px] text-yellow-500" />
                            Dashboard
                          </a>
                          <div>
                            {/* Manage Order Dropdown */}
                            <button
                              className="flex items-center p-3 pb-3 w-full rounded-md text-gray-300 hover:bg-gray-700"
                              onClick={toggleManageOrder}
                            >
                              <FaBoxOpen className="mr-2 text-yellow-500" />
                              Manage Order
                              <MdExpandMore
                                className={`ml-auto transform ${
                                  manageOrderOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {manageOrderOpen && (
                              <div className="ml-8 mt-2 space-y-2">
                                <a
                                  href="/parcelorder"
                                  className="flex items-center p-2 pb-3 rounded-md text-gray-300 hover:bg-gray-700"
                                >
                                  Parcel Order
                                </a>
                                <a
                                  href="/onsiteorder"
                                  className="flex items-center p-2 pb-3 rounded-md text-gray-300 hover:bg-gray-700"
                                >
                                  Onsite Order
                                </a>
                                {/* <a
                                  href="/kitchen"
                                  className="flex items-center p-2 pb-3 rounded-md text-gray-300 hover:bg-gray-700"
                                >
                                  Kitchen
                                </a> */}
                              </div>
                            )}
                          </div>
                          <a
                            href="/managemenu"
                            className="flex items-center p-3 pb-3 rounded-md text-gray-300 hover:bg-gray-700"
                          >
                            <MdOutlineRestaurantMenu className="mr-2 w-[20px] h-[20px] text-yellow-500" />
                            Manage Menu
                          </a>
                          <div>
                            {/* PaymentHistory Dropdown */}
                            <button
                              className="flex items-center p-3 pb-3 w-full rounded-md text-gray-300 hover:bg-gray-700"
                              onClick={togglePaymentHistory}
                            >
                              <FaClipboardList className="mr-2 text-yellow-500" />
                              PaymentHistory
                              <MdExpandMore
                                className={`ml-auto transform ${
                                  PaymentHistoryOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {PaymentHistoryOpen && (
                              <div className="ml-8 mt-2 space-y-2">
                                <a
                                  href="/paymentparcel"
                                  className="flex items-center p-3 pb-3 rounded-md text-gray-300 hover:bg-gray-700"
                                >
                                  Parcel Order
                                </a>
                                <a
                                  href="/paymentonsite"
                                  className="flex items-center p-2 rounded-md text-gray-300 hover:bg-gray-700"
                                >
                                  Onsite Order
                                </a>
                              </div>
                            )}
                          </div>
                          <a
                            href="/qrcode"
                            className="flex items-center p-3 pb-3 rounded-md text-gray-300 hover:bg-gray-700"
                          >
                            <MdOutlineQrCodeScanner className="mr-2 w-[20px] h-[20px] text-yellow-500" />
                            QR Codes
                          </a>
                        </nav>
                        <button
                          className="flex items-center px-4 py-2 m-auto mt-10 bg-red-500 rounded-md text-white "
                          onClick={handleLogout}
                        >
                          <IoMdLogOut className="mr-2" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </div>
          </Dialog>

          {/* Search Bar */}
          <div className="flex">
            <div className="relative w-[400px] mr-28 marker">
              <input
                type="text"
                placeholder="Search Here Your Delicious Food..."
                className="w-[300px] sm:w-[200px] xl:w-[260px] 2xl:w-[300px] md:w-[300px] h-[40px] p-2 pl-10 md:ml-48 sm:ml-3  ml-48 bg-gray-800 rounded-full text-gray-300 placeholder-gray-400 focus:outline-none"
              />
              <FaSearch className="w-5 h-5 ml-48 text-gray-400 absolute sm:right-[330px] md:left-2 top-2.5" />
            </div>

            {/* Notification Icon and User Profile Dropdown */}
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <div
                className="relative cursor-pointer"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <svg
                  className="w-6 h-6 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a7 7 0 00-7 7v4.29l-1.71 1.7a1 1 0 00-.29.71v1a1 1 0 001 1h16a1 1 0 001-1v-1a1 1 0 00-.29-.71L19 13.29V9a7 7 0 00-7-7zm-1 18h2a1 1 0 01-2 0z" />
                </svg>
                {/* Notification Badge */}
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block w-2.5 h-2.5 rounded-full bg-red-500" />
                )}
              </div>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute md:right-[7%] md:top-[6%] right-[-23%] top-[15%] mt-2 w-80 bg-[#252836] text-gray-300 rounded-lg shadow-lg overflow-hidden z-50">
                  {/* Header with Close Button and Clear All Button */}
                  <div className="p-4 flex items-center justify-between">
                    <h3 className="text-xl text-white font-semibold">
                      Notification
                    </h3>
                    <div className="flex items-center space-x-4">
                      <button
                        className="text-gray-400 hover:text-gray-200 focus:outline-none"
                        onClick={clearAllNotifications} // Call the clearAllNotifications function
                      >
                        Clear All
                      </button>
                      <button
                        className="text-gray-400 hover:text-gray-200 focus:outline-none"
                        onClick={() => setIsNotificationOpen(false)}
                      >
                        <svg
                          className="w-5 h-5 bg-white text-black rounded-full"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* Notifications List with Scroll */}
                  <div className="divide-y divide-gray-700 max-h-[400px] overflow-y-auto">
                  {notifications.map((notification) => {
  // Check if notification.orderId and notification.orderId.userId exist
  const userId = notification.orderIds[0]?.userId; // Assuming the first order's user details are sufficient
  const userName = userId?.name || "Unknown User";
  const userPhone = userId?.phone || "Unknown Phone";
  const totalQuantity = notification.totalQuantity || 0;

  return (
    <div
      key={notification._id}
      className="p-3 bg-[#1F1D2B] cursor-pointer rounded-lg mb-1"
    >
      <div className="notification">
        <div className="top flex justify-between border-b border-[#2A2A38] pb-2">
          <div className="left flex items-center">
            <div className="icon bg-[#5e3632] p-2 rounded-full">
              <FaBox className="text-[15px] text-[#E74C3C]" />
            </div>
            <div className="name pl-3">
              <p className="text-lg text-white font-medium">
                {userName}
              </p>
            </div>
          </div>
          <div className="right">
            <div className="flex items-center">
              <GoDotFill className="text-[green] mr-1" />
              <p className="text-xs text-gray-400">
                {convertToIndianTime(notification.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <div className="bottom flex justify-between pt-3">
          <div className="left">
            <p className="text-xl font-medium text-white">
              {userPhone}
            </p>
          </div>
          <div className="right">
            <p className="text-xl font-medium text-white">
              Quantity: {totalQuantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
})}
                  </div>
                </div>
              )}

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={handlenavigateprofile}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src="./assets/images/21460d39cd98ccca0d3fa906d5718aa3.jpg"
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="text-white hidden lg:flex">
                    {adminData.firstname} {adminData.lastname}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.25 7.5l4.25 4.25 4.25-4.25L15 9l-5 5-5-5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;