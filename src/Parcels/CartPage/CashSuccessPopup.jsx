import React from 'react';

const CashSuccessPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-[#1A1B23] w-[300px] rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-4">
          Payment Successful
        </h3>
        <img
          src="./assets/images/success.png"
          alt="Payment Successful"
          className="mx-auto mb-4"
        />
        <button
          className="bg-[#C68A15] text-white py-2 w-full rounded-full text-sm font-medium"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default CashSuccessPopup;