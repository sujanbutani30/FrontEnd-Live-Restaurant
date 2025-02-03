"use client";

import { FaChevronLeft, FaTrash, FaCaretRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { IoIosCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { initiateRazorpayPayment, handleRazorpayCallback, handleCashPayment } from '../../api/paymentApi';
import Razorpay from 'razorpay';
import jsPDF from 'jspdf'; // Import jsPDF library
import io from 'socket.io-client';
import { data } from "autoprefixer";
import { BASE_URL } from '../../config';

export default function CartPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]); // Combined items from all orders
  const [cookingRequest, setCookingRequest] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isTimerPopupOpen, setIsTimerPopupOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility state
  const [timer, setTimer] = useState(900); // 15 minutes in seconds
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null); // Store order details from backend

  // Fetch cart data from API
  useEffect(() => {
  
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/api/place-order/orders/user/summary/${userId}`);
      const data = await response.json();
      const combinedItems = data.orderDetails.flatMap((order) =>
        order.items.map((item) => ({
          ...item,
          orderId: order.orderId // Add orderId to each item
        }))
      );
      setItems(combinedItems);
      setOrderDetails({
        subtotal: data.subtotal,
        cgst: data.cgst,
        sgst: data.sgst,
        grandTotal: data.grandTotal,
      });
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };
  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  // Retrieve items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('cartItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Timer logic
  useEffect(() => {
    const savedTimer = localStorage.getItem('timer');
    const savedStartTime = localStorage.getItem('timerStartTime');

    if (savedTimer && savedStartTime) {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const elapsedTime = currentTime - parseInt(savedStartTime, 10);
      const remainingTime = parseInt(savedTimer, 10) - elapsedTime;

      if (remainingTime > 0) {
        setTimer(remainingTime);
        setIsTimerPopupOpen(true);
      } else {
        // Timer has expired
        localStorage.removeItem('timer');
        localStorage.removeItem('timerStartTime');
      }
    }
  }, []);

  // Start the timer
  const startTimer = () => {
    const startTime = Math.floor(Date.now() / 1000); // Current time in seconds
    localStorage.setItem('timer', timer);
    localStorage.setItem('timerStartTime', startTime);
    setIsTimerPopupOpen(true);
  };

  // Update the timer every second
  useEffect(() => {
    let interval;
    if (isTimerPopupOpen) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) {
            const newTimer = prev - 1;
            localStorage.setItem('timer', newTimer);
            return newTimer;
          } else {
            clearInterval(interval);
            setIsTimerPopupOpen(false);
            localStorage.removeItem('timer');
            localStorage.removeItem('timerStartTime');
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, [isTimerPopupOpen]);

  // Socket logic
  useEffect(() => {
    const socket = io(`${BASE_URL}`); // Replace with your server URL

    socket.on('startTimer', (data) => {
      setIsTimerPopupOpen(true);
      setTimer(data.duration);
      localStorage.setItem('timer', data.duration);
      localStorage.setItem('timerStartTime', Math.floor(Date.now() / 1000));
    });

    socket.on('timerExpired', (data) => {
      setIsTimerPopupOpen(false);
      localStorage.removeItem('timer');
      localStorage.removeItem('timerStartTime');
      // Handle timer expiration logic here
    });

    socket.on('paymentAccepted', (data) => {
      setIsTimerPopupOpen(false);
      setIsSuccessPopupOpen(true);
      localStorage.removeItem('timer');
      localStorage.removeItem('timerStartTime');
      // Clear the interval
      setTimer(0);
    });

    socket.on('paymentDeclined', (data) => {
      setIsTimerPopupOpen(false);
      localStorage.removeItem('timer');
      localStorage.removeItem('timerStartTime');
      alert('Your cash payment has been declined.');
      // Clear the interval
      setTimer(0);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Open the payment popup
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

  const handleDoneClick = () => {
    setIsSuccessPopupOpen(false);
    navigate('/parcel-homepage');
  };

  // Increment quantity
  // Function to increment quantity
const incrementQuantity = async (orderId, productId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/place-order/order/${orderId}/item/${productId}/increment`, {
      method: 'PATCH',
    });

    if (response.ok) {
      fetchCartData(); // Fetch updated cart data
    } else {
      console.error('Failed to increment quantity');
    }
  } catch (error) {
    console.error('Error incrementing quantity:', error);
  }
};

// Function to decrement quantity
const decrementQuantity = async (orderId, productId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/place-order/order/${orderId}/item/${productId}/decrement`, {
      method: 'PATCH',
    });

    if (response.ok) {
      fetchCartData(); // Fetch updated cart data
    } else {
      console.error('Failed to decrement quantity');
    }
  } catch (error) {
    console.error('Error decrementing quantity:', error);
  }
};
  // Remove item from cart
  const removeItem = async (orderId) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${BASE_URL}/api/place-order/user/${userId}/order/${orderId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Remove all items with the given orderId from the local state
        setItems((prevItems) => prevItems.filter((item) => item.orderId !== orderId));
      } else {
        const errorData = await response.json();
        console.error('Failed to delete item:', errorData);
        alert('Failed to delete item. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('An error occurred. Please try again.');
    }
  };
  // Calculate total amount, CGST, SGST, and payable amount for all items
  const totalAmount = orderDetails ? orderDetails.subtotal : 0; // Use subtotal directly
const cgst = orderDetails ? orderDetails.cgst : 0; // Use CGST directly
const sgst = orderDetails ? orderDetails.sgst : 0; // Use SGST directly
const payableAmount = orderDetails ? orderDetails.grandTotal : 0; // Use grandTotal directly
  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    try {
      if (!window.Razorpay) {
        throw new Error('Razorpay script not loaded');
      }

      // Convert payable amount to paise (Razorpay requires amount in paise)
      const amountInPaise = payableAmount * 100;

      const userId = localStorage.getItem('userId'); // Get userId from localStorage
      const response = await initiateRazorpayPayment(userId); // Use userId for payment
      const { order: { currency, id, notes } } = response;

      const options = {
        key: 'rzp_test_V7TeUgAIzcpzOL', // Replace with your Razorpay key
        amount: amountInPaise, // Use the payable amount in paise
        currency: currency,
        name: 'Your Company Name',
        description: 'Payment for your order',
        order_id: id, // Use the order ID from the response
        handler: async (response) => {
          const { razorpay_payment_id } = response;
          await handleRazorpayCallback(userId, razorpay_payment_id); // Use userId for callback
          setIsSuccessPopupOpen(true);
          setIsTimerPopupOpen(false); // Stop the timer
          localStorage.removeItem('timer'); // Clear timer from localStorage
          localStorage.removeItem('timerStartTime');
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };

      const rzp = new window.Razorpay(options); // Use window.Razorpay
      rzp.open();
    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
    }
  };

  // Handle cash payment
  const handleCashPayment = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Get userId from localStorage
      await handleCashPayment(userId); // Use userId for payment
      startTimer(); // Start the timer for cash payment
    } catch (error) {
      console.error('Error handling cash payment:', error);
    }
  };

  // Generate and Download PDF Invoice
  const downloadInvoice = () => {
    const doc = new jsPDF();
  
    // Add Invoice Title
    doc.setFontSize(18);
    doc.text("Invoice", 10, 10);
  
    // Add Items Table
    doc.setFontSize(14);
    doc.text("Items:", 10, 20);
    let yPos = 30;
    items.forEach((item) => {
      // Check if item.itemId is defined
      const itemName = item.itemId ? item.itemId.itemName : 'Unknown Item';
      doc.text(`${itemName} - ₹ ${item.totalPrice * item.quantity}`, 10, yPos);
      yPos += 10;
    });
  
    // Add Total Amount
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹ ${totalAmount.toFixed(2)}`, 10, yPos + 10);
    doc.text(`CGST (2.5%): ₹ ${cgst.toFixed(2)}`, 10, yPos + 20);
    doc.text(`SGST (2.5%): ₹ ${sgst.toFixed(2)}`, 10, yPos + 30);
    doc.text(`Payable Amount: ₹ ${payableAmount.toFixed(2)}`, 10, yPos + 40);
  
    // Save the PDF
    doc.save(`invoice.pdf`);
  };
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <button onClick={() => navigate(-1)} className="p-2">
          <FaChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Cart</h1>
        <button className="text-sm text-yellow-500" onClick={() => navigate('/parcel-homepage')}>
          + Add Items
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
      {items.map((item) => (
  <div key={item._id} className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-800 rounded-md flex items-center justify-center">
          <img
            src={item.imageUrl}
            alt={item.itemName}
            className="w-full h-full rounded-md"
          />
        </div>
        <div>
          <h3 className="font-medium">{item.itemName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => decrementQuantity(item.orderId, item.productId)}
              className="text-black bg-yellow-600 p-1 rounded-full flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-medium">{item.quantity}</span>
            <button
              onClick={() => incrementQuantity(item.orderId, item.productId)}
              className="text-black bg-yellow-600 p-1 rounded-full flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-green-500 font-medium">
          ₹ {item.totalPrice * item.quantity}
        </span>
        <button
          onClick={() => {
            console.log("Deleting order:", item.orderId); // Debugging
            removeItem(item.orderId);
          }}
          className="text-red-500"
        >
          <FaTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
))}
        {/* Cooking Request */}
        <div className="mt-10">
          <p className="text-sm text-white mb-2">
            Add Cooking Request <span className="text-slate-400">(Optional)</span>
          </p>
          <textarea
            placeholder="Lorem Ipsum is simply dummy text of "
            value={cookingRequest || ''}
            onChange={(e) => setCookingRequest(e.target.value)}
            className="bg-gray-700 border border-slate-800 text-white rounded-lg w-full pl-4 pt-1 h-10 resize-none"
          />
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="mb-10 pl-3 pr-3 pt-14 space-y-2 pb-10">
  <div className="flex justify-between text-slate-400">
    <span>Total ({items.length} Items)</span>
    <span>₹ {totalAmount.toFixed(2)}</span>
  </div>
  <div className="flex justify-between text-slate-400">
    <span>CGST 3%</span>
    <span>₹ {cgst.toFixed(2)}</span>
  </div>
  <div className="flex justify-between text-slate-400">
    <span>SGST 3%</span>
    <span>₹ {sgst.toFixed(2)}</span>
  </div>
  <div className="flex justify-between text-lg font-medium pt-2 border-t border-slate-800">
    <span>Payable Amount</span>
    <span>₹ {payableAmount.toFixed(2)}</span>
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
          <button
            onClick={handlePlaceOrder}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 flex items-center rounded-md"
          >
            Place Order
            <FaCaretRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Payment Popup */}
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
                onClick={() => handlePaymentSelection('Online')}
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
                onClick={() => handlePaymentSelection('Cash')}
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
            <button
              className="bg-[#C68A15] text-white py-2 w-full rounded-full text-sm font-medium"
              onClick={() => {
                if (selectedPayment === 'Cash') {
                  handleCashPayment();
                } else if (selectedPayment === 'Online') {
                  handleRazorpayPayment();
                }
              }}
            >
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
          <div className="bg-[#1A1B23] w-[350px] rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Payment Successful
            </h3>
            <div className="text-left text-sm text-white mb-4">
              <p><strong>Total Payable Amount:</strong> ₹ {payableAmount.toFixed(2)}</p>
            </div>
            <button
              className="bg-[#C68A15] text-white py-2 w-full rounded-full text-sm font-medium mb-2"
              onClick={handleDoneClick}
            >
              Done
            </button>
            <button
              className="bg-green-500 text-white py-2 w-full rounded-full text-sm font-medium"
              onClick={downloadInvoice}
            >
              Download Invoice (PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}