"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SpendingCategories = ({ transactions }) => {
  if (!transactions || !transactions.length) {
    return (
      <motion.section 
        className="spending-categories bg-white p-6 rounded-xl shadow-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-800">Spending Categories</h2>
        <div className="mt-8 mb-8">
          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-gray-500 mt-4">No transactions available yet</p>
        </div>
      </motion.section>
    );
  }

  // Compute total spending per category
  const categoryTotals = transactions.reduce((acc, txn) => {
    if (txn.category && txn.amount) {
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    }
    return acc;
  }, {});

  // Sort categories by amount (descending)
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .map(([category]) => category);

  const amounts = sortedCategories.map(category => categoryTotals[category]);
  
  // Calculate total for percentage
  const total = amounts.reduce((sum, amount) => sum + amount, 0);

  // Use consistent colors with a pleasing light theme palette
  const mainColor = 'rgba(79, 70, 229, 0.7)'; // Main indigo color with transparency
  const hoverColor = 'rgba(79, 70, 229, 0.9)'; // Darker on hover

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend since we'll create our own
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `$${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: (value) => `$${value}`
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    // Make bars thinner by increasing the max width percentage
    // Default is 88% - increasing this value creates more space between bars
    barPercentage: 0.5,
    // Control thickness of individual bars
    categoryPercentage: 0.7
  };

  const data = {
    labels: sortedCategories,
    datasets: [
      {
        label: "Amount Spent",
        data: amounts,
        backgroundColor: mainColor,
        hoverBackgroundColor: hoverColor,
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };

  return (
    <motion.section 
      className="spending-categories bg-white p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Spending Categories</h2>
        <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
          Total: ${total.toFixed(2)}
        </span>
      </div>
      
      <div className="h-64 mb-4">
        <Bar data={data} options={options} />
      </div>
      
      {/* Category legend with percentages */}
      <div className="mt-6 space-y-3">
        {sortedCategories.map((category, index) => {
          const amount = categoryTotals[category];
          const percentage = ((amount / total) * 100).toFixed(1);
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-indigo-600 mr-2"></div>
                <span className="text-gray-700">{category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">${amount.toFixed(2)}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default SpendingCategories;