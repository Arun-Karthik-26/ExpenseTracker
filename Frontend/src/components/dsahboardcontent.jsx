import React, { useEffect, useState } from "react";
import axios from "axios";
import ActivityChart from "./ActivityChart";
import { FiDollarSign, FiClipboard, FiCreditCard } from "react-icons/fi";
import Layout from "./Layout";

const DashboardContent = () => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [numBudgets, setNumBudgets] = useState(0);
  const [latestBudgets, setLatestBudgets] = useState([]);
  const [activityData, setActivityData] = useState({ budgets: [], amounts: [] }); // Data for the chart
  const userId = "X0sdMYA77pMJDyZ5XXjJKvdQkpY2"; // Replace with dynamic user ID

  // Function to fetch dashboard data from the server
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/getDashBoardData?user=${userId}`);
      const data = response.data;

      setTotalBudget(data.totalBudget); // Set total budget
      setTotalSpend(data.totalSpend); // Set total spend
      setNumBudgets(data.numBudgets); // Set number of budgets
      setLatestBudgets(data.latestBudgets); // Set latest budgets

      // Prepare activity data for the chart
      const activityData = data.activityData; // Fetch activity data from the response

      // Calculate amount spent for each activity
      const updatedActivityData = activityData.map(act => {
        return {
          title: act.title, // Title of the budget
          amount_spend: act.totalAmount - act.remaining // Calculate spend as totalAmount - remaining
        };
      });

      // Prepare data for the chart
      const budgets = updatedActivityData.map(act => act.title); // Extract budget titles for x-axis
      const amounts = updatedActivityData.map(act => act.amount_spend); // Extract calculated spend for y-axis

      setActivityData({
        budgets: budgets,
        amounts: amounts,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData(); // Fetch data on component mount
  }, []);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome to PennyTrack ✌️</h1>
        <p className="text-gray-500">Here's what's happening with your money. Let's manage your expense.</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Budget</p>
            <h3 className="text-2xl font-bold">${totalBudget}</h3>
          </div>
          <FiDollarSign className="text-blue-500 text-3xl" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Spend</p>
            <h3 className="text-2xl font-bold">${totalSpend}</h3>
          </div>
          <FiClipboard className="text-blue-500 text-3xl" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500">No. of Budgets</p>
            <h3 className="text-2xl font-bold">{numBudgets}</h3>
          </div>
          <FiCreditCard className="text-blue-500 text-3xl" />
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Activity</h3>
        <ActivityChart budgets={activityData.budgets} amounts={activityData.amounts} />
      </div>

      {/* Latest Budgets */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Latest Budgets</h3>
        <div className="flex flex-col space-y-4">
          {latestBudgets.map((budget, index) => {
            // Calculate the spent amount
            const spentAmount = budget.totalAmount - budget.remaining;
            return (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p>{budget.title}</p>
                  <p className="text-gray-500 text-sm">
                    Total: ${budget.totalAmount} | Spent: ${spentAmount}
                  </p>
                </div>
                <div className="text-xl font-bold">${budget.totalAmount}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardContent;
