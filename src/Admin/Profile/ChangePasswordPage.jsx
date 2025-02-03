import React, { useEffect, useState } from "react";
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAdminData, updatePassword } from '../../api/ProfileApi'; // Import API functions

const ChangePasswordPage = () => {
  const [activeLink, setActiveLink] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [adminData, setAdminData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const data = await getAdminData(token);
        setAdminData(data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem('adminId');

    try {
      const response = await updatePassword(token, userId, oldPassword, newPassword);
      if (response.success) {
        alert("Password updated successfully!");
        navigate("/profilepage");
      }
    } catch (error) {
      console.error("Error updating password:", error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <section className="flex gap-3 sm:flex-col md:flex-row w-full">
      <div className="md:w-[350px] h-[300px] sm:w-full bg-[#1F1D2B] p-6 rounded-xl">
        <h3 className="text-[20px] font-semibold mb-4">Menu</h3>

        {/* Profile Link */}
        <a
          href="/Profilepage"
          onClick={() => handleLinkClick("profile")}
          className={`flex items-center w-full p-4 bg-[#CA923D] rounded-md text-white ${activeLink === "profile"
            ? "bg-[#CA923D] text-gray-900"
            : "bg-gray-700 text-gray-300"
            } font-medium mb-4`}
        >
          <FaUser className="mr-2" />
          Profile
        </a>

        {/* Change Password Link */}
        <a
          href="/ChangePassword"
          onClick={() => handleLinkClick("change-password")}
          className={`flex items-center w-full bg-[#CA923D] p-4 rounded-md text-white ${activeLink === "change-password"
            ? "bg-[#CA923D] text-gray-900"
            : "bg-[#CA923D] text-gray-300"
            } mb-4`}
        >
          <FaLock className="mr-2" />
          Change Password
        </a>
      </div>

      <div className="relative bg-gray-800 rounded-lg overflow-hidden p-3 xl:w-[700px] lg:w-full sm:w-full">
        <div
          className="absolute w-[700px] h-[90px] inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('./assets/images/6b8d7b581303d40fcc1f30dfc6de9d00.jpg')" }}
        ></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center ">
            <h2 className="mt-6 font-semibold text-xl">Change Password</h2>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <form onSubmit={handlePasswordChange}>
            <input
              type="id"
              value={adminData._id}
              hidden
            />
            <div className="mb-3">
              <label className="block text-sm font-medium">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="mt-1 block md:w-[500px] sm:w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="mt-1 block md:w-[500px] sm:w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="mt-1 block md:w-[500px] sm:w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div>
              <button type="submit" className="flex items-center justify-center p-2 rounded-md mb-7 text-white bg-yellow-600 w-[500px]">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChangePasswordPage;