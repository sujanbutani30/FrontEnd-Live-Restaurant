// DeleteConfirmationModal.js
import React from "react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1e1e2d] rounded-lg p-6 w-[350px]">
        <h2 className="text-white text-xl font-semibold mb-4">
          Delete QR Code
        </h2>

        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-600 p-4 rounded-full border-2 border-pink-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              width="36"
              height="36"
            >
              <path d="M3 6h18v2H3V6zm3 4v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10H6zm8 6v-6h2v6h-2zm-4 0v-6h2v6H10zm-3-14h10l1 1H6l1-1z" />
            </svg>
          </div>
        </div>

        <p className="text-gray-400 text-center mb-6">
          <strong className="text-white text-2xl font-medium ml-3">
            Delete This Qr Code
          </strong>{" "}
          <br />
          <span className="ml-6">
            {" "}
            Are you sure you want to delete <br /> this item?
          </span>
        </p>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-14 rounded-lg"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-14 rounded-lg"
          >
            Yes 
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;