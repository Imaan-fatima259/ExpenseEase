const BudgetSchema = require('../models/BudgetModel');
const IncomeSchema = require('../models/IncomeModel');
const ExpenseSchema = require('../models/ExpenseModel')

// Helper function to calculate total budgets
const getTotalBudgets = async (userId) => {
    const budgets = await BudgetSchema.find({ userId });
    return budgets.reduce((total, budget) => total + budget.amount, 0);
};

// Helper function to calculate total income
const getTotalIncome = async (userId) => {
    const incomes = await IncomeSchema.find({ userId });
    return incomes.reduce((total, income) => total + income.amount, 0);
};

exports.addOrUpdateBudget = async (req, res) => {
    const {amount } = req.body;
    const { _id: userId, googleId } = req.user;
    const category = req.body.category ? req.body.category.toLowerCase() : "";

    try {
        // Validation checks
        if (!category || !amount) {
            return res.status(400).json({ message: "Category and amount are required!" });
        }

        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number!" });
        }

        // Determine the user identifier (either userId or googleId)
        const userIdentifier = userId || googleId;
        
        // Get the total income and total budgets for the user
        const totalIncome = await getTotalIncome(userIdentifier);
        const totalBudgets = await getTotalBudgets(userIdentifier);

        console.log("Total Budgets:", totalBudgets, "Total Income:", totalIncome, "User:", userIdentifier);
        const numAmount = Number(amount)

        // Check if the total budget exceeds the total income
        if (totalBudgets + numAmount > totalIncome) {
            return res.status(400).json({
                message: "Total budget exceeds total income! Adjust the budget or add more income."
            });
        }

        // Find the existing budget for the category (if any)
        let budget = await BudgetSchema.findOne({ category: category.toLowerCase(), userId: userId || googleId });

        if (budget) {
            // Update the existing budget
            const totalExpenses = budget.amount - budget.remaining; // Calculate total expenses already made
            const newRemaining = amount - totalExpenses;

            if (isNaN(newRemaining)) {
                return res.status(400).json({
                    message: `Invalid calculation for remaining budget. Ensure values are valid.`,
                });
            }

            budget.amount = amount;
            budget.remaining = newRemaining;

            await budget.save();
            return res.status(200).json({ message: "Budget updated successfully", budget });
        } else {
            // Create a new budget if none exists for this category
            const remaining = amount; // Initial remaining is the same as the amount

            if (isNaN(remaining)) {
                return res.status(400).json({
                    message: `Invalid remaining value for budget. Ensure the amount is valid.`,
                });
            }

            budget = new BudgetSchema({
                category,
                amount,
                remaining,
                userId: userId || googleId,  // Store userId or googleId
            });

            await budget.save();
            return res.status(201).json({ message: "Budget created successfully", budget });
        }
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


exports.editBudget = async (req, res) => {
    const { category, amount } = req.body;
    const { id } = req.params; // Capture the budget ID for editing

    try {
        // Validate input
        if (!category || amount === undefined) {
            return res.status(400).json({ message: "Category and amount are required!" });
        }

        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number!" });
        }

        // Find the existing budget by id
        let budget = await BudgetSchema.findOne({ _id: id });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found or you are not authorized to edit this record" });
        }

        // Get user identifier (userId or googleId)
        const userIdentifier = budget.userId;

        // Get total income and total budgets for the user
        const totalIncome = await getTotalIncome(userIdentifier);
        const totalBudgets = await getTotalBudgets(userIdentifier) - budget.amount + Number(amount);

        console.log("Total Budgets:", totalBudgets, "Total Income:", totalIncome, "User:", userIdentifier);

        // Check if the updated total budget exceeds total income
        if (totalBudgets > totalIncome) {
            return res.status(400).json({
                message: "Total budget exceeds total income! Adjust the budget or add more income."
            });
        }

        // Calculate total expenses already made for this category
        const totalExpenses = budget.amount - budget.remaining; // Total spent

        // Check if new amount can accommodate the existing expenses
        if (amount < totalExpenses) {
            return res.status(400).json({
                message: `Budget cannot be updated. Total expenses (${totalExpenses}) exceed the new budget amount (${amount}).`,
            });
        }

        // Calculate new remaining amount
        const newRemaining = amount - totalExpenses;

        if (isNaN(newRemaining)) {
            return res.status(400).json({
                message: `Invalid calculation for remaining budget. Ensure values are valid.`,
            });
        }

        // Update the budget fields
        budget.category = category.toLowerCase(); // Update category
        budget.amount = amount; // Update total budget amount
        budget.remaining = newRemaining; // Update remaining budget

        // Save the updated budget
        await budget.save();

        return res.status(200).json({ message: "Budget updated successfully", budget });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};




exports.getBudgets = async (req, res) => {
    const { _id: userId,googleId } = req.user;
    try {
        const budgets = await BudgetSchema.find({ userId: userId || googleId });
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteBudget = async (req, res) => {
    const { id } = req.params;
    const { _id: userId, googleId } = req.user;  

    try {
        // Find the budget by id and ensure it belongs to the authenticated user
        const budget = await BudgetSchema.findOne({ _id: id, userId: userId || googleId });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found or you are not authorized to delete this record" });
        }

        const userIdentifier = userId || googleId;
        const totalIncome = await getTotalIncome(userIdentifier);
        const totalBudgets = await getTotalBudgets(userIdentifier);

        console.log("Before Deletion - Total Budgets:", totalBudgets, "Total Income:", totalIncome, "User:", userIdentifier);

        // Check if deleting the budget would make total budgets exceed total income
        if (totalBudgets - budget.amount > totalIncome) {
            return res.status(400).json({
                message: "Cannot delete this budget as it will cause total budgets to exceed total income."
            });
        }

        // Check if any expenses exist for this budget category
        const existingExpenses = await ExpenseSchema.findOne({ category: budget.category, userId: userIdentifier });

        if (existingExpenses) {
            return res.status(400).json({
                message: "Cannot delete this budget as there are existing expenses linked to this category."
            });
        }

        // Delete the budget if validation passes
        await BudgetSchema.findByIdAndDelete(id);
        res.status(200).json({ message: "Budget Deleted" });

    } catch (err) {
        console.error(err);  // Log the error for debugging
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
