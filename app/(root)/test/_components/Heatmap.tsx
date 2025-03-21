import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";

const dummyData = [
  { date: "2025-03-01", amount: 20 },
  { date: "2025-03-02", amount: 50 },
  { date: "2025-03-03", amount: 1000 },
  { date: "2025-03-04", amount: 800 },
  { date: "2025-03-05", amount: 30 },
  { date: "2025-03-06", amount: 60 },
  { date: "2025-03-07", amount: 90 },
  { date: "2025-03-08", amount: 120 },
  { date: "2025-03-09", amount: 40 },
  { date: "2025-03-10", amount: 70 },
  { date: "2025-03-11", amount: 50 },
  { date: "2025-03-12", amount: 10 },
  { date: "2025-03-13", amount: 90 },
  { date: "2025-03-14", amount: 350 },
];

// Enhanced color scale that shifts to red for high values
const getColorClass = (amount) => {
  if (amount < 40) return "bg-blue-200 text-blue-800";
  if (amount < 80) return "bg-blue-400 text-white";
  if (amount < 200) return "bg-blue-600 text-white";
  if (amount < 300) return "bg-purple-600 text-white";
  if (amount < 400) return "bg-red-500 text-white";
  return "bg-red-700 text-white";
};

// Function to get the color for the line chart
const getLineColor = (amount) => {
  if (amount < 200) return "#3B82F6"; // blue
  if (amount < 300) return "#8B5CF6"; // purple
  if (amount < 400) return "#EF4444"; // red
  return "#B91C1C"; // dark red
};

// Format date more cleanly
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMM dd');
};

// Custom tooltip for the LineChart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const colorClass = data.amount >= 300 ? "text-red-600" : "text-blue-600";
    
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900">{format(new Date(data.date), 'MMM dd, yyyy')}</p>
        <p className={`font-bold ${colorClass}`}>${data.amount}</p>
      </div>
    );
  }
  return null;
};

const Heatmap = () => {
  // Group data by weeks for better organization
  const weeks = [];
  let currentWeek = [];
  
  dummyData.forEach((day, index) => {
    const dayOfWeek = new Date(day.date).getDay();
    
    // Start a new week on Sunday (0) or for the first item
    if (dayOfWeek === 0 || index === 0) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeek = [day];
    } else {
      currentWeek.push(day);
    }
  });
  
  // Add the last week
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Custom dot for line chart that changes color based on value
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill="white" 
        stroke={getLineColor(payload.amount)} 
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Daily Spending Overview</h2>
      
      {/* Improved Legend */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Spending Color Legend</h3>
        <div className="grid grid-cols-6 gap-2">
          <div className="flex flex-col items-center">
            <div className="h-8 w-12 bg-blue-200 rounded-md mb-1"></div>
            <span className="text-xs font-medium text-gray-600">Low<br/>&lt;$40</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-8 w-12 bg-blue-400 rounded-md mb-1"></div>
            <span className="text-xs font-medium text-gray-600">Medium<br/>$40-$79</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-8 w-12 bg-blue-600 rounded-md mb-1"></div>
            <span className="text-xs font-medium text-gray-600">High<br/>$80-$199</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-8 w-12 bg-purple-600 rounded-md mb-1"></div>
            <span className="text-xs font-medium text-gray-600">Very High<br/>$200-$299</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-8 w-12 bg-red-500 rounded-md mb-1"></div>
            <span className="text-xs font-medium text-gray-600">Alert<br/>$300-$399</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-8 w-12 bg-red-700 rounded-md mb-1"></div>
            <span className="text-xs font-medium text-gray-600">Critical<br/>$400+</span>
          </div>
        </div>
      </div>
      
      {/* Improved Heatmap */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">March 2025 Spending Heatmap</h3>
        
        <div className="grid gap-y-6">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-3">
              {week.map((day, dayIndex) => {
                return (
                  <div 
                    key={dayIndex} 
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center shadow-sm transition-transform hover:scale-105 ${getColorClass(day.amount)}`}
                  >
                    <div className="text-sm font-medium mb-1">{formatDate(day.date)}</div>
                    <div className="text-lg font-bold">${day.amount}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Improved Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Spending Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart 
            data={dummyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(tick) => format(new Date(tick), 'dd')} 
              stroke="#9CA3AF"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tickFormatter={(value) => `$${value}`}
              domain={[0, 'dataMax + 50']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 15 }} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              name="Daily Spending"
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Heatmap;