import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/authApi'; // Import the API function

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('email'); // Retrieve email from localStorage

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await resetPassword(email, newPassword); // Use the API function

      if (response.success) {
        setMessage(response.message);
        setError('');
        setTimeout(() => {
          navigate('/login'); // Redirect to login after successful reset
        }, 2000);
      } else {
        setError(response.message);
        setMessage('');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while resetting the password.');
    }
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/d75bfbbb18fefcba2a744eb559378aad.jfif')" }}
    >
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#1f1d2b] bg-opacity-90 px-6 sm:px-10 py-8">
        <div className="p-8 rounded-md shadow-md w-full sm:w-[700px] m-4" style={{ backgroundColor: '#252836' }}>
          <h2 className="text-2xl font-semibold text-white mb-6">Reset Password</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {message && <div className="text-green-500 mb-4">{message}</div>}

          {/* Enter New Password Field */}
          <div className="mb-4 relative">
            <label className="block text-sm text-white mb-1">Enter New Password<span className="text-red-500">*</span></label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              className="w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#CA923D]"
              style={{ backgroundColor: '#2d303e', border: '1px solid #ABBBC240' }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500 mt-3"
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6 relative">
            <label className="block text-sm text-white mb-1">Confirm Password<span className="text-red-500">*</span></label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter Confirm Password"
              className="w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#CA923D]"
              style={{ backgroundColor: '#2D303E', border: '1px solid #ABBBC240' }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500 mt-3"
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
            </button>
          </div>

          {/* Reset Password Button */}
          <button
            type="button"
            className="w-full py-2 bg-[#CA923D] transition duration-200 hover:bg-[#a57b2f] text-white font-semibold rounded-md"
            onClick={handleSubmit}
          >
            Reset Password
          </button>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex items-center justify-center bg-[#1f1d2b] bg-opacity-90 w-1/2">
        <img
          src="/assets/images/Group 1000005985.png"
          alt="Illustration"
          className="w-full max-w-lg h-auto"
        />
      </div>
    </div>
  );
};

export default ResetPassword;