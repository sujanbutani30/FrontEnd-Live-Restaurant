import React, { useEffect, useState } from "react";
import { FaUsers, FaClock, FaChartLine } from "react-icons/fa";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  getDashboardCounts,
  getOrderCounts,
  getCustomerVisit,
  getTrendingDishes,
} from "../../api/DashboardApi";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [dashboardCounts, setDashboardCounts] = useState({
    totalOrderToday: 0,
    averageCustomer: 0,
    averageWaitingTime: "00:00 Hr",
    todayRevenue: 0,
  });

  const [orderCounts, setOrderCounts] = useState({
    parcelCounts: 0,
    onsiteCounts: 0,
  });

  const [customerVisitData, setCustomerVisitData] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerVisitFilter, setCustomerVisitFilter] = useState("Week");
  const [orderFilter, setOrderFilter] = useState("Week");

  // Helper function to filter data by date
  const filterDataByDate = (itemDate, currentDate, filter) => {
    switch (filter) {
      case "Week":
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the week (Sunday)
        const endOfWeek = new Date(currentDate);
        endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay())); // End of the week (Saturday)
        return itemDate >= startOfWeek && itemDate <= endOfWeek;

      case "Month":
        return (
          itemDate.getMonth() === currentDate.getMonth() &&
          itemDate.getFullYear() === currentDate.getFullYear()
        );

      case "Year":
        return itemDate.getFullYear() === currentDate.getFullYear();

      default:
        return true; // No filtering
    }
  };

  // Fetch customer visit data with filtering
  const fetchCustomerVisitData = async (filter) => {
    try {
      const response = await getCustomerVisit(); // Fetch all data
      const currentDate = new Date();

      // Filter the data based on the selected filter
      const filteredData = response.filter((item) => {
        const itemDate = new Date(item._id);
        return filterDataByDate(itemDate, currentDate, filter);
      });

      setCustomerVisitData(filteredData);
    } catch (error) {
      console.error("Error fetching customer visit data:", error);
      setError("Failed to fetch customer visit data");
    }
  };

  // Fetch order counts with filtering
  const fetchOrderData = async (filter) => {
    try {
      const response = await getOrderCounts();
      const currentDate = new Date();

      // Filter parcel counts
      const filteredParcelCounts = response.parcelCounts.filter((item) => {
        const itemDate = new Date(item._id);
        return filterDataByDate(itemDate, currentDate, filter);
      });

      // Filter onsite counts
      const filteredOnsiteCounts = response.onsiteCounts.filter((item) => {
        const itemDate = new Date(item._id);
        return filterDataByDate(itemDate, currentDate, filter);
      });

      // Calculate total counts
      const totalParcelCounts = filteredParcelCounts.reduce(
        (sum, item) => sum + item.count,
        0
      );
      const totalOnsiteCounts = filteredOnsiteCounts.reduce(
        (sum, item) => sum + item.count,
        0
      );

      setOrderCounts({
        parcelCounts: totalParcelCounts,
        onsiteCounts: totalOnsiteCounts,
      });
    } catch (error) {
      console.error("Error fetching order data:", error);
      setError("Failed to fetch order data");
    }
  };

  // Fetch dashboard counts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const counts = await getDashboardCounts();
        setDashboardCounts({
          totalOrderToday: counts.totalOrders,
          averageCustomer: counts.totalCustomers,
          averageWaitingTime: counts.averageWaitingTime,
          todayRevenue: counts.totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data");
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch customer visit data when the filter changes
  useEffect(() => {
    fetchCustomerVisitData(customerVisitFilter);
  }, [customerVisitFilter]);

  // Fetch order counts when the filter changes
  useEffect(() => {
    fetchOrderData(orderFilter);
  }, [orderFilter]);

  // Fetch trending dishes when the component mounts or the filter changes
  useEffect(() => {
    const fetchTrendingDishes = async (filter) => {
      try {
        const data = await getTrendingDishes(filter);

        // If filter is "All", show all dishes
        if (filter === "All") {
          const mappedData = data.map((dish) => ({
            name: dish.dishName,
            price: dish.price,
            orderQty: dish.totalOrders,
            revenue: dish.totalRevenue,
            image: dish.dishImage,
          }));
          setPopularDishes(mappedData);
          return;
        }

        // Get the current date
        const currentDate = new Date();

        // Filter data based on the selected filter
        const filteredData = data.filter((dish) => {
          const dishDate = new Date(dish.date.date); // Convert dish date to Date object

          switch (filter) {
            case "Day":
              return (
                dishDate.getDate() === currentDate.getDate() &&
                dishDate.getMonth() === currentDate.getMonth() &&
                dishDate.getFullYear() === currentDate.getFullYear()
              );

            case "Week":
              const startOfWeek = new Date(currentDate);
              startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
              const endOfWeek = new Date(currentDate);
              endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
              return dishDate >= startOfWeek && dishDate <= endOfWeek;

            case "Month":
              return (
                dishDate.getMonth() === currentDate.getMonth() &&
                dishDate.getFullYear() === currentDate.getFullYear()
              );

            case "Year":
              return dishDate.getFullYear() === currentDate.getFullYear();

            default:
              return true; // No filtering
          }
        });

        // Map the filtered data to the desired format
        const mappedData = filteredData.map((dish) => ({
          name: dish.dishName,
          price: dish.price,
          orderQty: dish.totalOrders,
          revenue: dish.totalRevenue,
          image: dish.dishImage,
        }));

        setPopularDishes(mappedData);
      } catch (error) {
        console.error("Error fetching trending dishes:", error);
        setError("Failed to fetch trending dishes");
      }
    };

    fetchTrendingDishes(filter);
  }, [filter]);

  // Chart data
  const barChartData = {
    labels: customerVisitData.map((item) => item._id),
    datasets: [
      {
        data: customerVisitData.map((item) => item.count),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 5,
      },
    ],
  };

  const doughnutData = {
    labels: ["Parcel Order", "Onsite Order"],
    datasets: [
      {
        data: [orderCounts.parcelCounts, orderCounts.onsiteCounts],
        backgroundColor: ["#f87171", "#fbbf24"],
      },
    ],
  };

  console.log("Customer Visit Data:", customerVisitData);
  console.log("Bar Chart Data:", barChartData);

  return (
    <>
      <div className="flex flex-col 2xl:flex-row gap-8 mb-8 w-full">
        {/* Image Container */}
        <div className="flex-1 rounded-lg p-6 relative overflow-hidden w-full grid-cols-6 min-h-52">
          <img
            src={`/assets/images/Frame 1000006002.png`}
            alt="Restaurant interior"
            className="absolute inset-0 w-full h-full object-center"
          />
        </div>

        {/* Stats Section */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1F1D2B] p-6 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-red-500 rounded-md">
              <img
                src="./assets/images/todayicon.png"
                alt="Icon"
                className="w-6 h-6"
              />
            </div>
            <div>
              <h4 className="text-gray-300">Total Order Today</h4>
              <p className="text-3xl font-bold text-white">
                {dashboardCounts.totalOrderToday}
              </p>
            </div>
          </div>

          <div className="bg-[#1F1D2B] p-6 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-md">
              <FaUsers className="text-white text-xl" />
            </div>
            <div>
              <h4 className="text-gray-300">Average Customer</h4>
              <p className="text-3xl font-bold text-white">
                {dashboardCounts.averageCustomer}
              </p>
            </div>
          </div>

          <div className="bg-[#1F1D2B] p-6 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-md">
              <FaClock className="text-white" />
            </div>
            <div>
              <h4 className="text-gray-300">Average Waiting Time</h4>
              <p className="text-3xl font-bold text-white">
                {dashboardCounts.averageWaitingTime}
              </p>
            </div>
          </div>

          <div className="bg-[#1F1D2B] p-6 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-yellow-500 rounded-md">
              <FaChartLine className="text-white" />
            </div>
            <div>
              <h4 className="text-gray-300">Today Revenue</h4>
              <p className="text-3xl font-bold text-white">
                ₹{dashboardCounts.todayRevenue}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-12 xl:grid-cols-2 gap-8 mb-8">
        {/* Left Column (2 Charts) */}
        <div className="2xl:col-span-6 md:space-y-8 sm:space-y-0">
          {/* Customer Visit Chart */}
          <div className="bg-[#1F1D2B] p-6 rounded-lg 2xl:h-[360px] xl:h-[320px] md:block md:mb-0 mb-10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold">Customer Visit</h4>
              <select
                className="bg-[#1F1D2B] outline-[#2A2A38] border border-[#2A2A38] text-white rounded px-2 py-1"
                value={customerVisitFilter}
                onChange={(e) => setCustomerVisitFilter(e.target.value)}
              >
                <option value="Week">Week</option>
                <option value="Month">Month</option>
                <option value="Year">Year</option>
              </select>
            </div>
            {customerVisitData.length === 0 ? (
              <p className="text-center text-gray-500">No data available for the selected filter.</p>
            ) : (
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Date",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Customer Visits",
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            )}
          </div>

          {/* Orders Chart */}
          <div className="bg-[#1F1D2B] p-6 rounded-lg 2xl:h-[410px]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold">Orders</h4>
              <select
                className="bg-[#1F1D2B] outline-[#2A2A38] border border-[#2A2A38] text-white rounded px-2 py-1"
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
              >
                <option value="Week">Week</option>
                <option value="Month">Month</option>
                <option value="Year">Year</option>
              </select>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut
                  data={doughnutData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
            <div className="flex justify-around mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{orderCounts.parcelCounts}</p>
                <p className="text-gray-400">Parcel Order</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{orderCounts.onsiteCounts}</p>
                <p className="text-gray-400">Onsite Order</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Popular Dishes) */}
        <div className="bg-[#1F1D2B] p-6 rounded-lg 2xl:col-span-6 ">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold">Popular Dishes</h4>
            <select
              className="bg-[#1F1D2B] outline-[#2A2A38] border border-[#2A2A38] text-white rounded px-2 py-1"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </select>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-left">
                <th className="py-2">Dish</th>
                <th className="py-2">Price</th>
                <th className="py-2 sm:hidden md:table-cell">Order/Day</th>
                <th className="py-2 sm:hidden md:table-cell">Revenue/Day</th>
              </tr>
            </thead>
            <tbody>
              {popularDishes.length > 0 ? (
                popularDishes.map((dish, index) => (
                  <tr key={index} className="border-t border-[#2A2A38]">
                    <td className="py-2 flex items-center">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-14 h-14 mr-2 rounded bg-black p-2"
                      />
                      {dish.name}
                    </td>
                    <td className="py-2">₹{dish.price.toFixed(2)}</td>
                    <td className="py-2 sm:hidden md:table-cell">
                      {dish.orderQty}
                    </td>
                    <td className="py-2 sm:hidden md:table-cell">
                      ₹{dish.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}