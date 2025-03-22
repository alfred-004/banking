"use client"
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar } from "recharts";

// Sample transactions (replace with API fetch in real app)
const transactions = [
  { category: "Rent", amount: 15000, month: "January" },
  { category: "Groceries", amount: 5000, month: "January" },
  { category: "Entertainment", amount: 2000, month: "January" },
  { category: "Rent", amount: 15000, month: "February" },
  { category: "Groceries", amount: 6000, month: "February" },
  { category: "Entertainment", amount: 2500, month: "February" },
];

function forecastBudget(transactions) {
  const categories = {};
  const months = [...new Set(transactions.map(t => t.month))];
  
  transactions.forEach(({ category, amount }) => {
    if (!categories[category]) categories[category] = [];
    categories[category].push(amount);
  });

  const forecast = {};
  Object.keys(categories).forEach((category) => {
    const avg = categories[category].reduce((a, b) => a + b, 0) / categories[category].length;
    forecast[category] = avg.toFixed(2);
  });

  // Generate next month forecast data for chart
  const nextMonth = months.length === 1 ? "March" : "March";
  const forecastChartData = Object.entries(forecast).map(([category, amount]) => ({
    name: nextMonth,
    category,
    amount: parseFloat(amount),
    forecast: parseFloat(amount)
  }));

  return { forecast, forecastChartData };
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-md shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-700">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: ₹{entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Forecast = () => {
  const [forecastData, setForecastData] = useState({});
  const [forecastChartData, setForecastChartData] = useState([]);
  const [historicalData, setHistoricalData] = useState(transactions);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    const result = forecastBudget(transactions);
    setForecastData(result.forecast);
    setForecastChartData(result.forecastChartData);
  }, []);

  // Prepare data for trend visualization
  const generateChartData = () => {
    const months = [...new Set(transactions.map(t => t.month))];
    const categories = [...new Set(transactions.map(t => t.category))];
    
    const result = months.map(month => {
      const monthData = { name: month };
      categories.forEach(category => {
        const transaction = transactions.find(t => t.month === month && t.category === category);
        monthData[category] = transaction ? transaction.amount : 0;
      });
      return monthData;
    });

    // Add forecast data for next month
    if (forecastChartData.length > 0) {
      const nextMonthData = { name: forecastChartData[0].name };
      categories.forEach(category => {
        const forecastItem = Object.entries(forecastData).find(([cat]) => cat === category);
        nextMonthData[category] = forecastItem ? parseFloat(forecastItem[1]) : 0;
      });
      result.push(nextMonthData);
    }

    return result;
  };

  const chartData = generateChartData();
  
  // Calculate total expenses
  const calculateTotal = (data) => {
    return data.reduce((sum, item) => sum + item.amount, 0);
  };
  
  const totalExpenses = calculateTotal(transactions);
  const monthlySavings = 50000 - totalExpenses / 2; // Assuming monthly income

  // Get categories for the bar chart
  const categories = [...new Set(transactions.map(t => t.category))];
  const colors = {
    "Rent": "#8884d8",
    "Groceries": "#82ca9d",
    "Entertainment": "#ffc658"
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Budget Forecast</h1>
        <p className="text-gray-600 mb-6">Track your expenses and plan your financial future</p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-800">₹{totalExpenses.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Monthly Savings</p>
                <p className="text-2xl font-bold text-gray-800">₹{monthlySavings.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Categories</p>
                <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button 
              onClick={() => setSelectedTab("overview")}
              className={`px-4 py-3 font-medium text-sm ${selectedTab === "overview" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-blue-500"}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setSelectedTab("data")}
              className={`px-4 py-3 font-medium text-sm ${selectedTab === "data" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-blue-500"}`}
            >
              Transaction Data
            </button>
            <button 
              onClick={() => setSelectedTab("forecast")}
              className={`px-4 py-3 font-medium text-sm ${selectedTab === "forecast" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-blue-500"}`}
            >
              Forecast & Insights
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Expense Trends</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      {categories.map((category, index) => (
                        <Line 
                          key={category}
                          type="monotone" 
                          dataKey={category} 
                          stroke={colors[category] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
                          strokeWidth={2} 
                          activeDot={{ r: 8 }}
                          dot={{ r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Category Breakdown</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      {categories.map((category, index) => (
                        <Bar 
                          key={category}
                          dataKey={category} 
                          fill={colors[category] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {selectedTab === "data" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Transaction History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">Month</th>
                        <th className="px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">Category</th>
                        <th className="px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">Amount</th>
                        <th className="px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicalData.map(({ category, amount, month }, index) => (
                        <tr key={index} className="hover:bg-gray-50 border-b border-gray-100">
                          <td className="px-4 py-3 text-sm text-gray-700">{month}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              category === "Rent" ? "bg-blue-100 text-blue-700" : 
                              category === "Groceries" ? "bg-green-100 text-green-700" : 
                              "bg-yellow-100 text-yellow-700"
                            }`}>
                              {category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">₹{amount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {selectedTab === "forecast" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Future Predictions</h2>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Category</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Predicted Monthly</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(forecastData).map(([category, amount], index) => {
                        const currentAvg = parseFloat(amount);
                        const previousAvg = transactions
                          .filter(t => t.category === category && t.month === "January")
                          .reduce((sum, t) => sum + t.amount, 0);
                        const trend = currentAvg > previousAvg ? "up" : currentAvg < previousAvg ? "down" : "stable";
                        
                        return (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="px-4 py-3 text-sm text-gray-700">{category}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">₹{parseFloat(amount).toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm">
                              {trend === "up" && (
                                <div className="flex items-center text-red-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                  <span>Increasing</span>
                                </div>
                              )}
                              {trend === "down" && (
                                <div className="flex items-center text-green-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                  <span>Decreasing</span>
                                </div>
                              )}
                              {trend === "stable" && (
                                <div className="flex items-center text-gray-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                                  </svg>
                                  <span>Stable</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Smart Suggestions</h2>
                  <div className="space-y-4">
                    <div className="flex p-3 bg-blue-50 rounded-lg">
                      <div className="mr-3 bg-blue-100 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-700">Entertainment Expenses</h3>
                        <p className="text-sm text-blue-600">Consider reducing entertainment expenses by 10% to save approximately ₹250 per month.</p>
                      </div>
                    </div>
                    
                    <div className="flex p-3 bg-yellow-50 rounded-lg">
                      <div className="mr-3 bg-yellow-100 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-yellow-700">Groceries Trend</h3>
                        <p className="text-sm text-yellow-600">Groceries spending increased by 20% from January to February. Consider meal planning to manage costs.</p>
                      </div>
                    </div>
                    
                    <div className="flex p-3 bg-green-50 rounded-lg">
                      <div className="mr-3 bg-green-100 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-green-700">Automated Savings</h3>
                        <p className="text-sm text-green-600">Set up an automatic transfer of ₹15,000 monthly to a savings account for better financial management.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center mt-6">
          Last updated: March 21, 2025 • Data is for demonstration purposes only
        </div>
      </div>
    </div>
  );
};

export default Forecast;