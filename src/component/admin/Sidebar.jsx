import React, { useEffect } from 'react';
import { FaClipboardList } from 'react-icons/fa';
import { MdWindow, MdOutlineRestaurantMenu, MdOutlineQrCodeScanner, MdExpandMore } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa6";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdLogOut } from 'react-icons/io';
import { BASE_URL } from '../../config';

export const Sidebar = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    const [manageOrderOpen, setManageOrderOpen] = useState(false);
    const [PaymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();
    const handlenavigateprofile = () => {
        navigate('/Profilepage');
    }
    const toggleManageOrder = () => {
        setManageOrderOpen(!manageOrderOpen);
    };

    const togglePaymentHistory = () => {
        setPaymentHistoryOpen(!PaymentHistoryOpen);
    };

    const handleLinkClick = (linkName) => {
        setActiveLink(linkName);
    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const [open, setOpen] = useState(false)

    const [adminData, setAdminData] = useState({});

    const handleLogout = () => {
        // Clear user data from localStorage or sessionStorage
        localStorage.removeItem("authToken"); // Adjust this depending on where your user data is stored

        // Optionally make an API request to invalidate session if necessary
        // await axios.post(`${BASE_URL}/api/v1/auth/logout`); // Optional backend call

        // Redirect user to login or home page after logout
        navigate("/login"); // Or any other page
    };


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

    return (
        <div className="">
            <aside className="w-[280px] fixed top-0 left-0 h-screen sm:hidden lg:flex bg-gray-800 py-6 px-6 flex flex-col items-center">
                <div className="flex flex-col items-center mb-8 border-b border-[#2E2B40] pb-5">
                    {/* Centered Image */}
                    <img src="./assets/images/rms-logo.png" alt="Logo" className="w-[216px] rounded-full mb-2" />
                </div>

                <nav className="flex flex-col space-y-3 w-full">
                    <div className="pb-4">
                        <a href='/dashboard' className="flex items-center p-2 rounded-md text-[16px] text-white font-semibold hover:bg-gray-700 w-full">
                            <MdWindow className="mr-2 w-[22px] h-[20px] text-yellow-500" />
                            Dashboard
                        </a>
                    </div>
                    <div className="pb-4">
                        {/* Manage Order Dropdown */}
                        <button
                            className="flex items-center p-2 rounded-md text-[16px] text-white font-semibold hover:bg-gray-700 w-full"
                            onClick={toggleManageOrder}
                        >
                            <FaBoxOpen className="mr-2 w-[22px] h-[20px] text-yellow-500" />
                            Manage Order
                            <MdExpandMore className={`ml-auto text-[22px] transform ${manageOrderOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {manageOrderOpen && (
                            <div className="ml-8 mt-2 space-y-2">
                                <a href='/parcelorder' className="flex items-center p-2 rounded-md text-[14px] text-white font-normal hover:bg-gray-700">
                                    Parcel Order
                                </a>
                                <a href='/onsiteorder' className="flex items-center p-2 rounded-md text-[14px] text-white font-normal hover:bg-gray-700">
                                    Onsite Order
                                </a>
                                <a href='/kitchen' className="flex items-center p-2 rounded-md text-[14px] text-white font-normal hover:bg-gray-700">
                                    Kitchen
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="pb-4">
                        <a href='/managemenu' className="flex items-center p-2 rounded-md text-[16px] text-white font-semibold hover:bg-gray-700 w-full">
                            <MdOutlineRestaurantMenu className="mr-2 w-[22px] h-[20px] text-yellow-500" />
                            Manage Menu
                        </a>
                    </div>

                    <div className='pb-4'>
                        {/* PaymentHistory Dropdown */}
                        <button className="flex items-center p-2 rounded-md text-[16px] text-white font-semibold hover:bg-gray-700 w-full"
                            onClick={togglePaymentHistory}>
                            <FaClipboardList className="mr-2 w-[22px] h-[20px] text-yellow-500" />
                            PaymentHistory
                            <MdExpandMore className={`ml-auto text-[22px] transform ${PaymentHistoryOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {PaymentHistoryOpen && (
                            <div className="ml-8 mt-2 space-y-2">
                                <a href='/paymentparcel' className="flex items-center p-2 rounded-md text-[14px] text-white font-normal hover:bg-gray-700">
                                    Parcel Order
                                </a>
                                <a href='/paymentonsite' className="flex items-center p-2 rounded-md text-[14px] text-white font-normal hover:bg-gray-700">
                                    Onsite Order
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="pb-2">
                        <a href="/qrcode" className="flex items-center p-2 rounded-md text-[16px] text-white font-semibold hover:bg-gray-700 w-full">
                            <MdOutlineQrCodeScanner className="mr-2 w-[22px] h-[20px] text-yellow-500" />
                            QR Codes
                        </a >
                    </div>
                </nav>
                <button className="w-full flex justify-center items-center px-3 py-3 mt-auto bg-[#E74C3C] rounded-lg text-[16px] text-white font-medium"
                    onClick={handleLogout}
                >
                    <IoMdLogOut className='mr-2 text-[22px] h-[20px] text-white'/> 
                    Log Out
                </button>

            </aside>
        </div>
    )
}
