"use client";

import { FaChevronLeft, FaTrash, FaCaretRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import axios from "axios";
import { useUser } from '../UserContext';
import { IoIosCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../../config';

export default function CartPage({ cartItems }) {
  const [items, setItems] = useState([]); // Cart items
  const [cookingRequest, setCookingRequest] = useState("");
  const [loading, setLoading] = useState(""); // Loading state
  const [error, setError] = useState(""); // Error state
  const { user } = useUser();
  const Navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isTimerPopupOpen, setIsTimerPopupOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility state
  const [timer, setTimer] = useState(10);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);


  // Open the popup
  const handlePlaceOrder = () => {
    setIsPopupOpen(true);
  };

  // Close the popup
  const togglePopup = () => {
    setIsPopupOpen(false);
  };

  // Handle payment method selection
  const handlePaymentSelection = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
  };

  useEffect(() => {
    let interval;
    if (isTimerPopupOpen) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    if (timer === 0 && isTimerPopupOpen) {
      setIsTimerPopupOpen(false);
      setIsSuccessPopupOpen(true);
    }

    return () => clearInterval(interval);
  }, [timer, isTimerPopupOpen]);
  const handleDoneClick = () => {
    setIsSuccessPopupOpen(false);
    Navigate('/parcel-homepage');
  };

  useEffect(() => {
    // console.log("useEffect", user);
    
    const fetchOrderData = async () => {
      // console.log("fetch");
      
      try {
        setLoading(true); // Set loading to true when starting fetch
        const response = await axios.get(`${BASE_URL}/api/add-to-cart-order/${user._id}`);

        console.log("API Response Get Cart :", response)

        if (response.status === 200) {
          const fetchedItems = response.data.order || [];
          setItems(fetchedItems);
        }0
      } catch (error) {
        setError("Error fetching order. Please try again later.");
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    if (user?._id) fetchOrderData(); // Ensure user._id is available before making API call
  }, []); // Fetch when the user context changes

  const incrementQuantity = (id) => {
    setItems((prevOrders) =>
      prevOrders.map((order) => ({
        ...order,
        items: order.items.map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }))
    );
  };
  
  const decrementQuantity = (id) => {
    setItems((prevOrders) =>
      prevOrders.map((order) => ({
        ...order,
        items: order.items.map((item) =>
          item._id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      }))
    );
  };
  const userId= localStorage.getItem('userId');

  const handleNavigateHome = () => {
    Navigate('/parcel-homepage');
  }

  const removeItem = async (orderId) => {
    try {
      // API call to delete the order by its _id
      const response = await fetch(
        `${BASE_URL}/api/place-order/user/${userId}/order/${orderId}`, // Ensure backend endpoint matches this URL
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        // Remove the order from local state
        setItems((prevItems) => prevItems.filter((order) => order._id !== orderId));
        console.log("Order removed successfully:", data.message);
      } else {
        console.error("Error removing order:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error in removeItem function:", error.message || error);
    }
  };

  const handlePayClick = (paymentMethod) => {
    // Log the items array to understand its structure
    console.log("Selected Payment Method:", paymentMethod);
    setSelectedPayment(paymentMethod);
    
    const orderData = {
      userId: user._id,
      items: items.flatMap((order) => { // Assuming items is an array of orders
        return order.items.map((item) => {
          // Ensure itemId is present and has _id
          if (!item.itemId || !item.itemId._id) {
            console.error("Item missing itemId:", item); // Log the full item if it doesn't have itemId
            return null;  // Skip this item if itemId is missing
          }
  
          // Return the formatted order item with itemId._id
          return {
            itemId: item.itemId._id,  // Use _id inside itemId
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            customizations: item.customizations || [],
          };
        }).filter(item => item !== null); // Filter out any null items
      }),
      paymentMethod: paymentMethod, // Ensure it's a string and not an event
      totalAmount: totalPrice,
      cookingRequest: cookingRequest, // Assuming no cooking request
    };
    // Make the API call to place the order
    axios
      .post('https://restaurants-customer-dashboard.onrender.com/api/v1/order/create', orderData)
      .then((response) => {
        console.log("Order placed successfully:", response);
        if(paymentMethod === 'Online'){
          Navigate('/paymentmethod');
        }else{
          setIsTimerPopupOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });
  };
  
  // console.log("Cart Items Structure:", items);
  const totalPrice = items.reduce((acc, order) => {
    return (
      acc +
      order.items.reduce(
        (orderAcc, item) => orderAcc + item.itemId.price * item.quantity,
        0
      )
    );
  }, 0);
  

  const cgst = totalPrice * 0.025; // 2.5% CGST
  const sgst = totalPrice * 0.025; // 2.5% SGST
  const payableAmount = totalPrice + cgst + sgst;

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <a href="/parcel-homepage" className="p-2">
          <FaChevronLeft className="w-6 h-6" />
        </a>
        <h1 className="text-lg font-medium">Cart</h1>
        <button className="text-sm text-yellow-500" onClick={handleNavigateHome}>+ Add Items</button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
      {items.length === 0 ? (
    <p className="text-center mt-4">Your cart is empty.</p>
  ) : (
    items.map((order) =>
      order.items.map((item, index) => (
        <div
          key={index}
          className="bg-slate-900 border border-slate-800 p-3 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-800 rounded-md flex items-center justify-center">
                <span role="img" aria-label="burger" className="text-xl">
                  <img
                    src={`https://restaurants-customer-dashboard.onrender.com/${item.itemId.imageUrl}`}
                    alt={item.itemId.itemName}
                  />
                </span>
              </div>
              <div>
                <h3 className="font-medium">{item.itemId.itemName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => decrementQuantity(item._id)}
                    className="text-black bg-yellow-600 p-1 rounded-full flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => incrementQuantity(item._id)}
                    className="text-black bg-yellow-600 p-1 rounded-full flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-500 font-medium">
                ₹ {item.itemId.price * item.quantity}
              </span>
              <button
                onClick={() => removeItem(order._id)}
                className="text-red-500"
              >
                <FaTrash className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))
    )
  )}
        {/* Cooking Request */}
             <div className="mt-10">
          <p className="text-sm text-white mb-2">
            Add Cooking Request <span className="text-slate-400">(Optional)</span>
          </p>
          <textarea
            placeholder="Lorem Ipsum is simply dummy text of "
            value={cookingRequest}
            onChange={(e) => setCookingRequest(e.target.value)}
            className="bg-gray-700 border border-slate-800 text-white rounded-lg w-full  pl-4 pt-1 h-10  
             resize-none"
          />
        </div>

        {/* Price Breakdown */}
        <div className="mt-10 pt-14 space-y-2 pb-5">
          <div className="flex justify-between text-slate-400">
            <span>Total ({items.length} Items)</span>
            <span>₹ {totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>CGST 2.5%</span>
            <span>₹ {cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>SGST 2.5%</span>
            <span>₹ {sgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-medium pt-2 border-t border-slate-800">
            <span>Payable Amount</span>
            <span>₹ {payableAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            {items.length} Items Added
            <br />
            <span className="text-white font-medium">₹ {payableAmount.toFixed(2)}</span>
          </div>
          <button onClick={handlePlaceOrder} className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 flex items-center rounded-md">
            Place Order
            <FaCaretRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1A1B23] w-[300px] rounded-lg p-6">
            {/* Popup Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Select Payment</h3>
              <button
                className="text-gray-400 hover:text-white"
                style={{ fontSize: '20px' }}
                onClick={togglePopup}
              >
                <IoIosCloseCircle />
              </button>
            </div>

            {/* Payment Options */}
            <div className="flex justify-between items-center mb-6">
              {/* Online Payment */}
              <div
                onClick={() => handlePayClick('Online')}
                className={`w-[120px] h-[120px] flex flex-col justify-center items-center rounded-lg cursor-pointer transition ${
                  selectedPayment === 'Online'
                    ? 'border-2 border-[#C68A15] bg-gray-800'
                    : 'bg-gray-800 border border-transparent'
                }`}
              >
                <div
                  style={{ marginLeft: "75px" }}
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedPayment === 'Online'
                      ? 'border-[#C68A15] bg-[#C68A15]'
                      : 'border-gray-500'
                  }`}
                />
                <img
                  src="./assets/images/28.png"
                  alt="Online"
                  className="w-10 h-10 mb-2 mt-2"
                />
                <p className="text-sm text-white">Online</p>
              </div>

              {/* Cash Payment */}
              <div
                onClick={() => handlePayClick('Cash')}
                className={`w-[120px] h-[120px] flex flex-col justify-center items-center rounded-lg cursor-pointer transition ${
                  selectedPayment === 'Cash'
                    ? 'border-2 border-[#C68A15] bg-gray-800'
                    : 'bg-gray-800 border border-transparent'
                }`}
              >
                <div
                  style={{ marginLeft: "75px" }}
                  className={`w-4 h-4 rounded-full border-2 mt-2 ${
                    selectedPayment === 'Cash'
                      ? 'border-[#C68A15] bg-[#C68A15]'
                      : 'border-gray-500'
                  }`}
                />
                <img
                  src="./assets/images/29.png"
                  alt="Cash"
                  className="w-10 h-10 mb-2 mt-2"
                />
                <p className="text-sm text-white">Cash</p>
              </div>

            </div>

            {/* Pay Button */}
            <button className="bg-[#C68A15] text-white py-2 w-full rounded-full text-sm font-medium" onClick={handlePayClick}>
              Pay
            </button>
          </div>
        </div>
      )}

        {/* Cash Payment Timer Popup */}
        {isTimerPopupOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1A1B23] w-[300px] rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Cash Payment Timer
            </h3>
            <p className="text-4xl font-bold text-[#C68A15] mb-4">{timer}s</p>
            <p className="text-sm text-gray-300">
              Pay your bill at the cash counter to confirm your order!
            </p>
          </div>
        </div>
      )}
      {/* Payment Success Popup */}
      {isSuccessPopupOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1A1B23] w-[300px] rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Payment Successfully
            </h3>
            <img
              src="./assets/images/success.png"
              alt="Payment Successful"
              className=" mx-auto mb-4"
            />
            <button
              className="bg-[#C68A15] text-white py-2 w-full rounded-full text-sm font-medium"
              onClick={handleDoneClick}
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
    
  );
}
