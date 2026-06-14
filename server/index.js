import express from 'express';
import cors from 'cors';
import { getDb } from './db/database.js';
import { analyzeProfile } from './services/matchingEngine.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = getDb();

// --- Career Routes ---
app.get('/api/careers', (req, res) => {
  res.json(db.careers.map(c => ({
    id: c.id,
    title: c.title,
    category: c.category,
    description: c.description,
    demandLevel: c.demandLevel,
    tier2Tier3Opportunities: c.tier2Tier3Opportunities,
    salaryEntry: c.salaryEntry,
    salaryMid: c.salaryMid,
    salarySenior: c.salarySenior,
    jobRoles: c.jobRoles
  })));
});

app.get('/api/careers/:id', (req, res) => {
  const career = db.careers.find(c => c.id === req.params.id);
  if (!career) return res.status(404).json({ error: 'Career not found' });
  res.json(career);
});

// --- Quiz Routes ---
app.get('/api/quiz/questions', (req, res) => {
  res.json(db.quizQuestions);
});

app.post('/api/analyze', (req, res) => {
  const { answers } = req.body;
  if (!answers) return res.status(400).json({ error: 'Answers are required' });
  const recommendations = analyzeProfile(db, answers);
  res.json({ recommendations });
});

// --- Resources Route (aggregated across all careers) ---
app.get('/api/resources', (req, res) => {
  const resources = [];
  db.careers.forEach(c => {
    if (c.courses) {
      c.courses.forEach(course => {
        resources.push({
          ...course,
          careerId: c.id,
          careerTitle: c.title,
          category: c.category
        });
      });
    }
  });
  res.json(resources);
});

// --- Stats Route (for homepage counters) ---
app.get('/api/stats', (req, res) => {
  const totalCareers = db.careers.length;
  const totalResources = db.careers.reduce((sum, c) => sum + (c.courses?.length || 0), 0);
  const totalCertifications = db.careers.reduce((sum, c) => sum + (c.certifications?.length || 0), 0);
  const totalJobRoles = db.careers.reduce((sum, c) => sum + (c.jobRoles?.length || 0), 0);
  const categories = [...new Set(db.careers.map(c => c.category))];

  res.json({
    totalCareers,
    totalResources,
    totalCertifications,
    totalJobRoles,
    totalCategories: categories.length,
    categories
  });
});

// --- Chat Route ---
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const query = message.toLowerCase().trim();
  let reply = '';

  if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greet') || query.includes('help')) {
    reply = "Hi there! I am your **CareerPath AI Advisor** 🚀\n\nI can help you explore career paths, salary ranges, learning resources, and roadmaps. Ask me questions like:\n- *'What is the salary of a Data Analyst?'*\n- *'Tell me about UI/UX Design'* \n- *'Where can I learn coding for free?'*\n- *'Which career has the highest demand?'*";
  } else if (query.includes('web') || query.includes('develop') || query.includes('code') || query.includes('coding') || query.includes('software') || query.includes('programmer')) {
    const career = db.careers.find(c => c.id === 'fullstack-web-dev');
    reply = `### 💻 Full Stack Web Developer\n\n* **Category:** ${career.category}\n* **Demand Level:** **${career.demandLevel}**\n* **Entry Salary:** **${career.salaryEntry}**\n* **Mid-Level Salary:** **${career.salaryMid}**\n\n**About the role:**\n${career.description}\n\n**Key Job Roles:**\n${career.jobRoles.slice(0, 3).map(r => `- ${r}`).join('\n')}\n\n👉 View the [6-Month Learning Roadmap & Free Courses](/career/fullstack-web-dev)!`;
  } else if (query.includes('data') || query.includes('analyst') || query.includes('analytics') || query.includes('sql') || query.includes('python')) {
    const career = db.careers.find(c => c.id === 'data-analyst');
    reply = `### 📊 Data Analyst\n\n* **Category:** ${career.category}\n* **Demand Level:** **${career.demandLevel}**\n* **Entry Salary:** **${career.salaryEntry}**\n* **Mid-Level Salary:** **${career.salaryMid}**\n\n**About the role:**\n${career.description}\n\n**Key Job Roles:**\n${career.jobRoles.slice(0, 3).map(r => `- ${r}`).join('\n')}\n\n👉 View the [Google Certificates & Learning Roadmap](/career/data-analyst)!`;
  } else if (query.includes('design') || query.includes('ui') || query.includes('ux') || query.includes('figma') || query.includes('designer')) {
    const career = db.careers.find(c => c.id === 'ui-ux-designer');
    reply = `### 🎨 UI/UX Designer\n\n* **Category:** ${career.category}\n* **Demand Level:** **${career.demandLevel}**\n* **Entry Salary:** **${career.salaryEntry}**\n* **Mid-Level Salary:** **${career.salaryMid}**\n\n**About the role:**\n${career.description}\n\n**Key Job Roles:**\n${career.jobRoles.slice(0, 3).map(r => `- ${r}`).join('\n')}\n\n👉 View the [Figma Roadmaps & Design Courses](/career/ui-ux-designer)!`;
  } else if (query.includes('marketing') || query.includes('seo') || query.includes('sales') || query.includes('campaign') || query.includes('ads') || query.includes('digital')) {
    const career = db.careers.find(c => c.id === 'digital-marketing');
    reply = `### 📣 Digital Marketing Specialist\n\n* **Category:** ${career.category}\n* **Demand Level:** **${career.demandLevel}**\n* **Entry Salary:** **${career.salaryEntry}**\n* **Mid-Level Salary:** **${career.salaryMid}**\n\n**About the role:**\n${career.description}\n\n**Key Job Roles:**\n${career.jobRoles.slice(0, 3).map(r => `- ${r}`).join('\n')}\n\n👉 View the [Marketing Roadmap & Free Resources](/career/digital-marketing)!`;
  } else if (query.includes('writ') || query.includes('content') || query.includes('copywrit') || query.includes('blog')) {
    const career = db.careers.find(c => c.id === 'content-writer');
    reply = `### ✍️ Content Writer / Copywriter\n\n* **Category:** ${career.category}\n* **Demand Level:** **${career.demandLevel}**\n* **Entry Salary:** **${career.salaryEntry}**\n* **Mid-Level Salary:** **${career.salaryMid}**\n\n**About the role:**\n${career.description}\n\n**Key Job Roles:**\n${career.jobRoles.slice(0, 3).map(r => `- ${r}`).join('\n')}\n\n👉 View the [Writing Roadmap & Portfolio Projects](/career/content-writer)!`;
  } else if (query.includes('salary') || query.includes('pay') || query.includes('earn') || query.includes('lpa') || query.includes('money') || query.includes('income')) {
    reply = `### 💰 Salary Insights (Indian Market)\n\nHere are the entry-level salary ranges for the career paths covered on our platform:\n\n1. **Digital Marketing Specialist:** ${db.careers.find(c => c.id === 'digital-marketing').salaryEntry}\n2. **Full Stack Web Developer:** ${db.careers.find(c => c.id === 'fullstack-web-dev').salaryEntry}\n3. **UI/UX Designer:** ${db.careers.find(c => c.id === 'ui-ux-designer').salaryEntry}\n4. **Data Analyst:** ${db.careers.find(c => c.id === 'data-analyst').salaryEntry}\n5. **Content Writer / Copywriter:** ${db.careers.find(c => c.id === 'content-writer').salaryEntry}\n\n*Mid-level and Senior-level salaries can go up to ₹12-25 LPA! You can click on any career path from the [Careers Page](/careers) to view full salary progressions.*`;
  } else if (query.includes('quiz') || query.includes('test') || query.includes('recommend') || query.includes('match') || query.includes('assess')) {
    reply = "Unsure which career is right for you? 🎯\n\nTake our **5-minute Career Match Quiz**! We analyze your answers across interests, skills, and background constraints to match you with the top 3 fields.\n\n👉 [Start the Career Quiz Now](/quiz)";
  } else if (query.includes('free') || query.includes('resource') || query.includes('course') || query.includes('learn') || query.includes('study') || query.includes('certif')) {
    reply = "### 📚 100% Free Learning Resources\n\nYes, all the resources recommended on CareerPath are either completely free or offer financial aid options:\n\n* **Web Dev:** freeCodeCamp, The Odin Project, Full Stack Open\n* **Data Analytics:** Google Data Analytics Certificate, SQL courses\n* **UI/UX:** Figma Tutorials, Google UX Design Course\n* **Marketing:** HubSpot Academy, Google Digital Marketing\n\n👉 Check out the [Resources Hub](/resources) to explore all learning links!";
  } else if (query.includes('remote') || query.includes('tier') || query.includes('city') || query.includes('opportunity') || query.includes('job')) {
    reply = "### 🏢 Opportunities in Tier 2 / Tier 3 Cities & Remote Work\n\nAll career paths featured on CareerPath have been vetted for **remote-friendliness** and local opportunities in smaller cities. \n\n* **Highest remote potential:** Full Stack Web Developer & UI/UX Designer.\n* **Strong freelance opportunities:** Content Writer & Digital Marketing.\n\nBuilding a strong portfolio and getting certifications is the key to landing these remote jobs!";
  } else {
    reply = "I understand you are asking about career paths! Here are a few things you can ask me:\n\n1. *'What is the salary of a Web Developer?'*\n2. *'Tell me about UI/UX Design'* \n3. *'Where can I learn coding for free?'*\n4. *'Which career has the highest demand?'*\n\nOr click here to take the [Career Quiz](/quiz) to get personalized matches!";
  }

  res.json({ reply });
});

// --- Compare Route ---
app.post('/api/compare', (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length < 2) {
    return res.status(400).json({ error: 'Provide at least 2 career IDs' });
  }
  const careers = ids.map(id => db.careers.find(c => c.id === id)).filter(Boolean);
  if (careers.length < 2) return res.status(404).json({ error: 'Some careers not found' });
  res.json(careers);
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`CareerPath API Server running on http://localhost:${port}`);
  });
}

export default app;
