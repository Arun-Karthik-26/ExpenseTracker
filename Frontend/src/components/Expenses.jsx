import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to load recent expenses
    const loadRecentExpenses = async () => {
        const userId = "X0sdMYA77pMJDyZ5XXjJKvdQkpY2"; // Replace with dynamic user ID if available

        try {
            const response = await axios.get(`http://localhost:5000/getlatestexpenses?user=${userId}`);
            setExpenses(response.data); // Set the expenses from the response
        } catch (err) {
            console.error("Error fetching recent expenses:", err);
            setError("Failed to load expenses."); // Set error message
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    // useEffect to load expenses on component mount
    useEffect(() => {
        loadRecentExpenses();
    }, []);

    // Render expenses
    if (loading) {
        return <div className="text-center mt-20 text-blue-600">Loading...</div>; // Show loading state
    }

    if (error) {
        return <div className="text-center mt-20 text-red-500">{error}</div>; // Show error message
    }

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-3xl font-semibold text-blue-600 mb-6 text-center">Recent Expenses</h1>
                
                {expenses.length === 0 ? (
                    <p className="text-center text-gray-600">No expenses found.</p> // Message if no expenses
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-violet-500 text-white">
                                    <th className="py-3 px-4 text-left">Amount</th>
                                    <th className="py-3 px-4 text-left">Description</th>
                                    <th className="py-3 px-4 text-left">Date</th>
                                    <th className="py-3 px-4 text-left">Budget Title</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense._id} className="border-t">
                                        <td className="py-2 px-4">{expense.amount}</td>
                                        <td className="py-2 px-4">{expense.description}</td>
                                        <td className="py-2 px-4">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="py-2 px-4">{expense.budget ? expense.budget.title : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Expenses;
