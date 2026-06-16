import { careersData, Career } from '../data/careersData';

export const BASE_URL = '/api';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Fetch to ${endpoint} failed, using local mock data fallback.`, error);
    throw error; // Let the caller catch it, or handle it via fallback logic below
  }
}

export const careerService = {
  getCareers: async (): Promise<Career[]> => {
    try {
      return await fetchApi('/careers');
    } catch {
      return careersData;
    }
  },
  getCareerById: async (id: string): Promise<Career> => {
    try {
      return await fetchApi(`/careers/${id}`);
    } catch {
      const career = careersData.find(c => c.id === id);
      if (!career) throw new Error('Career not found locally');
      return career;
    }
  }
};

export const quizService = {
  getQuestions: async () => {
    return [
      {
        id: 'education',
        step: 1,
        question: 'What is your current education status?',
        required: true,
        type: 'single',
        options: [
          { id: 'btech_cs', label: 'B.Tech / B.E. (Computer Science / IT)' },
          { id: 'btech_other', label: 'B.Tech / B.E. (Other Branches)' },
          { id: 'bca', label: 'BCA (Bachelor of Computer Applications)' },
          { id: 'mca', label: 'MCA (Master of Computer Applications)' },
          { id: 'bsc', label: 'B.Sc / M.Sc (Computer Science / IT)' },
          { id: 'non_tech', label: 'Non-Technical Graduate (B.Com, B.A, BBA)' },
          { id: 'self_taught', label: 'Self-Taught / School Student' }
        ]
      },
      {
        id: 'interests',
        step: 2,
        question: 'Select your key areas of interest (Select up to 3):',
        required: true,
        type: 'multiple',
        options: [
          { id: 'coding', label: 'Coding & Web Application Development' },
          { id: 'ai', label: 'AI, Algorithms & Neural Networks' },
          { id: 'security', label: 'Ethical Hacking & System Security' },
          { id: 'data', label: 'Data Cleaning, Graphs & Insights' },
          { id: 'design', label: 'UI/UX Visual Design & Prototyping' },
          { id: 'servers', label: 'Server APIs & Database Systems' }
        ]
      },
      {
        id: 'goal',
        step: 3,
        question: 'What is your career goal?',
        required: true,
        type: 'single',
        options: [
          { id: 'mern-stack-dev', label: 'MERN Stack Developer' },
          { id: 'ai-ml-engineer', label: 'AI/ML Engineer' },
          { id: 'cybersecurity-analyst', label: 'Cybersecurity Analyst' },
          { id: 'data-analyst', label: 'Data Analyst' },
          { id: 'java-backend-dev', label: 'Java Backend Developer' }
        ]
      }
    ];
  },
  submitAnswers: async (answers: Record<string, any>) => {
    // Perform client-side matching directly for rapid and 100% offline generation
    const selectedGoal = answers.goal;
    const targetCareer = careersData.find(c => c.id === selectedGoal) || careersData[0];
    
    // Calculate match percentage
    let matchPercentage = 95; // Default target is high since they selected it as goal
    if (answers.education === 'non_tech') matchPercentage = 85; // slightly lower due to learning curve
    
    // Custom match reasons
    const matchReasons = [
      `Aligned with your goal of becoming a ${targetCareer.title}.`,
      `Leverages your interest in ${
        Array.isArray(answers.interests) 
          ? answers.interests.map((i: string) => i.toUpperCase()).join(', ') 
          : 'technology'
      }.`,
      `${targetCareer.demandLevel} market demand with ${targetCareer.tier2Tier3Opportunities} placement opportunities in Tier-2/3 cities.`
    ];

    // Determine matched vs missing skills (Skill Gap Analysis)
    const allSkills = targetCareer.requiredSkills;
    const isTechEd = ['btech_cs', 'mca', 'bca', 'bsc'].includes(answers.education);
    const interests = answers.interests || [];
    
    const matched: string[] = [];
    const missing: string[] = [];

    allSkills.forEach((skill, idx) => {
      // Tech students get basic skills matched
      if (isTechEd && (skill.includes('HTML') || skill.includes('CSS') || skill.includes('Git') || skill.includes('Java Core') || skill.includes('Python'))) {
        matched.push(skill);
      }
      // Interest matches
      else if (interests.includes('design') && (skill.includes('Figma') || skill.includes('Design'))) {
        matched.push(skill);
      }
      else if (interests.includes('data') && (skill.includes('Excel') || skill.includes('SQL'))) {
        matched.push(skill);
      }
      else if (interests.includes('coding') && idx < 2) {
        matched.push(skill); // Match first couple of skills if they love coding
      }
      else {
        missing.push(skill);
      }
    });

    // Handle edge case where matched is empty
    if (matched.length === 0) {
      matched.push(allSkills[0]);
      missing.shift();
    }

    const recommendations = [
      {
        career: {
          id: targetCareer.id,
          title: targetCareer.title,
          category: targetCareer.category,
          description: targetCareer.description,
          demand_level: targetCareer.demandLevel,
          tier2_tier3_opportunities: targetCareer.tier2Tier3Opportunities,
          salary_entry_min: parseInt(targetCareer.salaryEntry.replace(/[^0-9.]/g, '').split('')[0]) * 100000 || 350000,
          salary_entry_max: parseInt(targetCareer.salaryEntry.replace(/[^0-9.]/g, '').split('')[1]) * 100000 || 700000,
          salary_mid_min: 800000,
          salary_mid_max: 1500000,
          salary_senior_min: 1800000,
          salary_senior_max: 3500000,
          job_roles: targetCareer.jobRoles,
          roadmap: {
            sixMonths: targetCareer.monthlyMilestones.map(m => ({
              month: m.month,
              title: m.title,
              description: m.description,
              skills: m.skills
            }))
          },
          courses: targetCareer.recommendedProjects.map(p => ({
            title: p.title,
            provider: p.difficulty,
            url: '#',
            duration: p.technologies.join(', '),
            level: 'Project'
          })),
          certifications: targetCareer.certifications
        },
        score: 48,
        matchPercentage,
        matchReasons,
        considerations: targetCareer.cons,
        // Include new items for results/onboarding display
        matchedSkills: matched,
        missingSkills: missing,
        weeklyLearningPlan: targetCareer.weeklyLearningPlan,
        monthlyMilestones: targetCareer.monthlyMilestones,
        recommendedProjects: targetCareer.recommendedProjects
      }
    ];

    // Add other careers as alternatives
    careersData.forEach(c => {
      if (c.id !== selectedGoal) {
        let altMatch = 70;
        if (c.category === targetCareer.category) altMatch = 85;
        
        recommendations.push({
          career: {
            id: c.id,
            title: c.title,
            category: c.category,
            description: c.description,
            demand_level: c.demandLevel,
            tier2_tier3_opportunities: c.tier2Tier3Opportunities,
            salary_entry_min: 300000,
            salary_entry_max: 600000,
            salary_mid_min: 700000,
            salary_mid_max: 1200000,
            salary_senior_min: 1500000,
            salary_senior_max: 2500000,
            job_roles: c.jobRoles,
            roadmap: {
              sixMonths: c.monthlyMilestones.map(m => ({
                month: m.month,
                title: m.title,
                description: m.description,
                skills: m.skills
              }))
            },
            courses: [],
            certifications: c.certifications
          },
          score: 35,
          matchPercentage: altMatch,
          matchReasons: [`Alternative path in ${c.category}.`],
          considerations: c.cons,
          matchedSkills: [],
          missingSkills: c.requiredSkills,
          weeklyLearningPlan: c.weeklyLearningPlan,
          monthlyMilestones: c.monthlyMilestones,
          recommendedProjects: c.recommendedProjects
        });
      }
    });

    return { recommendations };
  }
};

export const resourceService = {
  getAll: async () => {
    const resources: any[] = [];
    careersData.forEach(c => {
      c.recommendedProjects.forEach(proj => {
        resources.push({
          title: `${c.title} Project: ${proj.title}`,
          provider: proj.difficulty,
          url: '#',
          duration: `Tech stack: ${proj.technologies.join(', ')}`,
          level: proj.description,
          careerId: c.id,
          careerTitle: c.title,
          category: c.category
        });
      });
    });
    return resources;
  }
};

export const statsService = {
  getStats: async () => {
    return {
      totalCareers: careersData.length,
      totalResources: 25,
      totalCertifications: 15,
      totalJobRoles: 20,
      totalCategories: 3,
      categories: ['Software Engineering', 'Data Science & AI', 'IT & Security']
    };
  }
};

export const compareService = {
  compare: async (ids: string[]) => {
    return careersData.filter(c => ids.includes(c.id));
  }
};

export const chatService = {
  sendMessage: async (message: string) => {
    const query = message.toLowerCase().trim();
    
    // Career Mentor response routing - behaving strictly as a Career Mentor & Roadmap Generator
    if (query.includes('roadmap') || query.includes('plan') || query.includes('path') || query.includes('learn') || query.includes('study')) {
      return {
        reply: `As your **Career Mentor**, I recommend generating an active study plan! 🚀\n\nYou can select any of our targeted tracks like **MERN Stack Developer**, **AI/ML Engineer**, or **Cybersecurity Analyst**. \n\nOur plans break down your learning week-by-week, showing you exactly what topics to study and which portfolio projects to build. Go to the [Study Planner](/study-plan) to get started immediately!`
      };
    }
    
    if (query.includes('mern') || query.includes('web') || query.includes('react') || query.includes('node')) {
      const career = careersData.find(c => c.id === 'mern-stack-dev')!;
      return {
        reply: `### 💻 MERN Stack Developer Pathway\n\n* **Salary Range:** ${career.salaryEntry} (Entry) to ${career.salarySenior} (Senior)\n* **Demand:** **${career.demandLevel}**\n\n**Mentor Tip:** Start by building solid foundations in JavaScript ES6+ before jumping into React. The key to landing MERN jobs from Tier 2/3 cities is having live, deployed full-stack portfolio projects.\n\n👉 View the [MERN Stack Roadmap & Weekly Plan](/career/mern-stack-dev)!`
      };
    }
    
    if (query.includes('ai') || query.includes('ml') || query.includes('machine') || query.includes('python')) {
      const career = careersData.find(c => c.id === 'ai-ml-engineer')!;
      return {
        reply: `### 🤖 AI/ML Engineer Pathway\n\n* **Salary Range:** ${career.salaryEntry} (Entry) to ${career.salarySenior} (Senior)\n* **Demand:** **${career.demandLevel}**\n\n**Mentor Tip:** Do not just watch tutorial videos. Master Linear Algebra and probability first, then write neural network layers from scratch in PyTorch. Deploying models via FastAPI endpoints is what distinguishes top candidates.\n\n👉 View the [AI/ML Roadmap & Weekly Plan](/career/ai-ml-engineer)!`
      };
    }

    if (query.includes('security') || query.includes('cyber') || query.includes('hacking') || query.includes('penetration')) {
      const career = careersData.find(c => c.id === 'cybersecurity-analyst')!;
      return {
        reply: `### 🛡️ Cybersecurity Analyst Pathway\n\n* **Salary Range:** ${career.salaryEntry} (Entry) to ${career.salarySenior} (Senior)\n* **Demand:** **${career.demandLevel}**\n\n**Mentor Tip:** A certification like CompTIA Security+ or Cisco CyberOps is highly valued by SOC recruitment teams. Set up a virtual home lab using pfSense and Splunk to analyze attack logs.\n\n👉 View the [Cybersecurity Roadmap & Weekly Plan](/career/cybersecurity-analyst)!`
      };
    }
    
    if (query.includes('java') || query.includes('backend') || query.includes('spring')) {
      const career = careersData.find(c => c.id === 'java-backend-dev')!;
      return {
        reply: `### ☕ Java Backend Developer Pathway\n\n* **Salary Range:** ${career.salaryEntry} (Entry) to ${career.salarySenior} (Senior)\n* **Demand:** **${career.demandLevel}**\n\n**Mentor Tip:** Java is the backbone of enterprise applications and banking systems. Master Spring Boot, Dependency Injection, JPA/Hibernate, and write clean JUnit test suites.\n\n👉 View the [Java Backend Developer Roadmap & Weekly Plan](/career/java-backend-dev)!`
      };
    }

    if (query.includes('resume') || query.includes('ats') || query.includes('cv') || query.includes('portfolio')) {
      return {
        reply: `To improve your placement odds, use our **Resume Optimizer**! 📝\n\nIt compares your current CV keywords directly against your target career path to compute a match score, highlight your skill gaps, and suggest bullet-point rewrites.\n\n👉 [Run a Resume Analysis Now](/resume-analyzer)`
      };
    }

    // Default Mentor welcome/help response
    return {
      reply: `Hello! I am your **AI Career Mentor** 🎓\n\nI am here to guide you through your career planning, skill development, and portfolio construction. I don't answer generic chat questions—I specialize in helping you build roadmaps and bridge your skills gaps.\n\nHere is how I can help:\n- Ask about a specific pathway, e.g., *'Tell me about AI/ML Engineer'* or *'Spring Boot'*.\n- Ask about building a CV: *'How do I fix my resume?'*\n- Learn about milestones: *'What projects should I build for Web Dev?'*\n\nOr complete your [Career Onboarding Flow](/quiz) to get your personalized roadmap generated instantly!`
    };
  }
};
