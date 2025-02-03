import React, { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import { BiImageAdd } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  addCategory,
  fetchItems,
  updateItem,
  deleteItem,
} from "../../api/manageMenuApi";
import { BASE_URL } from '../../config';

const Managemenu = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); // Stores category ID
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dotsMenuOpen, setDotsMenuOpen] = useState(null);

  const navigate = useNavigate();

  // Fetch categories and items on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        const itemsData = await fetchItems();
        console.log("Items Data:", itemsData); // Debugging: Log items data
        setItems(itemsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [refreshKey]);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Set the preview image
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Toggle dots menu for each item
  const toggleDotsMenu = (itemId) => {
    setDotsMenuOpen(dotsMenuOpen === itemId ? null : itemId);
  };

  // Open edit modal for an item
  const openEditModal = async (itemId) => {
    try {
      const item = items.find((item) => item._id === itemId);
      if (item) {
        setEditingItem(item);
        setIsEditOpen(true);
      }
    } catch (error) {
      console.error("Error opening edit modal:", error);
    }
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingItem(null);
  };

  // Open delete confirmation modal
  const handleOpenDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  // Close delete confirmation modal
  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setItemToDelete(null);
  };

  // Handle adding a new category
  const handleAddCategory = async () => {
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("image", selectedImageFile);

    try {
      await addCategory(formData);
      setRefreshKey((prevKey) => prevKey + 1);
      setIsPopupOpen(false);
      setCategoryName(""); // Reset category name
      setPreviewImage(null); // Reset preview image
      setSelectedImageFile(null); // Reset selected image file
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Handle updating an item
  const handleUpdateItem = async (updatedItem) => {
    try {
      await updateItem(updatedItem._id, updatedItem);
      setRefreshKey((prevKey) => prevKey + 1);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Handle deleting an item
  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId);
      setRefreshKey((prevKey) => prevKey + 1);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Helper function to construct the image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return ""; // Return a placeholder image or an empty string
    }
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl; // Use the absolute URL as is
    }
    return `${BASE_URL}/${imageUrl}`; // Prepend the base URL for relative paths
  };

  // Filter items based on the selected category
  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.categoryId && item.categoryId._id === selectedCategory);

  // Debugging: Log the selected category, categories, and filtered items
  useEffect(() => {
    console.log("Selected Category ID:", selectedCategory);
    console.log("All Categories:", categories);
    console.log("Filtered Items:", filteredItems);
  }, [selectedCategory, items]);

  return (
    <>
      {/* Category Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">
          Categories ({categories.length})
        </h3>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-[#CA923D] hover:bg-yellow-700 text-white font-semibold sm:text-[12px] md:text-[16px] py-2 px-2 rounded-lg shadow-md flex items-center"
        >
          <MdAddBox className="text-white mr-2" />
          Add Categories
        </button>
        {/* Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 text-white rounded-lg p-6 md:w-96 sm:w-90">
              <h2 className="text-lg font-bold mb-4">Add Category</h2>

              {/* Category Name Input */}
              <div className="mb-4">
                <label className="block text-sm mb-2">Category Name</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter Category Name"
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm mb-2">Upload Item Image</label>
                <div className="border-2 border-dashed border-gray-600 p-4 rounded-md text-center">
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
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mx-auto h-32 w-auto object-cover rounded-md"
                      />
                    ) : (
                      <>
                        <p className="text-blue-400">
                          <BiImageAdd className="text-gray-400 text-5xl ml-32" />
                          Upload Image{" "}
                          <span className="text-white">or drag and drop</span>{" "}
                          <br />
                          <span className="text-sm text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </span>
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="bg-[#CA923D] hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Displaying categories in a grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`text-white p-2 rounded-md flex items-center ${
            selectedCategory === "All" ? "bg-[#CA923D]" : "bg-gray-800"
          }`}
        >
          <img
            src="./assets/images/pngwing 14-2.png"
            alt="all"
            className="w-10 h-10 mr-2 bg-gray-900"
          />
          All
        </button>
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category._id)} // Use category ID
            className={`text-white p-2 rounded-md flex items-center ${
              selectedCategory === category._id ? "bg-[#CA923D]" : "bg-gray-800"
            }`}
          >
            <img
              src={getImageUrl(category.image)} // Use the helper function
              alt={category.categoryName}
              className="w-10 h-10 mr-2 bg-gray-900"
            />
            {category.categoryName}
          </button>
        ))}
      </div>

      {/* Burger Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold  text-white mt-6">
          {selectedCategory === "All"
            ? "All"
            : categories.find((cat) => cat._id === selectedCategory)
                ?.categoryName}
        </h2>
        <button
          type="button"
          onClick={() =>
            navigate("/additems", { state: { category: selectedCategory } })
          }
          className="bg-[#CA923D] hover:bg-yellow-700 white mt-5 font-semibold sm:text-[14px] md:text-[16px] py-2 px-6 rounded-lg shadow-md flex items-center"
        >
          <MdAddBox className="text-white mr-2" />
          Add{" "}
          {selectedCategory === "All"
            ? "Item"
            : categories.find((cat) => cat._id === selectedCategory)
                ?.categoryName}
        </button>
      </div>

      {/* Display filtered items */}
      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 w-full rounded-lg p-4 text-gray-300 relative"
            >
              <div className="bg-gray-700 w-full h-36 flex items-center justify-center rounded-lg">
                <img
                  src={getImageUrl(item.imageUrl)} // Use the helper function
                  alt={item.itemName}
                  className="w-40 ml-1 h-28 object-cover rounded-md mb-2"
                />
              </div>

              {/* Discount Label */}
              {item.discount && (
                <div className="absolute top-0 left-2 bg-[#CA923D] text-white text-sm px-1 py-1 rounded-md">
                  {item.discount} %
                </div>
              )}

              <button
                onClick={() => toggleDotsMenu(item._id)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-200"
              >
                <FaEllipsisV />
              </button>

              {dotsMenuOpen === item._id && (
                <div className="absolute top-10 right-2 bg-gray-700 text-white rounded-md shadow-md py-1 w-28">
                  <button
                    onClick={() => openEditModal(item._id)}
                    className="hover:text-yellow-600 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Edit Burger
                  </button>
                  <button
                    onClick={() => handleOpenDelete(item)}
                    className="block w-full text-left px-4 py-2 hover:text-yellow-600 hover:bg-gray-600"
                  >
                    Delete
                  </button>
                </div>
              )}

              <h3 className="text-base font-semibold">{item.itemName}</h3>
              <p className="text-sm mt-1">{item.spiceLevel}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-white-400">
                  {item.price}
                </span>
                {/* Veg/Non-Veg Icon */}
                <div
                  className={`relative mb-2 border-dotted border-2 rounded-full p-3 ${
                    item.itemType === "veg"
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                >
                  <span
                    className={`absolute bottom-3 right-3 transform translate-x-1/2 translate-y-1/2 rounded-full ${
                      item.itemType === "veg" ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: "15px", height: "15px" }}
                    title={item.itemType === "veg" ? "Veg" : "Non-Veg"}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No items found</p>
        )}
      </div>

      {/* Edit Item Modal */}
      {isEditOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 text-white w-96 p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Edit Item</h2>

            {/* Image Upload Section */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Upload Item Image
              </label>
              <div className="w-full h-32 bg-gray-700 rounded flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  className="w-full p-2 bg-gray-700 rounded"
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, image: e.target.files[0] })
                  }
                />
              </div>
            </div>

            {/* Item Name Input */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Item Name
              </label>
              <input
                type="text"
                value={editingItem.itemName}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, itemName: e.target.value })
                }
                className="w-full p-2 bg-gray-700 rounded"
              />
            </div>

            {/* Item Ingredients Input */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Item Ingredients
              </label>
              <input
                type="text"
                value={editingItem.ingredients}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    ingredients: e.target.value,
                  })
                }
                className="w-full p-2 bg-gray-700 rounded"
              />
            </div>

            {/* Item Rate and Discount */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium">
                  Item Rate
                </label>
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, price: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium">
                  Add Discount (%)
                </label>
                <input
                  type="number"
                  value={editingItem.discount}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, discount: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>
            </div>

            {/* Select Availability */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Select Availability
              </label>
              <select
                value={editingItem.availability}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    availability: e.target.value,
                  })
                }
                className="w-full p-2 bg-gray-700 rounded"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={closeEditModal}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateItem(editingItem)}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 text-white w-80 p-6 rounded-lg shadow-lg relative">
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div className="bg-red-600 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 13h6m2 10H7a2 2 0 01-2-2V7h14v14a2 2 0 01-2 2zm5-19H5a2 2 0 00-2-2v2h18V4a2 2 0 00-2-2z"
                  />
                </svg>
              </div>
              {/* Message */}
              <h2 className="text-lg font-bold mb-2">
                Delete {itemToDelete.itemName}
              </h2>
              <p className="text-sm text-gray-400 mb-6 text-center">
                Are you sure you want to delete this item?
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleCloseDelete}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-1/3"
              >
                No
              </button>
              <button
                onClick={() => handleDeleteItem(itemToDelete._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-1/3"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Managemenu;