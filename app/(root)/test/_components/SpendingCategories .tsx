"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SpendingCategories = ({ transactions  }) => {
  if (!transactions.length) {
    return (
      <section className="spending-categories bg-white p-4 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold">Spending Categories</h2>
        <p className="text-gray-500 mt-2">No transactions available</p>
      </section>
    );
  }

  // Compute total spending per category
  const categoryTotals = transactions.reduce((acc, txn) => {
    if (txn.category && txn.amount) {
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    }
    return acc;
  }, {});

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  // Dynamic colors for categories
  const backgroundColors = categories.map(
    (_, i) => `hsl(${(i * 60) % 360}, 70%, 50%)`
  );

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Spending by Category",
        data: amounts,
        backgroundColor: backgroundColors,
      },
    ],
  };

  return (
    <motion.section 
      className="spending-categories bg-white p-6 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Spending Categories</h2>
      <Bar data={data} />
    </motion.section>
  );
};

export default SpendingCategories;
