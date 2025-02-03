import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ParcelLogin = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);  // Update the username state
  };

  // Handler for phone input change
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);  // Update the phone state
  };


  const handleSignUp = async (e) => {
    e.preventDefault();

    const userData = {
      name: username,
      phone: phone,
    };

    try {
      // Send signup request to backend
      const response = await axios.post('https://restaurants-customer-dashboard.onrender.com/api/v1/user/userSignup', userData);
      console.log(response.data);  // Log the signup response

      // Save JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect to homepage
      navigate('/parcel-homepage');
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up, please try again.');
    }
  };
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d23]">
      <div className="w-[375px] px-6 py-8  shadow-md">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="w-25 h-25 flex items-center justify-center mb-4">
            <img
              src="/assets/images/Frame 1116602047.png"
              alt="Chef Icon"
            />
          </div>
        </div>

        {/* Input Fields */}
        <form>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              User Name*
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Marcus George"
              className="w-full px-4 py-2 bg-[#26264d] text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Phone Number*
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="91+"
              className="w-full px-4 py-2 bg-[#26264d] text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Next Button */}
          <button
            type="submit"
            className="w-full text-white py-2 bg-[#CA923D] rounded-lg text-lg font-medium hover:bg-orange-600"
            onClick={handleSignUp}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParcelLogin;
