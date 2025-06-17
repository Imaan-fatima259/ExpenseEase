const SavingSchema = require('../models/SavingModel');
const IncomeSchema = require('../models/IncomeModel');
const BudgetSchema = require('../models/BudgetModel');

// Helper function to get available income
const getAvailableIncome = async (userId) => {
    const incomes = await IncomeSchema.find({ userId });
    const budgets = await BudgetSchema.find({ userId });

    const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);
    const totalBudgets = budgets.reduce((acc, item) => acc + item.amount, 0);

    return totalIncome - totalBudgets;
};

// ADD Saving Goal
// ADD Saving Goal
exports.addSavingGoal = async (req, res) => {
    const { title, targetAmount, currentAmount } = req.body;
    const { _id: userId, googleId } = req.user;
    const uid = userId || googleId;

    try {
        if (!title || !targetAmount || !currentAmount) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        const availableIncome = await getAvailableIncome(uid);

        if (currentAmount > availableIncome) {
            return res.status(400).json({ message: 'Insufficient available income for this saving amount.' });
        }

        const saving = new SavingSchema({
            title,
            targetAmount,
            currentAmount,
                        userId: uid
        });

        await saving.save();

        const goalAchieved = currentAmount >= targetAmount;

        res.status(200).json({
            message: goalAchieved
                ? '🎉 Congratulations! You have achieved your saving goal!'
                : 'Saving goal added successfully!',
            saving,
            goalAchieved
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// EDIT Saving Goal
exports.editSavingGoal = async (req, res) => {
    const { id } = req.params;
    const { title, targetAmount, currentAmount } = req.body;
    const { _id: userId, googleId } = req.user;
    const uid = userId || googleId;

    try {
        if (!title || !targetAmount || !currentAmount ) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        const saving = await SavingSchema.findOne({ _id: id, userId: uid });

        if (!saving) {
            return res.status(404).json({ message: 'Saving goal not found or unauthorized' });
        }

        const availableIncome = await getAvailableIncome(uid);

        if (currentAmount > availableIncome) {
            return res.status(400).json({ message: 'Insufficient available income for this saving amount.' });
        }

        saving.title = title;
        saving.targetAmount = targetAmount;
        saving.currentAmount = currentAmount;

        const updatedSaving = await saving.save();
        const goalAchieved = updatedSaving.currentAmount >= updatedSaving.targetAmount;

        res.status(200).json({
            message: goalAchieved
                ? '🎉 Congratulations! You have achieved your saving goal!'
                : 'Saving goal updated successfully!',
            saving: updatedSaving,
            goalAchieved
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getSavingGoals = async (req, res) => {
    const { _id: userId, googleId } = req.user;

    try {
        const savings = await SavingSchema.find({ userId: userId || googleId });
        res.status(200).json(savings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }

};
// DELETE Saving Goal
exports.deleteSavingGoal = async (req, res) => {
    const { id } = req.params;
    const { _id: userId, googleId } = req.user;

    try {
        const saving = await SavingSchema.findOne({ _id: id, userId: userId || googleId });
        
        if (!saving) {
            return res.status(404).json({ message: 'Saving goal not found or unauthorized' });
        }

        await SavingSchema.findByIdAndDelete(id);
        res.status(200).json({ message: 'Saving goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};