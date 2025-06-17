import React, { useState, useEffect } from "react";
import styled from "styled-components";
import avatar from '../../assests/img/avatar.png'
import { menuItems } from "../../utils/menuItems";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../context/globalContext";

function Navigation({ active, setActive }) {
  const { profile, getProfile, totalIncome} = useGlobalContext();
  const [userName, setUserName] = useState("Guest");
  const [profileImage, setProfileImage] = useState();

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setUserName(profile.name || "Guest");
      setProfileImage(
        profile.profilePicture
          ? profile.profilePicture.startsWith("http") 
            ? profile.profilePicture // Direct URL (e.g., Gravatar, social media)
            : `http://localhost:5000/uploads/${profile.profilePicture}?${new Date().getTime()}`
          : avatar
      );
    }
  }, [profile]);

  const handleAvatarClick = () => {
    setActive(5);
  };

  return (
    <NavStyled>
      <div className="user-con">
        <Link to="/dashboard" className="avatar-link" onClick={handleAvatarClick}>
        <img src={profileImage} alt="User Avatar" />
        </Link>
        <div className="text">
          <h2>{userName}</h2>
          <p>{totalIncome()}</p>
        </div>
      </div>
      <ul className="menu-items">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActive(item.id)}
            className={active === item.id ? "active" : ""}
          >
            {item.icon}
            <span>{item.title}</span>
          </li>
        ))}
      </ul>
      {/* <div className="bottom-nav">
        <Link onClick={handleLogout}>
          <li style={{ listStyle: "none" }}>
            {signout} Sign Out
          </li>
        </Link>
      </div> */}
    </NavStyled>
  );
}

const NavStyled = styled.nav`
  padding: 2rem 1.5rem;
  width: 374px;
  height: 100%;
  background: #ffffff;
  border: 3px solid #FFFFFF;
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;

  .user-con {
    height: 100px;
    display: flex;
    align-items: center;
    gap: 1rem;

    .avatar-link {
      display: inline-block;
      &:hover img {
        transform: scale(1.1);
        transition: transform 0.3s ease;
      }
    }

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      background: #fcf6f9;
      border: 2px solid #FFFFFF;
      padding: .2rem;
      box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
      cursor: pointer;
    }

    h2 {
      color: rgba(34, 34, 96, 1);
    }

    p {
      color: rgba(34, 34, 96, .6);
    }
  }

  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    li {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.4s ease-in-out;
      color: rgba(34, 34, 96, .6);
      background: #f8f8f8;
      border: 2px solid #ccc;
      border-radius: 8px;
      list-style: none;
      position: relative;

      &:hover {
        background:rgb(223, 214, 226);
      }
    }
  }

  .active {
    background: rgb(223, 214, 226) !important;
    color: white !important;
  }

  .bottom-nav {
    li {
      padding: 1rem;
      font-weight: bold;
      cursor: pointer;
      background:  rgb(184, 163, 190);
      color: white;
      text-align: center;
      border-radius: 8px;
      transition: background 0.3s;
    }
  }
    /* Media queries for responsiveness */

  /* Tablets and smaller desktops */
  @media (max-width: 1024px) {
    width: 280px;

    .user-con {
      img {
        width: 60px;
        height: 60px;
      }
      h2 {
        font-size: 1.1rem;
      }
      p {
        font-size: 0.9rem;
      }
    }

    .menu-items li {
      padding: 0.8rem;
      font-size: 0.9rem;
      gap: 0.7rem;
    }
  }

  /* Mobile devices */
  @media (max-width: 800px) {
    width: 100%;
    height: auto;
    padding: 1rem;
    border-radius: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #fff;
    border-top: 3px solid #fff;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;

    .user-con {
      display: none; /* Hide user info to save space */
    }

    .menu-items {
      flex-direction: row;
      flex-wrap: nowrap;
      overflow-x: auto;
      gap: 0.5rem;
      flex: 1;

      li {
        flex: 0 0 auto;
        padding: 0.5rem 0.7rem;
        font-size: 0.85rem;
        border-radius: 10px;
        justify-content: center;
        gap: 0.3rem;

        svg {
          font-size: 1.3rem; /* Assuming icons are svg */
        }

        span {
          display: none; /* Hide text on very small screens */
        }
      }
    }
  }
`;

export default Navigation;