# CareerPath Recommender 🎓

> **Bridging the career guidance gap for millions of students in Tier 2 and Tier 3 cities.**

CareerPath is a data-driven web platform built for Innovathon 2026. It provides personalized career recommendations, actionable learning roadmaps, and free curated resources tailored specifically for students who lack access to professional career counseling.

## 🚀 Features

- **Smart Matching Engine**: A weighted Node.js algorithm matches students to careers based on 15 constraint-aware factors (budget, internet speed, interests, etc.).
- **Interactive Quiz**: A seamless, state-preserved 5-step quiz to gather student profiles.
- **Career Comparison**: Side-by-side analysis of job demand, salaries (in INR), and opportunities.
- **Resource Hub**: A fully filterable database of 100% free learning resources (Coursera, freeCodeCamp, etc.).
- **Dynamic Actionable Roadmaps**: Granular 6-month, 1-year, and 2-year skill-building roadmaps for every career.
- **Light/Dark Mode**: Built-in persistence for comfortable viewing.
- **Vanilla CSS Design System**: Ultra-fast, lightweight UI designed for slower connections—zero heavy component libraries.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Custom Vanilla CSS (Design System)
- **Backend**: Node.js, Express.js
- **Database**: Portable JSON Document Store
- **Architecture**: Decoupled Client-Server

## 🚦 Getting Started

To run this project locally, you will need Node.js installed.

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/bandhansingh2027/careerpath.git
   cd careerpath
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development servers (Frontend & Backend simultaneously):**
   \`\`\`bash
   npm run dev:all
   \`\`\`

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

\`\`\`text
CareerPath/
├── server/                 # Node.js backend
│   ├── db/                 # JSON Database
│   ├── services/           # Matching Engine Logic
│   └── index.js            # Express API Routes
├── src/                    # React frontend
│   ├── app/                
│   │   ├── components/     # Reusable UI elements
│   │   ├── pages/          # Full page layouts (Home, Quiz, Results, etc.)
│   │   ├── services/       # API integration
│   │   └── routes.tsx      # Application routing
│   └── styles/             # Vanilla CSS Design System
├── Innovathon_2026_Final_Presentation.md  # Hackathon Pitch Deck
└── package.json            # Project configuration
\`\`\`

## 🏆 Hackathon Details
* **Event**: Innovathon 2026
* **Theme**: EdTech / AI Integration
* **Problem Statement ID**: PS-A05
* **Team**: CODE TITANS (RRGI 100)

---
*Built with ❤️ for students in Tier 2/3 cities of India.*
