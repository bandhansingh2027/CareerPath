import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';
import { chatService } from '../services/api';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

export function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Hi there! I am your **CareerPath AI Advisor** 🚀\n\nI can help you explore career options, salary ranges, learning resources, and roadmaps. Ask me anything, or take the [Career Quiz](/quiz) to find matches!',
      isBot: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'What is the salary of a Data Analyst?',
    'Tell me about UI/UX Design',
    'Where can I learn coding for free?',
    'Which careers have high demand?'
  ];

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
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't reach the advisor server. Please check if the API is running.",
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

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleLinkNavigation = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      const href = target.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
        setIsOpen(false);
      }
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
    html = html.replace(/^[\*\-]\s+(.*?)$/gm, '<li style="margin-left: 12px; list-style-type: disc;">$1</li>');
    // Line breaks
    html = html.replace(/\n/g, '<br />');
    return html;
  };

  return (
    <div className="chat-widget">
      {/* Floating Trigger Button */}
      <button 
        className="chat-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Career AI Chatbot"
      >
        {isOpen ? <X style={{ width: 24, height: 24 }} /> : <MessageSquare style={{ width: 24, height: 24 }} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Bot style={{ width: 18, height: 18, color: 'var(--text-inverse)' }} />
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  border: '1.5px solid var(--accent)'
                }} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  AI Advisor <Sparkles style={{ width: 12, height: 12, fill: 'var(--text-inverse)' }} />
                </div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>Online & ready to guide</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-inverse)', cursor: 'pointer', padding: 0 }}
            >
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chat-messages" onClick={handleLinkNavigation}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`chat-bubble ${msg.isBot ? 'chat-bubble-bot' : 'chat-bubble-user'}`}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }}
              />
            ))}
            {isTyping && (
              <div className="chat-bubble chat-bubble-bot" style={{ display: 'flex', gap: 3, alignItems: 'center', padding: '10px 14px' }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions (if no user messages sent yet, or contextually) */}
          {messages.length === 1 && !isTyping && (
            <div className="chat-suggestions">
              {suggestions.map((s, idx) => (
                <button 
                  key={idx} 
                  className="chat-suggestion-chip"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="chat-input-area">
            <input 
              type="text" 
              className="form-input" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              style={{ flex: 1, height: '38px', borderRadius: 'var(--radius-lg)', margin: 0 }}
            />
            <button 
              className="btn btn-primary" 
              onClick={() => handleSend(input)}
              disabled={isTyping || !input.trim()}
              style={{ height: '38px', width: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)' }}
            >
              <Send style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
