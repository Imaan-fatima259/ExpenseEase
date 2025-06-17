import React, { useEffect, useState } from "react";
import "./SavingGoalForm.css";
import DatePicker from "react-datepicker";

import { useGlobalContext } from "../../context/globalContext";

const SavingGoalForm = ({savingToEdit, setSavingToEdit}) => {
  const { addSavingGoal, editSavingGoal } = useGlobalContext();

  const [inputState, setInputState] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
  });

  useEffect(() => {
    if (savingToEdit) {
      setInputState({
        title: savingToEdit.title,
        targetAmount: savingToEdit.targetAmount,
        currentAmount: savingToEdit.currentAmount,
      });
    }
  }, [savingToEdit]);

  const { title, targetAmount, currentAmount } = inputState;

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert numeric fields to numbers
    const finalInputState = {
      ...inputState,
      targetAmount: parseFloat(inputState.targetAmount),
      currentAmount: parseFloat(inputState.currentAmount),
    };

    if (savingToEdit) {
      editSavingGoal(savingToEdit._id, { ...savingToEdit, ...finalInputState });
    } else {
      addSavingGoal(finalInputState);
    }
    setInputState({
      title: "",
      targetAmount: "",
      currentAmount: "",
    });
    setSavingToEdit(null);
  };

  return (
    <form className="saving-goal-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Goal Title"
        value={title}
        onChange={handleInput("title")}
        className="saving-goal-input"
        required
      />
      <input
        type="number"
        name="targetAmount"
        placeholder="Target Amount"
        value={targetAmount}
        onChange={handleInput("targetAmount")}
        className="saving-goal-input"
        required
      />
      <input
        type="number"
        name="currentAmount"
        placeholder="Current Amount"
        value={currentAmount}
        onChange={handleInput("currentAmount")}
        className="saving-goal-input"
        required
      />
      <button type="submit" className="saving-goal-button">
        Add Goal
      </button>
    </form>
  );
};

export default SavingGoalForm;