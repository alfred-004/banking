import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const defaultCategories = [
  { category: "Groceries", budget: 500 },
  { category: "Entertainment", budget: 100 },
  { category: "Transport", budget: 150 },
  { category: "Shopping", budget: 250 },
];

const BudgetForm = () => {
  const [budgets, setBudgets] = useState(defaultCategories);

  const handleBudgetChange = (index: number, value: number) => {
    const updatedBudgets = [...budgets];
    updatedBudgets[index].budget = value;
    setBudgets(updatedBudgets);
  };

  return (
    <Card className="p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">💰 Set Your Monthly Budget</h2>
      <p className="text-gray-600 mb-4">Enter your budget for each category below:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <label className="text-gray-700">{item.category}</label>
            <Input
              type="number"
              value={item.budget}
              onChange={(e) => handleBudgetChange(index, Number(e.target.value))}
              className="border rounded-lg p-2"
            />
          </div>
        ))}
      </div>

      <Button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">Save Budget</Button>
    </Card>
  );
};

export default BudgetForm;
