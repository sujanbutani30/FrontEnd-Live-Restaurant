
import React from 'react';
import { MdSave } from "react-icons/md";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  categoryName: string;
  imageUrl: string;
}

export default function SaveModal({ isOpen, onClose, onSave, categoryName, imageUrl }: SaveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-80 md:w-96">
        <h2 className="text-lg font-semibold mb-4">Save Category</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryName}
            readOnly
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category Image</label>
          <div className="border-2 border-dashed border-gray-600 bg-gray-700 rounded-lg p-4 text-center">
            <img
              src={imageUrl}
              alt="Category Preview"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <button
            className="px-12 py-2 ml-4 border border-gray-500 rounded-lg hover:bg-gray-700 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="font-semibold py-2 px-12 rounded-lg shadow-md bg-yellow-600 hover:bg-yellow-500 transition flex items-center"
            onClick={onSave}
          >
            <MdSave className="text-white mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
