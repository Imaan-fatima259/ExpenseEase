import React, { useContext, useState } from "react";
import { fetchWithAuth } from "../utils/api"; // Import the fetchWithAuth function
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [budget, setBudget] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]); // Notification state
  const [profile, setProfile] = useState([]);
  const [savingGoals, setSavingGoals] = useState([]);

  // Function to fetch notifications

  // Function to handle errors and show toast notification
  const handleError = (errMessage) => {
    toast.error(errMessage, { position: "top-right", autoClose: 3000 });
  };

  const getNotifications = async () => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}get-notifications`);
      setNotifications(response.data); // Store notifications in state
      console.log(response.data); // Log the notifications for debugging
    } catch (err) {
      handleError(
        err.response
          ? err.response.data.message
          : "Error fetching notifications"
      );
    }
  };

  const getProfile = async () => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}get-profile`);
      setProfile(response.data);
      console.log(response.data);
    } catch (err) {
      handleError(
        err.response
          ? err.response.data.message
          : "Error fetching profile information"
      );
    }
  };

  const editProfile = async (id, updatedProfile) => {
    try {
      await fetchWithAuth(`${BASE_URL}update-profile/${id}`, {
        method: "PUT",
        data: updatedProfile,
      });
      toast.success("Profile updated successfully!");
      getProfile(); // Refresh the expenses list after updating
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error updating profile"
      );
    }
  };

  const uploadProfilePicture = async (formData) => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}upload-profile-picture`,
        {
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct header for file uploads
          },
        }
      );
      toast.success("Profile picture updated successfully!");
      getProfile(); // Refresh profile after uploading
    } catch (err) {
      handleError(
        err.response
          ? err.response.data.message
          : "Error uploading profile picture"
      );
    }
  };

  // Add a new saving goal
  const totalSaving = () => {
    return savingGoals.reduce((total, saving) => total + saving.currentAmount, 0);
  };

  // Add income
  const addIncome = async (income) => {
    try {
      await fetchWithAuth(`${BASE_URL}add-income`, {
        method: "POST",
        data: income,
      });
      toast.success("Income added successfully!");
      getIncomes(); // Refresh incomes after adding
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Something went wrong"
      );
    }
  };

  // Get incomes
  const getIncomes = async () => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}get-incomes`);
      setIncomes(response.data);
      console.log(response.data);
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error fetching incomes"
      );
    }
  };

  const editIncome = async (id, updatedIncome) => {
    try {
      await fetchWithAuth(`${BASE_URL}update-income/${id}`, {
        method: "PUT",
        data: updatedIncome,
      });
      toast.success("Income updated successfully!");
      getIncomes(); // Refresh the expenses list after updating
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error updating income"
      );
    }
  };

  // Delete income
  const deleteIncome = async (id) => {
    try {
      await fetchWithAuth(`${BASE_URL}delete-income/${id}`, {
        method: "DELETE",
      });
      toast.success("Income deleted successfully!");
      getIncomes(); // Refresh incomes after deletion
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message
        : "Error deleting income";
      handleError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Total income
  const totalIncome = () => {
    return incomes.reduce((total, income) => total + income.amount, 0);
  };

  const addBudget = async (budgetItem) => {
    try {
      await fetchWithAuth(`${BASE_URL}add-or-update-budget`, {
        method: "POST",
        data: budgetItem,
      });
      toast.success("Budget added successfully!");
      getBudget(); // Refresh budget data after adding
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error adding budget"
      );
    }
  };

  const getBudget = async () => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}get-budgets`);
      setBudget(response.data); // Update state with fetched budgets
      console.log(response.data);
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error fetching budgets"
      );
    }
  };

  const updateBudget = async (categoryId, updatedBudgetItem) => {
    try {
      if (!updatedBudgetItem.category || !updatedBudgetItem.amount) {
        throw new Error("Category and amount are required!"); // Prevent sending invalid requests
      }

      await fetchWithAuth(`${BASE_URL}update-budget/${categoryId}`, {
        method: "PUT",
        data: updatedBudgetItem,
      });
      toast.success("Budget updated successfully!");
      getBudget(); // Refresh budget data after updating
    } catch (err) {
      handleError(err.response ? err.response.data.message : err.message);
    }
  };

  const deleteBudget = async (categoryId) => {
    try {
      await fetchWithAuth(`${BASE_URL}delete-budget/${categoryId}`, {
        method: "DELETE",
      });
      toast.success("Budget deleted successfully!");
      getBudget(); // Refresh budget data after deletion
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error deleting budget"
      );
    }
  };

  const totalBudget = () => {
    return budget.reduce((total, item) => total + item.amount, 0);
  };

  const allocateBudget = (income) => {
    const remainingIncome = income - totalBudget();
    if (remainingIncome < 0) {
      handleError("Total budget exceeds income");

      return false;
    }
    return true;
  };

  const addExpense = async (expense) => {
    try {
      console.log("Expense category:", expense.category); // Log the category of the expense being added
      const categoryBudget = budget.find(
        (b) =>
          b.category.toLowerCase() &&
          expense.category.toLowerCase() &&
          b.category.toLowerCase() === expense.category.toLowerCase()
      );
      if (!categoryBudget) {
        const errorMessage = `No budget set for category: ${expense.category}`;
        handleError(errorMessage);

        return;
      }

      if (categoryBudget.remaining < expense.amount) {
        const errorMessage = `Expense exceeds remaining budget for category: ${expense.category}`;
        handleError(errorMessage);
        return;
      }

      await fetchWithAuth(`${BASE_URL}add-expense`, {
        method: "POST",
        data: expense,
      });
      toast.success("Expense added successfully!");
      getExpenses();
      getBudget();
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Something went wrong"
      );
    }
  };

  // Update expense
  const editExpense = async (id, updatedExpense) => {
    try {
      await fetchWithAuth(`${BASE_URL}edit-expense/${id}`, {
        method: "PUT",
        data: updatedExpense,
      });
      toast.success("Expense updated successfully!");
      getExpenses(); // Refresh the expenses list after updating
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error updating expense"
      );
    }
  };

  const totalExpensesByCategory = (category) => {
    return expenses
      .filter((expense) => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  // Get expenses
  const getExpenses = async () => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}get-expenses`);
      const sortedExpenses = response.data.sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      setExpenses(sortedExpenses);
      console.log(response.data);
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error fetching expenses"
      );
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await fetchWithAuth(`${BASE_URL}delete-expense/${id}`, {
        method: "DELETE",
      });
      toast.success("Expense deleted successfully!");
      getExpenses(); // Refresh expenses after deletion
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error deleting expense"
      );
    }
  };

  // Total expenses
  const totalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Total balance
  const totalBalance = () => {
    return totalIncome() - totalExpenses();
  };

  // Add a new saving goal
  const addSavingGoal = async (goal) => {
    try {
      await fetchWithAuth(`${BASE_URL}add-saving-goal`, {
        method: "POST",
        data: goal,
      });
      toast.success("Saving goal added successfully!");
      getSavingGoals(); // Refresh goals after adding
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error adding saving goal"
      );
    }
  };

  // Get all saving goals
  const getSavingGoals = async () => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}get-saving-goals`);
      setSavingGoals(response.data);
      console.log(response.data);
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error fetching saving goals"
      );
    }
  };

  // Update a saving goal
  const editSavingGoal = async (id, updatedGoal) => {
    try {
      await fetchWithAuth(`${BASE_URL}update-saving-goal/${id}`, {
        method: "PUT",
        data: updatedGoal,
      });
      toast.success("Saving goal updated successfully!");
      getSavingGoals(); // Refresh after update
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error updating saving goal"
      );
    }
  };

  // Delete a saving goal
  const deleteSavingGoal = async (id) => {
    try {
      await fetchWithAuth(`${BASE_URL}delete-saving-goal/${id}`, {
        method: "DELETE",
      });
      toast.success("Saving goal deleted successfully!");
      getSavingGoals(); // Refresh after delete
    } catch (err) {
      handleError(
        err.response ? err.response.data.message : "Error deleting saving goal"
      );
    }
  };

  // Calculate total target amount of all saving goals
  const totalSavingGoalsTarget = () => {
    return savingGoals.reduce((total, goal) => total + goal.targetAmount, 0);
  };

  // Transaction history (combined incomes and expenses)
  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return history.slice(0, 3);
  };

  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        editIncome,
        addExpense,
        getExpenses,
        editExpense,
        deleteExpense,
        totalExpenses,
        budget,
        addBudget,
        allocateBudget,
        updateBudget,
        deleteBudget,
        getBudget,
        totalBudget,
        totalBalance,
        transactionHistory,
        totalExpensesByCategory,
        error,
        setError,
        getNotifications,
        notifications,
        profile,
        editProfile,
        getProfile,
        uploadProfilePicture,
        savingGoals,
        addSavingGoal,
        getSavingGoals,
        editSavingGoal,
        deleteSavingGoal,
        totalSavingGoalsTarget,
        totalSaving,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
