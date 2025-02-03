'use client';

import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaCaretRight } from 'react-icons/fa';
import { IoIosCloseCircle } from "react-icons/io";
// Remove the Next.js import
// import { useRouter } from 'next/navigation';

export default function AddMoreItems() {
  // Remove the router initialization
  // const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Online');
  const [isTimerPopupOpen, setIsTimerPopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isCashPaymentPopupOpen, setIsCashPaymentPopupOpen] = useState(false);
  const [isBillDetailsPopupOpen, setIsBillDetailsPopupOpen] = useState(false);
  const [timer, setTimer] = useState(5);

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const handlePaymentSelection = (method) => {
    setSelectedPayment(method);
  };

  const handlePayClick = () => {
    if (selectedPayment === 'Cash') {
      setIsPopupOpen(false);
      setIsTimerPopupOpen(true);
    } else {
      // Navigate to the payment method page for online payment
      // Use window.location for navigation instead of Next.js router
      window.location.href = '/paymentmethod';
    }
  };

  const handleDoneClick = () => {
    setIsSuccessPopupOpen(false);
    setIsCashPaymentPopupOpen(true);
  };

  useEffect(() => {
    let interval;
    if (isTimerPopupOpen) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    if (timer === 0 && isTimerPopupOpen) {
      setIsTimerPopupOpen(false);
      setIsSuccessPopupOpen(true);
    }

    return () => clearInterval(interval);
  }, [timer, isTimerPopupOpen]);

  useEffect(() => {
    if (isCashPaymentPopupOpen) {
      const timer = setTimeout(() => {
        setIsCashPaymentPopupOpen(false);
        setIsBillDetailsPopupOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isCashPaymentPopupOpen]);

  return (
    <div className="bg-[#0A0B14] min-h-screen w-full text-white relative">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-800">
        <a href="/cartpage" className="p-2">
          <FaChevronLeft className="w-6 h-6" />
        </a>
        <h1 className="text-lg ml-28 font-medium">Cart</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-6 pt-12 pb-32">
        {/* Illustration */}
        <div className="w-[240px] h-[240px] relative pb-3">
          <img
            src="./assets/images/21532513_6461715 1.png"
            alt="Person eating at table illustration"
            width={240}
            height={240}
            className="object-contain"
          />
        </div>

        {/* Text */}
        <p className="text-center text-gray-300 text-sm mb-2">
          If you want to order another item, you
          <br />
          can order this button.
        </p>
        <p className="text-center text-gray-300 text-sm mb-6">
          If you want to order another item, you
          <br /> can order this button.
        </p>

        {/* Add More Button */}
        <button className="bg-[#C68A15] text-white py-3 px-8 rounded-full text-sm font-medium">
          Add More Items
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[#1A1B23] p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">5 Items Added</p>
          <p className="text-lg font-semibold">₹ 2,050</p>
        </div>
        <button
          className="bg-[#C68A15] text-white py-3 px-6 rounded-full text-sm font-medium flex items-center"
          onClick={togglePopup}
        >
          Place Order
          <FaCaretRight size={20} className="ml-1" />
        </button>
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1A1B23] w-[300px] rounded-lg p-6">
            {/* Popup Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Select Payment</h3>
              <button
                className="text-gray-400 hover:text-white"
                style={{ fontSize: '20px' }}
                onClick={togglePopup}
              >
                <IoIosCloseCircle />
              </button>
            </div>

            {/* Payment Options */}
            <div className="flex justify-between items-center mb-6">
              {/* Online Payment */}
              <div
                onClick={() => handlePaymentSelection('Online')}
                className={`w-[120px] h-[120px] flex flex-col justify-center items-center rounded-lg cursor-pointer transition ${
                  selectedPayment === 'Online'
                    ? 'border-2 border-[#C68A15] bg-gray-800'
                    : 'bg-gray-800 border border-transparent'
                }`}
              >
                <div
                  style={{ marginLeft: "75px" }}
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedPayment === 'Online'
                      ? 'border-[#C68A15] bg-[#C68A15]'
                      : 'border-gray-500'
                  }`}
                />
                <img
                  src="./assets/images/28.png"
                  alt="Online"
                  className="w-10 h-10 mb-2 mt-2"
                />
                <p className="text-sm text-white">Online</p>
              </div>

              {/* Cash Payment */}
              <div
                onClick={() => handlePaymentSelection('Cash')}
                className={`w-[120px] h-[120px] flex flex-col justify-center items-center rounded-lg cursor-pointer transition ${
                  selectedPayment === 'Cash'
                    ? 'border-2 border-[#C68A15] bg-gray-800'
                    : 'bg-gray-800 border border-transparent'
                }`}
              >
                <div
                  style={{ marginLeft: "75px" }}
                  className={`w-4 h-4 rounded-full border-2 mt-2 ${
                    selectedPayment === 'Cash'
                      ? 'border-[#C68A15] bg-[#C68A15]'
                      : 'border-gray-500'
                  }`}
                />
                <img
                  src="./assets/images/29.png"
                  alt="Cash"
                  className="w-10 h-10 mb-2 mt-2"
                />
                <p className="text-sm text-white">Cash</p>
              </div>
            </div>

            {/* Pay Button */}
            <button className="bg-[#C68A15] text-white py-2 w-full rounded-full text-sm font-medium" onClick={handlePayClick}>
              Pay
            </button>
          </div>
        </div>
      )}

      {/* Cash Payment Timer Popup */}
      {isTimerPopupOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1A1B23] w-[300px] rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Cash Payment Timer
            </h3>
            <p className="text-4xl font-bold text-[#C68A15] mb-4">{timer}s</p>
            <p className="text-sm text-gray-300">
              Pay your bill at the cash counter to confirm your order!
            </p>
          </div>
        </div>
      )}

      {/* Payment Success Popup */}
      {isSuccessPopupOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1A1B23] w-[300px] rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Payment Successfully
            </h3>
            <img
              src="./assets/images/success.png"
              alt="Payment Successful"
              className=" mx-auto mb-4"
            />
            <button
              className="bg-[#C68A15] text-white py-2 w-full rounded-full text-sm font-medium"
              onClick={handleDoneClick}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Cash Payment Final Popup */}
      {isCashPaymentPopupOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1A1B23] w-[330px] rounded-lg p-6 text-center">
            {/* Header */}
            <h3 className="text-lg font-semibold text-white mb-2">Cash Payment</h3>
            {/* Horizontal Line */}
            <hr className="border-t-[1px] border-gray-500 mb-4" />

            {/* Content */}
            <div>
              <h3 className="text-lg text-white font-semibold " style={{ fontSize: '16px' }}>
                Thank you! <br />
              </h3>
              <h1
                style={{
                  color: '#CA923D',
                  fontWeight: '600',
                  fontSize: '28px'
                }}
              >
                Please pay your bill at the cash counter!
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Bill Details Popup */}
      {isBillDetailsPopupOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1A1B23] w-[350px] rounded-lg p-4 text-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Bill Details</h3>
              <button className="text-white text-xl">&times;</button>
            </div>
            {/* Horizontal Line */}
            <hr className="border-t-[1px] border-gray-500 mb-4" />

            {/* Bill Information */}
            <div className="text-sm mb-4">
              <p>
                <span>Bill No : GRT1715</span>
                <span className="float-right">Date : 24/01/2024</span>
              </p>
              <p>
                <span>Time : 7:00 PM</span>
                <span className="float-right">Customer : 98266 66655</span>
              </p>
              <p>
                <span>Table : 05</span>
                <span className="float-right">Name : Chance Geidt</span>
              </p>
            </div>

            {/* Horizontal Line */}
            <hr className="border-t-[1px] border-gray-500 mb-4" />

            {/* Items List */}
            <div className="text-sm mb-4">
              <div className="flex justify-between font-semibold">
                <span className="flex-1">Items Names</span>
                <span className="w-8 text-center">Qty</span>
                <span className="flex-1 text-right">Amount</span>
              </div>
              {/* Sample Items */}
              {[
                ['Jeera Rice', 2, '290.00'],
                ['Veg Manhwa', 1, '119.00'],
                ['Dal Tadka', 1, '215.00'],
                ['Butter Tandoor', 1, '45.00'],
                ['Garlic Naan', 5, '300.00'],
                ['Veg Sweet Corn', 1, '119.00'],
                ['Plain Papad', 2, '160.00'],
                ['Baked Veg With', 1, '270.00'],
                ['Biryani Rice', 2, '315.00'],
              ].map(([name, qty, amount], idx) => (
                <div className="flex justify-between" key={idx}>
                  <span className="flex-1">{name}</span>
                  <span className="w-8 text-center">{qty}</span>
                  <span className="flex-1 text-right">{amount}</span>
                </div>
              ))}
            </div>

            {/* Horizontal Line */}
            <hr className="border-t-[1px] border-gray-500 mb-4" />

            {/* Amounts */}
            <div className="text-sm mb-4">
              <div className="flex justify-between">
                <span>Total Amount :</span>
                <span>₹ 1315.00</span>
              </div>
              <div className="flex justify-between">
                <span>CGST 2.5 :</span>
                <span>₹ 32.88</span>
              </div>
              <div className="flex justify-between">
                <span>SGST 2.5 :</span>
                <span>₹ 32.88</span>
              </div>
            </div>

            {/* Horizontal Line */}
            <hr className="border-t-[1px] border-gray-500 mb-4" />

            {/* Grand Total */}
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total Amount :</span>
              <span>₹ 1381.00</span>
            </div>

            {/* Download Button */}
            <button
              className="bg-[#CA923D] text-black font-semibold py-2 px-4 rounded-md w-full"
              onClick={() => alert('Bill Downloaded!')}
            >
              Download Bill
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 