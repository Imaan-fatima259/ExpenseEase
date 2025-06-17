import React from "react";
import "./Features.css";
import first from "../assests/img/first.jpeg";
import sec from "../assests/img/sec.png";
import third from "../assests/img/third.jpeg";

const features = [
  {
    title: "Managing budget and Expenses",
    description:
      "Easily manage your finances by tracking your expenses and setting up a budget plan.",
    image: third,
  },
  {
    title: "Interactive and Simple Design",
    description:
      "Enjoy a seamless user experience with our intuitive and interactive interface.",
    image: first, 
  },
  {
    title: "Financial Advice Chatbot",
    description:
      "Get personalized financial advice in real-time with our intelligent chatbot.",
    image: sec, 
  },
];

const Features = () => {
  return (
    <section className="features-section">
      <h2 className="features-subtitle">FEATURES</h2>
      <h1 className="features-title">Our Features & Services.</h1>
      <div className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <img src={feature.image} alt={feature.title} className="feature-image" />
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
