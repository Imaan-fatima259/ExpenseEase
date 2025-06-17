import React from "react";
import "./Home.css";
import myImage from '../assests/img/goals.png'; // Adjust the path based on your folder structure
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="section-content">
      <div class="first">
        <div className="section1">
        <h1>Spend Wisely, Save Easily.</h1>
        <p class="hero_subhead">
          <strong>
          Experience the freedom of guilt-free spending and seamless saving
          with our innovative, flexible financial management solution.{" "}
          </strong>{" "}
        </p>
        </div>
        <img src="https://img.freepik.com/premium-vector/vector-illustration-about-concept-accounting-financial-reporting-report-preparation_675567-6861.jpg?ga=GA1.1.1552930351.1738427640&semt=ais_hybrid"
        alt=""/>
      </div>

      <section className="card-section">
      <h2 className="animated-heading">Goals of Our Website</h2>
        <div className="card-row">
         <div class="card_flip-container goal-card">
            <div class="card_flip-wrapper">
              <div className="card_simple is-dandelion">
                <div className="card_simple-number is-dandelion">
                  <span className="card_simple-number-text">1</span>
                </div>
                <h3 className="heading-style-h4">Track your expenses</h3>
              </div>
              <div className="card_simple is-dandelion is-back">
                <img
                  src="https://img.freepik.com/premium-vector/growing-cash-graph_102902-2208.jpg?ga=GA1.1.47587542.1722853452&semt=sph"
                  loading="lazy"
                  alt=""
                  className="card_simple_icon_image"
                />
                <div className="padding-top padding-small">
                  Easily track and categorize your expenses to manage your
                  budget effectively.
                </div>
              </div>
            </div>
          </div>
          <div className="card_flip-container">
            <div className="card_flip-wrapper">
              <div className="card_simple is-dandelion">
                <div className="card_simple-number is-dandelion">
                  <span className="card_simple-number-text">2</span>
                </div>
                <h3 className="heading-style-h4">Set Financial Goals</h3>
              </div>
              <div className="card_simple is-dandelion is-back">
                <img
                  src={myImage}
                  loading="lazy"
                  alt=""
                  className="card_simple_icon_image"
                />
                <div className="padding-top padding-small">
                  Set and achieve your financial goals with our goal-setting
                  features.
                </div>
              </div>
            </div>
          </div>
          <div className="card_flip-container">
            <div className="card_flip-wrapper">
              <div className="card_simple is-dandelion">
                <div className="card_simple-number is-dandelion">
                  <span className="card_simple-number-text">3</span>
                </div>
                <h3 className="heading-style-h4">Analyze Spending</h3>
              </div>
              <div className="card_simple is-dandelion is-back">
                <img
                  src="https://img.freepik.com/free-vector/stack-money-gold-coins-3d-cartoon-style-icon-coins-with-dollar-sign-wad-cash-currency-flat-vector-illustration-wealth-investment-success-savings-economy-profit-concept_74855-26108.jpg?size=626&ext=jpg&ga=GA1.1.47587542.1722853452&semt=sph"
                  loading="lazy"
                  alt=""
                  className="card_simple_icon_image"
                />
                <div className="padding-top padding-small">
                  Get detailed reports and visualizations to understand your
                  spending habits.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
