import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchCategory } from "../../api/categoryApi"; // Import the fetchCategories function

const ParcelCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useEffect to call fetchCategories when the component is mounted
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategory();
        setCategories(data); // Set categories in state
      } catch (error) {
        setError(error.message); // Set error message in state
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    getCategories();
  }, []);

  const navigate = useNavigate();

  // Function to clean image URL
  const cleanImageUrl = (url) => {
    if (!url) return ''; // Return an empty string if URL is undefined
    return url.replace('/', '');
  };

  return (
    <div className="flex flex-col items-center bg-[#1F1D2B] min-h-screen text-white">
      {/* Header */}
      <div className="items-center justify-between px-4 py-5 w-[375px] bg-[#1F1D2B] flex">
        <MdOutlineKeyboardArrowLeft
          style={{ fontSize: '25px' }}
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-bold">Categories</h1>
        <div className="w-6 h-6"></div> {/* Empty space for alignment */}
      </div>
      <div className="flex items-center justify-between px-4 py-2 w-[375px] bg-[#0B0F1F]">
        <h1 className="text-lg font-bold">Categories</h1>
        <h1 className="text-lg font-bold"></h1>
        <div className="w-6 h-6">10</div> {/* Empty space for alignment */}
      </div>

      {/* Categories Grid */}
      <div className="w-[375px] px-4 py-4 grid grid-cols-3 gap-4 bg-[#0d0d23]">
        {loading ? (
          <p className="text-gray-500 text-center col-span-3">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center col-span-3">{error}</p>
        ) : categories.length > 0 ? (
          categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-[#252836] rounded-lg p-2"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-2">
                <img
                  src={cleanImageUrl(category.image)} // Use the cleaned image URL
                  alt={category.categoryName}
                  className="object-cover w-full h-full rounded-lg"
                  onError={(e) => {
                    e.target.src = '/path/to/fallback/image.jpg'; // Fallback image
                  }}
                />
              </div>
              <p className="text-xs font-medium text-gray-300">
                {category.categoryName}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">No categories found</p>
        )}
      </div>
    </div>
  );
};

export default ParcelCategory;