"use client"; // Ensure this is at the top

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import BudgetForm from "./BudgetForm";

const budgetData = [
  { category: "Groceries", spent: 450, budget: 500 },
  { category: "Entertainment", spent: 120, budget: 100 },
  { category: "Transport", spent: 80, budget: 150 },
  { category: "Shopping", spent: 200, budget: 250 },
];

const alerts = [
  { message: "⚠ You are 90% close to your monthly groceries budget!", type: "warning" },
  { message: "🔴 Overspending detected in Entertainment this month!", type: "danger" },
  { message: "⚡ Unusual transaction: $50 spent on Electronics.", type: "anomaly" },
];

const BudgetAlerts = () => {
  const totalBudget = budgetData.reduce((acc, item) => acc + item.budget, 0);
  const totalSpent = budgetData.reduce((acc, item) => acc + item.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  const pieChartData = [
    { name: "Spent", value: totalSpent },
    { name: "Remaining", value: remainingBudget },
  ];

  const COLORS = ["#4F46E5", "#10B981"];
  
  // Calculate percentage for each category
  const categoryData = budgetData.map(item => ({
    ...item,
    percentage: Math.round((item.spent / item.budget) * 100)
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💰 Budget Alerts</h1>
          <p className="text-gray-600">Track your expenses and stay within budget.</p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-blue-500 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Budget</h3>
            <p className="text-2xl font-bold text-gray-800">${totalBudget}</p>
          </Card>
          <Card className="p-6 border-l-4 border-indigo-500 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Spent</h3>
            <p className="text-2xl font-bold text-gray-800">${totalSpent}</p>
          </Card>
          <Card className="p-6 border-l-4 border-green-500 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Remaining</h3>
            <p className="text-2xl font-bold text-gray-800">${remainingBudget}</p>
          </Card>
        </div>

        {/* Budget Overview */}
        <Card className="p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">📊 Current Budget Usage</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full md:w-2/3 space-y-4">
              {categoryData.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-700">{item.category}</h3>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      item.percentage > 90 ? "bg-red-100 text-red-800" : 
                      item.percentage > 75 ? "bg-yellow-100 text-yellow-800" : 
                      "bg-green-100 text-green-800"
                    }`}>
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        item.percentage > 90 ? "bg-red-500" : 
                        item.percentage > 75 ? "bg-yellow-500" : 
                        "bg-green-500"
                      }`} 
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>${item.spent} spent</span>
                    <span>${item.budget} budget</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Alerts Section */}
        <Card className="p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">🔔 Alerts</h2>
            <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">{alerts.length} Active</span>
          </div>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 shadow-sm flex items-start ${
                  alert.type === "danger"
                    ? "bg-red-50 border-red-500 text-red-800"
                    : alert.type === "warning"
                    ? "bg-yellow-50 border-yellow-500 text-yellow-800"
                    : "bg-blue-50 border-blue-500 text-blue-800"
                }`}
              >
                <div className="flex-1">
                  {alert.message}
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <BudgetForm/>
    </div>
  );
};

export default BudgetAlerts;