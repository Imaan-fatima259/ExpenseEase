const express = require("express");
const axios = require("axios");

const router = express.Router();

// POST request to interact with Flask API (chatbot)
router.post("/get-advice", async (req, res) => {
    try {
        const userQuestion = req.body.question;

        // Call the Flask chatbot API
        const response = await axios.post("http://127.0.0.1:5000/get-advice", { question: userQuestion });

        res.json(response.data); // Return the response to the frontend
    } catch (error) {
        console.error("Error calling chatbot API:", error);
        res.status(500).json({ error: "Failed to get financial advice" });
    }
});

module.exports = router;