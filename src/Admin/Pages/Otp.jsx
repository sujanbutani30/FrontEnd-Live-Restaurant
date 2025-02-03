import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../../api/authApi'; // Import the API functions

const Otp = () => {
  const navigate = useNavigate();
  const [otpFields, setOtpFields] = useState(['', '', '', '', '', '']); // Initialize with 6 empty fields
  const [email, setEmail] = useState(""); // Example email input, should be set dynamically based on context
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30); // Countdown timer state

  useEffect(() => {
    const storedEmail = localStorage.getItem("email"); // Retrieve email from localStorage
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInputChange = (index, event) => {
    const value = event.target.value; // Extract value from the input field
    if (isNaN(value)) return; // Ensure only numeric values are allowed
    const updatedFields = [...otpFields];
    updatedFields[index] = value.slice(-1); // Allow only one character per input
    setOtpFields(updatedFields);
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpCode = otpFields.join(''); // Combine OTP input fields
    if (!email || otpCode.length !== 6) {
      setError('Please complete all fields or ensure the email is set.');
      return;
    }

    try {
      const response = await verifyOtp(email, otpCode); // Use the API function

      if (response.success) {
        console.log('OTP Verified:', response.message);
        navigate('/resetpassword');
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setError('An error occurred during verification.');
    }
  };

  // Resend OTP (Reset timer and call API to resend OTP)
  const handleResend = async () => {
    try {
      const response = await resendOtp(email); // Use the API function

      if (response.success) {
        setTimer(30); // Reset timer
        setMessage("A new OTP has been sent to your email.");
        setError("");
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('Error during OTP resend:', err);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/d75bfbbb18fefcba2a744eb559378aad.jfif')" }}
    >
      {/* Left side - OTP Form */}
      <div className="w-full md:w-full lg:w-1/2 flex items-center justify-center bg-[#1f1d2b] bg-opacity-90">
        <div className="p-8 rounded-md shadow-md w-[500px]" style={{ backgroundColor: '#252836', margin: '50px' }}>
          <h2 className="text-2xl font-semibold text-white mb-4">Enter OTP</h2>
          <p className="text-gray-400 mb-6">
            A verification code has been sent to <span className="text-white">{email || "your email"}</span>.
          </p>

          {/* OTP Input Fields */}
          <div className="flex justify-between mb-4 gap-2">
            {otpFields.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center text-white text-lg rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                style={{ backgroundColor: '#2D303E' }}
                onChange={(e) => handleInputChange(index, e)} // Pass event to the function
                value={value}
              />
            ))}
          </div>

          {/* Countdown Timer and Resend Link */}
          <div className="flex items-center justify-between mb-4 text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.00016 4.00016V8.00016L10.6668 9.3335M14.6668 8.00016C14.6668 11.6821 11.6821 14.6668 8.00016 14.6668C4.31826 14.6668 1.3335 11.6821 1.3335 8.00016C1.3335 4.31826 4.31826 1.3335 8.00016 1.3335C11.6821 1.3335 14.6668 4.31826 14.6668 8.00016Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>{timer} sec</span>
            </div>
            <button
              className="text-blue-400 hover:text-blue-500 focus:outline-none"
              onClick={handleResend}
              disabled={timer > 0}
            >
              Resend OTP
            </button>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            className="w-full py-2 px-4 bg-[#CA923D] text-white font-semibold rounded-md transition duration-200 hover:bg-[#a57b2f]">
            Verify
          </button>
          {message && <p className="text-green-400 mt-4">{message}</p>}
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden w-1/2 lg:flex md:hidden items-center justify-center bg-[#1f1d2b] bg-opacity-90">
        <img
          src="/assets/images/Group 1000005985.png"
          alt="Illustration"
          className="w-full max-w-lg h-auto"
        />
      </div>
    </div>
  );
};

export default Otp;