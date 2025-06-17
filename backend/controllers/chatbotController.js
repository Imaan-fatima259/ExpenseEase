import { pipeline } from "node_modules/@tensorflow/tfjs-node"; 
import { SentenceTransformer, util } from "sentence-transformers";
import fs from "fs";

// Load the QA pipeline model
const qa_pipeline = pipeline("question-answering", {
    model: "distilbert-base-cased-distilled-squad",
});

// Load the embedding model for semantic similarity
const embedder = new SentenceTransformer("all-MiniLM-L6-v2");

// Load the knowledge base JSON file
const knowledgeBase = JSON.parse(fs.readFileSync("./data/knowledgeBase.json", "utf-8"));

export const getFinancialAdvice = async (req, res) => {
    try {
        const { question } = req.body;

        // Embed the user question
        const userQuestionEmbedding = embedder.encode(question);

        // Find the best matching question
        let bestMatch = null;
        let maxSimilarity = -1;

        for (let key of Object.keys(knowledgeBase)) {
            let keyEmbedding = embedder.encode(key);
            let similarity = util.pytorch_cos_sim(userQuestionEmbedding, keyEmbedding).item();

            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                bestMatch = key;
            }
        }

        if (bestMatch && maxSimilarity > 0.7) {
            const context = knowledgeBase[bestMatch];
            const response = await qa_pipeline({ question, context });
            return res.json({ answer: response.answer });
        }

        return res.json({ answer: "Sorry, I couldn't find an answer. Try rephrasing." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};