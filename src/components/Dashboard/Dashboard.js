import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import Chart from '../Chart/Chart';
import CategoryChart from '../Chart/CategoryChart'; 
import axios from 'axios'; // Import axios for API calls
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Charts from "chart.js/auto";
import html2canvas from "html2canvas";
import ChartDataLabels from "chartjs-plugin-datalabels";

Charts.register(ChartDataLabels); 
function Dashboard() {
    const { totalExpenses, incomes, expenses, budget, profile, getProfile, totalIncome, totalBalance, getIncomes, getExpenses, getBudget, notifications, getNotifications } = useGlobalContext();

    const [selectedChart, setSelectedChart] = useState('line');
    const [showInfo, setShowInfo] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        getIncomes();
        getExpenses();
        getProfile();
        getNotifications();
        getBudget();
    }, []);

    
    const generateReport = async (
  selectedMonth = new Date().getMonth(),
  selectedYear = new Date().getFullYear()
) => {
  if (!Array.isArray(incomes) || !Array.isArray(expenses)) {
    console.error("Incomes or expenses are not properly defined.");
    return;
  }

  const totalIncome = incomes.reduce((acc, income) => acc + (income.amount || 0), 0);

  const monthlyExpenses = expenses.filter(
    (expense) =>
      new Date(expense.date).getMonth() === selectedMonth &&
      new Date(expense.date).getFullYear() === selectedYear
  );

  const totalExpense = monthlyExpenses.reduce((acc, expense) => acc + (expense.amount || 0), 0);
  const remainingBalance = totalIncome - totalExpense;

  // ====== CATEGORY-WISE EXPENSE CHART ======
  const categoryTotals = {};
  monthlyExpenses.forEach((expense) => {
    const category = expense.category || "Uncategorized";
    categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
  });

  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 300;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
    const totalCategoryAmount = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

    const categoryChart = new Charts(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8E44AD"
          ],
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: "bottom",
        },
        datalabels: {
          color: "#fff",
          formatter: (value) => {
            const percentage = ((value / totalCategoryAmount) * 100).toFixed(1);
            return `${percentage}%`;
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const categoryChartImage = await html2canvas(canvas).then((canvas) =>
    canvas.toDataURL("image/png")
  );

  // ====== PDF GENERATION ======
  const doc = new jsPDF();

  // Add report title
  doc.setFontSize(16);
  doc.text(
    `Financial Report - ${new Date(selectedYear, selectedMonth).toLocaleString("default", {
      month: "long",
    })} ${selectedYear}`,
    10,
    10
  );

  // Add summary table
  autoTable(doc, {
    startY: 20,
    head: [["Category", "Amount"]],
    body: [
      ["Total Income (Overall)", `$${totalIncome}`],
      ["Total Expenses (This Month)", `$${totalExpense}`],
      ["Remaining Balance", `$${remainingBalance}`],
    ],
  });

  // Add detailed expenses table
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Type", "Category", "Amount", "Date"]],
    body: monthlyExpenses.map((expense) => [
      "Expense",
      expense.category || "N/A",
      `$${expense.amount || 0}`,
      new Date(expense.date).toLocaleDateString(),
    ]),
  });

  // ====== Embed Category Chart on First Page ======
  const pageWidth = doc.internal.pageSize.getWidth();
  const chartWidth = 120;
  const chartHeight = 80;
  const chartX = (pageWidth - chartWidth) / 2;
  const chartY = doc.lastAutoTable.finalY + 20;

  // Add heading above the chart
  doc.setFontSize(14);
  doc.text("Category-wise Expense Breakdown", pageWidth / 2, chartY - 10, { align: "center" });

  // Add the chart image
  doc.addImage(categoryChartImage, "PNG", chartX, chartY, chartWidth, chartHeight);

  // Cleanup
  canvas.remove();
  categoryChart.destroy();

  doc.save(`Monthly_Report_${selectedMonth + 1}_${selectedYear}.pdf`);
};
    
    const safeExpenses = expenses || [];
    const safeBudgets = budget || [];

    const handleChartChange = (event) => {
        setSelectedChart(event.target.value);
    };

    const handleShowInfo = () => {
        setShowInfo(!showInfo);
    };

    // Chatbot functionality
    const toggleChatbot = () => {
        setIsChatbotOpen(!isChatbotOpen);
    };

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const sendMessage = async () => {
        if (userInput.trim() !== '') {
            setMessages([...messages, { text: userInput, sender: 'user' }]);

            try {
                const response = await axios.post('http://127.0.0.1:5000/get-advice', {
                    question: userInput
                });

                setMessages([
                    ...messages,
                    { text: userInput, sender: 'user' },
                    { text: response.data.answer, sender: 'bot' },
                ]);
            } catch (error) {
                console.error('Error getting response from server:', error);
                setMessages([
                    ...messages,
                    { text: 'Sorry, I could not get an answer. Please try again later.', sender: 'bot' }
                ]);
            }

            setUserInput('');
        }
    };

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>All Transactions</h1>

                <div className="chart-selection">
                    <label htmlFor="chart-select">Select Chart: </label>
                    <select id="chart-select" onChange={handleChartChange} value={selectedChart}>
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                    </select>
                </div>

                <div className="stats-con">
                    <div className="chart-con">
                        {selectedChart === 'line' && (
                            <Chart
                                totalIncome={incomes.map((income) => income.amount)}
                                totalExpenses={expenses.map((expense) => expense.amount)}
                            />
                        )}
                        {selectedChart === 'bar' && (
                            <CategoryChart expenses={safeExpenses} budgets={safeBudgets} />
                        )}

                        <div className="report-selection">
                            <label>Select Month:</label>
                            <select onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i}>
                                        {new Date(2025, i).toLocaleString("default", { month: "long" })}
                                    </option>
                                ))}
                            </select>

                            <label>Select Year:</label>
                            <select onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                                {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            {profile?.plan === 'premium' ? (

                            <button onClick={() => generateReport(selectedMonth, selectedYear)}>
                                Generate Report
                            </button>
                    ) : (
                        <button disabled title="Upgrade to Premium to access this feature">
                          Premium Only
                        </button>
                      )}

                      </div>
                        {notifications.length > 0 && (
                        <div className="notifications">
                            <h3>⚠ Budget Alerts:</h3>
                            {notifications.slice().reverse().slice(0, 3).map((note, index) => (
                                <p key={index}>{note.message}</p>
                            ))}
                        </div>
                    )}

                        <button className="my-info-btn" onClick={handleShowInfo}>
                            More Info
                        </button>

                        {showInfo && (
                            <div className="dashboard">
                                <div className="card-container">
                                        <div className="card income">
                                            <h2>💰 Total Income</h2>
                                            <p>${totalIncome()}</p>
                                        </div>
                                        <div className="card expense">
                                            <h2>📉 Total Expense</h2>
                                            <p>${totalExpenses()}</p>
                                        </div>
                                        <div className="card balance">
                                            <h2>🔄 Total Balance</h2>
                                            <p>${totalBalance()}</p>
                                        </div>
                                        </div>

                                {/* <div className="min-max-container">
                                    <div className="salary">
                                        <div className="card min-max">
                                            <h3>⬇ Min Salary</h3>
                                            <p>${Math.min(...incomes.map(item => item.amount))}</p>
                                        </div>
                                        <div className="card min-max">
                                            <h3>⬆ Max Salary</h3>
                                            <p>${Math.max(...incomes.map(item => item.amount))}</p>
                                        </div>
                                    </div>
                                    <div className="expenses"> 
                                        <div className="card min-max">
                                            <h3>⬇ Min Expense</h3>
                                            <p>${Math.min(...expenses.map(item => item.amount))}</p>
                                        </div>
                                        <div className="card min-max">
                                            <h3>⬆ Max Expense</h3>
                                            <p>${Math.max(...expenses.map(item => item.amount))}</p>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        )}
                    </div>

                    <div className="history-con">
                        <History />
                        {/* <button className="chatbot-icon" onClick={toggleChatbot}>
                            <FaRobot className="chat-icon" />
                        </button> */}
                    </div>
                </div>

                {/* Chatbot Modal
                {isChatbotOpen && (
                    <div className="chatbot-modal">
                        <div className="chatbot-container">
                            <div className="chatbot-header">
                                <h3>Chatbot</h3>
                                <button className="close-btn" onClick={toggleChatbot}>X</button>
                            </div>
                            <div className="chatbot-messages">
                                {messages.map((message, index) => (
                                    <div key={index} className={message.sender}>
                                        <p>{message.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="chatbot-input">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={handleInputChange}
                                    placeholder="Ask me a question..."
                                />
                                <button onClick={sendMessage}>Send</button>
                            </div>
                        </div>
                        <div className="chatbot-overlay" onClick={toggleChatbot}></div>
                    </div>
                )} */}
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    /* Dashboard Container */
.dashboard {
    flex-direction: row;
    align-items: center;
    padding: 2rem;
}
     /* Month and Year Selection */
    .report-selection {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 1rem;
        background-color: #f4f4f4;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        margin-top: 2rem;
    }

    .report-selection label {
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
    }

    .report-selection select {
        padding: 0.7rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
        cursor: pointer;
        transition: border-color 0.3s ease;
    }

    .report-selection select:focus {
        border-color: rgb(96, 13, 119);
        outline: none;
    }

    .report-selection button {
        padding: 0.8rem 2rem;
        font-size: 1.2rem;
        font-weight: bold;
        color: #fff;
        background-color: rgb(96, 13, 119);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .report-selection button:hover {
        background-color: rgb(175, 125, 190);
        transform: scale(1.05);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .report-selection {
            flex-direction: column;
            align-items: stretch;
        }

        .report-selection select, .report-selection button {
            width: 100%;
        }
    }

/* Button Styles */
.my-info-btn {
    padding: 0.8rem 2rem;
    background-color: rgb(223, 214, 226);
    color: black;
    font-size: 1.2rem;
    font-weight: bolder;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
    margin-botton: 10px;
    transition: all 0.3s ease;
}

.my-info-btn:hover {
    background-color:rgb(175, 125, 190);
    transform: scale(1.05);
}

/* Heading Styles */
h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #333;
    text-align: center;
    margin-bottom: 2rem;
    position: relative;
}

h1::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: rgb(96, 13, 119);
}

/* Chart Selection */
.chart-selection {
    margin-top: 50px;
    margin-bottom: 20px;
}

.chart-selection label {
    font-size: 1.2rem;
    margin-right: 1rem;
}

.chart-selection select {
    font-size: 1rem;
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
}

/* Stats Container */
.stats-con {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2rem;
    background-color: rgb(255, 255, 255);
}

/* Chart Container */
.chart-con {
    background-color: rgb(223, 214, 226);
    margin-top: 60px;
    border: 2px solid rgb(96, 13, 119);
    border-radius: 15px;
    grid-column: 1 / 4;
    height: 287px;
}

/* Notifications */
.notifications {
    background-color: #ffebcc;
    border-left: 5px solid #ff9800;
    padding: 1rem;
    margin-top: 30px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    transition: all 0.3s ease-in-out;
    animation: fadeIn 0.5s ease-in-out;
}

.notifications h3 {
    color: #d84315;
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
}

.notifications p {
    background: #fff;
    padding: 0.7rem;
    border-radius: 5px;
    margin: 5px 0;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
}

.notifications p:hover {
    transform: scale(1.05);
    background-color: #ffe0b2;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dashboard {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    padding: 2rem;
}

.card {
    background: #fff;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
    min-width: 220px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-container {
  display: flex;
  gap: 1rem; /* optional: space between cards */
  justify-content: space-between; /* optional: controls spacing */
  flex-wrap: wrap; /* optional: wrap on small screens */
}

.card {
  flex: 1; /* allow equal width cards */
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.income { background: #e3fcef; color: #2a9d8f; flex-direction: row;}
.expense { background: #ffecec; color: #d62828; flex-direction: row; }
.balance { background: #eef3ff; color: #264653; flex-direction: row;}

.min-max-container {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 1rem;
}

.min-max {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    font-size: 1rem;
    text-align: center;
    min-width: 160px;
}

.salary {
    background:  rgb(223, 214, 226);
    margin-right: 10px;
}

.expenses {
    background:  rgb(223, 214, 226);
}

/* History Container */
.history-con {
    grid-column: 4 / -1;
}

.history-con h2 {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.salary-title {
    font-size: 1.2rem;
}

.salary-title span {
    font-size: 1.8rem;
}

.salary-item {
    background: #ffffff;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.salary-item p {
    font-weight: 600;
    font-size: 1.6rem;
}

/* Chatbot Icon */
.chatbot-icon {
    position: fixed;
    right: 20px;
    background-color: rgb(96, 13, 119);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.chatbot-icon .chat-icon {
    color: white;
    font-size: 1.8rem;
}

.chatbot-icon:hover {
    transform: scale(1.1);
    background-color: #5e0b77;
}
    

/* Responsive Design */
@media (max-width: 1024px) {
    .stats-con {
        grid-template-columns: repeat(3, 1fr);
    }

    .amount-con {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .stats-con {
        grid-template-columns: repeat(2, 1fr);
    }

    .amount-con {
        grid-template-columns: 1fr;
    }

    .history-con {
        grid-column: 1 / -1;
    }
}

@media (max-width: 480px) {
    .stats-con {
        grid-template-columns: 1fr;
    }

    .amount-con {
        grid-template-columns: 1fr;
    }

    .chatbot-icon {
        right: 10px;
        width: 40px;
        height: 40px;
    }
}
    /* Responsive Design */
@media (max-width: 1024px) {
    .stats-con {
        grid-template-columns: repeat(3, 1fr);
    }

    .amount-con {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .stats-con {
        grid-template-columns: repeat(2, 1fr);
    }

    .amount-con {
        grid-template-columns: 1fr;
    }

    .history-con {
        grid-column: 1 / -1;
    }
}

@media (max-width: 480px) {
    .stats-con {
        grid-template-columns: 1fr;
    }

    .amount-con {
        grid-template-columns: 1fr;
    }

    .chatbot-icon {
        right: 10px;
        width: 40px;
        height: 40px;
    }
        
}
    @media screen and (max-width: 768px) {
    .stats-con {
      flex-direction: column;
    }

    .dashboard .card-container {
      flex-direction: column;
      align-items: center;

      .card {
        width: 90%;
      }
    }

    .chart-selection,
    .report-selection {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media screen and (max-width: 480px) {
    .report-selection {
      select,
      button,
      label {
        width: 100%;
      }

      button {
        width: 100%;
      }
    }
  }`


export default Dashboard;