import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { registerAdmin, fetchRestaurants, createRestaurant } from '../../api/authApi'; // Import API functions
import axios from 'axios';
function Register() {
  const { register, handleSubmit, watch, formState: { errors, isValid, isDirty } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRestaurantFormOpen, setIsRestaurantFormOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  // Fetch restaurants on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchRestaurants();
        setRestaurants(response);
      } catch (error) {
        console.error('Error fetching restaurants', error);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    try {
      const response = await registerAdmin(data); // Call API function
      if (response.success) {
        alert("Admin registered successfully!");
        navigate('/login');
      } else {
        alert("Error: " + response.message);
      }
    } catch (error) {
      console.error("Error registering admin:", error.response || error);
      alert("Error registering admin");
    }
  };

  const [formData, setFormData] = useState({
    restaurantName: "",
    restaurantAddress: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createRestaurant(formData); // Call API function
      if (response.success) {
        alert("Restaurant created successfully!");
        setIsRestaurantFormOpen(false);
      } else {
        setError(response.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Server error occurred.");
    }
  };

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const selectedCountry = watch("country");
  const selectedState = watch("state");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryData = response.data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        setCountries(countryData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry) return;
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states`,
          {
            headers: {
              "X-CSCAPI-KEY": "bDJXdWVSNnV0Wm01MUkyWWhjSm0ySkNjYTcxSTd6eHJ6ZzRxaDBhZw==",
            },
          }
        );
        setStates(response.data);
        setCities([]);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState) return;
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states/${selectedState}/cities`,
          {
            headers: {
              "X-CSCAPI-KEY": "bDJXdWVSNnV0Wm01MUkyWWhjSm0ySkNjYTcxSTd6eHJ6ZzRxaDBhZw==",
            },
          }
        );
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, [selectedState]);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const toggleRestaurantForm = () => setIsRestaurantFormOpen(!isRestaurantFormOpen);

  return (
    <div
      className=" min-h-screen w-full flex items-center justify-center text-white bg-cover bg-center"
      style={{
        backgroundImage: `
        linear-gradient(89.95deg, rgba(31, 29, 43, 0.96) 0.04%, rgba(30, 28, 42, 0.43) 70.08%, rgba(30, 28, 41, 0.37) 99.14%), 
        linear-gradient(89.47deg, #1F1D2B 0.37%, rgba(31, 28, 42, 0.74) 99.48%),
        url('./assets/images/b031f0ade82ec13db272ea276a0e4068.jpg')`,
      }}>
      <div className="bg-opacity-70 min-h-screen p-8 rounded-lg max-w-full w-full flex flex-col md:flex-row items-center md:items-start">
        {/* Left Section - Form */}
        <div className="md:w-[870px] bg-[#252836] p-10 flex flex-col justify-center rounded-xl">
          <h2 className="text-[34px] font-semibold text-white mb-5">Registration</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-[14px] font-medium pb-1">First Name <span className='text-[red]'>*</span></label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  {...register("firstname", { required: "First Name is required" })}
                  className="w-full px-4 py-2 bg-[#2D303E] text-white rounded-lg placeholder:text-[#ABBBC2] outline-none outline focus:outline-[#CA923D]"
                />
                {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message}</p>}
              </div>
              <div>
                <label className="block text-white text-[14px] font-medium pb-1">Last Name <span className='text-[red]'>*</span></label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  {...register("lastname", { required: "Last Name is required" })}
                  className="w-full px-4 py-2 bg-[#2D303E] text-white rounded-lg placeholder:text-[#ABBBC2] outline-none outline focus:outline-[#CA923D]"
                />
                {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
              <div>
                <label className="block text-white text-[14px] font-medium pb-1">Email Address <span className='text-[red]'>*</span></label>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-2 bg-[#2D303E] text-white rounded-lg placeholder:text-[#ABBBC2] outline-none outline focus:outline-[#CA923D]"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-white text-[14px] font-medium pb-1">Phone Number <span className='text-[red]'>*</span></label>
                <input
                  type="tel"
                  placeholder="Enter Phone Number"
                  {...register("phonenumber", { required: "Phone number is required" })}
                  className="w-full px-4 py-2 bg-[#2D303E] text-white rounded-lg placeholder:text-[#ABBBC2] outline-none outline focus:outline-[#CA923D]"
                />
                {errors.phonenumber && <p className="text-red-500 text-sm">{errors.phonenumber.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white text-[14px] font-medium pb-1">Country <span className='text-[red]'>*</span></label>
                <select
                  {...register("country", { required: "Country is required" })}
                  className="w-full px-4 py-2 bg-[#2D303E] text-white rounded-lg outline-none outline focus:outline-[#CA923D]"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
              </div>
              <div>
                <label className="block text-white text-[14px] font-medium pb-1">State <span className='text-[red]'>*</span></label>
                <select
                  {...register("state", { required: "State is required" })}
                  className="w-full px-4 py-2 bg-[#2D303E] text-white rounded-lg outline-none outline focus:outline-[#CA923D]"
                  disabled={!states.length}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.iso2} value={state.iso2}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
              </div>
              <div>
                <label className="block text-white text-[14px] font-medium pb-1">City <span className='text-[red]'>*</span></label>
                <select
                  {...register("city", { required: "City is required" })}
                  className="w-full px-4 py-2 bg-[#2D303E] text-white rounded-lg outline-none outline focus:outline-[#CA923D]"
                  disabled={!cities.length}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-white text-[14px] font-medium pb-1">Select Restaurant <span className='text-[red]'>*</span></label>
              <select {...register("selectrestaurant", { required: "Restaurant selection is required" })} className="w-full px-4 py-2 bg-[#2D303E] text-white rounded-lg outline-none outline focus:outline-[#CA923D]">
                <option value="">Select Restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.restaurantName}
                  </option>
                ))}
              </select>
              {errors.selectrestaurant && <p className="text-red-500 text-sm">{errors.selectrestaurant.message}</p>}
            </div>

            {/* Create New Restaurant Button */}
            <a
              href="#"
              onClick={toggleRestaurantForm}
              className="w-full py-2 text-white font-semibold mt-4 text-center block cursor-pointer transition duration-300 rounded-lg bg-[#CA923D] hover:bg-[#a57b2f]"
            >
              Create New Restaurant
            </a>

            <div>
              <label className="block text-white text-[14px] font-medium pb-1">Password <span className='text-[red]'>*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-2 bg-[#2D303E] text-white rounded-lg outline-none outline focus:outline-[#CA923D]"
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePassword}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-white text-[14px] font-medium pb-1">Confirm Password <span className='text-[red]'>*</span></label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("comfirmpassword", { required: "Confirm Password is required" })}
                  className="w-full px-4 py-2 bg-[#2D303E] text-white rounded-lg outline-none outline focus:outline-[#CA923D]"
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={toggleConfirmPassword}
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
              {errors.comfirmpassword && <p className="text-red-500 text-sm">{errors.comfirmpassword.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("terms", { required: "You must agree to the terms" })}
                className="accent-[#CA923D]"
              />
              <span className="text-white text-[14px] font-normal">I agree to the <a href="#" className="text-[#5678E9]">T&C</a> and <a href="#" className="text-blue-500">Privacy Policies.</a></span>
            </div>
            {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}

            <button type="submit" className="w-full py-2 text-white font-semibold mt-4 rounded-lg bg-[#CA923D] transition duration-200 hover:bg-[#a57b2f]">Register</button>

            {/* Already have an account? */}
            <div className="text-center mt-4">
              <p className="text-white font-semibold text-[14px]">
                Already have an account? <a href="/login" className="text-[#5678E9] text-[18px] font-semibold">Login</a>
              </p>
            </div>
          </form>
        </div>

        {/* Create New Restaurant Form - Pop-up */}
        {isRestaurantFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#252836] text-gray-700 p-8 rounded-xl max-w-md w-full space-y-4">
            <h3 className="text-[20px] text-white font-bold border-b border-[#333748] pb-3">Create New Restaurant</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
                {error && <div className="text-red-500">{error}</div>}
                <div>
                  <label className="block text-white text-[14px] font-medium pb-1">Restaurant Name <span className='text-[red]'>*</span></label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    placeholder="Enter Restaurant Name"
                    className="w-full px-4 py-2 rounded-lg border text-[#ABBBC2] placeholder:text-[#ABBBC2] bg-[#2D303E]  border-[#333748] outline-none outline focus:outline-[#CA923D]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-[14px] font-medium pb-1">Address <span className='text-[red]'>*</span></label>
                  <input
                    type="text"
                    name="restaurantAddress"
                    value={formData.restaurantAddress}
                    onChange={handleChange}
                    placeholder="Enter Address"
                    className="w-full px-4 py-2 rounded-lg border text-[#ABBBC2] placeholder:text-[#ABBBC2] bg-[#2D303E]  border-[#333748] outline-none outline focus:outline-[#CA923D]"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Country and State on the same line */}
                  <div>
                    <label className="block text-white text-[14px] font-medium pb-1">Country <span className='text-[red]'>*</span></label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border text-[#ABBBC2] placeholder:text-[#ABBBC2] bg-[#2D303E] border-[#333748] outline-none outline focus:outline-[#CA923D]"
                      required
                    >
                      <option value="">Select Country </option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-[14px] font-medium pb-1">State <span className='text-[red]'>*</span></label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border text-[#ABBBC2] placeholder:text-[#ABBBC2] bg-[#2D303E] border-[#333748] outline-none outline focus:outline-[#CA923D]"
                      required
                    >
                      <option value="">Select State</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="California">California</option>
                    </select>
                  </div>

                  {/* City and Zip Code on the next line */}
                  <div>
                    <label className="block text-white text-[14px] font-medium pb-1">City <span className='text-[red]'>*</span></label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border text-[#ABBBC2] placeholder:text-[#ABBBC2] bg-[#2D303E] border-[#333748] outline-none outline focus:outline-[#CA923D]"
                      required
                    >
                      <option value="">Select City</option>
                      <option value="Surat">Surat</option>
                      <option value="San Francisco">San Francisco</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-[14px] font-medium pb-1">Zip Code <span className='text-[red]'>*</span></label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="Enter Zip Code"
                      className="w-full px-4 py-2 rounded-lg border text-[#ABBBC2] placeholder:text-[#ABBBC2] bg-[#2D303E] border-[#333748] outline-none outline focus:outline-[#CA923D]"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-5">
                  <button type="button" onClick={toggleRestaurantForm} className="w-[48%] h-[48px] border border-[#333748] text-[18px] text-white font-semibold rounded-lg">Cancel</button>
                  <button type="submit" className="w-[48%] h-[48px] bg-[#CA923D] border border-[#333748] text-[18px] text-white font-semibold rounded-lg">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Right Section - Logo or image */}
        <div className="w-full md:w-1/2 md:hidden sm:hidden lg:flex mt-72 justify-center items-center text-center text-white">
          <img src="./assets/images/Group 1000005985.png" alt="Logo" className="mb-4" />
        </div>
      </div>
    </div>
  );
}

export default Register;