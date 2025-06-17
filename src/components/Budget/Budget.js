import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import BudgetForm from './BudgetForm';
import { trash, edit } from '../../utils/Icons';
import Button from '../Button/Button';

function Budgets() {
    const { budget, getBudget, deleteBudget, totalBudget } = useGlobalContext();
    const [budgetToEdit, setBudgetToEdit] = useState(null);

    useEffect(() => {
        getBudget();
    }, []);

    return (
        <BudgetsStyled>
            <InnerLayout>
                <h2 className="total-budget">
                    Total Budget: <span>${totalBudget()}</span>
                </h2>
                <div className="budget-content">
                    <div className="form-container">
                        <BudgetForm budgetToEdit={budgetToEdit} setBudgetToEdit={setBudgetToEdit} />
                    </div>
                    <div className="budgets">
                        {budget.map((budget) => {
                            const { _id, category, amount, remaining } = budget;
                            return (
                                <div className="budget-item" key={_id}>
                                    <div className="budget-details">
                                        <h3 className="category-name">{category}</h3>
                                        <p><strong>Amount:</strong> ${amount}</p>
                                        <p><strong>Remaining:</strong> ${remaining}</p>
                                    </div>
                                    <div className="icon-group">
                                        <Button
                                            icon={edit}
                                            bPad={'0.7rem'}
                                            bRad={'50%'}
                                            bg={'#7393B3'}
                                            color={'black'}
                                            iColor={'blue'}
                                            hColor={'var(--color-green)'}
                                            onClick={() => setBudgetToEdit(budget)}
                                        />
                                        <Button
                                            icon={trash}
                                            bPad={'0.7rem'}
                                            bRad={'50%'}
                                            bg={'#7393B3'}
                                            color={'black'}
                                            iColor={'blue'}
                                            hColor={'var(--color-green)'}
                                            onClick={() => deleteBudget(_id)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </InnerLayout>
        </BudgetsStyled>
    );
}

const BudgetsStyled = styled.div`
    display: flex;
    overflow: auto;

    // .title {
    //     text-align: center;
    //     font-size: 2.5rem;
    //     margin-bottom: 1rem;
    //     color: var(--color-dark);
    // }

    .total-budget {
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

    .budget-content {
        display: flex;
        gap: 2rem;
        margin-top: 0.5rem;

        .budgets {
            flex: 1;

            .budget-item {
                display: flex;
                align-items: center;
                justify-content: space-between; /* Push icons to the right */
                background: #ffffff;
                border-left: 5px solid rgb(196, 157, 197);
                box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
                padding: 1rem;
                margin: 1rem 0;
                border-radius: 10px;
                transition: all 0.3s ease-in-out;

                &:hover {
                    transform: translateY(-5px);
                    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
                }

                .budget-details {
                    flex: 1;
                }

                .icon-group {
                    width: 80px;
                    height: 80px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .category-name {
                    font-size: 1.6rem;
                    font-weight: bold;
                    text-transform: uppercase;
                    color: rgb(196, 157, 197);
                    letter-spacing: 1px;
                    padding: 0.3rem 0;
                    border-bottom: 3px solid rgb(196, 157, 197);
                    display: inline-block;
                }

                p {
                    font-size: 1rem;
                    margin: 0.5rem 0;
                }
            }
        }
    }
`;

export default Budgets;
