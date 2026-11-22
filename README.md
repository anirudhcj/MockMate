# MockMate — AI-Powered Mock Interview Platform

MockMate is a full-stack technical and HR interview preparation platform built with the MERN stack and Google Gemini AI. Users can configure custom mock interviews by topic, difficulty, and question count, submit structured responses, and receive instant AI-evaluated feedback and performance analytics.

## Features

- **Customizable Mock Interviews:** Practice across 10 core domains (**JavaScript, React.js, Node.js, MongoDB, HTML & CSS, DBMS, Operating Systems, Computer Networks, Data Structures & Algorithms, and HR Interview**) with Beginner, Intermediate, and Advanced difficulty levels.
- **Flexible Session Lengths:** Choose between 5-question and 10-question interview sessions with automatic question top-up from the question bank.
- **Voice Assistance (Speech-to-Text & Text-to-Speech):** Dictate answers hands-free using the browser Web Speech API (`Speak Answer`) and listen to questions read aloud (`Listen`).
- **AI Answer Evaluation:** Powered by **Google Gemini (`gemini-2.5-flash`)** to score responses against ideal answers and key technical concepts.
- **Performance Analytics & History:** Track overall readiness, average scores, category-wise breakdowns, and past interview sessions.
- **Secure Authentication:** JWT-based user registration and login flow.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT)
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)

## Project Structure

- `client/` — React + Vite frontend (`components/`, `pages/`, `services/`, `vite.config.js`)
- `server/` — Node.js + Express backend (`config/`, `controllers/`, `middleware/`, `models/`, `routes/`, `seed/`, `services/`, `server.js`)

## Local Setup & Installation

### 1. Clone the Repository
    git clone [https://github.com/anirudhcj7-acj/MockMate.git](https://github.com/anirudhcj7-acj/MockMate.git)
    cd MockMate

### 2. Configure the Backend (`server`)
    cd server
    npm install

Create a `.env` file inside `server/` (see `server/.env.example`):

    PORT=5000
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_jwt_secret_key
    GEMINI_API_KEY=your_google_gemini_api_key

Seed the 100 interview questions into MongoDB and start the backend server:

    node seed/seedQuestions.js
    npm start

The API server runs on `http://localhost:5000`.

### 3. Configure & Run the Frontend (`client`)
Open a new terminal tab:

    cd client
    npm install
    npm run dev

Open `http://localhost:5173` in your browser.
