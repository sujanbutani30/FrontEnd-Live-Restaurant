import React from "react";

const Modal = ({ showModal, closeModal, selectedOrder }) => {
  if (!showModal) return null;

  return (
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
              <strong>Bill No:</strong> GRT1715
            </p>
            <p>
              <strong>Date:</strong> 24/01/2024
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <p>
              <strong>Time:</strong> 7:00 PM
            </p>
            <p>
              <strong>Customer:</strong> 98266 66655
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <p>
              <strong>Name:</strong> Chance Geidt
            </p>
            <p>
              <strong>Payment:</strong>{" "}
              <span className="text-green-500">Online</span>
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
            <div className="flex justify-between mb-1">
              <p className="min-w-[150px]">Jeera Rice</p>
              <p className="min-w-[60px]">2</p>
              <p className="min-w-[80px] text-right">290.00</p>
            </div>
            <div className="flex justify-between mb-1">
              <p className="min-w-[150px]">Veg Manhwa So</p>
              <p className="min-w-[60px]">1</p>
              <p className="min-w-[80px] text-right">119.00</p>
            </div>
            <div className="flex justify-between mb-1">
              <p className="min-w-[150px]">Dal Tadka</p>
              <p className="min-w-[60px]">1</p>
              <p className="min-w-[80px] text-right">215.00</p>
            </div>
            <div className="flex justify-between mb-1">
              <p className="min-w-[150px]">Butter Tandoor</p>
              <p className="min-w-[60px]">1</p>
              <p className="min-w-[80px] text-right">45.00</p>
            </div>
            <div className="flex justify-between mb-1">
              <p className="min-w-[150px]">Garlic Naan</p>
              <p className="min-w-[60px]">5</p>
              <p className="min-w-[80px] text-right">300.00</p>
            </div>
            <div className="flex justify-between mb-1">
              <p className="min-w-[150px]">Veg Sweet Corn</p>
              <p className="min-w-[60px]">1</p>
              <p className="min-w-[80px] text-right">119.00</p>
            </div>
            <div className="flex justify-between mb-1">
              <p className="min-w-[150px]">Plain Papad</p>
              <p className="min-w-[60px]">2</p>
              <p className="min-w-[80px] text-right">160.00</p>
            </div>
            <div className="flex justify-between mb-1">
              <p className="min-w-[150px]">Baked Veg With</p>
              <p className="min-w-[60px]">1</p>
              <p className="min-w-[80px] text-right">270.00</p>
            </div>
            <div className="flex justify-between mb-1">
              <p className="min-w-[150px]">Biryani Rice</p>
              <p className="min-w-[60px]">2</p>
              <p className="min-w-[80px] text-right">315.00</p>
            </div>
          </div>
        </div>

        {/* Total Section */}
        <div className="mt-4 text-sm">
          <div className="flex justify-between mb-1 font-semibold">
            <p>Total Amount</p>
            <p>₹ 1315.00</p>
          </div>
          <div className="flex justify-between mb-1">
            <p>SGST 2.5%</p>
            <p>₹ 32.88</p>
          </div>
          <div className="flex justify-between mb-1">
            <p>CGST 2.5%</p>
            <p>₹ 32.88</p>
          </div>
        </div>

        {/* Grand Total */}
        <div className="mt-4 border-t border-gray-700 pt-2 text-sm font-semibold">
          <div className="flex justify-between">
            <p>Grand Total Amount</p>
            <p>₹ 1381.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;