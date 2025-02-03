import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategory, fetchTredingProduct } from '../../api/categoryApi'; // Import the API functions

const ParcelHomePage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('veg'); // Default selected filter
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]); // Initialize as empty array
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Initialize as empty array
  const [selectedCategory, setSelectedCategory] = useState(null); // State to store the selected category for preview

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetchCategory();
        console.log('Categories API Response:', response); // Debugging
        if (response && response.data) {
          setCategories(response.data);
        } else {
          setError('No data received from the API');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  // Debugging: Log categories state
  useEffect(() => {
    console.log('Categories:', categories);
  }, [categories]);

  // Fetch items
  useEffect(() => {
    const getItems = async () => {
      try {
        const data = await fetchTredingProduct();
        console.log('Items API Response:', data); // Debugging
        if (data) {
          setItems(data);
        } else {
          setError('No data received from the API');
        }
      } catch (error) {
        setError('Error fetching items');
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, []);

  // Filter items based on selected category (veg/nonveg)
  useEffect(() => {
    const filtered = items.filter((item) => item.itemType === selected);
    setFilteredItems(filtered);
  }, [selected, items]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter items based on the search query
    if (query.trim() !== '') {
      const filteredResults = items.filter((item) =>
        item?.itemName && item.itemName.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]); // Clear results if search query is empty
    }
  };

  // Navigation functions
  const handleCategoryView = () => {
    navigate('/parcel-category');
  };

  const handleTrendingClick = () => {
    navigate('/trending-menu');
  };

  const navigateCart = () => {
    navigate('/cartpage');
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    setSearchQuery(''); // Clear search query when toggling search input
    setSearchResults([]); // Clear search results when toggling search input
  };

  // Function to handle category click and set the selected category for preview
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col items-center bg-[#0B0F1F] min-h-screen text-white">
      {/* Header */}
      <div className="w-[375px] bg-[#1F1D2B] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-15 h-12 flex items-center justify-center">
            <img
              src="/assets/images/Frame 1000006241.png"
              alt="Logo"
              width={100}
            />
          </div>
        </div>
        <div className="flex space-x-3">
          {/* Search Icon */}
          <button onClick={toggleSearchInput}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"
              />
            </svg>
          </button>

          {/* Cart Icon */}
          <button onClick={navigateCart}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l1.6-8H6.4L7 13zM5 21a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Input */}
      {showSearchInput && (
        <div className="w-[375px] h-svh overscroll-contain absolute top-16 z-10 px-4 py-2 bg-[#1F1D2B] flex flex-col">
          <input
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-3 py-2 rounded-lg bg-[#252836] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5678E9]"
          />
          {/* Search Results */}
          <div className="mt-2">
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#252836] rounded-lg p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#2D303E] w-16 h-16 rounded-lg flex items-center justify-center">
                      <img
                        src={`https://restaurants-customer-dashboard.onrender.com/${result.imageUrl}`}
                        alt={result.itemName}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{result.itemName}</h3>
                      <p className="text-xs text-gray-400">{result.spiceLevel}</p>
                      <p className="text-sm font-semibold text-green-500">
                        {result.price}
                      </p>
                    </div>
                  </div>
                  <button className="bg-[#CA923D] text-xs text-white px-4 py-2 rounded-lg font-bold">
                    Order Now
                  </button>
                </div>
              ))
            ) : searchQuery.trim() ? (
              <p className="text-sm text-gray-400">No results found</p>
            ) : null}
          </div>
        </div>
      )}

      {/* Veg/Non-Veg Toggle */}
      <div className="w-[375px] bg-[#0B0F1F] flex justify-around py-3">
        <button
          onClick={() => setSelected('veg')}
          className={`flex items-center px-4 py-2 border-2 rounded-lg transition-colors duration-200 ${
            selected === 'veg'
              ? 'border-green-500 text-green-500'
              : 'border-gray-500 text-gray-500'
          }`}
          style={{ width: '150px' }}
        >
          <span
            className={`w-3 h-3 rounded-lg ${
              selected === 'veg' ? 'bg-green-500' : 'bg-gray-500'
            }`}
          ></span>
          <span className="ml-2">Veg</span>
        </button>
        <button
          onClick={() => setSelected('nonveg')}
          className={`flex items-center px-4 py-2 border-2 rounded-lg transition-colors duration-200 ${
            selected === 'nonveg'
              ? 'border-red-500 text-red-500'
              : 'border-gray-500 text-gray-500'
          }`}
          style={{ width: '150px' }}
        >
          <span
            className={`w-3 h-3 rounded-full ${
              selected === 'nonveg' ? 'bg-red-500' : 'bg-gray-500'
            }`}
          ></span>
          <span className="ml-2">Non Veg</span>
        </button>
      </div>

      {/* Categories */}
      <div className="w-[375px] px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold">Categories</h2>
          <button className="text-xs text-[#5678E9]" onClick={handleCategoryView}>
            View All
          </button>
        </div>
        <div className="flex overflow-x-hidden space-x-4">
          {categories && categories.length > 0 ? (
            categories.map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 cursor-pointer"
                onClick={() => handleCategoryClick(category)} // Handle category click
              >
                <div className="bg-gray-700 w-14 h-14 rounded-lg flex items-center justify-center">
                  <img
                    src={category.image} // Use the image URL from the API response
                    alt={category.categoryName}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-400">{category.categoryName}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No categories found</p>
          )}
        </div>
      </div>

      {/* Display Selected Category Details */}
      {selectedCategory && (
        <div className="w-[375px] px-4 py-3">
          <h2 className="text-sm font-semibold mb-2">{selectedCategory.categoryName}</h2>
          <div className="bg-[#252836] rounded-lg p-4">
            <img
              src={selectedCategory.image} // Use the image URL from the selected category
              alt={selectedCategory.categoryName}
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-sm font-medium text-white mt-2">
              {selectedCategory.categoryName}
            </p>
          </div>
        </div>
      )}

      {/* Trending Menu */}
      <div className="w-[375px] px-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold">Trending Menu</h2>
          <button className="text-xs text-[#5678E9]" onClick={handleTrendingClick}>
            View All
          </button>
        </div>
        {/* Food Items */}
        <div className="space-y-4">
          {filteredItems && filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#252836] rounded-lg p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-[#2D303E] w-16 h-16 rounded-lg flex items-center justify-center">
                    <img
                      src={`https://restaurants-customer-dashboard.onrender.com/${item.imageUrl}`}
                      alt={item.itemName}
                      className="object-cover w-full h-full rounded-lg"
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
                <button
                  className="bg-[#CA923D] text-xs text-white px-4 py-2 rounded-lg font-bold"
                  onClick={() => navigate(`/itemsdetails/${item._id}`)}
                >
                  Order Now
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No items found</p>
          )}
        </div>
      </div>

      {/* Floating Menu Button */}
      <button
        className="fixed bottom-4 right-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-[#666872b0] border-white border-2"
        onClick={handleTrendingClick}
      >
        <img src="/assets/images/menu.png" alt="Menu Icon" className="w-8 h-10" />
      </button>
    </div>
  );
};

export default ParcelHomePage;