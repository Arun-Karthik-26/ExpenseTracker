import { response } from 'express';
import Expense from '../models/expense.js'; // Import your Expense model
import Budget from '../models/budget.js'; // Import your Budget model (ensure this is correct)

// Endpoint to fetch expenses for the selected month
export const generateReport = async (req, res) => {
  const userId = req.query.user;
  const month = req.query.month; // Month in YYYY-MM format

  // Validate input
  if (!month || !userId) {
    return res.status(400).json({ message: "Month and User ID are required." });
  }

  // Create date range
  const startDate = new Date(`${month}-01`);
  if (isNaN(startDate.getTime())) {
    return res.status(400).json({ message: "Invalid month format. Use YYYY-MM." });
  }
  
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1); // Get the first day of the next month
  try {
    // Aggregate to find expenses and join with Budget to get the budget title
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $lookup: {
          from: 'budgets', // The collection name for budgets
          localField: 'budgetId', // Field from Expense collection (budgetId)
          foreignField: '_id', // Field from Budget collection (_id)
          as: 'budget', // Alias for the joined data
        },
      },
      {
        $unwind: {
          path: '$budget', // Unwind the array to get a single budget
          preserveNullAndEmptyArrays: true, // Keep expenses without a matching budget
        },
      },
      {
        $project: { // Select only the fields to return
          _id: 1,
          amount: 1,
          description: 1,
          date: 1,
          'budget.title': 1, // Include budget title
        },
      },
      {
          $sort: { date: -1 } // Sort by date in descending order
      }
    ]);

    if (expenses.length === 0) {
      return res.json({ message: "No expenses found" });
    }

    res.json(expenses); // Send back the filtered expenses
  } catch (error) {
    console.error("Error fetching expenses:", error); // Log the error for debugging
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};


export const getBudgetData = async (req, res) => {
  const userId = req.query.user;
  const month = req.query.month; // e.g., "2024-10"
  console.log(userId,month);
  try {
      const startDate = new Date(`${month}-01`); // First day of the month
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1); 

      const budgets = await Budget.find({
          uid: userId,
          createdAt: { $gte: startDate, $lt: endDate }
      });

      if (budgets.length === 0) {
        return res.json({ message: "No budgets found" });
      }
  
      // Prepare budget details to send in response
      const budgetDetails = budgets.map(budget => ({   // Budget ID (if exists)
        title: budget.title,          // Title of the budget
        totalAmount: budget.totalAmount, // Total amount for the budget
        remaining: budget.remaining, 
        totalSpent: budget.totalAmount-budget.remaining  // Remaining amount             // Version key
      }));
  
      console.log(budgetDetails);
      res.json(budgetDetails);
  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
}
