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

app.listen(port, () => {
  console.log(`CareerPath API Server running on http://localhost:${port}`);
});
