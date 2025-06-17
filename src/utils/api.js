import axios from "axios";

export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token"); // Ensure the token is in localStorage
    if (!token) throw new Error("No token found!");
  
    const config = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    };
    return axios(url, config);
  };
  