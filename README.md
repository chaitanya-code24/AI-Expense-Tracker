# 💸 AI-Powered Expense Tracker

An advanced expense tracking system powered by LLMs and vector databases. Easily track your spending, upload bills, and interact with your data through a smart chatbot.

## 🚀 Features

- 💬 **AI Chatbot** – Chat with your expenses: Ask “What did I spend on food last week?” or add expenses like “I spent ₹300 on groceries.”
- 📸 **Bill Photo Upload** – Upload receipts and auto-extract expense data using LLMs.
- 🧠 **Auto Categorization** – Detect expense categories intelligently.
- 🗃️ **Vector Memory** – Each expense is embedded and stored in Pinecone for semantic retrieval.
- 🔐 **Authentication** – Login with Google or email (Firebase Auth).
- 🌐 **Deployed** – Live on Vercel (Frontend) and Render (Backend).

---

## 🧱 Tech Stack

| Layer        | Tech                                 |
|--------------|--------------------------------------|
| Frontend     | Next.js (App Router), Tailwind CSS   |
| Backend      | FastAPI                              |
| Database     | MongoDB                              |
| AI/LLM       | Groq API + LLaMA Models              |
| Embedding    | Pinecone       |
| Auth         | Firebase Authentication              |
| Deployment   | Vercel (Frontend), Render (Backend)  |

---

## 🛠️ Setup Instructions
## 🔗 Related Repositories

- **🔙 Backend Repo:** [AI Expense Tracker – FastAPI Backend](https://github.com/chaitanya-code24/backend_expense-tracker)

### Clone the repo

```bash
# Clone the frontend repo
git clone https://github.com/your-username/AI-expense-tracker.git
cd AI-expense-tracker

# Install dependencies
npm install

# Run the development server
npm run dev
