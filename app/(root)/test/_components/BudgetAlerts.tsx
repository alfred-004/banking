"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import BudgetForm from "./BudgetForm";
import { Calendar, AlertTriangle, BellRing } from "lucide-react";
import Heatmap from "./Heatmap";

const defaultBudgetData = [
  { category: "Groceries", spent: 450, budget: 500 },
  { category: "Entertainment", spent: 120, budget: 100 },
  { category: "Transport", spent: 80, budget: 150 },
  { category: "Shopping", spent: 200, budget: 250 },
];

const BudgetAlerts = () => {
  const [budgetData, setBudgetData] = useState(defaultBudgetData);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState("");
  const [lastTrackedMonth, setLastTrackedMonth] = useState("");
  const [dynamicAlerts, setDynamicAlerts] = useState([]);
  const [userName, setUserName] = useState("User"); // Default user name
  const [userEmail, setUserEmail] = useState(""); // User email will be set from localStorage or other source
  const [emailSent, setEmailSent] = useState(false);

  // Get current month and handle month change
  useEffect(() => {
    const now = new Date();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const thisMonth = monthNames[now.getMonth()];
    setCurrentMonth(thisMonth);
    
    // Check if we need to initialize lastTrackedMonth from localStorage
    if (typeof window !== 'undefined' && !lastTrackedMonth) {
      const storedMonth = localStorage.getItem("lastTrackedMonth");
      if (storedMonth) {
        setLastTrackedMonth(storedMonth);
      } else {
        // If no stored month, set current month as last tracked
        setLastTrackedMonth(thisMonth);
        localStorage.setItem("lastTrackedMonth", thisMonth);
      }

      // Get user data from localStorage
      const storedUserName = localStorage.getItem("userName");
      const storedUserEmail = localStorage.getItem("userEmail");
      if (storedUserName) setUserName(storedUserName);
      if (storedUserEmail) setUserEmail(storedUserEmail);
      else setUserEmail("user@example.com"); // Fallback email for testing
    }
    
    // If month has changed, reset spent values
    if (lastTrackedMonth && thisMonth !== lastTrackedMonth && !isLoading) {
      console.log(`Month changed from ${lastTrackedMonth} to ${thisMonth}, resetting budget spent values`);
      
      // Reset spent values while keeping budgets
      const resetData = budgetData.map(item => ({
        ...item,
        spent: 0
      }));
      
      setBudgetData(resetData);
      setLastTrackedMonth(thisMonth);
      localStorage.setItem("lastTrackedMonth", thisMonth);
      
      // Save the reset data to localStorage
      localStorage.setItem("budgetData", JSON.stringify(resetData));
      
      // Reset email sent flag for the new month
      setEmailSent(false);
    }
  }, [lastTrackedMonth, budgetData, isLoading]);

  // Load budget data from localStorage
  useEffect(() => {
    // Use setTimeout to ensure this runs client-side only
    const loadData = () => {
      try {
        const storedData = localStorage.getItem("budgetData");
        console.log("Fetched from localStorage:", storedData); // Debug log
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            // Validate the data to ensure spent and budget are numbers
            const validatedData = parsedData.map(item => ({
              category: item.category || "Unnamed",
              spent: Number(item.spent) || 0,
              budget: Number(item.budget) || 0
            }));
            setBudgetData(validatedData);
          }
        }
      } catch (error) {
        console.error("Error loading budget data:", error);
        // Fallback to default data on error
        setBudgetData(defaultBudgetData);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Ensure we're in a browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Generate dynamic alerts based on budget data
  useEffect(() => {
    if (!isLoading) {
      const newAlerts = [];
      
      budgetData.forEach(item => {
        const spent = Number(item.spent) || 0;
        const budget = Number(item.budget) || 1; // Avoid division by zero
        const percentage = Math.round((spent / budget) * 100);
        
        // Generate alerts based on spending thresholds
        if (percentage >= 100) {
          newAlerts.push({
            category: item.category,
            message: `🔴 ${item.category} budget exceeded! Spent $${spent.toFixed(2)} of $${budget.toFixed(2)}.`,
            type: "danger",
            percentage
          });

          const sendBudgetAlert = async () => {
            try {
              console.log("Sending budget alert email...");
              
              const response = await fetch('/api/sendEmails', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userEmail,
                  userName,
                  totalBudget,
                  totalSpent
                }),
              });
              
              
              if (response.ok) {
                console.log("Email sent successfully:", data);
                setEmailSent(true); // Set flag to prevent repeated emails
                // Store the date of the last alert to prevent repeat alerts
                localStorage.setItem("lastEmailAlert", new Date().toISOString());
              } else {
                console.error("Failed to send email:", data);
              }
            } catch (error) {
              console.error("Error sending budget alert:", error);
            }
          };
        } else if (percentage >= 90) {
          newAlerts.push({
            category: item.category,
            message: `⚠️ ${item.category} at ${percentage}% of budget! Almost exceeded.`,
            type: "warning",
            percentage
          });

          const sendBudgetAlert = async () => {
            try {
              console.log("Sending budget alert email...");
              
              const response = await fetch('/api/sendEmails', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userEmail,
                  userName,
                  totalBudget,
                  totalSpent
                }),
              });
              
              
              if (response.ok) {
                console.log("Email sent successfully:", data);
                setEmailSent(true); // Set flag to prevent repeated emails
                // Store the date of the last alert to prevent repeat alerts
                localStorage.setItem("lastEmailAlert", new Date().toISOString());
              } else {
                console.error("Failed to send email:", data);
              }
            } catch (error) {
              console.error("Error sending budget alert:", error);
            }
          };
        } else if (percentage >= 75) {
          newAlerts.push({
            category: item.category,
            message: `📊 ${item.category} at ${percentage}% of monthly budget.`,
            type: "caution",
            percentage
          });

          const sendBudgetAlert = async () => {
            try {
              console.log("Sending budget alert email...");
              
              const response = await fetch('/api/sendEmails', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userEmail,
                  userName,
                  totalBudget,
                  totalSpent
                }),
              });
              
              
              if (response.ok) {
                console.log("Email sent successfully:", data);
                setEmailSent(true); // Set flag to prevent repeated emails
                // Store the date of the last alert to prevent repeat alerts
                localStorage.setItem("lastEmailAlert", new Date().toISOString());
              } else {
                console.error("Failed to send email:", data);
              }
            } catch (error) {
              console.error("Error sending budget alert:", error);
            }
          };
        }
        
        // Check for unusual spending patterns (optional)
        // For example, if spent more than 50% of budget in first week of month
        const dayOfMonth = new Date().getDate();
        if (dayOfMonth <= 7 && percentage > 50) {
          newAlerts.push({
            category: item.category,
            message: `⚡ Unusual early spending in ${item.category}: ${percentage}% used in first week.`,
            type: "anomaly",
            percentage
          });
        }
      });
      
      // Sort alerts by severity (percentage)
      newAlerts.sort((a, b) => b.percentage - a.percentage);
      
      setDynamicAlerts(newAlerts);
    }
  }, [budgetData, isLoading]);

  // Save to localStorage whenever budgetData changes
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      try {
        // Ensure we're storing valid number values
        const dataToStore = budgetData.map(item => ({
          category: item.category,
          spent: Number(item.spent) || 0,
          budget: Number(item.budget) || 0
        }));
        localStorage.setItem("budgetData", JSON.stringify(dataToStore));
        console.log("Saved to localStorage:", dataToStore);
      } catch (error) {
        console.error("Error saving budget data:", error);
      }
    }
  }, [budgetData, isLoading]);

  const totalBudget = budgetData.reduce((acc, item) => acc + (Number(item.budget) || 0), 0);
  const totalSpent = budgetData.reduce((acc, item) => acc + (Number(item.spent) || 0), 0);
  const remainingBudget = totalBudget - totalSpent;

  // Send alert email if budget is exceeded
  useEffect(() => {
    if (!isLoading && !emailSent && totalSpent > totalBudget && userEmail) {
      sendBudgetAlert();
    }
  }, [totalSpent, totalBudget, isLoading, emailSent, userEmail]);

  // Function to send alert to backend API
  

  // Function to manually trigger alert email
  const triggerManualAlert = () => {
    setEmailSent(false); // Reset the flag to allow sending
    sendBudgetAlert();
  };

  // Check the API status when component loads
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/email', {
          method: 'GET',
        });
        
        const data = await response.json();
        console.log("API status check response:", data);
      } catch (error) {
        console.error("Error checking API status:", error);
      }
    };
    
    if (typeof window !== 'undefined' && !isLoading) {
      checkApiStatus();
    }
  }, [isLoading]);

  const pieChartData = [
    { name: "Spent", value: totalSpent },
    { name: "Remaining", value: remainingBudget > 0 ? remainingBudget : 0 },
  ];

  const COLORS = ["#4F46E5", "#10B981"];

  // Calculate percentage for each category
  const categoryData = budgetData.map(item => {
    const spent = Number(item.spent) || 0;
    const budget = Number(item.budget) || 1; // Avoid division by zero
    return {
      ...item,
      spent,
      budget,
      percentage: Math.round((spent / budget) * 100)
    };
  });

  // Handle dismissing an alert
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  
  const dismissAlert = (index) => {
    const alertToRemove = dynamicAlerts[index];
    setDismissedAlerts([...dismissedAlerts, alertToRemove.category]);
  };
  
  // Filter out dismissed alerts
  const activeAlerts = dynamicAlerts.filter(alert => 
    !dismissedAlerts.includes(alert.category)
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💰 Budget Tracker</h1>
          <p className="text-gray-600">Track your expenses and stay within budget for <span className="font-medium">{currentMonth}</span>.</p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-blue-500 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Budget</h3>
            <p className="text-2xl font-bold text-gray-800">${totalBudget.toFixed(2)}</p>
          </Card>
          <Card className="p-6 border-l-4 border-indigo-500 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Spent</h3>
            <p className="text-2xl font-bold text-gray-800">${totalSpent.toFixed(2)}</p>
          </Card>
          <Card className="p-6 border-l-4 border-green-500 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Remaining</h3>
            <p className="text-2xl font-bold text-gray-800">${remainingBudget.toFixed(2)}</p>
            {totalSpent > totalBudget && (
              <div className="mt-2">
                <button 
                  onClick={triggerManualAlert}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                >
                  {emailSent ? "Resend Alert" : "Send Alert"}
                </button>
                {emailSent && (
                  <span className="text-xs text-gray-500 ml-2">Alert sent</span>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Dynamic Alerts Section - Only shown when there are active alerts */}
        {activeAlerts.length > 0 && (
          <Card className="p-6 shadow-sm mb-8 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <BellRing className="w-5 h-5 mr-2 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">Budget Alerts</h2>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                {activeAlerts.length} Active
              </span>
            </div>
            
            <div className="space-y-4">
              {activeAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 shadow-sm flex items-start justify-between ${
                    alert.type === "danger"
                      ? "bg-red-50 border-red-500 text-red-800"
                      : alert.type === "warning"
                      ? "bg-yellow-50 border-yellow-500 text-yellow-800"
                      : alert.type === "anomaly"
                      ? "bg-purple-50 border-purple-500 text-purple-800"
                      : "bg-blue-50 border-blue-500 text-blue-800"
                  }`}
                >
                  <div className="flex items-center">
                    {alert.type === "danger" && (
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                    )}
                    <span>{alert.message}</span>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-gray-600 ml-4"
                    onClick={() => dismissAlert(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Budget Overview */}
        <Card className="p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">📊 {currentMonth} Budget Usage</h2>
          <div className="flex flex-col md:flex-row items-start gap-8">
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
                  <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
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
                      item.percentage >= 100 ? "bg-red-100 text-red-800" : 
                      item.percentage >= 90 ? "bg-yellow-100 text-yellow-800" : 
                      item.percentage >= 75 ? "bg-orange-100 text-orange-800" : 
                      "bg-green-100 text-green-800"
                    }`}>
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        item.percentage >= 100 ? "bg-red-500" : 
                        item.percentage >= 90 ? "bg-yellow-500" : 
                        item.percentage >= 75 ? "bg-orange-500" : 
                        "bg-green-500"
                      }`} 
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>${Number(item.spent).toFixed(2)} spent</span>
                    <span>${Number(item.budget).toFixed(2)} budget</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Budget Form */}
        <Card className="p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">✏️ Update Your {currentMonth} Budget</h2>
          <BudgetForm setBudgetData={setBudgetData} currentData={budgetData} />
        </Card>
      </div>

      <Heatmap/>
    </div>
  );
};

export default BudgetAlerts;