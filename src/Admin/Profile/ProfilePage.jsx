import React, { useEffect, useState } from 'react';
import { FaUser, FaLock, FaFileAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getAdminById } from '../../api/ProfileApi'; // Import the getAdminById function
import { jwtDecode } from 'jwt-decode'; // Correct import
import { Sidebar } from '../../component/admin/Sidebar';
import { Header } from '../../component/admin/Header';

function ProfilePage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [adminData, setAdminData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
    selectrestaurant: { restaurantName: '' },
    city: '',
    state: '',
    country: '',
    profile_picture: '',
  });
  const navigate = useNavigate();

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Decode the token to get the admin ID
    const decodedToken = jwtDecode(token); // Use the named export
    const adminId = localStorage.getItem('adminId');
    console.log('Admin ID:', adminId);
    const fetchAdminData = async () => {
      try {

        const response = await getAdminById(adminId); // Fetch data by ID
        console.log('API Response:', response);

        if (response.success) {
          setAdminData(response.data); // Set the admin data
        } else {
          console.error('API response was not successful.');
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, [navigate]);

  return (
    <>
      <section className="flex gap-x-6 sm:flex-col md:flex-row w-full">
        {/* Menu Section */}
        <div className="md:w-[350px] h-[300px] sm:w-full bg-[#1F1D2B] p-6 rounded-xl">
          <h3 className="text-[20px] font-semibold mb-4">Menu</h3>

          {/* Profile Link */}
          <a
            href="/Profilepage"
            onClick={() => handleLinkClick('profile')}
            className={`flex items-center w-full p-4 bg-[#CA923D] rounded-md text-white ${
              activeLink === 'profile'
                ? 'bg-[#CA923D] text-gray-900'
                : 'bg-[#CA923D] text-gray-300'
            } font-medium mb-4`}
          >
            <FaUser className="mr-2" />
            Profileaa
          </a>

          {/* Change Password Link */}
          <a
            href="/ChangePassword"
            onClick={() => handleLinkClick('change-password')}
            className={`flex items-center w-full bg-[#CA923D] p-4 rounded-md text-white ${
              activeLink === 'change-password'
                ? 'bg-yellow-500 text-gray-900'
                : 'bg-gray-700 text-gray-300'
            } mb-4`}
          >
            <FaLock className="mr-2" />
            Change Password
          </a>

       
          {/* <a
            href="/TermsAndConditions"
            onClick={() => handleLinkClick('terms-and-conditions')}
            className={`flex items-center text-white w-full p-4 bg-[#CA923D] rounded-md ${
              activeLink === 'terms-and-conditions'
                ? 'bg-yellow-500 text-gray-900'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            <FaFileAlt className="mr-2" />
            Terms & Condition
          </a> */}
        </div>

        {/* Profile Information Section */}
        <div className="relative rounded-lg overflow-hidden w-[1085px] bg-[#1F1D2B]">
          {/* Background Image */}
          <div
            className="h-[130px] inset-0 bg-cover bg-center relative flex items-center justify-end"
            style={{
              backgroundImage:
                "url('./assets/images/6b8d7b581303d40fcc1f30dfc6de9d00.jpg')",
            }}
          >
            <div className="edit-btn px-6">
              <a
                href="/editprofile"
                className="m-0 bg-[#CA923D] font-semibold text-[18px] p-2 text-white rounded-lg flex items-center"
              >
                <FiEdit className="mr-2" />
                Edit Profile
              </a>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="profileLogo">
            <div className="flex items-center mb-[-20px] absolute top-[40px] left-[20px]">
              <img
                src={
                  adminData.profile_picture ||
                  './assets/images/21460d39cd98ccca0d3fa906d5718aa3.jpg'
                }
                alt="Profile"
                className="md:w-[140px] md:h-[140px] rounded-full sm:w-[80px] sm:h-[80px]"
              />
            </div>
          </div>

          {/* Profile Form Section */}
          <div className="mt-[60px] grid grid-cols-3 gap-6 p-7">
            {/* First Row */}
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-[14px] font-medium">First Name</label>
              <input
                type="text"
                value={adminData.firstname || ''}
                className="mt-1 block w-full bg-[#2D303E] border border-[#ABBBC240] rounded-md px-3 py-2 text-white"
                readOnly
              />
            </div>
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-[14px] font-medium">Last Name</label>
              <input
                type="text"
                value={adminData.lastname || ''}
                className="mt-1 block w-full bg-[#2D303E] border border-[#ABBBC240] rounded-md px-3 py-2 text-white"
                readOnly
              />
            </div>
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-[14px] font-medium">Email Address</label>
              <input
                type="email"
                value={adminData.email || ''}
                className="mt-1 block w-full bg-[#2D303E] border border-[#ABBBC240] rounded-md px-3 py-2 text-white"
                readOnly
              />
            </div>

            {/* Second Row */}
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-[14px] font-medium">Phone Number</label>
              <input
                type="text"
                value={adminData.phonenumber || ''}
                className="mt-1 block w-full bg-[#2D303E] border border-[#ABBBC240] rounded-md px-3 py-2 text-white"
                readOnly
              />
            </div>
            <div className="md:col-span-1 sm:col-span-3">
  <label className="block text-[14px] font-medium">Restaurant Name</label>
  <input
    type="text"
    value={adminData.selectrestaurant || ''}
    className="mt-1 block w-full bg-[#2D303E] border border-[#ABBBC240] rounded-md px-3 py-2 text-white"
    readOnly
  />
</div>
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-[14px] font-medium">Gender</label>
              <input
                type="text"
                value="male"
                className="mt-1 block w-full bg-[#2D303E] border border-[#ABBBC240] rounded-md px-3 py-2 text-white"
                readOnly
              />
            </div>

            {/* Third Row */}
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-[14px] font-medium">City</label>
              <input
                type="text"
                value={adminData.city || ''}
                className="mt-1 block w-full bg-[#2D303E] border border-[#ABBBC240] rounded-md px-3 py-2 text-white"
                readOnly
              />
            </div>
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-[14px] font-medium">State</label>
              <input
                type="text"
                value={adminData.state || ''}
                className="mt-1 block w-full bg-[#2D303E] border border-[#ABBBC240] rounded-md px-3 py-2 text-white"
                readOnly
              />
            </div>
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-[14px] font-medium">Country</label>
              <input
                type="text"
                value={adminData.country || ''}
                className="mt-1 block w-full bg-[#2D303E] border border-[#ABBBC240] rounded-md px-3 py-2 text-white"
                readOnly
              />
            </div>

            {/* Fourth Row */}
            <div className="col-span-3">
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                value="123 Main St, Anytown USA"
                className="mt-1 block w-full bg-[#2D303E] border border-[#ABBBC240] rounded-md px-3 py-2 text-white"
                readOnly
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProfilePage;