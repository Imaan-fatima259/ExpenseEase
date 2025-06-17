import React from 'react';
import { Link } from 'react-router-dom';
import "./Sidebar.css"; // Create a CSS file for styling the sidebar

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>ExpenseEase</h2>
      <ul className="sidebar-menu">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/expense-tracking">Expense Tracking</Link></li>
        <li><Link to="/budget-management">Budget Management</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
