import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/globalContext';

function History() {
    const { transactionHistory } = useGlobalContext();
    const [...history] = transactionHistory();

    return (
        <HistoryStyled>
            <h2>
                Recent History
            </h2>
            {history.map((item) => {
                const { _id, title, amount, type } = item;
                const emoji = type === 'expense' ? '💸' : '💰'; // Assign emoji based on type
                
                return (
                    <div key={_id} className="history-item">
                        <p className="history-title" style={{
                            color: type === 'expense' ? 'red' : 'var(--color-green)'
                        }}>
                            {emoji} {title}
                        </p>

                        <p className="history-amount" style={{
                            color: type === 'expense' ? 'red' : 'var(--color-green)'
                        }}>
                            {type === 'expense' ? `-${amount <= 0 ? 0 : amount}` : `+${amount <= 0 ? 0 : amount}`}
                        </p>
                    </div>
                )
            })}
        </HistoryStyled>
    );
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    h2 {
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 1rem;
        align-items: center;
        gap: 0.5rem;
    }

    .history-item {
        background:rgb(223, 214, 226);
        border: 2px solid rgb(63, 2, 71);
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: transform 0.3s ease-in-out;

        &:hover {
            transform: scale(1.03); /* Slight zoom effect on hover */
            box-shadow: 0px 1px 20px rgba(0, 0, 0, 0.1); /* Enhanced shadow on hover */
        }
    }

    .history-title {
        font-weight: 600;
        font-size: 1.4rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .history-amount {
        font-weight: 700;
        font-size: 1.5rem;
    }
`;

export default History;
