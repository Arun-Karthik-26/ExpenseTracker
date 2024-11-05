import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import BudgetChart from './Bugetchart'; 
import html2canvas from 'html2canvas';

const GenerateReport = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budgetData, setBudgetData] = useState([]); 

    const fetchExpensesInRange = async () => {
        if (!startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError("Start date cannot be after end date.");
            return;
        }

        setLoading(true); // Set loading to true
        setError(null); // Reset previous errors

        try {
            const response = await axios.get(`https://expensetracker-backend-s78u.onrender.com/getexpensesinrange?user=${userId}&startDate=${startDate}&endDate=${endDate}`);

            if (response.data.length === 0) {
                setExpenses([]);
                setError("No expenses found for the selected date range.");
            } else {
                setExpenses(response.data);
                setError(null);
                // Extract unique budget IDs from the fetched expenses
                const budgetIds = [...new Set(response.data.map(expense => expense.budgetId))];
                // Fetch budget data only for these IDs
                await fetchBudgetData(userId, budgetIds);
            }
        } catch (err) {
            console.error("Error fetching expenses:", err);
            setError("Failed to load expenses.");
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    const fetchBudgetData = async (uid, budgetIds) => {
        try {
            const response = await axios.get(`https://expensetracker-backend-s78u.onrender.com/getbudgetdata?user=${uid}`);
            const allBudgets = response.data; 
            // Filter budgets to include only those with the provided IDs
            const filteredBudgets = allBudgets.filter(budget => budgetIds.includes(budget.budgetId));
            // Calculate totals
            let totalBudget = 0;
            let totalSpent = 0;
            const budgetSpentMap = {};

            // Initialize the budgetSpentMap and calculate totalBudget
            filteredBudgets.forEach(budget => {
                totalBudget += budget.totalAmount; // Sum total budget amounts
                budgetSpentMap[budget.budgetId] = 0; // Initialize spent to zero with correct budgetId
            });

            console.log("Initial budgetSpentMap:", budgetSpentMap); // Debugging log

            // Sum up the spent amounts for the fetched expenses
            expenses.forEach(expense => {
                const expenseBudgetId = expense.budgetId; // Get the budgetId from the expense
                if (budgetSpentMap[expenseBudgetId] !== undefined) { // Check for budgetId match
                    budgetSpentMap[expenseBudgetId] += expense.amount; // Accumulate spent amount
                }
            });

            console.log("Updated budgetSpentMap after expenses:", budgetSpentMap); // Debugging log

            // Calculate total spent based on the expenses within the date range
            totalSpent = Object.values(budgetSpentMap).reduce((acc, spent) => acc + spent, 0);

            // Set state for totals
            setTotalBudget(totalBudget);
            setTotalSpent(totalSpent);
            setRemainingAmount(totalBudget - totalSpent);

            // Update budget data with spent amounts
            const updatedBudgets = filteredBudgets.map(budget => ({
                ...budget,
                spentAmount: budgetSpentMap[budget.budgetId] || 0 // Use budgetId for spentAmount
            }));
            
            console.log("Updated budgets with spent amounts:", updatedBudgets); // Debugging log
            setBudgetData(updatedBudgets);

        } catch (err) {
            console.error("Error fetching budget data:", err);
            setError("Failed to load budget data.");
        }
    };

    const generateReport = async () => {
        if (!expenses || !Array.isArray(expenses) || expenses.length === 0) return; 
        
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Hello ${userEmail}`, 14, 10);
        doc.setFontSize(16);
        doc.text("Expense Report", 14, 22);
        doc.setFontSize(12);
        doc.text(`Report for: ${startDate} to ${endDate}`, 14, 30);
        doc.setFontSize(14);
        doc.text(`Total Budget: $${totalBudget}`, 14, 40);
        doc.text(`Total Spent: $${totalSpent}`, 14, 48);
        doc.text(`Remaining Amount: $${remainingAmount}`, 14, 56);

        const chartElement = document.getElementById('budgetChart'); 
        
        if (chartElement) {
            try {
                const canvas = await html2canvas(chartElement); 
                const imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 14, 60, 180, 100); 

                const tableData = expenses.map(expense => [
                    `$${expense.amount}`,
                    expense.description,
                    new Date(expense.date).toLocaleDateString(),
                    expense.budget ? expense.budget.title : 'N/A',
                ]);

                doc.autoTable({
                    head: [['Amount', 'Description', 'Date', 'Budget Title']],
                    body: tableData,
                    startY: 170,
                });

                doc.save(`Expense_Report_${startDate}_to_${endDate}.pdf`);
            } catch (error) {
                console.error("Error generating chart image:", error);
            }
        } else {
            console.error("Chart element not found");
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUserId(firebaseUser.uid);
                setUserEmail(firebaseUser.email);
            } else {
                console.error("No user is logged in");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-3xl font-semibold text-blue-600 mb-6 text-center">Generate Expense Report</h1>
                <h2 className="text-lg font-semibold text-blue-600">Welcome, {userEmail}</h2>
                <div className="mb-4">
                    <p>Total Budgets: ${totalBudget}</p>
                    <p>Total Spent: ${totalSpent}</p>
                    <p>Remaining Amount: ${remainingAmount}</p>
                </div>

                {/* Date Range Selection */}
                <div className="mb-6">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 mr-2"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 mr-2"
                    />
                    <button
                        onClick={fetchExpensesInRange}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Fetch Expenses
                    </button>
                    <button
                        onClick={generateReport}
                        className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Generate Report
                    </button>
                </div>

                {/* Chart */}
                {budgetData && Array.isArray(budgetData) && budgetData.length > 0 && <BudgetChart budgetData={budgetData} expenseData={expenses} />}

                {/* Expenses Table */}
                <div className="overflow-x-auto">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Expenses for Selected Date Range</h2>
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Amount</th>
                                <th className="border border-gray-300 px-4 py-2">Description</th>
                                <th className="border border-gray-300 px-4 py-2">Date</th>
                                <th className="border border-gray-300 px-4 py-2">Budget Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length > 0 ? (
                                expenses.map((expense, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-4 py-2">${expense.amount}</td>
                                        <td className="border border-gray-300 px-4 py-2">{expense.description}</td>
                                        <td className="border border-gray-300 px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="border border-gray-300 px-4 py-2">{expense.budget ? expense.budget.title : 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center text-gray-500">No expenses found for the selected date range.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {error && <p className="text-red-600">{error}</p>} {/* Display error message */}
            </div>
        </Layout>
    );
};

export default GenerateReport;
