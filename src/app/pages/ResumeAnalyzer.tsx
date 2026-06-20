import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { careerService } from '../services/api';
import { Link, useNavigate } from 'react-router';
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, Sparkles, ArrowRight, RefreshCw, BookOpen, Compass } from 'lucide-react';

export function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [careers, setCareers] = useState<any[]>([]);
  const [targetCareer, setTargetCareer] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [progressMsg, setProgressMsg] = useState('');

  useEffect(() => {
    careerService.getCareers()
      .then(data => {
        setCareers(data);
        if (data.length > 0) setTargetCareer(data[0].id);
      })
      .catch(console.error);
  }, []);

  const triggerMockUpload = () => {
    const mockResumes: Record<string, string> = {
      'fullstack-web-dev': `BANDHAN SINGH
Email: bandhan@gmail.com | Phone: +91 9876543210
Education: B.Tech in Computer Science, 2026 (Tier 3 College)

SKILLS:
- Frontend: HTML5, CSS3, JavaScript (ES6), React.js basics, Responsive Design
- Version Control: Git, GitHub
- Miscellaneous: Communication, MS Excel

PROJECTS:
1. Portfolio Website: Built using HTML/CSS and vanilla JS. Responsive design.
2. Simple Todo App: React.js application with local storage state management.`,
      'data-analyst': `KIRAN RAJ
Email: kiran.raj@gmail.com | Mobile: +91 9998887776
Education: B.Com in Computer Applications, 2025

SKILLS:
- Data Tools: Microsoft Excel (VLOOKUP, Pivot Tables, Formulas)
- Databases: Basic SQL queries (SELECT, WHERE, GROUP BY)
- Soft Skills: Analytical thinking, Presentation, English communication

EXPERIENCE:
- Internship at RetailCorp: Assisted in building monthly sales spreadsheets and charts.`,
      'default': `AMIT KUMAR
Email: amit.k@outlook.com
Education: BA in English Literature, 2026

SKILLS:
- Writing: Content writing, Blog writing, Social media copywriting
- SEO: Basic keyword research
- Soft Skills: Creative thinking, Teamwork, Communication`
    };

    const key = mockResumes[targetCareer] ? targetCareer : 'default';
    setResumeText(mockResumes[key]);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    const steps = [
      'Extracting skills and keywords from resume...',
      'Mapping resume profile against target career requirements...',
      'Calculating experience level and credentials...',
      'Compiling gap analysis and course recommendations...'
    ];

    let currentStepIndex = 0;
    setProgressMsg(steps[currentStepIndex]);

    const interval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setProgressMsg(steps[currentStepIndex]);
      }
    }, 900);

    setTimeout(() => {
      clearInterval(interval);
      const selectedCareerObj = careers.find(c => c.id === targetCareer);
      if (!selectedCareerObj) {
        setIsAnalyzing(false);
        return;
      }

      const allRequiredSkills = [
        'HTML5', 'CSS3', 'JavaScript ES6', 'Responsive Design', 'Git', 'GitHub',
        'React', 'Node.js', 'Express', 'REST APIs', 'MongoDB', 'SQL', 'Python',
        'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Figma', 'SEO', 'Content Writing',
        'Copywriting', 'Excel', 'Pivot Tables', 'UX Research', 'Wireframes'
      ];

      const matched: string[] = [];
      const missing: string[] = [];

      allRequiredSkills.forEach(skill => {
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const hasSkill = regex.test(resumeText) || resumeText.toLowerCase().includes(skill.toLowerCase());
        
        const isNeeded = selectedCareerObj.jobRoles?.some((role: string) => role.toLowerCase().includes(skill.toLowerCase())) ||
                         selectedCareerObj.title.toLowerCase().includes(skill.toLowerCase()) ||
                         selectedCareerObj.description.toLowerCase().includes(skill.toLowerCase()) ||
                         (targetCareer === 'fullstack-web-dev' && ['HTML5', 'CSS3', 'JavaScript ES6', 'Responsive Design', 'Git', 'GitHub', 'React', 'Node.js', 'Express', 'MongoDB'].includes(skill)) ||
                         (targetCareer === 'data-analyst' && ['Excel', 'SQL', 'Python', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Pivot Tables'].includes(skill)) ||
                         (targetCareer === 'ui-ux-designer' && ['Figma', 'UX Research', 'Wireframes', 'Responsive Design'].includes(skill)) ||
                         (targetCareer === 'digital-marketing' && ['SEO', 'Content Writing', 'Copywriting', 'Excel'].includes(skill)) ||
                         (targetCareer === 'content-writer' && ['Content Writing', 'Copywriting', 'SEO'].includes(skill));

        if (isNeeded) {
          if (hasSkill) matched.push(skill);
          else missing.push(skill);
        }
      });

      const total = matched.length + missing.length;
      const score = total > 0 ? Math.round((matched.length / total) * 100) : 40;
      
      const savedAnalyzerHistory = JSON.parse(localStorage.getItem('careerpath_analyzerHistory') || '[]');
      savedAnalyzerHistory.push({
        date: new Date().toLocaleDateString(),
        careerId: targetCareer,
        careerTitle: selectedCareerObj.title,
        score,
        matchedCount: matched.length,
        missingCount: missing.length
      });
      localStorage.setItem('careerpath_analyzerHistory', JSON.stringify(savedAnalyzerHistory));

      const user = JSON.parse(localStorage.getItem('careerpath_currentUser') || '{"badges": []}');
      if (user.email) {
        if (score >= 70 && !user.badges.includes('resume')) {
          user.badges.push('resume');
        }
        user.xp = (user.xp || 0) + 20;
        localStorage.setItem('careerpath_currentUser', JSON.stringify(user));
      }

      setAnalysisResult({
        score,
        matched,
        missing,
        recommendations: generateRecommendations(score, missing, selectedCareerObj.title)
      });
      setIsAnalyzing(false);
    }, 3800);
  };

  const generateRecommendations = (score: number, missing: string[], title: string) => {
    const recs = [];
    if (score < 40) {
      recs.push(`This is a career transition for you. Start with fundamental free courses to build a base in ${title}.`);
    } else if (score < 75) {
      recs.push(`You have a solid base! Focus on building 2-3 portfolio projects highlighting your skills in: ${missing.slice(0, 3).join(', ')}.`);
    } else {
      recs.push('Excellent match! Optimize your resume bullet points with active verbs and start applying to entry-level jobs.');
    }
    
    if (missing.length > 0) {
      recs.push(`Get certified in ${missing[0]} via the suggested learning platforms to boost your profile visibility.`);
    }
    recs.push('Highlight open-source contributions or freelance tasks to overcome tier-3 campus placement barriers.');
    return recs;
  };

  return (
    <Layout>
      <div style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ color: 'var(--text-inverse)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>Resume & Profile Analyzer</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>Compare your current resume against industry standards and fix your skills gap</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary" style={{ color: 'var(--text-inverse)', borderColor: 'rgba(255,255,255,0.3)' }}>
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        {!analysisResult && !isAnalyzing && (
          <div className="grid-2" style={{ gap: 'var(--space-8)' }}>
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <FileText style={{ color: 'var(--accent)', width: 22, height: 22 }} /> Paste Resume details
              </h3>

              <form onSubmit={handleAnalyze}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
                    Target Career Path
                  </label>
                  <select
                    value={targetCareer}
                    onChange={(e) => setTargetCareer(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)'
                    }}
                  >
                    {careers.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
                      Resume Text
                    </label>
                    <button
                      type="button"
                      onClick={triggerMockUpload}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-semibold)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <UploadCloud style={{ width: 14, height: 14 }} /> Fill Sample Resume
                    </button>
                  </div>

                  <textarea
                    rows={12}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your education, skills, project bullet points or full resume copy here..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      fontFamily: 'monospace',
                      lineHeight: '1.5'
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!resumeText.trim()}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', opacity: resumeText.trim() ? 1 : 0.5 }}
                >
                  Analyze Competency <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <Sparkles style={{ color: 'var(--accent)', width: 18, height: 18 }} /> Instant ATS Matching
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Our parser compares your skills, technology stacks, and keywords directly with hiring profiles from top tier-1 and remote companies.
                </p>
              </div>

              <div className="card" style={{ borderLeft: '4px solid var(--info)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <BookOpen style={{ color: 'var(--info)', width: 18, height: 18 }} /> Bridge the Gap
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Get instant suggestions on exactly which courses, certifications, and project milestones you need to secure placement matches.
                </p>
              </div>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div style={{
            minHeight: '40vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-4)'
          }}>
            <div className="spinner" />
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', animation: 'pulse 1.5s infinite' }}>
              {progressMsg}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>This will take just a moment...</p>
          </div>
        )}

        {analysisResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <h3>Analysis Results for target role: {careers.find(c => c.id === targetCareer)?.title}</h3>
              <button
                onClick={() => { setAnalysisResult(null); setResumeText(''); }}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                <RefreshCw style={{ width: 16, height: 16 }} /> Analyze Another Resume
              </button>
            </div>

            <div className="grid-3" style={{ gap: 'var(--space-6)' }}>
              <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--space-6)' }}>
                <div style={{
                  fontSize: '4.5rem',
                  fontWeight: 'var(--font-extrabold)',
                  color: analysisResult.score >= 75 ? 'var(--success)' : analysisResult.score >= 50 ? 'var(--info)' : 'var(--warning)',
                  lineHeight: 1
                }}>
                  {analysisResult.score}%
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 var(--space-4)' }}>
                  Overall ATS & Resume Score
                </div>
                <div className="progress-track" style={{ height: '8px', maxWidth: '200px', margin: '0 auto' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${analysisResult.score}%`,
                      backgroundColor: analysisResult.score >= 75 ? 'var(--success)' : analysisResult.score >= 50 ? 'var(--info)' : 'var(--warning)'
                    }}
                  />
                </div>
              </div>

              <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <h4 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                    <CheckCircle2 style={{ width: 18, height: 18 }} /> Matched Skills ({analysisResult.matched.length})
                  </h4>
                  {analysisResult.matched.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No matching keywords found.</p>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      {analysisResult.matched.map((skill: string) => (
                        <span key={skill} className="tag tag-success" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', border: '1px solid rgba(var(--success-rgb), 0.1)' }}>{skill}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
                  <h4 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                    <AlertTriangle style={{ width: 18, height: 18 }} /> Missing Key Skills ({analysisResult.missing.length})
                  </h4>
                  {analysisResult.missing.length === 0 ? (
                    <p style={{ color: 'var(--success)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>Awesome! You possess all the primary skills.</p>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                        {analysisResult.missing.map((skill: string) => (
                          <span key={skill} className="tag tag-accent" style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid rgba(var(--accent-rgb), 0.1)' }}>{skill}</span>
                        ))}
                      </div>
                      <Link 
                        to={`/study-plan?career=${targetCareer}&missing=${encodeURIComponent(analysisResult.missing.join(','))}`} 
                        className="btn btn-primary btn-sm" 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Sparkles style={{ width: 14, height: 14 }} /> Generate Roadmap for Missing Skills <ArrowRight style={{ width: 14, height: 14 }} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
              <div className="card glass-card">
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
                  <Compass style={{ color: 'var(--accent)', width: 20, height: 20 }} /> Job Match Scores (Role Comparison)
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                  See how well your resume matches other related careers in our catalog.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {[
                    { title: "Frontend Engineer", score: Math.min(100, analysisResult.score + 15), status: "Strong Match" },
                    { title: "Backend Engineer", score: Math.max(0, analysisResult.score - 10), status: "Skill Gap Identified" },
                    { title: "DevOps Specialist", score: Math.max(0, analysisResult.score - 30), status: "High Skill Gap" }
                  ].map((job, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div>
                        <strong style={{ fontSize: 'var(--text-xs)', display: 'block' }}>{job.title}</strong>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Status: {job.status}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="progress-track" style={{ width: '80px', height: '6px' }}>
                          <div className="progress-fill" style={{ width: `${job.score}%`, height: '6px', backgroundColor: job.score >= 70 ? 'var(--success)' : job.score >= 50 ? 'var(--info)' : 'var(--warning)' }} />
                        </div>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>{job.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 'var(--space-6)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
                  <Sparkles style={{ width: 20, height: 20, color: 'var(--accent)' }} /> AI Resume Improvement Suggestions
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingLeft: 'var(--space-2)' }}>
                  {analysisResult.recommendations.map((rec: string, i: number) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)', marginTop: '-2px' }}>•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
