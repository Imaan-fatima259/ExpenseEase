import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import About from "./components/About";
import Features from "./components/Features";
import Dashboard from "./components/Dashboard/Dashboard";
import Income from "./components/Income/Income";
import Expenses from "./components/Expenses/Expenses";
import Profile from "./components/Profile/Profile";
import Orb from "./components/Orb/Orb";
import Navigation from "./components/Navigation/Navigation";
import bg from "./img/bg.png";
import { MainLayout } from "./styles/Layouts";
import { GlobalProvider, useGlobalContext } from "./context/globalContext";
import "./App.css"; // Add any global styles here
import Budget from "./components/Budget/Budget";
import Chatbot from "./components/Chatbot";
import { ToastContainer } from "react-toastify";
import ChatbotButton from "./components/ChatbotButton";
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import SavingGoal from "./components/SavingGoals/SavingGoal";
import PricingPage from "./pages/PricingPage";

import PremiumBanner from "./components/PremiumBanner"; // Add this import


// import loggo from './assests/img/logo.png';

const Navbar = ({ isHidden }) => (
  <nav className={`navbar ${isHidden ? "hidden" : ""}`}>
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/features">Features</Link>
      </li>
    </ul>
  </nav>
);

const Header = ({ isHidden }) => (
  <header className={`header ${isHidden ? "hidden" : ""}`}>
    <div className="logo-heading">
      <div className="logo-container">
        <img
          src={require("./assests/img/loggo.png")}
          alt="App Logo"
          className="logo"
        />
      </div>
      <h1 className="heading-text">ExpenseEase: Smart Finance Management</h1>
    </div>
    <div className="cta-buttons">
      <Link to="/signup" className="btn">
        Sign Up
      </Link>
      <Link to="/login" className="btn">
        Log In
      </Link>
    </div>
  </header>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  // Define routes where the Chatbot button should be hidden
  const hideChatbotRoutes = ["/", "/about", "/features"];

  // Check if the current route is in the hideChatbotRoutes list
  const isChatbotHidden = hideChatbotRoutes.includes(location.pathname);
  // Only hide header and navbar on login, signup, and dashboard routes
  const isAuthOrDashboardRoute =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/dashboard";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div>
      {!isAuthOrDashboardRoute && <Header isHidden={isHidden} />}
      {!isAuthOrDashboardRoute && <Navbar isHidden={isHidden} />}
      {children}
      {!isChatbotHidden && <ChatbotButton />}
    </div>
  );
};

const AppContent = () => {
  const [active, setActive] = useState(1);

  const [user, setUser] = useState({
    name: "Iriana Saliha",
    email: "iriana123@gmail.com",
    profileImage: "https://via.placeholder.com/150", // Default profile image
  });
  // Update user data, including profile image
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const global = useGlobalContext();
  console.log(global);

    const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Budget />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      case 5:
        return <Profile />;
      case 6:
        return <SavingGoal />;
      default:
        return <Dashboard />;
    }
  };

  const orbMemo = useMemo(() => <Orb />, []);

  return (
    <AppStyled bg={bg} className="App">
      <PremiumBanner />
      <ToastContainer position="top-right" autoClose={3000} />
      {orbMemo}
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main className="abcd">{displayData()}</main>
      </MainLayout>
    </AppStyled>
  );
};

const App = () => {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route
            path="/features"
            element={
              <Layout>
                <Features />
              </Layout>
            }
          />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/pricing" element={<PricingPage />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <AppContent />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </GlobalProvider>
  );
};

const AppStyled = styled.div`
  height: 100vh;
  background-color: rgb(222, 198, 229);
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 5px solid rgb(222, 198, 229);
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;