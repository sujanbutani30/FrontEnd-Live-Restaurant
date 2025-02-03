import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userSignup } from '../../api/authApi'; // Import the API function

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value); // Update the username state
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value); // Update the phone state
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const userData = {
      name: username,
      phone: phone,
    };
    try {
      const response = await userSignup(userData); // Use the API function
      if (response.success) {
        // Save JWT token in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        navigate('/parcel-homepage');
      } else {
        setError(response.message || 'Error signing up, please try again.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up, please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d23]">
      <div className="w-[375px] px-6 py-8 shadow-md">
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

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default UserLogin;