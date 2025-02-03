import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchTredingProduct } from "../../api/categoryApi"; // Import the fetchTredingProduct function
import { BASE_URL } from '../../config';

const TrendingMenu = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]); // State to hold items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trending menu items
  useEffect(() => {
    const getTrendingMenuItems = async () => {
      try {
        const data = await fetchTredingProduct();
        // Assuming the items are at data directly
        if (Array.isArray(data)) {
          setItems(data);
        } else if (data.items && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setError('No items found');
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Error fetching items');
      } finally {
        setLoading(false);
      }
    };

    getTrendingMenuItems(); // Call the function to fetch items
  }, []);

  // Function to clean image URL
  const cleanImageUrl = (url) => {
    if (!url) return ''; // Return an empty string if URL is undefined
    return url.replace(`${BASE_URL}/`, '');
  };

  return (
    <div className="text-white min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 w-full bg-[#1F1D2B]">
        <a href="/parcel-homepage" className="text-white text-lg">
          <MdOutlineKeyboardArrowLeft style={{ fontSize: '25px' }} />
        </a>
        <h1 className="text-lg font-bold">Trending Menu</h1>
        <div className="w-6 h-6"></div> {/* Empty space for alignment */}
      </div>
      <div className="flex items-center justify-between px-4 py-2 w-full bg-[#0B0F1F]">
        <h1 className="text-lg font-bold">Trending Menu</h1>
        <div className="w-6 h-6"></div> {/* Empty space for alignment */}
      </div>

      {/* Menu Section */}
      <div className="space-y-4 p-4 bg-[#0B0F1F]">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#252836] rounded-lg p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-[#2D303E] w-16 h-16 rounded-lg flex items-center justify-center">
                  <img
                    src={cleanImageUrl(item.imageUrl)} // Use the cleaned image URL
                    alt={item.itemName}
                    className="object-cover w-full h-full rounded-lg"
                    onError={(e) => {
                      e.target.src = '/path/to/fallback/image.jpg'; // Fallback image
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">{item.itemName}</h3>
                  <p className="text-xs text-gray-400">{item.spiceLevel}</p>
                  <p className="text-sm font-semibold text-green-500">
                    {item.price}
                  </p>
                </div>
              </div>
              <button className="bg-[#CA923D] text-xs text-white px-4 py-2 rounded-lg font-bold">
                Order Now
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No items found</p>
        )}
      </div>

      {/* Floating Menu Button */}
      <button className="fixed bottom-4 right-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-[#666872b0] border-white border-2">
        <img
          src="/assets/images/menu.png"
          alt="Menu Icon"
          className="w-8 h-10"
        />
      </button>
    </div>
  );
};

export default TrendingMenu;