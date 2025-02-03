import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchCategory } from "../../api/categoryApi"; // Import the fetchCategories function
import { BASE_URL } from '../../config';

const ParcelCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get the correct image URL
  const getImageUrl = (image) => {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image; // Use the full URL directly
    } else {
      return `${BASE_URL}/${image}`; // Prepend the base URL
    }
  };

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
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-[#252836] rounded-lg p-2"
          >
            <div className="w-16 h-16 flex items-center justify-center mb-2">
              <img
                src={getImageUrl(category.image)} // Use the function to get the correct URL
                alt={category.categoryName}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <p className="text-xs font-medium text-gray-300">{category.categoryName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParcelCategory;