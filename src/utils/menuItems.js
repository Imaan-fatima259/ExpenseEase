import {dashboard, expenses, transactions, trend, chatbot} from '../utils/Icons'

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 2,
        title: "Budget",
        icon: transactions,
        link: "/dashboard",
    },
    {
        id: 3,
        title: "Incomes",
        icon: trend,
        link: "/dashboard",
    },
    {
        id: 4,
        title: "Expenses",
        icon: expenses,
        link: "/dashboard",
    },
    // {
    //     id: 5,
    //     title: "Saving Goals",
    //     icon: expenses,
    //     link: "/SavingGoal",
    // },
    {
        id: 6,
        title: "Saving Goals",
        icon: expenses,
        link: "/SavingGoal",
    }
]