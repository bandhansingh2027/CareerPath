import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Layout } from '../components/Layout';
import { User, Mail, Lock, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    year: '1st Year'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      // Mock Login
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('careerpath_users') || '[]');
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        localStorage.setItem('careerpath_currentUser', JSON.stringify(user));
        setSuccess('Logged in successfully! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        // If no user exists, simulate a successful login for prototype ease
        const mockUser = {
          name: formData.email.split('@')[0],
          email: formData.email,
          college: 'Government Engineering College',
          year: '3rd Year',
          savedCareers: ['fullstack-web-dev'],
          completedLessons: [],
          quizHistory: []
        };
        localStorage.setItem('careerpath_currentUser', JSON.stringify(mockUser));
        setSuccess('Logged in successfully! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } else {
      // Mock Signup
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }

      const users = JSON.parse(localStorage.getItem('careerpath_users') || '[]');
      if (users.some((u: any) => u.email === formData.email)) {
        setError('User already exists with this email');
        return;
      }

      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        college: formData.college || 'Tier-3 Engineering College',
        year: formData.year,
        savedCareers: [],
        completedLessons: [],
        quizHistory: []
      };

      users.push(newUser);
      localStorage.setItem('careerpath_users', JSON.stringify(users));
      localStorage.setItem('careerpath_currentUser', JSON.stringify(newUser));

      setSuccess('Account created successfully! Welcome to CareerPath.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    }
  };

  return (
    <Layout showFooter={false}>
      <div style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6) 0',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '480px',
          padding: 'var(--space-6)',
          zIndex: 2
        }}>
          <div className="card" style={{
            padding: 'var(--space-8)',
            backdropFilter: 'blur(16px)',
            backgroundColor: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-xl)'
          }}>
            
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-bg)',
                color: 'var(--accent)',
                marginBottom: 'var(--space-4)'
              }}>
                <Sparkles style={{ width: 24, height: 24 }} />
              </div>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                {isLogin ? 'Welcome Back' : 'Create Your Account'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                {isLogin ? 'Sign in to access your dashboard & study plans' : 'Join CareerPath to map your professional journey'}
              </p>
            </div>

            {error && (
              <div style={{
                backgroundColor: 'var(--error-bg)',
                color: 'var(--error)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-4)',
                textAlign: 'center',
                border: '1px solid rgba(var(--error-rgb), 0.2)'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                border: '1px solid rgba(var(--success-rgb), 0.2)'
              }}>
                <CheckCircle style={{ width: 16, height: 16 }} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {!isLogin && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1.5)', color: 'var(--text-secondary)' }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1.5)', color: 'var(--text-secondary)' }}>College / University</label>
                      <input
                        type="text"
                        name="college"
                        placeholder="e.g. LPU, GEC"
                        value={formData.college}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1.5)', color: 'var(--text-secondary)' }}>Current Year</label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', height: '40px' }}
                      >
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                        <option>Graduate</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1.5)', color: 'var(--text-secondary)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1.5)', color: 'var(--text-secondary)' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                {isLogin ? 'Sign In' : 'Register Now'}
                <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </form>

            <div style={{
              marginTop: 'var(--space-6)',
              textAlign: 'center',
              borderTop: '1px solid var(--border)',
              paddingTop: 'var(--space-4)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)'
            }}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontWeight: 'var(--font-semibold)',
                  marginLeft: '6px',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
