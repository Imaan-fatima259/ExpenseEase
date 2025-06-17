const { addExpense, getExpense, deleteExpense, editExpense } = require('../controllers/expense');
const { addIncome,getIncomes,deleteIncome,editIncome } = require('../controllers/income');
const { addOrUpdateBudget,getBudgets, deleteBudget, editBudget} = require('../controllers/budget');
const {getNotifications} = require('../controllers/notificationController')
const { getUserProfile, updateUserProfile ,uploadProfilePicture} = require('../controllers/userController');
const { addSavingGoal, getSavingGoals, deleteSavingGoal, editSavingGoal } = require('../controllers/SavingGoalController');


const router = require('express').Router()


router.post('/add-income',addIncome)
      .get('/get-incomes', getIncomes)
      .delete('/delete-income/:id',deleteIncome)
      .post('/add-expense', addExpense)
      .get('/get-expenses', getExpense)
      .put('/edit-expense/:id',editExpense)
      .delete('/delete-expense/:id', deleteExpense)
      .post('/add-or-update-budget', addOrUpdateBudget)
      .get('/get-budgets', getBudgets)
      .delete('/delete-budget/:id',deleteBudget)
      .put('/update-budget/:id',editBudget)
      .put('/update-income/:id',editIncome)
      .get('/get-notifications',getNotifications)
      .get('/get-profile', getUserProfile) 
      .put('/update-profile/:id', updateUserProfile)
      .post('/uploadProfilePicture', uploadProfilePicture)
      .post('/add-saving-goal', addSavingGoal) 
      .get('/get-saving-goals', getSavingGoals)
      .delete('/delete-saving-goal/:id', deleteSavingGoal)
      .put('/update-saving-goal/:id', editSavingGoal);

  
module.exports = router