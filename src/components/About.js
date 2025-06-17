import React from "react";
import "./About.css";
import pic6 from "../assests/img/pic6.jpeg"; // Replace with the actual image path
import pic3 from "../assests/img/pic3.jpeg"; // Replace with the actual image path
import pic8 from "../assests/img/pic8.jpeg"; // Replace with the actual image path

const About = () => {
  return (
    <div className="about-section">
      <div className="about-content">
        <h1 className="about-title">About Us</h1>
        <p className="about-text">Welcome to ExpenseEase, your smart and intuitive expense and budget tracker designed to simplify easy finance management. 
        <br/>
        <h2 className="mission">Our Mission</h2>
        <p>Our mission is to provide a seamless and user-friendly platform that helps individuals and organizations track expenses, set budgets, and make informed financial decisions—all in one place.</p></p>
        <h2>Why Choose ExpenseEase?</h2>
        <p className="about-text">
        <b>Easy Expense Tracking:</b> Record and categorize expenses effortlessly.<br/>
        <b>Smart Budgeting:</b> Set budgets and get insights to stay on track.<br/>
        <b>Reports & Analytics:</b> Gain financial clarity with visual reports.<br/>
        <b>Secure & Accessible:</b> Your data is encrypted and accessible anytime, anywhere.<br/>
        </p>
        <h2>Get Started Today!</h2>
        <p className="about-text">
        Take control of your finances with ExpenseEase and experience stress-free money management. Sign up now and start tracking your expenses the smart way!
        </p>
      </div>

      <div className="about-image-grid">
        <div className="image-box">
          <img src={pic6} alt="Mosque" />
        </div>
        <div className="image-box">
          <img src={pic3} alt="Mosque" />
        </div>
        <div className="image-box">
          <img src={pic8} alt="Mosque" />
        </div>
      </div>
    </div>
  );
};

export default About;
