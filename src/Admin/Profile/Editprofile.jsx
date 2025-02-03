import React, { useEffect, useState } from 'react';
import { FaUser, FaLock, FaFileAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getAdminById, updateAdmin } from '../../api/ProfileApi'; // Import the updateAdmin function

function Editprofile() {
  const [activeLink, setActiveLink] = useState('');
  const [adminData, setAdminData] = useState({});
  const navigate = useNavigate();

  const handlenavigateprofile = () => {
    navigate('/Profilepage');
  };

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    getAdminById(adminId)
      .then(response => {
        if (response.success) {
          setAdminData(response.data);
        }
      })
      .catch(error => {
        console.error("Error fetching admin data:", error);
      });
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    // Create a copy of adminData without the selectrestaurant field
    const { selectrestaurant, ...dataToUpdate } = adminData;
  
    console.log(dataToUpdate);
  
    updateAdmin(adminId, dataToUpdate)
      .then(response => {
        if (response.success) {
          alert('Admin information updated successfully!');
          // Optionally, you can navigate to another page or refresh the data
        } else {
          alert('Failed to update admin information: ' + response.message);
        }
      })
      .catch(error => {
        console.error("Error updating admin data:", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error data:", error.response.data);
          console.error("Error status:", error.response.status);
          console.error("Error headers:", error.response.headers);
          alert('An error occurred while updating admin information: ' + error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
          alert('No response received from the server. Please check your network connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', error.message);
          alert('An error occurred while setting up the request: ' + error.message);
        }
      });
  };      

  return (
    <>
      <section className="flex gap-3 sm:flex-col md:flex-row w-full">
        <div className="md:w-[250px] h-[250px] xl:h-[250px] lg:h-[270px] md:h-[280px] sm:h-[280px] sm:w-full bg-gray-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-4">Menu</h3>

          <a
            href="/"
            onClick={() => handleLinkClick('profile')}
            className={`flex items-center w-full p-2 rounded-md bg-yellow-600 text-white ${activeLink === 'profile' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300'} font-medium mb-4`}
          >
            <FaUser className="mr-2" />
            Profile
          </a>

          <a
            href="/ChangePassword"
            onClick={() => handleLinkClick('change-password')}
            className={`flex items-center w-full p-2 rounded-md text-white ${activeLink === 'change-password' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300'} mb-4`}
          >
            <FaLock className="mr-2" />
            Change Password
          </a>

          <a
            href="/TermsAndConditions"
            onClick={() => handleLinkClick('terms-and-conditions')}
            className={`flex items-center w-full px-1 py-2 rounded-md text-white ${activeLink === 'terms-and-conditions' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300'}`}
          >
            <FaFileAlt className="mr-2" />
            Terms & Condition
          </a>
        </div>

        <div className="relative bg-gray-800 rounded-lg overflow-hidden p-3 w-full">
          <div
            className="absolute w-[800px] h-[90px] inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('./assets/images/6b8d7b581303d40fcc1f30dfc6de9d00.jpg')" }}
          ></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center ">
              <img
                src="./assets/images/21460d39cd98ccca0d3fa906d5718aa3.jpg"
                alt="Profile"
                className="md:w-[100px] md:h-[100px] rounded-full sm:w-[80px] sm:h-[80px]"
              />
            </div>
            <a href='#' className="md:mr-10 sm:mr-2 px-4 md:py-2 sm:py-1 bg-yellow-600 text-gray-900 mb-11 rounded-md flex items-center">
              <FiEdit className="mr-2" />
              Edit Profile
            </a>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstname"
                value={adminData.firstname || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                name='lastname'
                value={adminData.lastname || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-sm font-medium">Email Address</label>
              <input
                type="email"
                name='email'
                value={adminData.email || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>

            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                name='phonenumber'
                value={adminData.phonenumber || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-sm font-medium">Restaurant Name</label>
              <input
                type="text"
                name='selectrestaurant'
                value={adminData.selectrestaurant || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-sm font-medium">Gender</label>
              <input
                type="text"
                name='gender'
                value="male"
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>

            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                name='city'
                value={adminData.city || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-sm font-medium">State</label>
              <input
                type="text"
                name='state'
                value={adminData.state || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>
            <div className="md:col-span-1 sm:col-span-3">
              <label className="block text-sm font-medium">Country</label>
              <input
                type="text"
                name='country'
                value={adminData.country || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>

            <div className="col-span-3">
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                name='city1'
                value={adminData.city || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300"
              />
            </div>
            <button
              type="button"
              onClick={handleUpdate}
              className="mt-4 lg:col-span-1 sm:col-span-3 px-4 py-2 bg-yellow-600 text-white rounded-md"
            >
              Update Admin Info
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Editprofile;

