# 🧠 LearnMate AI – Google Gemini Powered Learning Assistant

> An AI-powered learning assistant designed to help students learn, practice, organize notes, generate quizzes, and track their academic progress using Google Gemini AI.

---

## 📌 Project Overview

**LearnMate AI** is a web-based intelligent learning assistant developed for students.

The system integrates **Google Gemini AI** with a **Flask backend**, **SQLite database**, and a modern responsive frontend.

Students can interact with an AI tutor, ask questions about academic subjects, generate quizzes, summarize notes, create study plans, and monitor their learning progress.

The goal of the project is to provide students with a personalized and interactive learning environment available through a single web application.

---

## 🎯 Objectives

* Provide students with an AI-powered personal tutor.
* Explain difficult academic concepts in simple language.
* Generate subject-specific quizzes using AI.
* Allow students to create and manage study notes.
* Automatically summarize and improve notes.
* Generate personalized study plans.
* Track quiz performance and learning progress.
* Store learning data securely using SQLite.
* Provide a responsive and user-friendly interface.

---

## ✨ Features

### 🤖 AI Tutor

Students can ask questions and receive AI-generated explanations.

Examples:

* Explain a concept.
* Give examples.
* Summarize a topic.
* Explain step-by-step.
* Generate practice questions.
* Provide exam-oriented answers.

---

### 📚 Subject Learning

The application supports multiple academic subjects, including:

* C Programming
* Java
* Python
* Data Structures
* Operating Systems
* Computer Networks
* Database Management Systems
* Mathematics
* Artificial Intelligence
* Machine Learning

Additional subjects can be added easily.

---

### 🧩 AI Quiz Generator

Students can generate quizzes based on:

* Subject
* Topic
* Difficulty
* Number of questions

The system displays questions with multiple-choice options and calculates the final score.

Quiz results are stored in the database for progress tracking.

---

### 📝 Smart Notes

Students can:

* Create notes
* Edit notes
* Delete notes
* Search notes
* Organize notes by subject
* Save notes to SQLite

AI-powered options include:

* Summarize notes
* Improve notes
* Convert notes into structured points

---

### 📅 AI Study Planner

Students can provide:

* Subjects
* Exam date
* Available study hours
* Difficult subjects
* Preferred study schedule

Gemini generates a personalized study plan.

---

### 📊 Progress Tracking

The dashboard displays:

* Overall learning progress
* Quiz accuracy
* Completed lessons
* Total quizzes
* Correct answers
* Study time
* Learning streak
* Subject-wise progress

---

### 👤 User Authentication

The application provides:

* User registration
* Login
* Logout
* Password hashing
* Session management

Each student's learning information is associated with their account.

---

## 🛠️ Technology Stack

| Technology        | Purpose                 |
| ----------------- | ----------------------- |
| HTML5             | Frontend structure      |
| CSS3              | UI design               |
| JavaScript        | Frontend interaction    |
| Python            | Backend programming     |
| Flask             | Web framework           |
| Google Gemini API | Artificial Intelligence |
| SQLite            | Database                |
| VS Code           | Development environment |
| Git/GitHub        | Version control         |

---

## 🏗️ System Architecture

```text
                ┌──────────────────────┐
                │      Student         │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   LearnMate Web UI   │
                │ HTML + CSS + JS      │
                └──────────┬───────────┘
                           │
                           │ HTTP Requests
                           ▼
                ┌──────────────────────┐
                │    Flask Backend     │
                │      Python          │
                └───────┬───────┬──────┘
                        │       │
              ┌─────────┘       └─────────┐
              ▼                           ▼
     ┌─────────────────┐        ┌─────────────────┐
     │ Google Gemini   │        │ SQLite Database │
     │      API        │        │                 │
     └────────┬────────┘        └─────────────────┘
              │
              ▼
     ┌─────────────────┐
     │ AI Response     │
     └────────┬────────┘
              │
              ▼
        Student UI
```

---

## 📂 Project Structure

```text
learnmate-ai/
│
├── app.py
├── requirements.txt
├── .env
├── .env.example
├── .gitignore
│
├── database/
│   └── learning.db
│
├── services/
│   └── gemini_service.py
│
├── models/
│   └── database.py
│
├── routes/
│   ├── auth.py
│   ├── chat.py
│   ├── quiz.py
│   ├── notes.py
│   └── study.py
│
├── templates/
│   ├── index.html
│   ├── login.html
│   └── register.html
│
└── static/
    ├── css/
    │   └── style.css
    │
    └── js/
        └── script.js
```

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/learnmate-ai.git
```

Move into the project directory:

```bash
cd learnmate-ai
```

---

## 2. Create a Virtual Environment

### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
```

```bash
source venv/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure Gemini API

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_secret_key_here
```

Do **not** upload `.env` to GitHub.

---

## 5. Initialize the Database

Run:

```bash
python app.py
```

The application should create the required SQLite database and tables.

---

## 6. Start the Application

```bash
python app.py
```

Open the application in your browser:

```text
http://127.0.0.1:5000
```

---

# 🔑 Environment Variables

| Variable         | Description                |
| ---------------- | -------------------------- |
| `GEMINI_API_KEY` | Google Gemini API key      |
| `SECRET_KEY`     | Flask session security key |

Example:

```env
GEMINI_API_KEY=your_api_key
SECRET_KEY=change_this_secret_key
```

---

# 🗄️ Database

LearnMate AI uses SQLite.

### Users

```text
id
name
email
password_hash
created_at
```

### Chats

```text
id
user_id
subject
user_message
ai_response
created_at
```

### Notes

```text
id
user_id
title
subject
content
created_at
updated_at
```

### Quizzes

```text
id
user_id
subject
topic
score
total_questions
created_at
```

### Study Plans

```text
id
user_id
subject
task
study_date
completed
```

---

# 🔌 API Endpoints

## AI Chat

```http
POST /api/chat
```

Example request:

```json
{
    "message": "Explain deadlock in operating systems",
    "subject": "Operating Systems"
}
```

---

## Quiz Generation

```http
POST /api/quiz
```

Example:

```json
{
    "subject": "Java",
    "topic": "Inheritance",
    "difficulty": "medium",
    "questions": 5
}
```

---

## Note Summarization

```http
POST /api/summarize
```

---

## Study Plan

```http
POST /api/study-plan
```

---

# 🔐 Security

The application follows basic security practices:

* Gemini API key stored in environment variables.
* Passwords stored using hashing.
* SQL queries use parameterized statements.
* User sessions are protected using Flask sessions.
* User input is validated.
* `.env` is excluded from Git.
* API credentials are never exposed in frontend JavaScript.

---

# 🎨 UI Design

LearnMate AI uses a modern student-focused interface.

### Design characteristics

* Responsive dashboard
* Sidebar navigation
* AI chat interface
* Rounded cards
* Progress bars
* Subject cards
* Quiz interface
* Notes editor
* Mobile-friendly layout
* Gemini-inspired purple/blue theme

---

# 🔄 Application Workflow

```text
             Register / Login
                    │
                    ▼
              Student Dashboard
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
    AI Tutor      Subjects      Notes
       │            │            │
       └────────────┼────────────┘
                    ▼
              Gemini AI
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
    Explain       Quiz        Study Plan
       │            │            │
       └────────────┼────────────┘
                    ▼
               SQLite DB
                    │
                    ▼
              Progress Report
```

---

# 💡 Example AI Interaction

### Student

```text
Explain recursion in C with a simple example.
```

### LearnMate AI

```text
Recursion is a programming technique where a function
calls itself to solve a smaller version of the same problem.

Example:

int factorial(int n)
{
    if(n == 0)
        return 1;

    return n * factorial(n - 1);
}
```

The AI can additionally provide:

* Simple explanation
* Step-by-step execution
* Example
* Practice questions
* Quiz

---

# 📈 Future Enhancements

Possible future improvements include:

* 🎤 Voice-based AI tutor
* 📄 PDF/document question answering
* 📷 Image-based question solving
* 🌐 Multi-language learning
* 📱 Progressive Web App
* 🔔 Study reminders
* 🏆 Gamification and badges
* 👨‍🏫 Teacher dashboard
* 📊 Advanced analytics
* 🎯 Personalized learning recommendations
* 🧠 AI-powered weak-topic detection

---

# 🎓 Academic Use

This project demonstrates the integration of:

* Artificial Intelligence
* Generative AI
* Web Development
* REST APIs
* Database Management
* Python Flask
* Natural Language Processing
* User Authentication
* Data Visualization

It can be used as a **college mini project, major project, hackathon project, or AI-based academic project**.

---
`https://sudhan2011.vercel.app/`

# 👨‍💻 Developer's
--sudharshan .s(Team leader)
--perarasu .s
--naveen kumar .s
--susiendar.s
--vairavel .m

**Project:** LearnMate AI
**Category:** Artificial Intelligence / EdTech
**Backend:** Python Flask
**AI:** Google Gemini
**Database:** SQLite

---

# 📜 License

This project is intended for educational and academic purposes.

You may modify and extend the project according to your requirements.
