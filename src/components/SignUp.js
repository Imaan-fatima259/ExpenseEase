import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loggo from "../assests/img/loggo.png";
import capture2 from "../assests/img/capture2.PNG";
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LogIn.css";

const SignUp = () => {
  const [name, setName] = useState(""); // Added name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !name || !password || !confirmPassword) {
      setError("Please fill all the fields....");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }
    if (!email || !name) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/signup", {
        name, // Include name in the request payload
        email,
        password,
      });
      console.log("User signed up successfully!", response.data);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          response,
        })
      );
      if (response.data.success) {
        navigate("/login");
      } else {
        setError(response.data.message || "Signup failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Section */}
      <div style={styles.leftSection}>
        <div style={styles.circle}></div>
        <div style={styles.textWithImage}>
          <div style={styles.textContainer}>
            <h2>Your journey to financial freedom begins here</h2>
          </div>
          <img src={capture2} alt="Woman with Tablet" style={styles.image} />
        </div>
      </div>

      {/* Right Section - Signup Form */}
      <div style={styles.rightSection}>
        <div style={styles.formContainer}>
          <img src={loggo} alt="Expense Ease Logo" style={styles.logo} />
          <h3>EXPENSE EASE</h3>
          <p>SMART FINANCE MANAGER</p>
          <input
            type="text"
            name="name"
            placeholder="Name"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input
            type="email"
            name="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
          <button onClick={handleSubmit} style={styles.signInButton}>
            Sign up
          </button>

          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#D6E4FF",
  },
  leftSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF3FF",
    position: "relative",
    padding: "20px",
  },
  circle: {
    position: "absolute",
    width: "300px",
    height: "300px",
    backgroundColor: "#2B3A67",
    borderRadius: "50%",
    bottom: "-10%",
    left: "-10%",
  },
  textWithImage: {
    display: "flex",
    alignItems: "center", // Vertically center-aligns text and image
  },
  textContainer: {
    width: "55%",
    backgroundColor: "#EFF3FF",
    padding: "40px",
    // border: "2px solid #2B3A67",
    borderRadius: "10px",
    textAlign: "center",
    zIndex: 2,
  },
  image: {
    margin: "0px",
    width: "300px", // Updated size
    height: "300px", // Updated size
    objectFit: "cover", // Keeps aspect ratio and covers the area
    borderRadius: "50%", // Circular border
    border: "5px solid transparent", // Transparent border
    animation: "glow 2s infinite alternate", // Animation for glow
    zIndex: 1, // Placed under the text container
  },

  rightSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "60%",
    backgroundColor: "#F0F4FF",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    width: "100px",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  signInButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1D2D50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "10px 0",
  },
  googleButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "5px",
    color: "black",
    cursor: "pointer",
  },
};

export default SignUp;