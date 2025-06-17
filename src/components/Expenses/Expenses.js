import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import ExpenseForm from "./ExpenseForm";
import { dateFormat } from "../../utils/dateFormat";
import {
  bitcoin,
  book,
  calender,
  card,
  circle,
  clothing,
  comment,
  dollar,
  food,
  freelance,
  medical,
  money,
  piggy,
  stocks,
  takeaway,
  trash,
  tv,
  users,
  yt,
  edit,
} from "../../utils/Icons";
import Button from "../Button/Button";

function Expenses() {
  const { expenses, getExpenses, deleteExpense, totalExpenses } =
    useGlobalContext();
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  useEffect(() => {
    getExpenses();
  }, []);

  const categoryIcon = (category) => {
    switch (category) {
      case "salary":
        return money;
      case "freelancing":
        return freelance;
      case "investments":
        return stocks;
      case "stocks":
        return users;
      case "bitcoin":
        return bitcoin;
      case "bank":
        return card;
      case "youtube":
        return yt;
      case "other":
        return piggy;
      default:
        return "";
    }
  };

  const expenseCatIcon = (category) => {
    switch (category) {
      case "education":
        return book;
      case "groceries":
        return food;
      case "health":
        return medical;
      case "subscriptions":
        return tv;
      case "takeaways":
        return takeaway;
      case "clothing":
        return clothing;
      case "travelling":
        return freelance;
      case "other":
        return circle;
      default:
        return circle;
    }
  };

  return (
    <ExpenseStyled>
      <InnerLayout>
        <h2 className="total-expense">
          Total Expense: <span>${totalExpenses()}</span>
        </h2>
        <div className="form-income-container">
          <div className="form-container">
            <ExpenseForm
              expenseToEdit={expenseToEdit}
              setExpenseToEdit={setExpenseToEdit}
            />
          </div>
          <div className="income-history">
            {expenses.map((income) => {
              const { _id, title, amount, date, category, description, type } =
                income;
              return (
                <div key={_id} className="income-item">
                  {/* <div className="icon">
                                        {(type === 'expense' || type === 'budget') ? expenseCatIcon(category) : categoryIcon(category)}
                                    </div> */}
                  <div className="content">
                    {/* <h5>{title}</h5> */}
                    <div className="budget-details">
                      <h3 className="category-name">{title}</h3>
                      <p>
                        <strong>Amount:</strong> ${amount}
                      </p>
                      <p>
                        <strong>Date:</strong> {dateFormat(date)}
                      </p>
                      <p>
                        <strong>Description:</strong> {description}
                      </p>
                      {income.isRecurring && (
                        <span className="recurring-badge">Recurring</span>
                      )}
                    </div>
                    <div className="btn-con">
                      <Button
                        icon={edit}
                        bPad={"1rem"}
                        bRad={"50%"}
                        bg={"#7393B3"}
                        color={"black"}
                        iColor={"blue"}
                        hColor={"var(--color-green)"}
                        onClick={() => setExpenseToEdit(income)} // Edit function
                      />
                      <Button
                        icon={trash}
                        bPad={"1rem"}
                        bRad={"50%"}
                        bg={"#7393B3"}
                        color={"black"}
                        iColor={"blue"}
                        hColor={"var(--color-green)"}
                        onClick={() => deleteExpense(_id)} // Delete function
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </InnerLayout>
    </ExpenseStyled>
  );
}

const ExpenseStyled = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;

  .total-expense {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(223, 214, 226);
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem 0;
    font-size: 2rem;
    gap: 0.5rem;
    span {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--color-green);
    }
  }
.recurring-badge {
    background-color:rgb(186, 5, 192);
    color: #fff;
    font-size: 0.8rem;
    font-weight: bold;
    padding: 0.2rem 0.5rem;
    margin-left: 1rem;
    border-radius: 10px;
    text-transform: uppercase;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
}
  .form-income-container {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .form-container {
    flex: 1;
    margin: 2rem 0;
  }

  .income-history {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 2;
  }

  .income-item {
    background: #ffffff;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    border-left: 5px solid rgb(196, 157, 197);
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    color: rgb(3, 3, 31);

    .icon {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffffff;
      i {
        font-size: 2.6rem;
      }
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      h5 {
        font-size: 1.5rem;
        font-weight: bold;
        padding-left: 2rem;
        color: var(--primary-color);
        position: relative;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
          background: var(--color-green);
        }
      }
    }

    .budget-details {
      flex: 1;
      padding: 1rem;
      max-width: 100%;
      box-sizing: border-box;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .category-name {
      font-size: 1.6rem;
      font-weight: bold;
      text-transform: uppercase;
      color: rgb(196, 157, 197);
      letter-spacing: 1px;
      padding: 0.3rem 0;
      margin-bottom: 0.5rem; /* Adjust this as needed */
      border-bottom: 3px solid rgb(196, 157, 197);
      display: inline-block;
    }

    /* ADD THIS PART */
    .btn-con {
      display: flex;
      flex-direction: column; /* Stack buttons vertically */
      align-items: flex-end; /* Align them to the right */
      gap: 0.01rem;
      margin-top: -130px; /* Move buttons slightly up */
    }
  }

  .pie-chart {
    width: 50%;
    margin: 2rem auto;
    padding: 2rem;
  }
`;

export default Expenses;
