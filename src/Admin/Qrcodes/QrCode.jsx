import React, { useEffect, useState } from "react";
import {
  FaEllipsisV,
  FaBoxOpen,
  FaSearch,
  FaClipboardList,
} from "react-icons/fa";
import {
  MdWindow,
  MdAddBox,
  MdOutlineRestaurantMenu,
  MdOutlineQrCodeScanner,
  MdExpandMore,
} from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import DeleteConfirmationModal from "../../component/Modal/DeleteConfirmationModal";
import { BASE_URL } from '../../config';

function QrCode() {
  const [activeLink, setActiveLink] = useState("");
  const [manageOrderOpen, setManageOrderOpen] = useState(false);
  const [PaymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("table");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null); // Fixed state for dropdown menu
  const [isOpen, setIsOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleManageOrder = () => setManageOrderOpen(!manageOrderOpen);
  const togglePaymentHistory = () => setPaymentHistoryOpen(!PaymentHistoryOpen);

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const toggledropdown = (tableNumber) => {
    setDropdownOpen(dropdownOpen === tableNumber ? null : tableNumber); // Updated dropdown toggle
  };

  const toggleCounterDropdown = (counterNumber) => {
    setDropdownOpen(dropdownOpen === counterNumber ? null : counterNumber); // Toggle dropdown for the current table or counter
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case "table":
        return "Table";
      case "counter":
        return "Counter";
      default:
        return "QR Codes";
    }
  };
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handlenavigateprofile = () => {
    navigate("/Profilepage");
  };
  const [selectedQrCode, setSelectedQrCode] = useState(null);

  const handleDelete = async (id) => {
    // const confirmDelete = window.confirm("Are you sure you want to delete this QR code?");
    // if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/qr-code/delete/${selectedQrCodeId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setIsModalOpen(false);
        // alert('QR Code deleted successfully!');
      } else {
        alert("Failed to delete QR Code");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again later.");
    }
  };
  const handleEditClick = (qrCode) => {
    setSelectedQrCode(qrCode);
    navigate("/createqrcode", { state: { qrCode } }); // Pass data using the state
  };

  const [adminData, setAdminData] = useState({});

  const [qrCodes, setQrCodes] = useState([]);

  useEffect(() => {
    const fetchQrCodes = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/qr-code/`
        );
        setQrCodes(response.data);
      } catch (error) {
        console.error("Error fetching QR Codes:", error);
      }
    };

    fetchQrCodes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login"); // Or any other page
  };

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedQrCodeId, setSelectedQrCodeId] = useState(null); // State to store QR Code ID for deletion
  const handleDeleteClick = (id) => {
    setSelectedQrCodeId(id); // Set the selected QR code to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal if the user cancels
  };

  useEffect(() => {
    // Fetch admin data
    const token = localStorage.getItem("authToken");
    console.log(token);

    axios
      .get(`${BASE_URL}/api/admin/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setAdminData(response.data.data); // Set admin data to the state
        }
      })
      .catch((error) => {
        console.error("Error fetching admin data:", error);
      });
  }, []);

  return (
    <>
      {/* Tabs */}
      <div className="flex">
        <button
          onClick={() => setActiveTab("table")}
          className={`px-4 py-2 rounded-ss-lg ${
            activeTab === "table"
              ? "border-b-2 border-yellow-500 text-[#CA923D] bg-[linear-gradient(180deg,_#2D303E_0%,_#422F11_162.79%)]"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Table
        </button>
        <button
          onClick={() => setActiveTab("counter")}
          className={`px-4 py-2 rounded-e-lg rounded-ee-none ${
            activeTab === "counter"
              ? "border-b-2 border-yellow-500 text-[#CA923D] bg-[linear-gradient(180deg,_#2D303E_0%,_#422F11_162.79%)]"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Counter
        </button>
      </div>

      {/* QR Code Section */}
      {activeTab === "table" && (
        <section className="relative bg-[#1F1D2B] rounded-lg   w-full overflow-auto rounded-ss-none rounded-r-lg rounded-bl-lg">
          <div className="relative bg-[#1F1D2B] rounded-lg p-5 w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-white">QR Codes</h1>
              <a
                href="/createqrcode"
                className="bg-[#CA923D] hover:bg-yellow-700 white font-semibold py-2 px-6 rounded-lg shadow-md flex items-center"
              >
                <MdAddBox className="text-white mr-2" />
                Create QR Code
              </a>
            </div>

            <div className="grid grid-cols-3 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-6 w-full">
            {qrCodes && qrCodes.length > 0 ? (
                qrCodes
                  .filter((qrCode) => qrCode.activeTab === activeTab) // Filter based on activeTab
                  .map((qrCode) => (
                    <div
                      key={qrCode._id}
                      className="bg-gray-700 rounded-lg flex h-[250px] flex-col items-center relative w-full"
                    >
                      {/* Table Number Label and Three Dots in One Line (Cover Full Width) */}
                      <div className="flex justify-between items-center w-full bg-gray-600 py-2 px-4 rounded-t-lg">
                        <h2 className="text-lg font-semibold text-white">{`Table No - ${qrCode.qrName}`}</h2>
                        <div
                          className="text-gray-400 cursor-pointer"
                          onClick={() => toggledropdown(qrCode._id)}
                          aria-label={`More options for table ${qrCode.qrName}`}
                        >
                          <FaEllipsisV />
                        </div>
                      </div>

                      {/* Dropdown Menu */}
                      {dropdownOpen === qrCode._id && (
                        <div className="absolute top-10 right-2 bg-gray-700 text-white rounded-md shadow-md py-1 w-28 z-10">
                          <a
                            href="/createqrcode"
                            className="block w-full text-left px-4 py-2 hover:text-yellow-600 hover:bg-gray-600"
                            onClick={() => handleEditClick(qrCode)}
                          >
                            Edit
                          </a>
                          <a
                            className="block w-full text-left px-4 py-2 hover:text-yellow-600 hover:bg-gray-600"
                            onClick={() => handleDeleteClick(qrCode._id)}
                          >
                            Delete
                          </a>
                        </div>
                      )}

                      {/* QR Code Box with Full Width Dark Background */}
                      <div className="bg-gray-900 relative rounded-lg w-44 h-40 mt-6 flex justify-center items-center">
                        <QRCodeSVG
                          className="absolute top-4 left-[40px] w-[100px]"
                          fgColor={qrCode.chooseColor}
                          bgColor={qrCode.qrColor}
                          value={qrCode.link}
                        />
                      </div>
                    </div>
                  ))
              ) : (
                <p>No QR Codes available</p> // Fallback message if no qrCodes are found
              )}
            </div>
          </div>
        </section>
      )}
      {activeTab === "counter" && (
        <section className="relative bg-gray-900 rounded-lg   w-full overflow-auto rounded-ss-none rounded-r-lg rounded-bl-lg">
          <div className="relative bg-[#1F1D2B] rounded-lg p-5 w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-white">QR Codes</h1>
              <a
                href="/createqrcode"
                className="bg-[#CA923D] hover:bg-yellow-700 white font-semibold py-2 px-6 rounded-lg shadow-md flex items-center"
              >
                <MdAddBox className="text-white mr-2" />
                Create QR Code
              </a>
            </div>

            <div className="grid grid-cols-3 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-6 w-full">
            {qrCodes && qrCodes.length > 0 ? (
                qrCodes
                  .filter((qrCode) => qrCode.activeTab === activeTab) // Filter based on activeTab
                  .map((qrCode) => (
                    <div
                      key={qrCode._id}
                      className="bg-gray-700 rounded-lg flex h-[250px] flex-col items-center relative w-full"
                    >
                      {/* Table Number Label and Three Dots in One Line (Cover Full Width) */}
                      <div className="flex justify-between items-center w-full bg-gray-600 py-2 px-4 rounded-t-lg">
                        <h2 className="text-lg font-semibold text-white">{`Table No - ${qrCode.qrName}`}</h2>
                        <div
                          className="text-gray-400 cursor-pointer"
                          onClick={() => toggledropdown(qrCode._id)}
                          aria-label={`More options for table ${qrCode.qrName}`}
                        >
                          <FaEllipsisV />
                        </div>
                      </div>

                      {/* Dropdown Menu */}
                      {dropdownOpen === qrCode._id && (
                        <div className="absolute top-10 right-2 bg-gray-700 text-white rounded-md shadow-md py-1 w-28 z-10">
                          <a
                            href="/createqrcode"
                            className="block w-full text-left px-4 py-2 hover:text-yellow-600 hover:bg-gray-600"
                            onClick={() => handleEditClick(qrCode)}
                          >
                            Edit
                          </a>
                          <a
                            className="block w-full text-left px-4 py-2 hover:text-yellow-600 hover:bg-gray-600"
                            onClick={() => handleDeleteClick(qrCode._id)}
                          >
                            Delete
                          </a>
                        </div>
                      )}

                      {/* QR Code Box with Full Width Dark Background */}
                      <div className="bg-gray-900 relative rounded-lg w-44 h-40 mt-6 flex justify-center items-center">
                        <QRCodeSVG
                          className="absolute top-4 left-[40px] w-[100px]"
                          fgColor={qrCode.chooseColor}
                          bgColor={qrCode.qrColor}
                          value={qrCode.link}
                        />
                      </div>
                    </div>
                  ))
              ) : (
                <p>No QR Codes available</p> // Fallback message if no qrCodes are found
              )}
            </div>
          </div>
        </section>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default QrCode;
