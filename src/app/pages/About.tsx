import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Target, Users, BookOpen, ArrowRight, Database, Code, Cpu, Shield } from 'lucide-react';
import { Layout } from '../components/Layout';
import { statsService } from '../services/api';

export function About() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { statsService.getStats().then(setStats).catch(() => {}); }, []);

  return (
    <Layout>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-12) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--text-inverse)', marginBottom: 'var(--space-3)' }}>About CareerPath</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 600, margin: '0 auto' }}>
            Empowering students in Tier 2/3 cities across India to discover their ideal career with data-backed recommendations and free resources
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-10) var(--space-6)' }}>

        {/* Mission */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <div className="grid-2" style={{ alignItems: 'center', gap: 'var(--space-10)' }}>
            <div>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Our Mission</h2>
              <p style={{ marginBottom: 'var(--space-4)', lineHeight: 'var(--leading-relaxed)' }}>
                Students in Tier 2 and Tier 3 cities often lack access to quality career guidance. Expensive counseling services and a lack of awareness about emerging career paths leave millions making uninformed decisions.
              </p>
              <p style={{ lineHeight: 'var(--leading-relaxed)' }}>
                CareerPath bridges this gap by providing free, data-driven career recommendations. Our platform analyzes your unique profile — interests, skills, educational background, and constraints — to match you with realistic career paths that include free learning resources and actionable roadmaps.
              </p>
            </div>
            <div className="card" style={{ backgroundColor: 'var(--accent-bg)' }}>
              <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--accent)' }}>The Problem We Solve</h4>
              <ul className="indicator-list">
                <li><span style={{ color: 'var(--error)' }}>x</span><span style={{ color: 'var(--text-secondary)' }}>70% of graduates in India are unemployable (NASSCOM)</span></li>
                <li><span style={{ color: 'var(--error)' }}>x</span><span style={{ color: 'var(--text-secondary)' }}>Only 4% of Tier 2/3 students receive formal career guidance</span></li>
                <li><span style={{ color: 'var(--error)' }}>x</span><span style={{ color: 'var(--text-secondary)' }}>Average career counseling costs ₹5,000–₹25,000 per session</span></li>
                <li><span style={{ color: 'var(--error)' }}>x</span><span style={{ color: 'var(--text-secondary)' }}>Students unaware of non-traditional career paths</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* How the Algorithm Works */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <div className="section-header">
            <h2 className="section-title">How Our Algorithm Works</h2>
            <p className="section-subtitle">A transparent look at our matching methodology</p>
          </div>

          <div className="grid-3">
            {[
              { icon: Database, title: 'Data Collection', desc: '15 questions across 5 categories: Interests, Skills, Background, Preferences, and Constraints. Each answer carries weighted scores for different career paths.' },
              { icon: Cpu, title: 'Weighted Scoring', desc: 'Each quiz option has pre-assigned weights for each career. Your total score per career is calculated by summing the weights of your selected options.' },
              { icon: Target, title: 'Match Ranking', desc: 'Scores are normalized to percentages. Top 5 careers are returned with match reasons derived from your highest-scoring answer categories.' }
            ].map((item, i) => (
              <div key={i} className="card">
                <item.icon style={{ width: 28, height: 28, color: 'var(--accent)', marginBottom: 'var(--space-3)' }} />
                <div className="card-title">{item.title}</div>
                <p className="card-description">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <div className="section-header">
            <h2 className="section-title">Technology Stack</h2>
          </div>

          <div className="grid-4">
            {[
              { label: 'Frontend', tech: 'React + TypeScript', detail: 'Vanilla CSS design system' },
              { label: 'Backend', tech: 'Node.js + Express', detail: 'REST API with 6 endpoints' },
              { label: 'Database', tech: 'JSON Database', detail: 'Structured career & quiz data' },
              { label: 'Build Tool', tech: 'Vite', detail: 'Fast HMR & optimized builds' }
            ].map((t, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <Code style={{ width: 24, height: 24, color: 'var(--accent)', margin: '0 auto var(--space-2)' }} />
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>{t.label}</div>
                <div style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1)' }}>{t.tech}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{t.detail}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        {stats && (
          <section style={{ marginBottom: 'var(--space-12)' }}>
            <div className="cta-banner">
              <h3>Platform at a Glance</h3>
              <div className="grid-4" style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
                {[
                  { v: stats.totalCareers, l: 'Career Paths' },
                  { v: stats.totalResources, l: 'Free Resources' },
                  { v: stats.totalCertifications, l: 'Certifications' },
                  { v: stats.totalJobRoles, l: 'Job Roles' }
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--text-inverse)' }}>{s.v}+</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Team */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <div className="section-header">
            <h2 className="section-title">Team CODE TITANS</h2>
            <p className="section-subtitle">Innovathon 2026 — RRGI, Batch 100</p>
          </div>

          <div className="grid-3" style={{ maxWidth: 800, margin: '0 auto' }}>
            {[
              { name: 'Siddharth Singh', role: 'Full Stack Developer' },
              { name: 'Team Member 2', role: 'UI/UX & Research' },
              { name: 'Team Member 3', role: 'Data & Content' }
            ].map((m, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-3)' }}>
                  <Users style={{ width: 28, height: 28, color: 'var(--accent)' }} />
                </div>
                <div style={{ fontWeight: 'var(--font-semibold)' }}>{m.name}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{m.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <div className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <Shield style={{ width: 28, height: 28, color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <h4 style={{ marginBottom: 'var(--space-2)' }}>Privacy & Data</h4>
              <p style={{ fontSize: 'var(--text-sm)' }}>
                CareerPath does not collect personal information. Your quiz answers are stored locally in your browser session and are never sent to third-party services. All processing happens on our backend server. We do not use cookies for tracking.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="cta-banner">
          <h3>Start Your Career Discovery</h3>
          <p>Take our free 5-minute quiz and find your ideal career path</p>
          <Link to="/quiz" className="btn btn-lg">Take the Quiz <ArrowRight /></Link>
        </div>
      </div>
    </Layout>
  );
}
