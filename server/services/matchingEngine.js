export function analyzeProfile(db, answers) {
  const careerScores = {};
  db.careers.forEach(c => careerScores[c.id] = { score: 0, career: c });

  let selectedOptions = [];
  for (const [qId, ans] of Object.entries(answers)) {
    if (Array.isArray(ans)) {
      selectedOptions.push(...ans);
    } else {
      selectedOptions.push(ans);
    }
  }

  if (selectedOptions.length === 0) return [];

  // Find weights
  const activeWeights = db.scoringWeights.filter(w => selectedOptions.includes(w.optionValue));

  // Apply weights
  activeWeights.forEach(w => {
    if (careerScores[w.careerId]) {
      careerScores[w.careerId].score += w.weight;
    }
  });

  const MAX_POSSIBLE_SCORE = 50; 
  
  const recommendations = Object.values(careerScores)
    .map(cs => {
      let percentage = Math.round((cs.score / MAX_POSSIBLE_SCORE) * 100);
      percentage = Math.min(Math.max(percentage, 30), 98);
      
      const c = cs.career;
      
      return {
        career: {
          id: c.id,
          title: c.title,
          category: c.category,
          description: c.description,
          demand_level: c.demandLevel,
          tier2_tier3_opportunities: c.tier2Tier3Opportunities,
          salary_entry_min: parseInt(c.salaryEntry.replace(/[^0-9]/g, '')) * 100000,
          salary_entry_max: parseInt(c.salaryEntry.split('–')[1]?.replace(/[^0-9]/g, '') || c.salaryEntry.replace(/[^0-9]/g, '')) * 100000,
          salary_mid_min: parseInt(c.salaryMid.replace(/[^0-9]/g, '')) * 100000,
          salary_mid_max: parseInt(c.salaryMid.split('–')[1]?.replace(/[^0-9]/g, '') || c.salaryMid.replace(/[^0-9]/g, '')) * 100000,
          salary_senior_min: parseInt(c.salarySenior.replace(/[^0-9]/g, '')) * 100000,
          salary_senior_max: parseInt(c.salarySenior.split('–')[1]?.replace(/[^0-9]/g, '') || c.salarySenior.replace(/[^0-9]/g, '')) * 100000,
          job_roles: c.jobRoles,
          roadmap: c.roadmap,
          courses: c.courses,
          certifications: c.certifications
        },
        score: cs.score,
        matchPercentage: percentage,
        matchReasons: generateReasons(c, percentage),
        considerations: generateConsiderations(c)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return recommendations;
}

function generateReasons(career, percentage) {
  return [
    `Strong alignment with your core interests (${percentage}% match)`,
    `${career.demandLevel} demand in the current job market`,
    `${career.tier2Tier3Opportunities} opportunities for Tier 2/3 cities`
  ];
}

function generateConsiderations(career) {
  const considerations = [];
  if (career.category === 'Technology') {
    considerations.push('Requires continuous learning to keep up with new tools');
  }
  if (career.category === 'Data & Analytics') {
    considerations.push('Strong logical and analytical thinking is crucial');
  }
  if (considerations.length === 0) {
    considerations.push('Building a portfolio is essential for landing your first role');
  }
  return considerations;
}
