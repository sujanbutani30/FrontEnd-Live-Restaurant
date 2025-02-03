import axios from "axios";

import React, { useEffect, useState } from "react";
import {
  MdOutlineRestaurantMenu,
  MdOutlineQrCodeScanner,
  MdWindow,
  MdExpandMore,
} from "react-icons/md";
import { FaBoxOpen, FaClipboardList, FaSearch, FaHome } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiImageAdd } from "react-icons/bi";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { fetchCategories } from "../../api/manageMenuApi";
import { BASE_URL } from '../../config';

const AddItems = () => {
  const [manageOrderOpen, setManageOrderOpen] = useState(false);
  const [manageHistoryOpen, setManageHistoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("request");
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Veg");
  const [showForm, setShowForm] = useState(false);
  const [customizations, setCustomizations] = useState([
    { name: "", rate: "", detail: "" },
  ]);
  const [PaymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const category = location.state?.category;
  const [categories, setCategories] = useState([]);
  console.log("categories------========>", categories)
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [steps, setSteps] = useState([
    {
      title: "",
      selection: "",
      options: [{ name: "", detail: "", rate: "20" }],
    },
  ]);
  const addStep = () => {
    setSteps((prev) => {
      const updatedFormData = [
        ...prev,
        {
          title: "",
          selection: "",
          options: [{ name: "", detail: "", rate: "" }],
        },
      ]; //to Create a copy of the array
      console.log("update", updatedFormData);

      return updatedFormData;
    });
  };

  const addCustomization = (index) => {
    const updatedFormData = [...steps];
    updatedFormData[index].options = [
      ...updatedFormData[index].options,
      { name: "", detail: "", rate: "" },
    ]; // console.log("MAIN", updatedFormData);

    console.log("upfatr", updatedFormData);
    setSteps(updatedFormData);
  };

  const handleChange = (index, field, value) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      )
    );
  };

  const handleStepCustomiseChange = (
    stepIndex,
    customiseIndex,
    field,
    value
  ) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, i) =>
        i === stepIndex
          ? {
              ...step,
              options: step.options.map((customise, j) =>
                j === customiseIndex
                  ? { ...customise, [field]: value }
                  : customise
              ),
            }
          : step
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
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
  const handleCustoChange = (e, index, key) => {
    const { value } = e.target;

    setCustomizations((prev) => {
      const updatedFormData = [...prev];
      updatedFormData[index][key] = value; // Update the specific field
      console.log("up", updatedFormData);

      return updatedFormData;
    });
  };

  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Store the file in state
      setPreviewImage(URL.createObjectURL(file)); // Create a preview URL for the image
    }
  };

  const toggleManageOrder = () => setManageOrderOpen(!manageOrderOpen);
  const toggleManageHistory = () => setManageHistoryOpen(!manageHistoryOpen);
  const togglePaymentHistory = () => {
    setPaymentHistoryOpen(!PaymentHistoryOpen);
  };

  // Function to remove a customization
  const removeCustomization = (index) => {
    const updatedCustomizations = customizations.filter((_, i) => i !== index);
    setCustomizations(updatedCustomizations);
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case "request":
        return "Manage Menu";
      case "AddItem":
        return "Add Item";
      case "delivered":
        return "Delivered";
      default:
        return "";
    }
  };
  const [open, setOpen] = useState(false);

  const handlenavigateprofile = () => {
    navigate("/Profilepage");
  };

  const [imageFile, setImageFile] = useState(null);

   // Fetch categories on component mount
   useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategory();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    const formData = {
      itemName: document.getElementById("item-name").value,
      ingredients: document.getElementById("item-ingredients").value,
      price: document.getElementById("item-price").value,
      discount: document.getElementById("item-discount").value,
      type: document.getElementById("item-type").value,
      spiceLevel: document.querySelector('input[name="spice-level"]:checked')
        ?.value,
      customizations: steps, // Assuming `steps` holds customization data
      itemType: selected,
      categoryId: selectedCategoryId,
    };

    // Handle image file separately
    const fileInput = document.getElementById("file-upload");
    const imageFile = fileInput?.files[0];

    if (imageFile) {
      formData.imageUrl = imageFile; // Add image to formData
    }

    try {
      console.log("REC?>>>>", formData);

      // Send form data including  image to backend
      const response = await axios.post(
        `${BASE_URL}/api/product/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Item added successfull");
      alert("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  return (
    <>
      <div
        className=" rounded-lg p-5 mb-4 flex justify-between items-center"
        style={{ backgroundColor: "#1F1D2B" }}
      >
        <h2 className="text-xl font-semibold text-white">
          Add Items {category}
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelected("veg")}
            className={`flex items-center px-4 py-2 border-2 rounded-lg transition-colors duration-200 ${
              selected === "veg"
                ? "border-green-500 text-green-500"
                : "border-gray-500 text-gray-500"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-lg ${
                selected === "veg" ? "bg-green-500" : "bg-gray-500"
              }`}
            ></span>
            <span className="ml-2">Veg</span>
          </button>
          <button
            onClick={() => setSelected("nonveg")}
            className={`flex items-center px-4 py-2 border-2 rounded-lg transition-colors duration-200 ${
              selected === "nonveg"
                ? "border-red-500 text-red-500"
                : "border-gray-500 text-gray-500"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full ${
                selected === "nonveg" ? "bg-red-500" : "bg-gray-500"
              }`}
            ></span>
            <span className="ml-2">Non Veg</span>
          </button>
        </div>
      </div>

      <section className="bg-[#1F1D2B] p-4 rounded-xl mb-4 flex flex-wrap md:flex-nowrap gap-4">
        {/* Form Section */}
        <div className="flex-1 space-y-4 md:space-y-0 md:grid md:grid-cols-12 gap-4">
          {/* Item Name */}
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="item-name" className="text-white block mb-2">
              Item Name
            </label>
            <input
              type="text"
              id="item-name"
              placeholder="Enter Item Name"
              className="w-full p-2 bg-[#2D303E] rounded-xl text-white placeholder-gray-400"
            />
          </div>

          {/* Item Ingredients */}
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="item-ingredients" className="text-white block mb-2">
              Item Ingredients
            </label>
            <input
              type="text"
              id="item-ingredients"
              placeholder="Enter Item Ingredients"
              className="w-full p-2 bg-[#2D303E] rounded-xl text-white placeholder-gray-400"
            />
          </div>

          {/* Item Price */}
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="item-price" className="text-white block mb-2">
              Item Price
            </label>
            <input
              type="text"
              id="item-price"
              placeholder="Enter Item Price"
              className="w-full p-2 bg-[#2D303E] rounded-xl text-white placeholder-gray-400"
            />
          </div>

          {/* Add Discount */}
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="item-discount" className="text-white block mb-2">
              Add Discount
            </label>
            <input
              type="text"
              id="item-discount"
              placeholder="Enter Add Discount"
              className="w-full p-2 bg-[#2D303E] rounded-xl text-white placeholder-gray-400"
            />
          </div>

          {/* Select Item Type */}
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="item-type" className="text-white block mb-2">
              Select Item Type
            </label>
            <select
              id="item-type"
              className="w-full p-2 bg-[#2D303E] rounded-xl text-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select Item Type
              </option>
              <option>Spicy</option>
              <option>Sweet</option>
            </select>
          </div>

          <div className="col-span-12 md:col-span-4">
            <label htmlFor="item-category" className="text-white block mb-2">
              Select Category
            </label>
            <select
              id="item-category"
              className="w-full p-2 bg-[#2D303E] rounded-xl text-white"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Spice Level */}
          <div className="col-span-12 md:col-span-4">
            <label className="text-white block mb-2">Spice Level</label>
            <div className="flex flex-wrap space-x-4 text-white bg-[#2D303E] py-2 px-2 rounded-xl text-sm">
              <label className="flex items-center text-[#ABBBC2]">
                <input
                  type="radio"
                  name="spice-level"
                  value="Less Spicy"
                  className="mr-1 peer appearance-none w-4 h-4 border-2 border-[#ABBBC2] rounded-full checked:bg-[#CA923D]"
                />
                Less Spicy
              </label>
              <label className="flex items-center text-[#ABBBC2]">
                <input
                  type="radio"
                  name="spice-level"
                  value="Regular Spicy"
                  className="mr-1 peer appearance-none w-4 h-4 border-2 border-[#ABBBC2] rounded-full checked:bg-[#CA923D]"
                />
                Regular Spicy
              </label>
              <label className="flex items-center text-[#ABBBC2]">
                <input
                  type="radio"
                  name="spice-level"
                  value="Extra Spicy"
                  className="mr-1 peer appearance-none w-4 h-4 border-2 border-[#ABBBC2] rounded-full checked:bg-[#CA923D]"
                />
                Extra Spicy
              </label>
            </div>
          </div>
        </div>

        {/* Upload Item Image */}
        <div className="flex-none w-full md:w-[150px] lg:w-[200px] xl:w-[399px]">
          <label className="block text-sm mb-2 text-white">
            Upload Item Image
          </label>
          <div className="border-2 border-dashed border-gray-600 p-4 rounded-md text-center bg-[#2D303E]">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-yellow-500"
            >
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="mx-auto h-32 w-auto object-cover rounded-md"
                />
              ) : (
                <p className="text-blue-400">
                  <BiImageAdd className="text-gray-400 text-5xl mx-auto" />
                  Upload Image{" "}
                  <span className="text-white">or drag and drop</span>
                  <br />
                  <span className="text-sm text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </span>
                </p>
              )}
            </label>
          </div>
        </div>
      </section>

      {/* Toggle form visibility */}
      <div>
        {/* Toggle form visibility */}
        <label>
          <input
            type="checkbox"
            onChange={() => setShowForm(!showForm)}
            className="mr-2"
          />
          Customization
        </label>

        {/* Conditionally render the image if the form is not visible */}
        {!showForm && (
          <div className="flex justify-center">
            <img
              src="/assets/images/Group 1116602033.png" // Replace with the actual image URL
              alt="Illustration"
              className="w-full max-w-xs mt-8"
            />
          </div>
        )}

        {/* Form container */}
        {showForm && (
          <div
            style={{
              marginTop: "10px",
              backgroundColor: "#1F1D2B",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <div>
              {steps.map((step, index) => (
                <div key={index}>
                  <h2 style={{ fontSize: "23px", color: "#fff" }}>
                    Step {index + 1}
                  </h2>

                  <div className="top flex flex-wrap justify-between items-center">
                    <div className="left w-[70%] sm:w-[60%] md:w-[70%] flex flex-wrap items-center gap-x-2 sm:my-3">
                      <div className="w-[30%] sm:w-[60%] md:w-[30%] ">
                        <label
                          htmlFor={`customization-title-${index}`}
                          style={{ display: "block", color: "#fff" }}
                        >
                          Customization Title
                        </label>
                        <input
                          id={`customization-title-${index}`}
                          type="text"
                          value={step.title}
                          placeholder="Enter Customization Title"
                          onChange={(e) =>
                            handleChange(index, "title", e.target.value)
                          }
                          style={{
                            padding: "10px",
                            width: "100%",
                            backgroundColor: "#2D303E",
                            color: "#fff",
                            marginBottom: "15px",
                          }}
                          className="rounded-xl"
                        />
                      </div>

                      <div className="">
                        <label className="bg-[#2D303E] p-2 rounded-l-xl text-[#ABBBC2]">
                          <input
                            type="radio"
                            className="mr-1 peer appearance-none w-4 h-4 border-2 border-[#ABBBC2] rounded-full checked:bg-[#CA923D]"
                            name={`selection-${index}`}
                            value="multiple"
                            onChange={(e) =>
                              handleChange(index, "selection", e.target.value)
                            }
                          />{" "}
                          Multiple Selection
                        </label>

                        <label className="bg-[#2D303E] p-2 rounded-r-xl text-[#ABBBC2]">
                          <input
                            className="mr-1 peer appearance-none w-4 h-4 border-2 border-[#ABBBC2] rounded-full checked:bg-[#CA923D]"
                            type="radio"
                            name={`selection-${index}`}
                            value="single"
                            onChange={(e) =>
                              handleChange(index, "selection", e.target.value)
                            }
                          />{" "}
                          Single Selection
                        </label>
                      </div>
                    </div>
                    <div className="right">
                      <button
                        className=""
                        style={{
                          marginTop: "10px",
                          backgroundColor: "#CA923D",
                          color: "text-white",
                          padding: "10px 20px",
                          borderRadius: "5px",
                        }}
                        onClick={() => addCustomization(index)}
                        // disabled={!steps.every(isStepFilled)}
                      >
                        <span className="flex items-center gap-2">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM18 12.75H12.75V18C12.75 18.41 12.41 18.75 12 18.75C11.59 18.75 11.25 18.41 11.25 18V12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H11.25V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z"
                              fill="white"
                            />
                          </svg>
                          Add Customization
                        </span>
                      </button>
                    </div>
                  </div>

                  {step.options.length > 0 &&
                    step.options.map((cust, customiseIndex) => {
                      return (
                        <>
                          <div
                            className="bg-[#252836] p-4 rounded-xl"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <div style={{ marginRight: "10px", width: "30%" }}>
                              <label
                                className="text-sm "
                                htmlFor={`customization-name-${index}`}
                                style={{
                                  display: "block",
                                  color: "#fff",
                                  marginBottom: "5px",
                                }}
                              >
                                Customization Name
                              </label>
                              <input
                                id={`customization-name-${index}`}
                                type="text"
                                value={cust.name}
                                placeholder="Enter Customization Name"
                                onChange={(e) =>
                                  handleStepCustomiseChange(
                                    index,
                                    customiseIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                                style={{
                                  padding: "10px",
                                  width: "100%",
                                  backgroundColor: "#343644",
                                  color: "#fff",
                                }}
                                className="rounded-xl"
                              />
                            </div>
                            <div style={{ marginRight: "10px", width: "30%" }}>
                              <label
                                className="text-sm"
                                htmlFor={`customization-detail-${index}`}
                                style={{
                                  display: "block",
                                  color: "#fff",
                                  marginBottom: "5px",
                                }}
                              >
                                Customization Detail
                              </label>
                              <input
                                id={`customization-detail-${index}`}
                                type="text"
                                value={cust.detail}
                                placeholder="Enter Customization Detail"
                                onChange={(e) =>
                                  handleStepCustomiseChange(
                                    index,
                                    customiseIndex,
                                    "detail",
                                    e.target.value
                                  )
                                }
                                style={{
                                  padding: "10px",
                                  width: "100%",
                                  backgroundColor: "#343644",
                                  color: "#fff",
                                }}
                                className="rounded-xl"
                              />
                            </div>
                            <div style={{ marginRight: "10px", width: "30%" }}>
                              <label
                                className="text-sm"
                                htmlFor={`extra-rate-${index}`}
                                style={{
                                  display: "block",
                                  color: "#fff",
                                  marginBottom: "5px",
                                }}
                              >
                                Extra Rate
                              </label>
                              <input
                                id={`extra-rate-${index}`}
                                type="text"
                                value={cust.rate}
                                placeholder="Enter Extra Rate"
                                onChange={(e) =>
                                  handleStepCustomiseChange(
                                    index,
                                    customiseIndex,
                                    "rate",
                                    e.target.value
                                  )
                                }
                                style={{
                                  padding: "10px",
                                  width: "100%",
                                  backgroundColor: "#343644",
                                  color: "#fff",
                                }}
                                className="rounded-xl"
                              />
                            </div>

                            <button className="ml-3 mt-8">
                              <svg
                                width="42"
                                height="43"
                                viewBox="0 0 42 43"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.5"
                                  y="1"
                                  width="41"
                                  height="41"
                                  rx="9.5"
                                  fill="#E74C3C"
                                />
                                <rect
                                  x="0.5"
                                  y="1"
                                  width="41"
                                  height="41"
                                  rx="9.5"
                                  stroke="#333748"
                                />
                                <path
                                  d="M31.0702 14.73C29.4602 14.57 27.8502 14.45 26.2302 14.36V14.35L26.0102 13.05C25.8602 12.13 25.6402 10.75 23.3002 10.75H20.6802C18.3502 10.75 18.1302 12.07 17.9702 13.04L17.7602 14.32C16.8302 14.38 15.9002 14.44 14.9702 14.53L12.9302 14.73C12.5102 14.77 12.2102 15.14 12.2502 15.55C12.2902 15.96 12.6502 16.26 13.0702 16.22L15.1102 16.02C20.3502 15.5 25.6302 15.7 30.9302 16.23C30.9602 16.23 30.9802 16.23 31.0102 16.23C31.3902 16.23 31.7202 15.94 31.7602 15.55C31.7902 15.14 31.4902 14.77 31.0702 14.73Z"
                                  fill="white"
                                />
                                <path
                                  d="M29.2302 17.64C28.9902 17.39 28.6602 17.25 28.3202 17.25H15.6802C15.3402 17.25 15.0002 17.39 14.7702 17.64C14.5402 17.89 14.4102 18.23 14.4302 18.58L15.0502 28.84C15.1602 30.36 15.3002 32.26 18.7902 32.26H25.2102C28.7002 32.26 28.8402 30.37 28.9502 28.84L29.5702 18.59C29.5902 18.23 29.4602 17.89 29.2302 17.64ZM23.6602 27.25H20.3302C19.9202 27.25 19.5802 26.91 19.5802 26.5C19.5802 26.09 19.9202 25.75 20.3302 25.75H23.6602C24.0702 25.75 24.4102 26.09 24.4102 26.5C24.4102 26.91 24.0702 27.25 23.6602 27.25ZM24.5002 23.25H19.5002C19.0902 23.25 18.7502 22.91 18.7502 22.5C18.7502 22.09 19.0902 21.75 19.5002 21.75H24.5002C24.9102 21.75 25.2502 22.09 25.2502 22.5C25.2502 22.91 24.9102 23.25 24.5002 23.25Z"
                                  fill="white"
                                />
                              </svg>
                            </button>
                          </div>
                        </>
                      );
                    })}
                  {/* 
                              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                  <div style={{ marginRight: "10px", width: "30%" }}>
                                      <label htmlFor={`customization-name-${index}`} style={{ display: "block", color: "#fff", marginBottom: "5px" }}>
                                          Customization Name
                                      </label>
                                      <input
                                          id={`customization-name-${index}`}
                                          type="text"
                                          value={step.name}
                                          placeholder="Enter Customization Name"
                                          onChange={(e) => handleChange(e, index, 'name')}
                                          style={{
                                              padding: "10px",
                                              width: "100%",
                                              borderRadius: "5px",
                                              backgroundColor: "#343644",
                                              color: "#fff",
                                          }}
                                      />
                                  </div>
                                  <div style={{ marginRight: "10px", width: "30%" }}>
                                      <label htmlFor={`customization-detail-${index}`} style={{ display: "block", color: "#fff", marginBottom: "5px" }}>
                                          Customization Detail
                                      </label>
                                      <input
                                          id={`customization-detail-${index}`}
                                          type="text"
                                          value={step.detail}
                                          placeholder="Enter Customization Detail"
                                          onChange={(e) => handleChange(e, index, 'detail')}
                                          style={{
                                              padding: "10px",
                                              width: "100%",
                                              borderRadius: "5px",
                                              backgroundColor: "#343644",
                                              color: "#fff",
                                          }}
                                      />
                                  </div>
                                  <div style={{ marginRight: "10px", width: "30%" }}>
                                      <label htmlFor={`extra-rate-${index}`} style={{ display: "block", color: "#fff", marginBottom: "5px" }}>
                                          Extra Rate
                                      </label>
                                      <input
                                          id={`extra-rate-${index}`}
                                          type="text"
                                          value={step.rate}
                                          placeholder="Enter Extra Rate"
                                          onChange={(e) => handleChange(e, index, 'rate')}
                                          style={{
                                              padding: "10px",
                                              width: "100%",
                                              borderRadius: "5px",
                                              backgroundColor: "#343644",
                                              color: "#fff",
                                          }}
                                      />
                                  </div>
                                      
                                  <button className='ml-3 mt-8'
                                      style={{
                                          backgroundColor: "red",
                                          color: "white",
                                          borderRadius: "5px",
                                          padding: "10px",
                                      }}
                                  >
                                      🗑
                                  </button>
                              </div>

                               <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                  <div style={{ marginRight: "10px", width: "30%" }}>
                                      <label htmlFor={`customization-name-${index}`} style={{ display: "block", color: "#fff", marginBottom: "5px" }}>
                                          Customization Name
                                      </label>
                                      <input
                                          id={`customization-name-${index}`}
                                          type="text"
                                          value={step.name}
                                          placeholder="Enter Customization Name"
                                          onChange={(e) => handleChange(e, index, 'name')}
                                          style={{
                                              padding: "10px",
                                              width: "100%",
                                              borderRadius: "5px",
                                              backgroundColor: "#343644",
                                              color: "#fff",
                                          }}
                                      />
                                  </div>
                                  <div style={{ marginRight: "10px", width: "30%" }}>
                                      <label htmlFor={`customization-detail-${index}`} style={{ display: "block", color: "#fff", marginBottom: "5px" }}>
                                          Customization Detail
                                      </label>
                                      <input
                                          id={`customization-detail-${index}`}
                                          type="text"
                                          value={step.detail}
                                          placeholder="Enter Customization Detail"
                                          onChange={(e) => handleChange(e, index, 'detail')}
                                          style={{
                                              padding: "10px",
                                              width: "100%",
                                              borderRadius: "5px",
                                              backgroundColor: "#343644",
                                              color: "#fff",
                                          }}
                                      />
                                  </div>
                                  <div style={{ marginRight: "10px", width: "30%" }}>
                                      <label htmlFor={`extra-rate-${index}`} style={{ display: "block", color: "#fff", marginBottom: "5px" }}>
                                          Extra Rate
                                      </label>
                                      <input
                                          id={`extra-rate-${index}`}
                                          type="text"
                                          value={step.rate}
                                          placeholder="Enter Extra Rate"
                                          onChange={(e) => handleChange(e, index, 'rate')}
                                          style={{
                                              padding: "10px",
                                              width: "100%",
                                              borderRadius: "5px",
                                              backgroundColor: "#343644",
                                              color: "#fff",
                                          }}
                                      />
                                  </div>
                                      
                                  <button className='ml-3 mt-8'
                                      style={{
                                          backgroundColor: "red",
                                          color: "white",
                                          borderRadius: "5px",
                                          padding: "10px",
                                      }}
                                  >
                                      🗑
                                  </button>
                              </div>                                */}
                </div>
              ))}
            </div>

            <div className="space-x-3 font-medium text-m flex justify-end pt-3">
              <button
                className=" bg-[#CA923D] rounded-md px-6 py-2 items-end"
                type="button"
                onClick={() => addStep()}
              >
                <span className="flex gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM18 12.75H12.75V18C12.75 18.41 12.41 18.75 12 18.75C11.59 18.75 11.25 18.41 11.25 18V12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H11.25V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z"
                      fill="white"
                    />
                  </svg>
                  Add Step {steps.length + 1}{" "}
                  {/* Display the next step number */}
                </span>
              </button>
              <button
                className=" bg-[#2A2A38] rounded-md px-8 py-2"
                type="button"
                onClick={handleSubmit} // Assuming `saveSteps` is the function to handle saving
                // disabled={steps.length < 3 || !steps.every(isStepFilled)} // Enable Save only when 3 steps are filled
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddItems;
