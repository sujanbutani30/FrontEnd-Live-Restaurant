import React, { useEffect, useRef, useState } from "react";
import { FaHome, FaBoxOpen, FaSearch, FaClipboardList } from "react-icons/fa";
import {
  MdWindow,
  MdOutlineRestaurantMenu,
  MdOutlineQrCodeScanner,
  MdExpandMore,
} from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { QRCodeSVG } from "qrcode.react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { MdAddBox } from "react-icons/md";
import { BASE_URL } from '../../config';

const Createqrcode = () => {
  const location = useLocation();
  const [manageOrderOpen, setManageOrderOpen] = useState(false);
  const [PaymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("table");
  const [activeTab3, setActiveTab3] = useState("table");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(location.state?.qrCode || {}); // Access passed QR code data
  const [category, setCategory] = useState(
    qrCodeData.contentCategory || "Food & Drink"
  );
  const [link, setLink] = useState(qrCodeData.link || "");
  const [additionalText, setAdditionalText] = useState(
    qrCodeData.additionalText || ""
  );
  const [chooseColor, setChooseColor] = useState(
    qrCodeData.chooseColor || "#ffffff"
  );
  const [frameColor, setFrameColor] = useState(
    qrCodeData.frameColor || "#000000"
  );
  const [qrColor, setQRColor] = useState(qrCodeData.qrColor || "#000000");
  const [contentCategory, setContentCategory] = useState("Food & Drink"); // State for content category
  const [qrName, setQRName] = useState(qrCodeData.qrName || 1); // State for QR Name
  // const [qrquentity, setQRQuantity] = useState(qrCodeData.qrquentity || 1); // State for QR Quantity
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [backgroundImage, setBackgroundImage] = useState(
    "./assets/images/qrcode_undefined_undefined_2.png"
  );
  const [activeTab2, setActiveTab2] = useState("svg");

  const isEditing = Boolean(qrCodeData);

  const element = document.querySelector("#elementId");
  if (element) {
    const xmlString = new XMLSerializer().serializeToString(element);
  } else {
    console.error("Element not found!");
  }

  const templateBackgrounds = {
    default: "./assets/images/qrcode_undefined_undefined_2.png",
    template1: "./assets/images/qrcode_undefined_undefined.png",
    // 'template2': './assets/images/Group 1116601973.png',
    template3: "./assets/images/Group 1116601958.png",
    template4: "./assets/images/Group 1116601960.png",
    // 'template5': './assets/images/Group 1116601959.png',
    template6: "./assets/images/Group 1116601961.png",
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    // Set the background image based on the selected template
    setBackgroundImage(templateBackgrounds[templateId]);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleManageOrder = () => setManageOrderOpen(!manageOrderOpen);
  const togglePaymentHistory = () => setPaymentHistoryOpen(!PaymentHistoryOpen);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { qrCode } = location.state || {};

  const getTabLabel = () => {
    switch (activeTab) {
      case "request":
        return "Table";
      case "progress":
        return "Counter";
      default:
        return "QR Codes";
    }
  };
  console.log(activeTab);

  const handlenavigateprofile = () => {
    navigate("/Profilepage");
  };

  const handleSubmit = async () => {
    const isTable = activeTab === "table";
    const qrData = {
      isTable,
      activeTab,
      link,
      qrName,
      // qrquentity,
      additionalText,
      chooseColor,
      frameColor,
      qrColor,
      contentCategory,
    };
    console.log(qrData);
    if (qrCode) {
      // Update QR Code
      await updateQrCode(qrCode._id, qrData); // Call the update function from your API
    } else {
      // Create a new QR Code
      await createQrCode(qrData); // Call the create function from your API
    }
  };

  const createQrCode = async (qrData) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/qr-code/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(qrData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("QR Code created successfully!");
        navigate("/qrcode");
        // Optionally, navigate back or refresh the list
      } else {
        alert("Failed to create QR Code");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again later.");
    }
  };

  const updateQrCode = async (id, qrData) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/qr-code/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(qrData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("QR Code updated successfully!");
        navigate("/qrcode");
        // Optionally, navigate back or refresh the list
      } else {
        alert("Failed to update QR Code");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again later.");
    }
  };

  const handleDownload = () => {
    const svgElement = qrCodeRef.current; // The QRCodeSVG component reference
    const svgData = new XMLSerializer().serializeToString(svgElement);

    // Create a Blob from the SVG data
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create a temporary image element to load the SVG and convert it to a PNG
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      // Set the canvas size to the size of the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      context.drawImage(img, 0, 0);

      // Convert the canvas to a PNG data URL
      const pngUrl = canvas.toDataURL("image/png");

      // Create a temporary link to download the image
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "QRCode.png"; // Name of the downloaded image
      link.click();
    };
    img.src = svgUrl; // Set the image source to the SVG data
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login"); // Or any other page
  };
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log(token);

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
  const qrCodeRef = useRef(null);

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
          className={`px-4 py-2 ${
            activeTab === "counter"
              ? "border-b-2 border-yellow-500 text-[#CA923D] bg-[linear-gradient(180deg,_#2D303E_0%,_#422F11_162.79%)]"
              : "bg-gray-700 text-gray-300"
          } rounded-e-lg rounded-ee-none`}
        >
          Counter
        </button>
      </div>

      {/* Main Content */}
      <section>
        <div className="bg-[#252836] rounded-lg p-4 md:p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">
              Create QR Code
            </h2>
            {/* <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="tab"
                  value="table"
                  checked={activeTab3 === "table"}
                  onChange={() => setActiveTab3("table")}
                  className="hidden" // Hide the default radio button
                />
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    activeTab3 === "table"
                      ? "border-[#CA923D]"
                      : "border-gray-500"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      activeTab3 === "table" ? "bg-[#CA923D]" : "bg-transparent"
                    }`}
                  ></div>
                </div>
                <span className="text-gray-300">Table</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="tab"
                  value="counter"
                  checked={activeTab3 === "counter"}
                  onChange={() => setActiveTab3("counter")}
                  className="hidden" // Hide the default radio button
                />
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    activeTab3 === "counter"
                      ? "border-[#CA923D]"
                      : "border-gray-500"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      activeTab3 === "counter"
                        ? "bg-[#CA923D]"
                        : "bg-transparent"
                    }`}
                  ></div>
                </div>
                <span className="text-gray-300">Counter</span>
              </label>
            </div> */}
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 mb-6">
            <div className="w-full">
              <label className="block text-sm mb-1 text-gray-300">
                Put Your Link Here
              </label>
              <input
                type="text"
                className="bg-[#2D303E] p-2 w-full text-gray-200 rounded-lg"
                placeholder="https://www.example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm mb-1 text-gray-300">
                Name Your QR
              </label>
              <input
                type="number"
                className="bg-[#2D303E] p-2 w-full text-gray-200 rounded-lg"
                placeholder="QR Name"
                value={qrName}
                onChange={(e) => setQRName(e.target.value)}
              />
            </div>
            {/* <div className="w-full">
              <label className="block text-sm mb-1 text-gray-300">
                Table Quentity
              </label>
              <input
                type="number"
                className="bg-[#2D303E] p-2 w-full text-gray-200 rounded-lg"
                placeholder="QR Quentity"
                value={qrquentity}
                onChange={(e) => setQRQuantity(e.target.value)}
              />
            </div> */}
            <div className="w-full">
              <label className="block text-sm mb-1 text-gray-300">
                Select Content Category
              </label>
              <select
                className="bg-[#2D303E] p-2 w-full text-gray-200 rounded-lg"
                value={contentCategory}
                onChange={(e) => setContentCategory(e.target.value)}
              >
                <option>Food & Drink</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Left Side: Additional Text, Colors, and Template Selection */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3">
              {/* Additional Text and Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    Additional Text
                  </label>
                  <input
                    type="text"
                    className="bg-[#2D303E] p-3 w-full text-gray-200 rounded-lg"
                    placeholder="Additional"
                    value={additionalText}
                    onChange={(e) => setAdditionalText(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    Choose Color
                  </label>
                  <div className="flex items-center bg-[#2D303E] rounded-lg p-2">
                    <input
                      type="color"
                      className="w-8 h-8 cursor-pointer"
                      value={chooseColor}
                      onChange={(e) => setChooseColor(e.target.value)}
                    />
                    <span className="ml-2 text-gray-200">{chooseColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    Frame Color
                  </label>
                  <div className="flex items-center bg-[#2D303E] rounded-lg p-2">
                    <input
                      type="color"
                      className="w-8 h-8 cursor-pointer"
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                    />
                    <span className="ml-2 text-gray-200">{frameColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    QR Color
                  </label>
                  <div className="flex items-center bg-[#2D303E] rounded-lg p-2">
                    <input
                      type="color"
                      className="w-8 h-8 cursor-pointer"
                      value={qrColor}
                      onChange={(e) => setQRColor(e.target.value)}
                    />
                    <span className="ml-2 text-gray-200">{qrColor}</span>
                  </div>
                </div>
              </div>

              {/* Template Selection */}
              <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-white">
                Thematic
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-10 gap-2 mb-6">
                {["template1", "template3", "template4", "template6"].map(
                  (templateId) => (
                    <div
                      key={templateId}
                      className={`bg-[#2B2F3F] rounded-lg w-full h-32 flex justify-center items-center cursor-pointer ${
                        selectedTemplate === templateId
                          ? "ring-2 ring-yellow-500"
                          : ""
                      }`}
                      onClick={() => handleTemplateSelect(templateId)}
                    >
                      <img
                        src={templateBackgrounds[templateId]}
                        alt={`Template ${templateId}`}
                        className="w-20"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Right Side: QR Code Preview */}
            <div className="w-full lg:w-1/3 flex justify-center lg:justify-end">
              <div className="bg-[#2B2F3F] rounded-lg w-full h-full p-4 flex flex-col justify-center items-center relative">
                <img
                  src={backgroundImage}
                  alt="QR Code Background"
                  className="w-full"
                />
                <QRCodeSVG
                  className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  ref={qrCodeRef}
                  fgColor={chooseColor}
                  bgColor={qrColor}
                  value={link}
                />
                <div className="flex space-x-4 mt-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tab"
                      value="svg"
                      checked={activeTab2 === "svg"}
                      onChange={() => setActiveTab2("svg")}
                      className="hidden" // Hide the default radio button
                    />
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        activeTab2 === "svg"
                          ? "border-[#CA923D]"
                          : "border-gray-500"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${
                          activeTab2 === "svg"
                            ? "bg-[#CA923D]"
                            : "bg-transparent"
                        }`}
                      ></div>
                    </div>
                    <span className="text-gray-300">SVG</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tab"
                      value="PNG"
                      checked={activeTab2 === "png"}
                      onChange={() => setActiveTab2("png")}
                      className="hidden" // Hide the default radio button
                    />
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        activeTab2 === "png"
                          ? "border-[#CA923D]"
                          : "border-gray-500"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${
                          activeTab2 === "png"
                            ? "bg-[#CA923D]"
                            : "bg-transparent"
                        }`}
                      ></div>
                    </div>
                    <span className="text-gray-300">PNG</span>
                  </label>
                </div>
                {/* Create/Update and Download Buttons */}
                <div className="flex items-center justify-end mt-6">
                  <button
                    className="bg-[#CA923D] flex items-center text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700"
                    onClick={async () => {
                      await Promise.all([handleSubmit(), handleDownload()]);
                    }}
                  >
                    <MdAddBox className="mr-2 w-5 h-5" />
                    {qrCodeData ? "Update QR Code" : "Download QR"}
                  </button>
                  <button
                    className="bg-[#CA923D] flex items-center text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 ml-4"
                    onClick={handleSubmit}
                  >
                    Save QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Createqrcode;
