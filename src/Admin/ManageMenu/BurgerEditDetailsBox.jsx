
import React, { useState } from "react";

const BurgerEditDetailsBox = ({ isOpen, onClose, onSave }) => {
  const [itemImage, setItemImage] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [availability, setAvailability] = useState("available");
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setItemImage(file);
    setImagePreview(URL.createObjectURL(file)); // Preview the uploaded image
  };

  const handleSave = () => {
    // Ensure all required fields are filled before saving
    if (!itemName || !itemDescription || !itemPrice || !discount) {
      alert("Please fill out all fields.");
      return;
    }

    const burgerDetails = {
      itemImage,
      itemName,
      itemDescription,
      itemPrice,
      discount,
      availability,
    };

    onSave(burgerDetails); // Send the data to the parent component
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Edit Burger Details</h2>
        
        {/* Upload Item Image */}
        <div className="mb-4">
          <label className="block font-medium">Upload Item Image</label>
          <input 
            type="file" 
            onChange={handleImageUpload} 
            className="mb-2"
          />
          {imagePreview && (
            <div className="mb-4">
              <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md" />
            </div>
          )}
        </div>

        {/* Item Name */}
        <div className="mb-4">
          <label className="block font-medium">Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Item Description */}
        <div className="mb-4">
          <label className="block font-medium">Item Description</label>
          <textarea
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Item Price */}
        <div className="mb-4">
          <label className="block font-medium">Item Price</label>
          <input
            type="number"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Discount Percentage */}
        <div className="mb-4">
          <label className="block font-medium">Discount %</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Availability Dropdown */}
        <div className="mb-4">
          <label className="block font-medium">Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        {/* Cancel and Save Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BurgerEditDetailsBox;
