import React from "react";
import { FaCaretRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const PaymentMethod = () => {
  const navigate = useNavigate();
  const navigateHome = () => {
    alert("Your Payment Success Done");
    navigate('/parcel-Homepage')
  }
  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col px-4">
      {/* Header */}
      <div className="flex items-center py-4">
        <button className="text-white text-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h1 className="flex-grow text-center text-lg font-semibold">
          Payment Method
        </h1>
      </div>

      {/* Card Selection */}
      <div className="bg-[#1D1D1D] p-4 rounded-lg space-y-4 mb-40">
        {/* Master Card */}
        <div className="flex items-center space-x-4 border-b border-gray-700 pb-4 mt-5 mb-5">
          <img
            src="./assets/images/Frame.png"
            alt="Master Card"
            className="w-10 h-10"
          />
          <h2 className="flex-grow font-medium">Master Card</h2>
          <input type="radio" name="payment-method" className="accent-yellow-500" />
        </div>

        {/* Card Holder Name */}
        <div>
          <label className="text-gray-400 text-sm">Card Holder Name*</label>
          <input
            type="text"
            placeholder="Marcus George"
            value="Marcus George"
            className="w-full bg-[#2A2A2A] mt-2 px-4 py-2 rounded-md outline-none text-gray-300"
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="text-gray-400 text-sm">Card Number*</label>
          <input
            type="text"
            placeholder="1234 4567 8745 5212"
            value="1234 4567 8745 5212"
            className="w-full bg-[#2A2A2A] mt-2 px-4 py-2 rounded-md outline-none text-gray-300"
          />
        </div>

        {/* Expiry and CVV */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="text-gray-400 text-sm">Expiry Date*</label>
            <input
              type="text"
              placeholder="11/2"
              value="11/2"
              className="w-full bg-[#2A2A2A] mt-2 px-4 py-2 rounded-md outline-none text-gray-300"
            />
          </div>
          <div className="flex-1">
            <label className="text-gray-400 text-sm">CVV*</label>
            <input
              type="text"
              placeholder="512"
              value="512"
              className="w-full bg-[#2A2A2A] mt-2 px-4 py-2 rounded-md outline-none text-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Visa and UPI */}
      <div className="bg-[#1D1D1D] p-4 rounded-lg space-y-4
      ">
      <div className="flex items-center space-x-4 ">
      <img
            src="./assets/images/Frame 1000004335.png"
            alt="Visa Card"
            className="w-10 h-10"
          />
          <h2 className="flex-grow font-medium">Visa Card</h2>
          <input type="radio" name="payment-method" className="accent-yellow-500" />
        </div>
        <div className="flex items-center space-x-4">
          <img
            src="./assets/images/Frame 1000004336.png"
            alt="UPI"
            className="w-10 h-10"
          />
          <h2 className="flex-grow font-medium">UPI</h2>
          <input type="radio" name="payment-method" className="accent-yellow-500" />  
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-[375px] bg-[#1A1B23] p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Payable Amount </p>
          <p className="text-lg font-semibold">₹ 2,050</p>
        </div>
        <button
          className="bg-[#C68A15] text-white py-3 px-6 rounded-full text-sm font-medium flex items-center"
          onClick={navigateHome}
        >
          Pay Now
          <FaCaretRight size={20} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;     
