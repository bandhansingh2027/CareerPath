import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Target, BookOpen, TrendingUp, Users, MapPin, Award, Briefcase, ChevronDown, ChevronUp, FileText, MessageSquare } from 'lucide-react';
import { Layout } from '../components/Layout';
import { careerService, statsService } from '../services/api';
import { CareerIcon } from '../components/CareerIcon';

export function Home() {
  const [careers, setCareers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    careerService.getCareers().then(d => setCareers(d)).catch(() => {});
    statsService.getStats().then(d => setStats(d)).catch(() => {});
  }, []);

  const faqs = [
    { q: 'Is this completely free?', a: 'Yes. CareerPath is 100% free. All recommended learning resources are also free or have financial aid options.' },
    { q: 'How accurate are the recommendations?', a: 'Our algorithm uses a weighted scoring system across 15 questions covering interests, skills, background, and constraints to find the best matches for your profile.' },
    { q: 'Is this only for students in Tier 2/3 cities?', a: 'While we focus on careers with strong remote and Tier 2/3 opportunities, the recommendations work for students from any location in India.' },
    { q: 'How long does the quiz take?', a: 'About 5 minutes. There are 15 questions across 5 categories.' },
    { q: 'Can I retake the quiz?', a: 'Yes, you can retake it as many times as you want with different answers to explore various career paths.' }
  ];

  const testimonials = [
    { name: 'Priya S.', location: 'Indore, MP', text: 'I was confused between data analytics and marketing. CareerPath helped me realize my strengths align with data work. Now I\'m pursuing a free Google certificate!', career: 'Data Analyst' },
    { name: 'Rahul K.', location: 'Jaipur, RJ', text: 'Coming from a commerce background, I didn\'t think tech was possible. The roadmap showed me exactly how to start with web development step by step.', career: 'Full Stack Developer' },
    { name: 'Sneha M.', location: 'Nagpur, MH', text: 'The free resources section saved me from spending money on expensive courses. I found everything I needed to start my UI/UX journey.', career: 'UI/UX Designer' }
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <MapPin style={{ width: 16, height: 16 }} />
            <span>Built for Tier 2/3 Students</span>
          </div>
          <h1>Find Your Perfect<br /><span className="hero-accent">Career Path</span></h1>
          <p>Get personalized career recommendations based on your interests, skills, and constraints. Discover realistic paths with free resources, roadmaps, and salary insights.</p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/quiz" className="btn btn-primary btn-lg">Take the Quiz (5 min) <ArrowRight /></Link>
            <Link to="/careers" className="btn btn-secondary btn-lg">Browse Careers</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-8) 0' }}>
          <div className="container">
            <div className="grid-4" style={{ textAlign: 'center' }}>
              {[
                { value: `${stats.totalCareers}+`, label: 'Career Paths' },
                { value: `${stats.totalResources}+`, label: 'Free Resources' },
                { value: `${stats.totalCertifications}+`, label: 'Certifications' },
                { value: `${stats.totalJobRoles}+`, label: 'Job Roles Covered' }
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--text-inverse)' }}>{s.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What We Offer</h2>
            <p className="section-subtitle">Everything you need to make an informed career decision, completely free</p>
          </div>
          <div className="grid-4">
            {[
              { icon: Target, title: 'Smart Matching Quiz', desc: 'Weighted algorithm matches you with ideal careers based on interests and aptitude.', link: '/quiz' },
              { icon: FileText, title: 'ATS Resume Analyzer', desc: 'Paste your resume to calculate keyword matches and identify missing skills.', link: '/resume-analyzer' },
              { icon: Award, title: 'AI Study Planner', desc: 'Get a week-by-week practice schedule tailored to your weekly study slots.', link: '/study-plan' },
              { icon: Users, title: 'Progress Dashboard', desc: 'Track your learning streaks, completed milestones, and target badges.', link: '/dashboard' },
              { icon: BookOpen, title: 'Free Resources Hub', desc: 'Explore curated learning resources and direct platform links.', link: '/resources' },
              { icon: TrendingUp, title: 'Indian Salary Trends', desc: 'Real salary brackets for entry, mid, and senior levels in modern job roles.', link: '/careers' },
              { icon: Briefcase, title: 'Job Openings Matrix', desc: 'Compare positions and view local hiring demands in smaller cities.', link: '/compare' },
              { icon: MessageSquare, title: 'Student Feedback', desc: 'Provide ideas, report bugs, or share testimonials to help peers.', link: '/feedback' }
            ].map((f, i) => (
              <Link key={i} to={f.link} className="card card-interactive" style={{ textDecoration: 'none', color: 'inherit' }}>
                <f.icon style={{ width: 28, height: 28, color: 'var(--accent)', marginBottom: 'var(--space-3)' }} />
                <div className="card-title" style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>{f.title}</div>
                <p className="card-description" style={{ fontSize: 'var(--text-xs)', margin: 0 }}>{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="grid-3">
            {[
              { step: '1', title: 'Answer 15 Questions', desc: 'Tell us about your interests, skills, educational background, preferences, and constraints' },
              { step: '2', title: 'Get Matched', desc: 'Our weighted scoring algorithm analyzes your profile against our career database and finds your best matches' },
              { step: '3', title: 'Start Learning', desc: 'Follow your personalized roadmap with free courses, get certified, and build your portfolio' }
            ].map((item) => (
              <div key={item.step} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--accent)', color: 'var(--text-inverse)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', margin: '0 auto var(--space-4)' }}>
                  {item.step}
                </div>
                <h4 style={{ marginBottom: 'var(--space-2)' }}>{item.title}</h4>
                <p style={{ fontSize: 'var(--text-sm)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Career Paths We Cover</h2>
            <p className="section-subtitle">Each path includes salary data, learning resources, roadmaps, and job role information</p>
          </div>
          <div className="grid-3">
            {careers.map(career => (
              <Link key={career.id} to={`/career/${career.id}`} className="card card-interactive" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--accent-bg)',
                    color: 'var(--accent)',
                    flexShrink: 0
                  }}>
                    <CareerIcon id={career.id} category={career.category} style={{ width: 22, height: 22 }} />
                  </div>
                  <span className={`badge ${career.demandLevel === 'High' ? 'badge-success' : 'badge-neutral'}`}>{career.demandLevel}</span>
                </div>
                
                <div style={{ flex: 1, marginBottom: 'var(--space-4)' }}>
                  <div className="card-title" style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-1)' }}>{career.title}</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'var(--font-semibold)', margin: 0 }}>
                    {career.category}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 'var(--font-semibold)' }}>{career.salaryEntry}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)', color: 'var(--accent)' }}>Details <ArrowRight style={{ width: 14, height: 14 }} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Student Stories</h2>
            <p className="section-subtitle">Hear from students who found their career path</p>
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className="card">
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 'var(--space-4)', lineHeight: 'var(--leading-relaxed)' }}>"{t.text}"</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>{t.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{t.location}</div>
                  </div>
                  <span className="badge badge-accent">{t.career}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 768 }}>
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {faqs.map((faq, i) => (
              <div key={i} className="card" style={{ padding: 0, cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-6)' }}>
                  <span style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>{faq.q}</span>
                  {openFaq === i ? <ChevronUp style={{ width: 18, height: 18, color: 'var(--text-muted)', flexShrink: 0 }} /> : <ChevronDown style={{ width: 18, height: 18, color: 'var(--text-muted)', flexShrink: 0 }} />}
                </div>
                {openFaq === i && (
                  <div style={{ padding: '0 var(--space-6) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-alt">
        <div className="container">
          <div className="cta-banner">
            <h3>Ready to Find Your Career Path?</h3>
            <p>Join students across India who found clarity about their career direction</p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/quiz" className="btn btn-lg">Start Your Journey <ArrowRight /></Link>
              <Link to="/resources" className="btn btn-lg btn-outline">Browse Free Resources</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
