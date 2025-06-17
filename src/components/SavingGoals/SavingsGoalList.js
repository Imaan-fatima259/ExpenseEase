import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import SavingGoalForm from './SavingGoalForm';
import Button from '../Button/Button';
import { edit, trash } from '../../utils/Icons';

// Confetti
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

function SavingGoals() {
    const { savingGoals, getSavingGoals, deleteSavingGoal, totalSaving } = useGlobalContext();
    const [goalToEdit, setGoalToEdit] = useState(null);
    const { width, height } = useWindowSize();
    const [confettiGoalId, setConfettiGoalId] = useState(null);

    useEffect(() => {
        getSavingGoals();
    }, []);

    // Handle confetti and goal deletion
    useEffect(() => {
        const achievedGoal = savingGoals.find(goal =>
            goal.currentAmount >= goal.targetAmount &&
            goal._id !== confettiGoalId // Don't retrigger for same goal
        );

        if (achievedGoal) {
            setConfettiGoalId(achievedGoal._id);

            // Clear confetti after 4 seconds
            const confettiTimer = setTimeout(() => {
                setConfettiGoalId(null);
            }, 4000);

            // Delete goal after 5 seconds
            const deleteTimer = setTimeout(() => {
                deleteSavingGoal(achievedGoal._id);
            }, 5000);

            return () => {
                clearTimeout(confettiTimer);
                clearTimeout(deleteTimer);
            };
        }
    }, [savingGoals]);

    return (
        <SavingGoalsStyled>
            <InnerLayout>
                <h2 className="total-saving">Total Savings: <span>${totalSaving()}</span></h2>

                <div className="form-goal-container">
                    <div className="form-container">
                        <SavingGoalForm savingToEdit={goalToEdit} setSavingToEdit={setGoalToEdit} />
                    </div>
                    <div className="goals-history">
                        {savingGoals.map((goal) => {
                            const { _id, title, targetAmount, currentAmount } = goal;
                            const goalAchieved = currentAmount >= targetAmount;
                            const progress = (currentAmount / targetAmount) * 100;

                            return (
                                <div key={_id} className="goal-item">
                                    {confettiGoalId === _id && <Confetti width={width} height={height} />}
                                    <div className="content">
                                        <div className="goal-details">
                                            <h3 className="category-name">{title}</h3>
                                            <p><strong>Target Amount:</strong> ${targetAmount}</p>
                                            <p><strong>Current Amount:</strong> ${currentAmount}</p>
                            
                                            {goalAchieved && (
                                                <p className="congrats">🎉 Congratulations! You've achieved your goal!</p>
                                            )}
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-segment red"
                                                    style={{ width: `${Math.min(progress, 30)}%` }}
                                                ></div>
                                                <div
                                                    className="progress-segment yellow"
                                                    style={{
                                                        width: `${
                                                            progress > 30 ? Math.min(progress - 30, 30) : 0
                                                        }%`
                                                    }}
                                                ></div>
                                                <div
                                                    className="progress-segment green"
                                                    style={{
                                                        width: `${progress > 65 ? Math.min(progress - 60, 40) : 0}%`
                                                    }}
                                                ></div>
                                            </div>

                                        </div>
                                        </div>
                                        <div className="btn-con">
                                            <Button
                                                icon={edit}
                                                bPad={'1rem'}
                                                bRad={'50%'}
                                                bg={'#7393B3'}
                                                color={'black'}
                                                iColor={'blue'}
                                                hColor={'var(--color-green)'}
                                                onClick={() => setGoalToEdit(goal)}
                                            />
                                            <Button
                                                icon={trash}
                                                bPad={'1rem'}
                                                bRad={'50%'}
                                                bg={'#7393B3'}
                                                color={'black'}
                                                iColor={'blue'}
                                                hColor={'var(--color-green)'}
                                                onClick={() => deleteSavingGoal(_id)}
                                                disabled={confettiGoalId === _id} // Prevent delete if celebration is active
                                            />
                                        </div>
                                    </div>
                            );
                        })}
                    </div>
                </div>
            </InnerLayout>
        </SavingGoalsStyled>
    );
}

const SavingGoalsStyled = styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;

    .total-saving {
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

    .form-goal-container {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .form-container {
        flex: 1;
        margin: 2rem 0;
    }

    .goals-history {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 2;
    }

    .goal-item {
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

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            margin-bottom: 20px;
        }

        .goal-details {
            flex: 1;
            padding: 1rem;
            max-width: 100%;
            box-sizing: border-box;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
            .progress-bar {
                display: flex;
                height: 10px;
                width: 50%;
                border-radius: 10px;
                overflow: hidden;
                background-color: #e0e0e0;
                margin-top: 10px;
            }

            .progress-segment {
                height: 100%;
            }

            .red {
                background-color: #ff4d4d;
            }

            .yellow {
                background-color: #ffd700;
            }

            .green {
                background-color: #4caf50;
            }


    .progress-bar-fill {
        height: 100%;
        background-color: rgb(196, 157, 197);
        transition: width 0.4s ease-in-out;
        border-radius: 10px 0 0 10px;
    }
        .category-name {
            font-size: 1.6rem;
            font-weight: bold;
            text-transform: uppercase;
            color: rgb(196, 157, 197);
            letter-spacing: 1px;
            padding: 0.3rem 0;
            margin-bottom: 0.5rem;
            border-bottom: 3px solid rgb(196, 157, 197);
            display: inline-block;
        }

        .btn-con {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.01rem;
            margin-top: -60px;
        }

        .congrats {
            font-size: 1.1rem;
            font-weight: bold;
            color: green;
            margin-top: 0.5rem;
        }
    }
`;

export default SavingGoals;