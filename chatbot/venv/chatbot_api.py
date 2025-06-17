from flask import Flask, request, jsonify
from flask_cors import CORS  
import json
from transformers import pipeline
from pymongo import MongoClient
from bson import ObjectId  
from textblob import TextBlob  
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)

# Load QA pipeline
qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")

# Load SBERT model for semantic similarity
sbert_model = SentenceTransformer('all-MiniLM-L6-v2')

# Connect to MongoDB
client = MongoClient("mongodb+srv://alisha:K0gR78dHQEKk556P@cluster0.cpbon.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["test"]  

users_collection = db["users"]
budgets_collection = db["budgets"]
expenses_collection = db["expenses"]
income_collection = db["incomes"]

# Load dataset
def load_knowledge_base():
    file_path = 'dataset.json'  
    with open(file_path, 'r') as f:
        dataset = json.load(f)
    return dataset

knowledge_dataset = load_knowledge_base()
questions = [item['question'] for item in knowledge_dataset]
answers = [item['answer'] for item in knowledge_dataset]

# Pre-compute SBERT embeddings
question_embeddings = sbert_model.encode(questions, convert_to_tensor=True)

# Financial advice logic
def get_financial_advice(user_question):
    # Check for exact match first
    for i, q in enumerate(questions):
        if user_question.strip().lower() == q.strip().lower():
            return answers[i]

    # Semantic similarity using SBERT
    user_embedding = sbert_model.encode(user_question, convert_to_tensor=True)
    similarities = util.pytorch_cos_sim(user_embedding, question_embeddings)[0]
    best_match_index = int(similarities.argmax())
    best_score = float(similarities[best_match_index])

    if best_score >= 0.6:
        return answers[best_match_index]
    else:
        return "I'm sorry, I couldn't find an answer."

# Sentiment analysis
def analyze_sentiment(text):
    sentiment = TextBlob(text).sentiment.polarity
    if sentiment < -0.05:
        return "😞 I sense some frustration. I'm here to help!"
    elif sentiment > 0.05:
        return "😊 I'm glad you're feeling positive!"
    else:
        return "😐 It seems like your query is neutral, with no specific sentiment."

# Budget advice generation
def generate_budget_advice(user_id):
    user_id = ObjectId(user_id)
    incomes = list(income_collection.find({"userId": user_id}))
    expenses = list(expenses_collection.find({"userId": user_id}))

    if not incomes or not expenses:
        return "You haven't set an income or added any expenses. Start by setting up your budget to get financial advice!"

    total_income = sum(inc["amount"] for inc in incomes)
    total_expense = sum(exp["amount"] for exp in expenses)

    category_expenses = {}
    for exp in expenses:
        category_expenses[exp["category"]] = category_expenses.get(exp["category"], 0) + exp["amount"]

    highest_category = max(category_expenses, key=category_expenses.get, default="General")
    highest_expense = category_expenses.get(highest_category, 0)

    if total_income - total_expense < 1000:
        advice = f"⚠️ You've exceeded your budget by {total_income - total_expense}. Try reducing spending on *{highest_category}*, which currently costs you {highest_expense}."
    elif total_income - total_expense < 2000:
        advice = f"🚨 You're nearing your budget limit ({total_income - total_expense}). Consider adjusting your spending on *{highest_category}*, which is your highest expense."
    else:
        advice = "✅ Your spending is within budget. Keep up the great financial habits!"

    return advice

# Flask API endpoints
@app.route('/get-advice', methods=['POST'])
def get_advice():
    data = request.get_json()
    user_question = data.get('question', '')

    if not user_question:
        return jsonify({"error": "No question provided"}), 400

    answer = get_financial_advice(user_question)
    sentiment_response = analyze_sentiment(user_question)
    return jsonify({"answer": answer, "sentiment": sentiment_response})

@app.route('/get-budget-advice', methods=['POST'])
def budget_advice():
    data = request.get_json()
    user_email = data.get("email")

    user = users_collection.find_one({"email": user_email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_id = str(user["_id"])
    advice = generate_budget_advice(user_id)

    return jsonify({"advice": advice})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
