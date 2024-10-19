import express from 'express';
import cors from 'cors';
import dbconnect from './db/mongodbconnect.js';
import {saveNewUser} from './controller/userController.js';
import { fetchBudgetsByUserId, saveNewBudget } from './controller/budgetController.js';
import { saveNewExpense } from './controller/expenseController.js';


const app = express();
const port = process.env.PORT || 5000;

// Middleware to enable CORS and parse JSON
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Sample POST route to handle JSON data
dbconnect();

app.post('/saveUser',saveNewUser);
app.post('/addbudget',saveNewBudget);
app.get('/getbudgets',fetchBudgetsByUserId);
app.post('/addexpense',saveNewExpense);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
