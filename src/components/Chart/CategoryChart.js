import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CategoryChart = ({ budgets, expenses }) => {

    // Processing data for the bar chart
    const categories = budgets.map((budget) => budget.category);
    const budgetAmounts = budgets.map((budget) => budget.amount);
    const expenseAmounts = expenses.map((expense) => expense.amount);

    // Chart Data
    const data = {
        labels: categories, // Categories for the x-axis
        datasets: [
            {
                label: 'Budget Amount',
                data: budgetAmounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light teal for budget
                borderColor: 'rgba(75, 192, 192, 1)', // Teal for budget
                borderWidth: 1,
            },
            {
                label: 'Expense Amount',
                data: expenseAmounts,
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light red for expenses
                borderColor: 'rgba(255, 99, 132, 1)', // Red for expenses
                borderWidth: 1,
            },
        ],
    };

    // Chart Options
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Budget vs Expenses by Category',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const label = tooltipItem.dataset.label || '';
                        return `${label}: $${tooltipItem.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Categories',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount ($)',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="chart-container">
            <Bar data={data} options={options} />
        </div>
    );
};

export default CategoryChart;
