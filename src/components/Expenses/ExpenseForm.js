import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";

function ExpenseForm({ expenseToEdit, setExpenseToEdit }) {
  const { addExpense, editExpense } = useGlobalContext();
  const [inputState, setInputState] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    customCategory: "",
    description: "",
    priority: "Medium",
    isRecurring: false, // New: Is this a recurring expense?
    recurrence: "", // New: recurrence interval (daily, weekly, monthly, yearly)
    nextOccurrence: null, // New: when recurring ends (optional)
    recurrenceEndDate:null
  });
  useEffect(() => {
    if (expenseToEdit) {
      setInputState({
        title: expenseToEdit.title,
        amount: expenseToEdit.amount,
        date: expenseToEdit.date,
        category: expenseToEdit.category,
        customCategory:
          expenseToEdit.category === "other"
            ? expenseToEdit.customCategory
            : "", // Handle pre-existing custom category
        description: expenseToEdit.description,
        priority: expenseToEdit.priority || "Medium",
        isRecurring: expenseToEdit.isRecurring, // New: Is this a recurring expense?
        recurrence: expenseToEdit.recurrence, // New: recurrence interval (daily, weekly, monthly, yearly)
        nextOccurrence: expenseToEdit.nextOccurrence, // New: when recurring ends (optional)
        recurrenceEndDate: expenseToEdit.recurrenceEndDate,
      });
    }
  }, [expenseToEdit]);

  const { title, amount, date, category, description, customCategory } =
    inputState;

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure that customCategory is used if 'Other' is selected
    const finalInputState = {
      ...inputState,
      category: category === "other" ? customCategory : category,
      isRecurring: inputState.isRecurring,
      recurrence: inputState.isRecurring
        ? inputState.recurrence
        : null,
      nextOccurrence: inputState.isRecurring
        ? inputState.nextOccurrence
        : null,
    };

    if (expenseToEdit) {
      editExpense(expenseToEdit._id, { ...expenseToEdit, ...finalInputState });
    } else {
      addExpense(finalInputState);
    }
    setInputState({
      title: "",
      amount: "",
      date: "",
      category: "",
      description: "",
      priority: "Medium",
      isRecurring: false, // New: Is this a recurring expense?
      recurrence: "", // New: recurrence interval (daily, weekly, monthly, yearly)
      nextOccurrence: null, // New: when recurring ends (optional)
      recurrenceEndDate: null,
    });
    setExpenseToEdit(null);
  };

  return (
    <ExpenseFormStyled onSubmit={handleSubmit}>
      <div className="input-control">
        <input
          type="text"
          value={title}
          name={"title"}
          placeholder="Expense Title"
          onChange={handleInput("title")}
        />
      </div>
      <div className="input-control">
        <input
          value={amount}
          type="text"
          name={"amount"}
          placeholder={"Expense Amount"}
          onChange={handleInput("amount")}
        />
      </div>
      <div className="input-control">
        <DatePicker
          id="date"
          placeholderText="Enter A Date"
          selected={date}
          dateFormat="dd/MM/yyyy"
          onChange={(date) => {
            setInputState({ ...inputState, date: date });
          }}
        />
      </div>

      <div className="selects input-control">
        <select
          required
          value={category}
          name="category"
          id="category"
          onChange={handleInput("category")}
          disabled={!!expenseToEdit}
        >
          <option value="" disabled>
            Select Option
          </option>
          <option value="education">Education</option>
          <option value="groceries">Groceries</option>
          <option value="health">Health</option>
          <option value="subscriptions">Subscriptions</option>
          <option value="takeaways">Takeaways</option>
          <option value="clothing">Clothing</option>
          <option value="travelling">Travelling</option>
          <option value="other">Other</option>
        </select>
      </div>
      {category === "other" && (
        <div className="input-control">
          <input
            type="text"
            value={customCategory}
            name={"customCategory"}
            placeholder="Enter Custom Category"
            onChange={handleInput("customCategory")}
          />
        </div>
      )}
      <select
        name="priority"
        value={inputState.priority}
        onChange={handleInput("priority")}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
     <div className="input-control checkbox-control">
  <label className="checkbox-label">
    <span>Recurring Expense</span>
    <input
      type="checkbox"
      checked={inputState.isRecurring}
      onChange={(e) =>
        setInputState({ ...inputState, isRecurring: e.target.checked })
      }
    />
        </label>
      </div>

      {inputState.isRecurring && (
        <>
          <div className="input-control">
            <select
              required
              value={inputState.recurrence}
              onChange={(e) =>
                setInputState({
                  ...inputState,
                  recurrence: e.target.value,
                })
              }
            >
              <option value="" disabled>
                Select Recurrence Frequency
              </option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="input-control">
            <DatePicker
              placeholderText="Next Occurence "
              selected={inputState.nextOccurrence}
              onChange={(date) =>
                setInputState({ ...inputState, nextOccurrence: date })
              }
              dateFormat="dd/MM/yyyy"
              isClearable
            />
          </div>
          <div className="input-control">
            <DatePicker
              placeholderText="Recurrence End Date (optional)"
              selected={inputState.recurrenceEndDate}
              onChange={(date) =>
                setInputState({ ...inputState, recurrenceEndDate: date })
              }
              dateFormat="dd/MM/yyyy"
              isClearable
            />
          </div>
        </>
      )}

      <div className="input-control">
        <textarea
          name="description"
          value={description}
          placeholder="Add A Reference"
          id="description"
          cols="30"
          rows="4"
          onChange={handleInput("description")}
        ></textarea>
      </div>
      <div className="submit-btn">
        <Button
          name={expenseToEdit ? "Edit Expense" : "Add Expense"}
          icon={plus}
          bPad={".8rem 1.6rem"}
          bRad={"30px"}
          bg={"pink"}
          color={"red"}
        />
      </div>
    </ExpenseFormStyled>
  );
}

const ExpenseFormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: 2px solid #fff;
    background: transparent;
    resize: none;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    color: rgba(34, 34, 96, 0.9);
    &::placeholder {
      color: rgba(34, 34, 96, 0.4);
    }
  }
    .checkbox-control {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  color: rgba(34, 34, 96, 0.9);
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color:rgb(95, 155, 235); /* Optional */
  margin-left: 0.5rem;
}
  .input-control {
    input {
      width: 100%;
    }
  }

  .selects {
    display: flex;
    justify-content: flex-end;
    select {
      color: rgba(34, 34, 96, 0.4);
      &:focus,
      &:active {
        color: rgba(34, 34, 96, 1);
      }
    }
  }

  .submit-btn {
    button {
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

      &:hover {
        background: #ff69b4 !important;
      }
    }
  }
`;
export default ExpenseForm;