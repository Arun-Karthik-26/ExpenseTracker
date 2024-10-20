import Expense from '../models/expense.js'; // Import the Expense model
import Budget from '../models/budget.js';
import mongoose from 'mongoose'; // Import mongoose for ObjectId

// Save new expense to MongoDB
export const saveNewExpense = async (req, res) => {
    const { budgetId, amount, description, date, userid } = req.body;
    console.log("Incoming request body:", req.body); // Log the incoming request body

    try {
        // Log the budgetId to verify
        console.log("Budget ID:", budgetId);

        // Convert budgetId to ObjectId
        const budgetObjectId = new mongoose.Types.ObjectId(budgetId);
        const expense = new Expense({ budgetId: budgetObjectId, amount, description, date, userid }); // Use budgetObjectId here
        await expense.save();

        // Update the budget's remaining amount and total expenses
        const budget = await Budget.findById("6713ff6d4b817585ceb9ad01");
        if (budget) {
            console.log("Budget found:", budget.title); // Log the title of the found budget
            budget.remaining -= amount;
            budget.expenses += amount; // Assuming you want to track total expenses
            await budget.save();
        } else {
            console.log("No budget found with ID:", budgetId);
        }

        console.log("Remaining after expense addition:", budget ? budget.remaining : 'Budget not found');
        res.status(201).json(expense);
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Error adding expense" });
    }
};

// Fetch expenses for a specific budget
export const fetchExpensesByBudgetId = async (req, res) => {
    const { budgetId } = req.params; // Extract budgetId from request parameters
  
    try {
      const expenses = await Expense.find({ budgetId }); // Find expenses based on budgetId
      res.status(200).json(expenses); // Send the expenses in the response
    } catch (error) {
      res.status(500).json({ message: 'Error fetching expenses', error });
    }
  };
