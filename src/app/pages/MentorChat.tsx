import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { chatService, careerService } from '../services/api';
import { Link } from 'react-router';
import { 
  Bot, Send, Sparkles, ChevronRight, User, Award, 
  MessageSquare, BookOpen, Flame, Compass 
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

export function MentorChat() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activePlan, setActivePlan] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions that are highly aligned with the platform goals
  const suggestions = [
    'How do I bridge my CSS gap for MERN Stack?',
    'What projects are best to get an AI job?',
    'Explain the Spring Boot roadmap',
    'How does my resume score look for Data Analyst?',
    'What certifications are valued in Cybersecurity?'
  ];

  useEffect(() => {
    // Read user profile
    const user = localStorage.getItem('careerpath_currentUser');
    let parsedUser = null;
    if (user) {
      parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
    } else {
      parsedUser = { name: 'Guest Scholar' };
      setCurrentUser(parsedUser);
    }

    // Read active study plan
    const plan = localStorage.getItem('careerpath_activeStudyPlan');
    if (plan) {
      setActivePlan(JSON.parse(plan));
    }

    // Set welcome message
    const welcomeMsg = `Hello **${parsedUser.name || 'Scholar'}**! 🎓 I am your **AI Career Mentor**.\n\nI am configured with full knowledge of modern career paths, required skills, and free learning resources.\n\nI don't just chat—I specialize in **bridging your skill gaps, refining your study plans, and recommending resume-worthy projects**.\n\nHow can I help you build your roadmap today?`;
    setMessages([
      { id: 'welcome', text: welcomeMsg, isBot: true }
    ]);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isBot: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatService.sendMessage(textToSend);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        isBot: true
      }]);
      
      // Update XP for interacting with the mentor!
      if (currentUser) {
        const updated = { ...currentUser, xp: (currentUser.xp || 0) + 10 };
        localStorage.setItem('careerpath_currentUser', JSON.stringify(updated));
        setCurrentUser(updated);
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error while formulating my advice. Please try again.",
        isBot: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };

  const formatMarkdown = (text: string) => {
    let html = text;
    // Replace headers
    html = html.replace(/^### (.*?)$/gm, '<h4 style="margin: 8px 0 4px; font-size: 15px; color: var(--accent);">$1</h4>');
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italics
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="chat-link" style="color: var(--accent); text-decoration: underline; font-weight: bold;">$1</a>');
    // Bullet points
    html = html.replace(/^[\*\-]\s+(.*?)$/gm, '<li style="margin-left: 12px; list-style-type: disc; margin-bottom: 2px;">$1</li>');
    // Line breaks
    html = html.replace(/\n/g, '<br />');
    return html;
  };

  return (
    <Layout>
      <div style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-8) 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ color: 'var(--text-inverse)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>AI Career Mentor Chat</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--text-sm)' }}>Get instant guidance on learning tracks, certificates, and portfolio building</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary" style={{ color: 'var(--text-inverse)', borderColor: 'rgba(255,255,255,0.3)' }}>
            Go to Dashboard
          </Link>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div className="layout-sidebar" style={{ gap: 'var(--space-6)' }}>
          
          {/* LEFT SIDEBAR: PROFILE & MENTOR SUGGESTIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Student Info Card */}
            <div className="card glass-card" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
                <User style={{ color: 'var(--accent)', width: 18, height: 18 }} /> Student Profile
              </h3>
              {currentUser && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Target Career:</span>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>{activePlan?.careerTitle || 'None Selected'}</strong>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flame style={{ width: 14, height: 14, color: '#f97316' }} /> Streak
                    </span>
                    <strong style={{ fontSize: 'var(--text-xs)' }}>{currentUser.streakCount || 0} Days</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Award style={{ width: 14, height: 14, color: 'var(--accent)' }} /> Career XP
                    </span>
                    <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)' }}>{currentUser.xp || 0} XP</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions Box */}
            <div className="card glass-card" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
                <Compass style={{ color: 'var(--accent)', width: 18, height: 18 }} /> Suggested Questions
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                Click any prompt to ask the mentor for specific guidance:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {suggestions.map((s, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(s)}
                    disabled={isTyping}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-xs)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    className="chat-suggestion-btn"
                  >
                    <span style={{ flex: 1, paddingRight: '8px' }}>{s}</span>
                    <ChevronRight style={{ width: 12, height: 12, flexShrink: 0, color: 'var(--accent)' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Link Card */}
            <div className="card" style={{ backgroundColor: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--accent)', marginBottom: 'var(--space-1)' }}>
                <BookOpen style={{ width: 14, height: 14 }} /> Study Planner
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                Have you generated your weekly study plan yet?
              </p>
              <Link to="/study-plan" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Go to Planner
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: MAIN CHAT PANEL */}
          <div className="card glass-card" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '600px',
            padding: 0,
            overflow: 'hidden',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            {/* Chat Panel Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                color: 'var(--text-inverse)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Bot style={{ width: 20, height: 20 }} />
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  border: '1.5px solid var(--bg-secondary)'
                }} />
              </div>
              <div>
                <strong style={{ fontSize: 'var(--text-base)', display: 'block' }}>Career AI Mentor</strong>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontWeight: 'semibold' }}>Active & Ready</span>
              </div>
            </div>

            {/* Conversation Log */}
            <div style={{
              flex: 1,
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '85%',
                    alignSelf: msg.isBot ? 'flex-start' : 'flex-end'
                  }}
                >
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: msg.isBot ? '0px 16px 16px 16px' : '16px 0px 16px 16px',
                      backgroundColor: msg.isBot ? 'var(--bg-secondary)' : 'var(--accent)',
                      color: msg.isBot ? 'var(--text-primary)' : 'var(--text-inverse)',
                      border: msg.isBot ? '1px solid var(--border)' : 'none',
                      fontSize: 'var(--text-sm)',
                      lineHeight: '1.5',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }}
                  />
                  <span style={{
                    fontSize: '9px',
                    color: 'var(--text-muted)',
                    marginTop: '4px',
                    marginRight: msg.isBot ? 0 : '4px',
                    marginLeft: msg.isBot ? '4px' : 0
                  }}>
                    {msg.isBot ? 'Mentor' : 'You'}
                  </span>
                </div>
              ))}
              
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '12px 16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '0px 16px 16px 16px' }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border)',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isTyping}
                placeholder="Ask the mentor about careers, roadmaps, project setups, or skills gap..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--border)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={isTyping || !input.trim()}
                className="btn btn-primary"
                style={{
                  height: '44px',
                  width: '44px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-lg)',
                  flexShrink: 0
                }}
              >
                <Send style={{ width: 18, height: 18 }} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}
