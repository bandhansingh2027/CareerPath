import { saveDb } from './database.js';
import { careerPaths } from '../../src/app/data/careerPaths.ts';
import { quizQuestions } from '../../src/app/data/quizQuestions.ts';

try {
  console.log('Seeding database to JSON...');
  
  const db = {
    careers: [],
    quizQuestions: [],
    scoringWeights: []
  };

  // Seed Careers
  for (const c of careerPaths) {
    db.careers.push({
      id: c.id,
      title: c.title,
      category: c.category,
      description: c.description,
      demandLevel: c.demandLevel,
      tier2Tier3Opportunities: c.tier2Tier3Opportunities,
      salaryEntry: `₹${c.salaryRange.entry.min / 100000}–${c.salaryRange.entry.max / 100000} LPA`,
      salaryMid: `₹${c.salaryRange.mid.min / 100000}–${c.salaryRange.mid.max / 100000} LPA`,
      salarySenior: `₹${c.salaryRange.senior.min / 100000}–${c.salaryRange.senior.max / 100000} LPA`,
      jobRoles: c.jobRoles,
      courses: c.courses,
      certifications: c.certifications,
      roadmap: c.roadmap,
      pros: c.pros,
      cons: c.cons
    });
  }

  // Seed Quiz & Weights
  for (const q of quizQuestions) {
    const question = {
      id: q.id,
      step: q.step,
      category: q.category,
      question: q.question,
      description: q.description || null,
      type: q.type,
      required: q.required,
      options: []
    };

    if (q.options) {
      for (const o of q.options) {
        question.options.push({ id: o.id, label: o.label, value: o.value });
        
        // Extract weights
        if (o.weight) {
          for (const [careerId, weight] of Object.entries(o.weight)) {
            db.scoringWeights.push({
              optionValue: o.value,
              careerId: careerId,
              weight: weight
            });
          }
        }
      }
    }
    db.quizQuestions.push(question);
  }

  saveDb(db);
  console.log('Seed completed successfully!');
} catch (error) {
  console.error('Seed failed:', error);
}
