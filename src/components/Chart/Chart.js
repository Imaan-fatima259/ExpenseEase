import React, { useRef, useEffect } from 'react';
import { Chart as ChartJs, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { dateFormat } from '../../utils/dateFormat';

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
);

function Chart() {
    const chartRef = useRef(null);
    const { incomes, expenses } = useGlobalContext();

    const allDates = [
        ...new Set([
            ...incomes.map((inc) => inc.date),
            ...expenses.map((exp) => exp.date),
        ]),
    ].sort();

    const labels = allDates.map((date) => dateFormat(date));

    const incomeData = allDates.map((date) => {
        const incomesForDate = incomes.filter((inc) => inc.date === date);
        return incomesForDate.reduce((sum, income) => sum + income.amount, 0);
    });

    const expenseData = allDates.map((date) => {
        const expensesForDate = expenses.filter((exp) => exp.date === date);
        return expensesForDate.reduce((sum, expense) => sum + expense.amount, 0);
    });

    const data = {
        labels,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                borderColor: 'green',
                backgroundColor: 'rgba(0,128,0,0.3)',
                tension: 0.2,
            },
            {
                label: 'Expenses',
                data: expenseData,
                borderColor: 'red',
                backgroundColor: 'rgba(255,0,0,0.3)',
                tension: 0.2,
            },
        ],
    };

    useEffect(() => {
        // Assign an id to the canvas element for export
        if (chartRef.current && chartRef.current.canvas) {
            chartRef.current.canvas.id = 'dashboard-chart';
        }
    }, []);

    return (
        <ChartStyled>
            <Line data={data} ref={chartRef} />
        </ChartStyled>
    );
}

const ChartStyled = styled.div`
    background: rgb(223, 214, 226);
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    margin-bottom: 40px;
    height: 100%;
`;

export default Chart;
