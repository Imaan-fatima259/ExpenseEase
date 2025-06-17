const IncomeSchema = require("../models/IncomeModel")
const BudgetSchema = require('../models/BudgetModel')

const getTotalIncome = async (userId) => {
    const incomes = await IncomeSchema.find({ userId });
    return incomes.reduce((total, income) => total + income.amount, 0);
};
const getTotalBudgets = async (userId) => {
    const budgets = await BudgetSchema.find({ userId });
    return budgets.reduce((total, budget) => total + budget.amount, 0);
};

// Helper function to set default budgets when income is added
const setDefaultBudgets = async (userId, incomeAmount) => {
    const categories = ["Education", "Groceries", "Health", "Clothing"];
    const defaultBudgetAmount = Math.floor(incomeAmount * 0.1); // 20% of income

    for (const category of categories) {
        let existingBudget = await BudgetSchema.findOne({ category: category.toLowerCase(), userId });

        if (!existingBudget) {
            // Create the budget only if it doesn't exist
            const newBudget = new BudgetSchema({
                category: category.toLowerCase(),
                amount: defaultBudgetAmount,
                remaining: defaultBudgetAmount,
                userId
            });
            await newBudget.save();
        }
    }
};

exports.addIncome = async (req,res) => {
    const {title, amount, category, description, date}  = req.body
    const { _id: userId, googleId } = req.user;  // Assuming the user is authenticated and their ID is in req.user


    const income = IncomeSchema({
        title,
        amount,
        category,
        description,
        date,
        userId: userId||googleId
    })
    try {
        //validations
        if(!title || !category || !description || !date){
            return res.status(400).json({message: 'All fields are required!'})
        }
        if(amount <= 0 || !amount === 'number'){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        await income.save()
        await setDefaultBudgets(userId || googleId, amount);
        res.status(200).json({message: 'Income Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }

    console.log(income)

}

exports.editIncome = async (req, res) => {
    const { id } = req.params; // Expense ID from the URL
    const { title, amount, category, description, date } = req.body;
    const { _id: userId, googleId } = req.user; // Authenticated user

    try {
        if (!title || !category || !description || !date || amount === undefined) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number!" });
        }

        // Fetch the expense
        const income = await IncomeSchema.findOne({ _id: id, userId: userId || googleId });
        if (!income) {
            return res.status(404).json({ message: "Income not found or you are not authorized to edit this record" });
        }


        // Update the expense
        income.title = title;
        income.amount = amount;
        income.category = category;
        income.description = description;
        income.date = date;

        const updatedIncome = await income.save();
        res.status(200).json({ message: "Income updated successfully", income: updatedIncome });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


exports.getIncomes = async (req, res) =>{
    try {
        const { _id: userId,googleId} = req.user;
        const incomes = await IncomeSchema.find({ userId: userId || googleId });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}
exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    const { _id: userId, googleId } = req.user; // Get the authenticated user

    try {
        // Find the income by ID and ensure it belongs to the authenticated user
        const income = await IncomeSchema.findOne({ _id: id, userId: userId || googleId });

        if (!income) {
            return res.status(404).json({ message: "Income not found or you are not authorized to delete this record" });
        }

        // Get total income and total budget
        const userIdentifier = userId || googleId;
        const totalIncome = await getTotalIncome(userIdentifier);
        const totalBudgets = await getTotalBudgets(userIdentifier);

        console.log("Before Deletion - Total Income:", totalIncome, "Total Budgets:", totalBudgets, "User:", userIdentifier);

        // Check if deleting this income will make total income less than total budget
        if (totalIncome - income.amount < totalBudgets) {
            return res.status(400).json({
                message: "Cannot delete this income as it would make total income less than total budget!"
            });
        }

        // If all checks pass, delete the income
        await IncomeSchema.findByIdAndDelete(id);
        res.status(200).json({ message: "Income Deleted" });

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
