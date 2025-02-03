import React, { useState , useEffect } from "react";
import axios from "axios";
import {
  MdWindow,
  MdOutlineRestaurantMenu,
  MdOutlineQrCodeScanner,
  MdExpandMore
} from "react-icons/md";
import { FaUser, FaLock, FaFileAlt,  FaSearch  ,FaClipboardList } from 'react-icons/fa';
import { FaBoxOpen } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { FiEdit } from "react-icons/fi";
import { BASE_URL } from '../../config';

const TermsAndConditions = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [manageOrderOpen, setManageOrderOpen] = useState(false);
  const [PaymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate
  const handlenavigateprofile = ()=> {
    navigate('/Profilepage');
  }
  const toggleManageOrder = () => {
    setManageOrderOpen(!manageOrderOpen);
  };

  const handleLogout = () => {
    // Clear user data from localStorage or sessionStorage
    localStorage.removeItem("authToken"); // Adjust this depending on where your user data is stored
  
    // Optionally make an API request to invalidate session if necessary
    // await axios.post('${BASE_URL}/api/v1/auth/logout'); // Optional backend call
  
    // Redirect user to login or home page after logout
    navigate("/login"); // Or any other page
  };

  const [adminData, setAdminData] = useState({});
  useEffect(() => {
    // Fetch admin data
    const token = localStorage.getItem("authToken");
    console.log(token);

    axios.get(`${BASE_URL}/api/v1/adminedit/getadmin`, {
      headers: {
          Authorization: `Bearer ${token}`
      }
  })
  .then(response => {
    if (response.data.success) {
      setAdminData(response.data.data); // Set admin data to the state
    }
  })
  .catch(error => {
      console.error("Error fetching admin data:", error);
  });
  }, []);

  const togglePaymentHistory = () => {
    setPaymentHistoryOpen(!PaymentHistoryOpen);
  };
 
  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const [open, setOpen] = useState(false)

  return (
    
        <section className="flex gap-3 sm:flex-col md:flex-row w-full">
          {/* Menu Section */}
          <div className="md:w-[250px] h-[250px] xl:h-[250px] lg:h-[270px] md:h-[280px] sm:h-[280px] sm:w-full   bg-gray-800 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Menu</h3>

            {/* Profile Link */}
            <a
              href="/Profilepage"
              onClick={() => handleLinkClick("profile")}
              className={`flex items-center w-full p-2 rounded-md text-white ${
                activeLink === "profile"
                  ? "bg-yellow-500 text-gray-900"
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
              className={`flex items-center w-full p-2 rounded-md text-white ${
                activeLink === "change-password"
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-gray-700 text-gray-300"
              } mb-4`}
            >
              <FaLock className="mr-2" />
              Change Password
            </a>

            {/* Terms & Conditions Link */}
            <a
              href="/TermsAndConditions"
              onClick={() => handleLinkClick("terms-and-conditions")}
              className={`flex items-center bg-yellow-600  text-white w-full px-1 py-2 rounded-md ${
                activeLink === "terms-and-conditions"
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              <FaFileAlt className="mr-2" />
              Terms & Condition
            </a>
          </div>

             {/* Profile Information Section */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden p-3 xl:w-[750px] lg:w-full">
            {/* Background Image */}
            <div
              className="absolute w-[750px] h-[90px] inset-0 bg-cover bg-center "
              style={{ backgroundImage: "url('./assets/images/6b8d7b581303d40fcc1f30dfc6de9d00.jpg')" }}
            ></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center ">
                <h2 className="mt-6 font-semibold text-xl">Terms & Condition</h2>
              </div>
            </div>

            {/* Profile Form Section */}
           <div className="mt-8  space-y-4 border border-gray-500 rounded-md">

  <div className="space-y-3">
    <p className="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Fusce quis ante ornare, venenatis tortor sed, fringilla ante. Morbi nec semper justo. Cras eget
          rhoncus urna, eu fringilla nibh. Class aptent taciti sociosqu ad litora torquent per conubia 
          nostra, per inceptos himenaeos. Nam pretium eleifend neque, vel blandit erat iaculis id. Etiam
           ut lectus vitae metus convallis condimentum quis cursus mi.   </p>
             <p className="text-gray-400"> Dolor sit amet, consectetur adipiscing elit. Fusce quis ante ornare, venenatis tortor sed,
               fringilla ante. Morbi nec semper justo. Cras eget rhoncus urna, eu fringilla nibh. Class
                aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. 
                Nam pretium eleifend neque, vel blandit erat iaculis id.  <p/>
               <p className="text-gray-400"> Consectetur adipiscing elit
                Fusce quis ante ornare, venenatis tortor sed, fringilla ante. Morbi nec semper justo. Cras
                 eget rhoncus urna, eu fringilla nibh. Class aptent taciti sociosqu ad litora torquent per
                  conubia nostra, per inceptos himenaeos. Nam pretium eleifend neque, vel blandit erat 
                  iaculis id. Etiam ut lectus vitae metus convallis condimentum quis cursus mi.</p>
</p>    
</div>
</div>
</div>
        </section>
  );
};

export default TermsAndConditions;
