const ExpenseSchema = require("../models/ExpenseModel");
const BudgetSchema = require("../models/BudgetModel");
const NotificationSchema = require("../models/NotificationModel");

exports.addExpense = async (req, res) => {
  const { _id: userId, googleId } = req.user;
  const {
    title,
    amount,
    description,
    date,
    priority,
    isRecurring = false,
    recurrence = null,
    nextOccurrence = null,
    recurrenceEndDate = null,
  } = req.body;

  const category = req.body.category ? req.body.category.toLowerCase() : "";

  try {
    if (!title || !category || !description || !date || !priority) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }

    // Validate recurring fields if isRecurring is true
    if (isRecurring) {
      const validRecurrences = ["daily", "weekly", "monthly", "yearly"];
      if (!recurrence || !validRecurrences.includes(recurrence)) {
        return res
          .status(400)
          .json({
            message:
              "Invalid or missing recurrence value for recurring expense.",
          });
      }
    }

    // Fetch the corresponding budget
    const budget = await BudgetSchema.findOne({
      category: category.toLowerCase(),
      userId: userId || googleId,
    });

    if (!budget) {
      return res.status(400).json({
        message: `No budget found for category '${category}'. Please set a budget first.`,
      });
    }

    if (budget.remaining < amount) {
      return res.status(400).json({
        message: `Budget exceeded for category '${category}'. Remaining budget: ${budget.remaining}`,
      });
    }

    // Deduct the expense amount from the budget's remaining balance
    budget.remaining -= amount;
    await budget.save();

    // Determine nextOccurrence date if recurring and not provided
    let calculatedNextOccurrence = null;
    if (isRecurring) {
      calculatedNextOccurrence = nextOccurrence
        ? new Date(nextOccurrence)
        : new Date(date);
    }

    // Create the expense
    const expense = new ExpenseSchema({
      title,
      amount,
      category,
      description,
      date,
      priority,
      userId: userId || googleId,
      isRecurring,
      recurrence: isRecurring ? recurrence : null,
      nextOccurrence: isRecurring ? calculatedNextOccurrence : null,
      recurrenceEndDate: isRecurring
        ? recurrenceEndDate
          ? new Date(recurrenceEndDate)
          : null
        : null,
    });

    if (budget.remaining <= 2000) {
      await NotificationSchema.create({
        userId: userId || googleId,
        message: `Warning! Only ${budget.remaining} left in ${category} budget.`,
        category,
        seen: false,
      });
    }

    await expense.save();
    res.status(200).json({ message: "Expense added successfully", expense });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.editBudget = async (req, res) => {
  const { category, amount } = req.body;
  const { id } = req.params; // Budget ID

  try {
    if (!category || amount === undefined) {
      return res
        .status(400)
        .json({ message: "Category and amount are required!" });
    }

    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }

    let budget = await BudgetSchema.findOne({ _id: id });

    if (!budget) {
      return res
        .status(404)
        .json({
          message:
            "Budget not found or you are not authorized to edit this record",
        });
    }

    const totalIncome = await getTotalIncome(budget.userId);
    const totalBudgets = (await getTotalBudgets(budget.userId)) - budget.amount; // Exclude current budget

    if (totalBudgets + amount > totalIncome) {
      return res.status(400).json({
        message:
          "Total budget exceeds total income! Adjust the budget or add more income.",
      });
    }

    // Calculate total expenses already made for this category
    const totalExpenses = budget.amount - budget.remaining;

    if (amount < totalExpenses) {
      return res.status(400).json({
        message: `Budget cannot be updated. Total expenses (${totalExpenses}) exceed the new budget amount (${amount}).`,
      });
    }

    // Update budget details
    budget.category = category.toLowerCase();
    budget.amount = amount;
    budget.remaining = amount - totalExpenses;

    await budget.save();
    return res
      .status(200)
      .json({ message: "Budget updated successfully", budget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.editExpense = async (req, res) => {
  const { id } = req.params; // Expense ID
  const {
    title,
    amount,
    category,
    description,
    date,
    isRecurring = false,
    recurrence = null,
    nextOccurrence = null,
    recurrenceEndDate = null,
    priority,
  } = req.body;
  const { _id: userId, googleId } = req.user;

  try {
    if (
      !title ||
      !category ||
      !description ||
      !date ||
      amount === undefined ||
      !priority
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }

    // Validate recurring fields if isRecurring is true
    if (isRecurring) {
      const validRecurrences = [
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "custom",
      ];
      if (!recurrence || !validRecurrences.includes(recurrence)) {
        return res
          .status(400)
          .json({
            message:
              "Invalid or missing recurrence value for recurring expense.",
          });
      }
    }

    const expense = await ExpenseSchema.findOne({
      _id: id,
      userId: userId || googleId,
    });
    if (!expense) {
      return res
        .status(404)
        .json({
          message:
            "Expense not found or you are not authorized to edit this record",
        });
    }

    const budget = await BudgetSchema.findOne({
      category: category.toLowerCase(),
      userId: userId || googleId,
    });

    if (!budget) {
      return res.status(400).json({
        message: `No budget found for category '${category}'. Please set a budget first.`,
      });
    }

    const previousAmount = expense.amount;
    const restoredBudget = budget.remaining + previousAmount; // Restore previous amount
    const newRemainingBudget = restoredBudget - amount;

    if (newRemainingBudget < 0) {
      return res.status(400).json({
        message: `Budget exceeded for category '${category}'. 
                You can't set this amount. Remaining budget: ${restoredBudget}`,
      });
    }

    // Update budget remaining balance
    budget.remaining = newRemainingBudget;
    await budget.save();

    // Update expense details
    expense.title = title;
    expense.amount = amount;
    expense.category = category.toLowerCase();
    expense.description = description;
    expense.date = date;
    expense.priority = priority;
    expense.isRecurring = isRecurring;
    expense.recurrence = isRecurring ? recurrence : null;
    expense.nextOccurrence = isRecurring
      ? nextOccurrence
        ? new Date(nextOccurrence)
        : new Date(date)
      : null;
    expense.recurrenceEndDate = isRecurring ? (recurrenceEndDate ? new Date(recurrenceEndDate) : null) : null;


    const updatedExpense = await expense.save();
    res
      .status(200)
      .json({
        message: "Expense updated successfully",
        expense: updatedExpense,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const { _id: userId, googleId } = req.user;
    const expenses = await ExpenseSchema.find({ userId: userId || googleId });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  const { _id: userId, googleId } = req.user; // Get the authenticated user

  try {
    // Find the expense by ID
    const expense = await ExpenseSchema.findOne({
      _id: id,
      userId: userId || googleId,
    });

    if (!expense) {
      return res
        .status(404)
        .json({
          message:
            "Expense not found or you are not authorized to delete this record",
        });
    }

    // Extract expense amount and category
    const { amount, category } = expense;

    // Delete the expense
    await ExpenseSchema.findByIdAndDelete(id);

    // Find the related budget and update the remaining budget
    const budget = await BudgetSchema.findOne({
      category,
      userId: userId || googleId,
    });

    if (budget) {
      budget.remaining += amount; // Add back the deleted expense amount
      await budget.save(); // Save the updated budget
    }

    res.status(200).json({ message: "Expense Deleted and Budget Updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};