"use client";

import { motion } from "framer-motion";
import { FaWallet, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";

const BudgetProgress = ({ totalBudget  , usedBudget = 0 }) => {
    const percentageUsed = totalBudget ? ((usedBudget / (totalBudget*100)) * 100) : 0;
    const remainingBudget = (totalBudget*100) - usedBudget;
    console.log('total budget',totalBudget);
    
  
    return (
      <section className="budget-progress bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaWallet className="text-blue-500" /> Budget Overview
        </h2>
  
        <div className="mt-4 space-y-2">
          <p className="text-gray-700 flex items-center gap-2">
            <FaMoneyBillWave className="text-green-500" />
            <span className="font-semibold">Total Budget:</span> ${totalBudget*100}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <FaCheckCircle className="text-red-500" />
            <span className="font-semibold">Used:</span> ${usedBudget} | 
            <span className="text-green-600 font-semibold"> Remaining: ${remainingBudget}</span>
          </p>
        </div>
  
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mt-4 overflow-hidden">
          <motion.div
            className="h-4 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${percentageUsed}%` }}
            transition={{ duration: 1.2 }}
          />
        </div>
  
        {/* Percentage Display */}
        <p className="text-right text-sm font-medium text-gray-600 mt-1">
          {percentageUsed}% of budget used
        </p>
      </section>
    );
  };
  
  export default BudgetProgress;
  
