import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Star, CheckCircle, Send, MessageSquare, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

export function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('General Feedback');
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Load existing testimonials
  const defaultTestimonials = [
    { name: 'Amit Pathak', role: 'B.Tech Student, GEC', rating: 5, comment: 'This platform helped me realize I can learn data analytics from my remote village using just free YouTube playlists! Saved me ₹40k on bootcamps.', date: '2 days ago' },
    { name: 'Priya Sharma', role: 'MCA Fresher', rating: 4, comment: 'The study plan checklist is highly structured. It gave me a clear vision of what Node.js components to learn.', date: '1 week ago' },
    { name: 'Rahul Sen', role: 'B.Sc Graduate', rating: 5, comment: 'The ATS resume analyzer matches keywords perfectly. My match percentage went from 40% to 80% after formatting.', date: '3 days ago' }
  ];

  const [testimonials, setTestimonials] = useState<any[]>(() => {
    const saved = localStorage.getItem('careerpath_testimonials');
    return saved ? JSON.parse(saved) : defaultTestimonials;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }

    const newTestimonial = {
      name: email.split('@')[0] || 'Anonymous Student',
      role: 'CareerPath Explorer',
      rating,
      comment,
      date: 'Just now'
    };

    const updated = [newTestimonial, ...testimonials];
    localStorage.setItem('careerpath_testimonials', JSON.stringify(updated));
    setTestimonials(updated);
    setSubmitted(true);

    // Reset form
    setComment('');
    setEmail('');
    setRating(0);
  };

  return (
    <Layout>
      <div style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--text-inverse)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>Student Feedback System</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)' }}>Help us improve CareerPath for tier-2/3 college students across India</p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: 1000 }}>
        <div className="grid-2" style={{ gap: 'var(--space-8)' }}>
          {/* Form Card */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                <CheckCircle style={{ width: 64, height: 64, color: 'var(--success)', margin: '0 auto var(--space-4)' }} />
                <h3 style={{ marginBottom: 'var(--space-2)' }}>Thank You for Your Feedback!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                  Your inputs have been recorded. We will use them to fine-tune our recommendations.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                  <button onClick={() => setSubmitted(false)} className="btn btn-secondary btn-sm">
                    Submit Another Feedback
                  </button>
                  <Link to="/" className="btn btn-primary btn-sm">
                    Back Home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                  <MessageSquare style={{ color: 'var(--accent)' }} /> Submit Feedback
                </h3>

                {/* Rating */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1.5)' }}>
                    Your Rating
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          width: 28,
                          height: 28,
                          cursor: 'pointer',
                          fill: star <= (hoverRating || rating) ? 'var(--warning)' : 'none',
                          color: star <= (hoverRating || rating) ? 'var(--warning)' : 'var(--text-muted)',
                          transition: 'color 0.2s, fill 0.2s'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1.5)' }}>
                    Feedback Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option>General Feedback</option>
                    <option>Bug Report / Problem</option>
                    <option>Career Data Recommendation</option>
                    <option>Course Recommendation Request</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1.5)' }}>
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                {/* Comment */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1.5)' }}>
                    Comments / Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you liked, what you struggled with, or what features we should add next..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                  <Send style={{ width: 16, height: 16 }} /> Submit Feedback
                </button>
              </form>
            )}
          </div>

          {/* Testimonials Sidebar */}
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
              <AlertCircle style={{ color: 'var(--info)' }} /> Student Testimonials
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {testimonials.map((t, idx) => (
                <div key={idx} className="card" style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: 'var(--text-sm)' }}>{t.name}</strong>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{t.role}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          style={{
                            width: 12,
                            height: 12,
                            fill: i < t.rating ? 'var(--warning)' : 'none',
                            color: i < t.rating ? 'var(--warning)' : 'var(--text-muted)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                    "{t.comment}"
                  </p>
                  <span style={{ display: 'block', textAlign: 'right', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '8px' }}>
                    {t.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
