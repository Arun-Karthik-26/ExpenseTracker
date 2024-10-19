import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import mongoose from 'mongoose';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newBudgetTitle, setNewBudgetTitle] = useState("");
  const [newBudgetTotalAmount, setNewBudgetTotalAmount] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(null); // State for selected budget
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        loadBudgets(firebaseUser.uid);
      } else {
        setUser(null);
        console.error("No user is logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  const loadBudgets = async (uid) => {
    try {
      const response = await axios.get("http://localhost:5000/getbudgets", {
        params: { uid },
      });
      setBudgets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setBudgets([]);
    }
  };

  const handleCreateBudget = async (event) => {
    event.preventDefault();

    try {
      if (!user || !user.uid) {
        console.error("User is not logged in or UID is undefined");
        return;
      }

      const newBudget = {
        uid: user.uid,
        title: newBudgetTitle,
        totalAmount: parseFloat(newBudgetTotalAmount),
        remaining: parseFloat(newBudgetTotalAmount),
        expenses: 0,
        createdAt: new Date().toISOString(),
      };

      await axios.post("http://localhost:5000/addbudget", newBudget);
      loadBudgets(user.uid);
      setNewBudgetTitle("");
      setNewBudgetTotalAmount("");
      setShowForm(false);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const handleAddExpense = async (event) => {
    event.preventDefault();
    try {
      const newExpense = {
        budgetId: selectedBudget._id, // Use the selected budget's _id directly
        amount: parseFloat(expenseAmount),
        description: expenseDescription,
        date: new Date().toISOString(), // Ensure to add the date field
        userid: user.uid,
      };

      // Post the new expense to your backend
      await axios.post("http://localhost:5000/addexpense", newExpense);
      // Reload budgets to reflect updated expenses
      loadBudgets(user.uid);
      setExpenseAmount("");
      setExpenseDescription("");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
};
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>

      {/* Create New Budget Card */}
      <div
        className="border border-gray-300 rounded-lg p-4 mb-4 cursor-pointer flex items-center justify-between"
        onClick={() => setShowForm(!showForm)}
      >
        <div className="flex items-center">
          <FiPlus className="mr-2" />
          <span className="font-semibold">Create New Budget</span>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreateBudget} className="mb-4">
          <input
            type="text"
            placeholder="Budget Title"
            value={newBudgetTitle}
            onChange={(e) => setNewBudgetTitle(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 mr-2"
          />
          <input
            type="number"
            placeholder="Total Amount"
            value={newBudgetTotalAmount}
            onChange={(e) => setNewBudgetTotalAmount(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 mr-2"
          />
          <button type="submit" className="bg-blue-600 text-white rounded-lg p-2">
            Add Budget
          </button>
        </form>
      )}

      {/* Display list of budgets as cards */}
      <h2>Your Budgets</h2>
      {budgets.length === 0 ? (
        <p>No budgets available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <div
              key={budget.budgetId}
              className="border p-4 mb-4 rounded-lg cursor-pointer"
              onClick={() => setSelectedBudget(budget)} // Set selected budget on click
            >
              <h3 className="text-lg font-semibold">{budget.title}</h3>
              <p>Total Amount: ${budget.totalAmount}</p>
              <p>Remaining Amount: ${budget.remaining}</p>
              <p>Expenses: ${budget.expenses}</p>
              <p>Date Created: {new Date(budget.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Display selected budget details and expense form */}
      {selectedBudget && (
        <div className="border p-4 rounded-lg mt-4">
          <h2 className="text-xl font-bold mb-2">{selectedBudget.title} - Details</h2>
          <p>Total Amount: ${selectedBudget.totalAmount}</p>
          <p>Remaining Amount: ${selectedBudget.remaining}</p>
          <p>Expenses: ${selectedBudget.expenses}</p>

          <form onSubmit={(e) => handleAddExpense(e, selectedBudget.budgetId)}>
            <h3 className="text-lg mt-4">Add Expense</h3>
            <input
              type="text"
              placeholder="Description"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              required
              className="border border-gray-300 rounded-lg p-2 mr-2 w-full"
            />
            <input
              type="number"
              placeholder="Amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              required
              className="border border-gray-300 rounded-lg p-2 mr-2 w-full"
            />
            <button type="submit" className="bg-green-600 text-white rounded-lg p-2 mt-2">
              Add Expense
            </button>
          </form>

          {/* Display expenses under the selected budget */}
          <h3 className="text-lg mt-4">Expenses</h3>
          <ul>
            {selectedBudget.expenses && selectedBudget.expenses.length > 0 ? (
              selectedBudget.expenses.map((expense) => (
                <li key={expense._id} className="border p-2 mb-2 rounded-lg">
                  <p>Description: {expense.description}</p>
                  <p>Amount: ${expense.amount}</p>
                  <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
                </li>
              ))
            ) : (
              <p>No expenses available for this budget.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Budgets;
