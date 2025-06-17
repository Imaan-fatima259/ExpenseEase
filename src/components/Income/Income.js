import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Form from '../Form/Form';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import { dateFormat } from '../../utils/dateFormat';
import {
    bitcoin, book, calender, card, circle, clothing, comment, dollar, food, freelance, medical,
    money, piggy, stocks, takeaway, trash, tv, users, yt, edit
} from '../../utils/Icons';
import Button from '../Button/Button';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

function Income() {
    const { incomes, getIncomes, deleteIncome, totalIncome } = useGlobalContext();
    const [incomeToEdit, setIncomeToEdit] = useState(null);

    useEffect(() => {
        getIncomes();
    }, [getIncomes]); // Added dependency

    // Avoid mapping errors when incomes are empty
    const pieChartData = incomes.length > 0 ? {
        labels: incomes.map((income) => income.category),
        datasets: [
            {
                data: incomes.map((income) => income.amount),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
        ],
    } : { labels: [], datasets: [] };

    const categoryIcon = (category) => {
        const icons = {
            salary: money, freelancing: freelance, investments: stocks, stocks: users,
            bitcoin: bitcoin, bank: card, youtube: yt, other: piggy
        };
        return icons[category] || circle;
    };

    const expenseCatIcon = (category) => {
        const icons = {
            education: book, groceries: food, health: medical, subscriptions: tv,
            takeaways: takeaway, clothing: clothing, travelling: freelance, other: circle
        };
        return icons[category] || circle;
    };

    return (
        <IncomeStyled>
            <InnerLayout>
                <h2 className="total-income">
                    Total Income: <span>${totalIncome()}</span>
                </h2>

                <div className="form-income-container">
                    <div className="form-container">
                        <Form incomeToEdit={incomeToEdit} setIncomeToEdit={setIncomeToEdit} />
                    </div>

                    <div className="income-history">
                        {incomes.map(({ _id, title, amount, date, category, description, type }) => (
                            <div key={_id} className="income-item">
                                
                                <div className="content">
                                    {/* <h5>{title}</h5> */}
                                    <div className="budget-details">
                                        <h3 className="category-name">{title}</h3>
                                        <p><strong>Amount:</strong> ${amount}</p>
                                        <p><strong>Date:</strong> {dateFormat(date)}</p>
                                        <p><strong>Description:</strong> {description}</p>
                                    </div>
                                        {/* <div className="text">
                                            <p>{dollar} {}</p>
                                            <p>{calender} {dateFormat(date)}</p>
                                            <p>{comment} {description}</p>
                                        </div> */}
                                        <div className="btn-con">
                                            <Button
                                                icon={edit}
                                                bPad={'1rem'}
                                                bRad={'50%'}
                                                bg={'#7393B3'}
                                                color={'black'}
                                                iColor={'blue'}
                                                hColor={'var(--color-green)'}
                                                onClick={() => setIncomeToEdit({ _id, title, amount, date, category, description, type })}
                                            />
                                            <Button
                                                icon={trash}
                                                bPad={'1rem'}
                                                bRad={'50%'}
                                                bg={'#7393B3'}
                                                color={'black'}
                                                iColor={'blue'}
                                                hColor={'var(--color-green)'}
                                                onClick={() => deleteIncome(_id)}
                                            />
                                        </div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {incomes.length > 0 && (
                    <div className="pie-chart">
                        <Pie data={pieChartData} />
                    </div>
                )}
            </InnerLayout>
        </IncomeStyled>
    );
}

const IncomeStyled = styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;

    .total-income {
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
        background: #FFFFFF;
        border: 2px solid #FFFFFF;
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
            background: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #FFFFFF;
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
                    content: '';
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

export default Income;