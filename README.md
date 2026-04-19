# FitCheck – Health & Wellness Tracker

FitCheck is a web application built with Node.js, Express, EJS and MySQL that allows users to track daily health habits including sleep, hydration, mood, nutrition and physical activity. The app differentiates between common and PRO users, offering exclusive features for those who want to go further.

---

## Features

### General
- User registration and login
- Profile creation with age, height and weight
- Automatic BMI calculation with personalized feedback
- Daily tracking of sleep, water intake, mood, nutrition and physical activity
- Record lookup by date
- Dashboard with summary, feedback and quick actions

### AI-Powered Analysis (PRO)
PRO users can request a personalized weekly health analysis powered by the Groq API (Llama 3.3). The system sends the last 7 days of habit data to the AI model, which cross-references all variables and returns personalized suggestions in Portuguese.

### User Permissions

| Feature                  | Common | PRO |
|--------------------------|:------:|:---:|
| Create Profile           | Yes    | Yes |
| Edit Profile             | No     | Yes |
| View History             | No     | Yes |
| Up to 3 Records          | Yes    | Yes |
| Unlimited Records        | No     | Yes |
| Wellness Goals           | No     | Yes |
| AI Weekly Analysis       | No     | Yes |

---

## Tech Stack

- Node.js
- Express.js
- EJS
- MySQL with Sequelize ORM
- Groq API (Llama 3.3) for AI analysis
- express-session for authentication
- bcrypt for password hashing

---

## Installation

### Requirements
- Node.js LTS
- MySQL Server or MariaDB
- Groq API key (free tier available at console.groq.com)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/EversonRubira/FitCheck.git
cd FitCheck
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
