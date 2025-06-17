import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

function BudgetForm({ budgetToEdit, setBudgetToEdit }) {
    const { addBudget, updateBudget } = useGlobalContext();
    const [inputState, setInputState] = useState({
        category: '',
        amount: '',
        customCategory: '',  // Add customCategory state
    });

    useEffect(() => {
        if (budgetToEdit) {
            setInputState({
                category: budgetToEdit.category,
                amount: budgetToEdit.amount,
                customCategory: budgetToEdit.category === 'other' ? budgetToEdit.customCategory : '',  // Handle pre-existing custom category
            });
        }
    }, [budgetToEdit]);

    const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalInputState = {
            ...inputState,
            category: inputState.category === 'other' ? inputState.customCategory : inputState.category,
        };

        if (budgetToEdit) {
            updateBudget(budgetToEdit._id,{ ...budgetToEdit, ...finalInputState });
        } else {
            addBudget(finalInputState);
        }
        setInputState({ category: '', amount: '', customCategory: '' });
        setBudgetToEdit(null);
    };

    return (
        <BudgetFormStyled onSubmit={handleSubmit}>
            <div className="input-control">
                <select
                    required
                    value={inputState.category}
                    name="category"
                    id="category"
                    onChange={handleInput('category')}
                    disabled={!!budgetToEdit}
                >
                    <option value="" disabled>
                        Select Category
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
            {inputState.category === 'other' && (
                <div className="input-control">
                    <input
                        type="text"
                        value={inputState.customCategory}
                        name="customCategory"
                        placeholder="Enter Custom Category"
                        onChange={handleInput('customCategory')}
                    />
                </div>
            )}
            <div className="input-control">
                <input
                    value={inputState.amount}
                    type="text"
                    name="amount"
                    placeholder="Budget Amount"
                    onChange={handleInput('amount')}
                />
            </div>
            <div className="submit-btn">
                <Button
                    name={budgetToEdit ? 'Edit Budget' : 'Add Budget'}
                    icon={plus}
                    bPad=".8rem 1.6rem"
                    bRad="30px"
                    bg="pink"
                    color="red"
                />
            </div>
        </BudgetFormStyled>
    );
}

const BudgetFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    input,
    select {
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: 2px solid #fff;
        background: transparent;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }
    }
    .submit-btn {
        button {
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        }
    }
`;

export default BudgetForm;
