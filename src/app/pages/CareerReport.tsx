import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Layout } from '../components/Layout';
import { careerService } from '../services/api';
import { Printer, TrendingUp, MapPin, Award, BookOpen, Briefcase, FileText, ChevronRight, Check } from 'lucide-react';

export function CareerReport() {
  const { careerId } = useParams();
  const [career, setCareer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!careerId) return;
    careerService.getCareerById(careerId)
      .then(data => {
        setCareer(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [careerId]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Layout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!career) {
    return (
      <Layout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Career Report not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Stylesheet specifically for printing */}
      <style>{`
        @media print {
          nav, footer, .chatbot-container, .print-btn-container, .back-btn {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .report-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: 960 }}>
        {/* Navigation & Actions */}
        <div className="print-btn-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <Link to={`/career/${career.id}`} className="btn btn-ghost btn-sm back-btn">
            &larr; Back to Career Overview
          </Link>
          <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer style={{ width: 16, height: 16 }} /> Print/Export Report
          </button>
        </div>

        {/* The Printable Page */}
        <div className="card report-card" style={{ padding: 'var(--space-8)', border: '1px solid var(--border)' }}>
          {/* Header */}
          <div style={{ borderBottom: '2px solid var(--accent)', paddingBottom: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <span className="badge badge-accent" style={{ marginBottom: 'var(--space-2)' }}>CAREER ANALYSIS REPORT</span>
                <h1 style={{ fontSize: 'var(--text-3xl)', margin: '4px 0' }}>{career.title}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', maxWidth: 600 }}>{career.description}</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                <div>Report Generated: {new Date().toLocaleDateString()}</div>
                <div>Source: CareerPath Recommender DB</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* Market Demands & Outlook */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp style={{ color: 'var(--accent)' }} /> 1. Market Demand & Local Outlook
              </h3>
              <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
                <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>GLOBAL DEMAND LEVEL</div>
                  <strong style={{ fontSize: 'var(--text-lg)', color: 'var(--accent)' }}>{career.demandLevel}</strong>
                </div>
                <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>TIER 2 & 3 CITIES OUTLOOK</div>
                  <strong style={{ fontSize: 'var(--text-lg)', color: 'var(--info)' }}>{career.tier2Tier3Opportunities}</strong>
                </div>
                <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>EST. REMOTENESS INDEX</div>
                  <strong style={{ fontSize: 'var(--text-lg)', color: 'var(--success)' }}>High Flex / Remote</strong>
                </div>
              </div>
            </div>

            {/* Salary progressions */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText style={{ color: 'var(--accent)' }} /> 2. Annual Salary Projection (Indian Market)
              </h3>
              <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--success)' }}>Entry-Level (0-2 Yrs)</div>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>{career.salaryEntry}</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>Junior associates, interns, freelance roles.</p>
                </div>
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--info)' }}>Mid-Level (2-5 Yrs)</div>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>{career.salaryMid}</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>Independent executors, leads, small consultants.</p>
                </div>
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--accent)' }}>Senior-Level (5+ Yrs)</div>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>{career.salarySenior}</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>Architects, project managers, growth specialists.</p>
                </div>
              </div>
            </div>

            {/* Target Job Roles */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase style={{ color: 'var(--accent)' }} /> 3. Target Industry Positions
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {career.jobRoles?.map((role: string, index: number) => (
                  <span key={index} className="tag" style={{ border: '1px solid var(--border)', padding: 'var(--space-2) var(--space-3)' }}>
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Roadmap & Timeframe */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award style={{ color: 'var(--accent)' }} /> 4. Required Learning Syllabus (6-Month Milestone)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {career.roadmap?.sixMonths?.map((step: any, index: number) => (
                  <div key={index} style={{ display: 'flex', gap: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: index < career.roadmap.sixMonths.length - 1 ? '1px dashed var(--border)' : 'none' }}>
                    <div style={{ fontWeight: 'var(--font-bold)', color: 'var(--accent)', minWidth: '70px' }}>Month {step.month}</div>
                    <div>
                      <strong style={{ display: 'block', fontSize: 'var(--text-sm)' }}>{step.title}</strong>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '4px 0' }}>{step.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                        {step.skills?.map((s: string, sIdx: number) => (
                          <span key={sIdx} style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum suggestions */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen style={{ color: 'var(--accent)' }} /> 5. High-quality Course Recommendations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {career.courses?.map((course: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <strong>{course.title}</strong>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Platform: {course.provider} | Duration: {course.duration} | Level: {course.level}
                      </div>
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontWeight: 'var(--font-bold)' }}>100% Free / Aid</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification checklist */}
            <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--accent)' }}>
              <h4 style={{ margin: '0 0 var(--space-3) 0', color: 'var(--accent)' }}>Student Action Plan Checklist</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2.5)', padding: 0, listStyle: 'none' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)' }}>
                  <Check style={{ color: 'var(--success)', width: 16, height: 16 }} />
                  <span>Check off missing skills inside the Skill Gap Analyzer page.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)' }}>
                  <Check style={{ color: 'var(--success)', width: 16, height: 16 }} />
                  <span>Generate a week-by-week study calendar matching weekly available slots.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)' }}>
                  <Check style={{ color: 'var(--success)', width: 16, height: 16 }} />
                  <span>Upload resume drafts once a month to ensure keywords score &gt; 80%.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
