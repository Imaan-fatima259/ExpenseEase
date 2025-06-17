const cron = require("node-cron");
const Expense = require("../models/ExpenseModel");
const moment = require("moment");

// ✅ Reusable function to process recurring expenses
const processRecurringExpenses = async () => {
  const now = moment.utc();
  console.log("⏰ Running recurring expenses scheduler at:", moment().format());

  try {
    const recurringExpenses = await Expense.find({
      isRecurring: true,
      nextOccurrence: { $lte: now.toDate() },
      $or: [
        { recurrenceEndDate: { $exists: false } },
        { recurrenceEndDate: { $gte: now.toDate() } },
      ],
    });

    console.log("📦 Recurring expenses found:", recurringExpenses.length);

    for (const expense of recurringExpenses) {
      try {
        console.log("➡️ Processing expense:", {
          title: expense.title,
          nextOccurrence: expense.nextOccurrence,
          recurrence: expense.recurrence,
        });

        // Create new one-time expense entry
        const createdExpense = await Expense.create({
          userId: expense.userId,
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          date: now.toDate(), // ✅ Use now (today)
          isRecurring: false,
          priority: expense.priority || "Medium",
        });

        console.log(
          "✅ New recurring instance created with ID:",
          createdExpense._id
        );

        // Calculate next occurrence
        let next = moment(expense.nextOccurrence);
        switch (expense.recurrence) {
          case "daily":
            next.add(1, "day");
            break;
          case "weekly":
            next.add(1, "week");
            break;
          case "monthly":
            next.add(1, "month");
            break;
          case "yearly":
            next.add(1, "year");
            break;
          default:
            console.warn("⚠️ Unknown recurrence pattern:", expense.recurrence);
            continue;
        }

        expense.nextOccurrence = next.toDate();

        // Stop recurring if past end date
        if (
          expense.recurrenceEndDate &&
          next.isAfter(moment(expense.recurrenceEndDate))
        ) {
          expense.isRecurring = false;
          console.log("⛔ Recurrence ended for:", expense.title);
        }

        await expense.save();
        console.log(
          "📝 Expense updated with next occurrence:",
          expense.nextOccurrence
        );
      } catch (innerErr) {
        console.error("❌ Error processing an expense:", innerErr.message);
      }
    }

    if (recurringExpenses.length === 0) {
      console.log("ℹ️ No recurring expenses due today.");
    }
  } catch (error) {
    console.error("🚨 Error in recurring expense scheduler:", error.message);
  }
};

// ✅ Run once at server start
processRecurringExpenses();

// ✅ Run daily at midnight
cron.schedule("0 0 * * *", processRecurringExpenses);

module.exports = processRecurringExpenses;