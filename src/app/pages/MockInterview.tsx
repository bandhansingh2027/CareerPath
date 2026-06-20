import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { careerService } from '../services/api';
import { Link } from 'react-router';
import { 
  Sparkles, MessageSquare, Award, ArrowRight, RefreshCw, 
  HelpCircle, CheckCircle, ChevronRight, User, AlertCircle, PlayCircle 
} from 'lucide-react';

interface Question {
  id: number;
  text: string;
  idealAnswer: string;
}

const INTERVIEW_QUESTIONS: Record<string, Question[]> = {
  'mern-stack-dev': [
    { id: 1, text: "Explain the difference between Virtual DOM and Real DOM in React.", idealAnswer: "React's Virtual DOM is a lightweight, in-memory representation of the real DOM. When state changes, React updates the Virtual DOM first, compares it with a snapshot using a diffing algorithm (reconciliation), and updates only the changed elements in the real DOM, boosting performance." },
    { id: 2, text: "What is middleware in Express, and how does it work?", idealAnswer: "Middleware functions are functions that have access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle. They can execute code, modify request/response objects, end the cycle, or call next() to pass control." },
    { id: 3, text: "How does MongoDB handle relationships between data collections?", idealAnswer: "MongoDB handles relationships in two main ways: Embedded documents (nesting related data inside a single document, ideal for 1-to-few relationships and read-heavy operations) and Reference documents (linking documents using references like ObjectIds, ideal for 1-to-many/many-to-many relationships to avoid duplication)." },
    { id: 4, text: "Explain the event loop in Node.js.", idealAnswer: "Node.js runs on a single-threaded event loop. It delegates blocking tasks (like I/O) to the system kernel or Libuv's thread pool. Once asynchronous operations complete, their callbacks are queued and executed sequentially by the event loop when the call stack is empty." },
    { id: 5, text: "What is the difference between useEffect and useMemo?", idealAnswer: "useEffect is used to run side-effects (e.g., API calls, subscriptions) after rendering. useMemo is used to cache/memoize the computed value of an expensive operation between renders, only recalculating it when its dependencies change." }
  ],
  'ai-ml-engineer': [
    { id: 1, text: "Explain the difference between Supervised and Unsupervised learning.", idealAnswer: "Supervised learning uses labeled training data to learn mapping functions from inputs to outputs (e.g., classification, regression). Unsupervised learning models unlabeled data to discover hidden patterns, groupings, or distributions (e.g., clustering like K-Means, dimensionality reduction like PCA)." },
    { id: 2, text: "What is overfitting, and how can you prevent it in neural networks?", idealAnswer: "Overfitting occurs when a model learns noise and details in training data so well that it performs poorly on unseen data. Prevention techniques include L1/L2 regularization, Dropout (randomly turning off neurons), early stopping, data augmentation, and reducing network capacity." },
    { id: 3, text: "How does the backpropagation algorithm work?", idealAnswer: "Backpropagation computes the gradient of the loss function with respect to the network weights. It uses the chain rule of calculus, traversing backward from the output layer to the input layer to calculate how much each weight contributed to the loss, enabling updates via gradient descent." },
    { id: 4, text: "Explain the self-attention mechanism in Transformers.", idealAnswer: "Self-attention allows a model to weigh the importance of different words in a sequence relative to a target word. It calculates query, key, and value vectors for each input token, computes dot-product attention scores to create weights, and aggregates value vectors accordingly." },
    { id: 5, text: "What is gradient vanishing, and how do activation functions like ReLU help?", idealAnswer: "Vanishing gradient happens during backpropagation when gradients shrink exponentially, stopping weights from updating. Sigmoid/Tanh have flat margins, making gradients near 0. ReLU (Rectified Linear Unit) resolves this because its gradient is exactly 1 for all positive inputs." }
  ],
  'cybersecurity-analyst': [
    { id: 1, text: "What is the difference between Symmetric and Asymmetric encryption?", idealAnswer: "Symmetric encryption uses a single shared key for both encryption and decryption (fast, e.g., AES). Asymmetric encryption uses a public key to encrypt and a separate private key to decrypt (secure key exchange, e.g., RSA)." },
    { id: 2, text: "Explain what SQL Injection (SQLi) is and how to defend against it.", idealAnswer: "SQL Injection occurs when malicious SQL code is injected into input fields, manipulating backend databases. Defense includes parameterized queries (prepared statements), input validation/sanitization, and using ORMs that automatically parameterize inputs." },
    { id: 3, text: "What is the difference between IDS and IPS?", idealAnswer: "IDS (Intrusion Detection System) is a passive monitoring system that detects threats and alerts administrators. IPS (Intrusion Prevention System) is active; it sits in-line to detect, alert, and automatically block/mitigate threats in real-time." },
    { id: 4, text: "Describe the three-way handshake in TCP.", idealAnswer: "The TCP three-way handshake establishes a reliable connection: 1) Client sends SYN (Synchronize) packet. 2) Server responds with SYN-ACK (Synchronize-Acknowledge) packet. 3) Client sends ACK (Acknowledge) back. The connection is then established." },
    { id: 5, text: "What is cross-site scripting (XSS) and how is it mitigated?", idealAnswer: "XSS occurs when malicious scripts are injected into trusted websites and executed in user browsers. Mitigation includes escaping input data, implementing Content Security Policies (CSP), sanitizing HTML, and using HttpOnly cookies to prevent token theft." }
  ],
  'data-analyst': [
    { id: 1, text: "What is the difference between Inner Join and Left Join in SQL?", idealAnswer: "An Inner Join returns only the rows that have matching values in both tables. A Left Join returns all rows from the left table, and the matched rows from the right table; if no match is found, NULL values are filled for the right table columns." },
    { id: 2, text: "Explain the difference between mean, median, and mode, and when to use which.", idealAnswer: "Mean is the average (sensitive to outliers). Median is the middle value (best for skewed data, e.g., salaries). Mode is the most frequent value (best for categorical data)." },
    { id: 3, text: "What is data normalization, and why is it important?", idealAnswer: "Data normalization is the process of organizing databases to reduce redundancy and improve data integrity. It involves creating tables and establishing relationships, ensuring that data dependencies are logical and preventing anomalies during inserts/updates." },
    { id: 4, text: "What is a Pivot Table in Excel, and what is it used for?", idealAnswer: "A Pivot Table is an interactive Excel tool used to summarize, analyze, explore, and present large datasets. It allows users to group rows, calculate counts, sums, or averages, and detect trends without writing complex formulas." },
    { id: 5, text: "Explain the difference between descriptive and predictive analytics.", idealAnswer: "Descriptive analytics analyzes historical data to understand 'what happened' (e.g., monthly sales report). Predictive analytics uses historical data, statistical algorithms, and machine learning to forecast 'what might happen' in the future." }
  ],
  'java-backend-dev': [
    { id: 1, text: "Explain the difference between JDK, JRE, and JVM.", idealAnswer: "JVM (Java Virtual Machine) executes Java bytecode. JRE (Java Runtime Environment) contains JVM and libraries to run Java apps. JDK (Java Development Kit) is the full development package containing JRE, compiler (javac), and debugger." },
    { id: 2, text: "What is Dependency Injection in Spring Boot, and what are its benefits?", idealAnswer: "Dependency Injection (DI) is a design pattern where the Spring container instantiates and injects dependency objects into classes. It promotes loose coupling, enhances code reusability, and makes classes easier to unit test using mock objects." },
    { id: 3, text: "Explain the difference between method overloading and method overriding.", idealAnswer: "Overloading occurs in the same class when methods share the same name but have different parameter lists (compile-time polymorphism). Overriding occurs in a subclass that redefines a method inherited from a superclass with the exact same signature (runtime polymorphism)." },
    { id: 4, text: "How does Garbage Collection work in Java?", idealAnswer: "Java Garbage Collection (GC) is an automatic process that reclaims heap memory by destroying unreachable objects. It runs in the background, identifying objects no longer referenced by the application stack and freeing up their memory." },
    { id: 5, text: "What is the difference between an Interface and an Abstract Class?", idealAnswer: "An interface defines a contract (all methods abstract by default, supports multiple inheritance). An abstract class is a class that cannot be instantiated but can contain abstract and concrete methods, member variables, and constructors (supports single inheritance)." }
  ]
};

export function MockInterview() {
  const [careers, setCareers] = useState<any[]>([]);
  const [selectedCareer, setSelectedCareer] = useState('mern-stack-dev');
  
  // Quiz phases: 'setup', 'interviewing', 'evaluating', 'results'
  const [phase, setPhase] = useState<'setup' | 'interviewing' | 'evaluating' | 'results'>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  // Feedback state
  const [overallScore, setOverallScore] = useState(0);
  const [evaluation, setEvaluation] = useState<any[]>([]);
  const [generalFeedback, setGeneralFeedback] = useState({ strengths: '', weaknesses: '', advice: '' });

  useEffect(() => {
    careerService.getCareers()
      .then(data => {
        setCareers(data);
        // Load target career from local storage user profile if available
        const user = localStorage.getItem('careerpath_currentUser');
        if (user) {
          const parsed = JSON.parse(user);
          if (parsed.savedCareers && parsed.savedCareers.length > 0) {
            setSelectedCareer(parsed.savedCareers[0]);
          }
        }
      })
      .catch(console.error);
  }, []);

  const startInterview = () => {
    const list = INTERVIEW_QUESTIONS[selectedCareer] || INTERVIEW_QUESTIONS['mern-stack-dev'];
    setQuestions(list);
    setCurrentQIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
    setPhase('interviewing');
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQIndex] = currentAnswer;
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Evaluate interview answers
      evaluateInterview(newAnswers);
    }
  };

  const evaluateInterview = (submittedAnswers: string[]) => {
    setPhase('evaluating');
    
    // Simulate complex NLP grading
    setTimeout(() => {
      let totalPoints = 0;
      const results = questions.map((q, idx) => {
        const userAns = (submittedAnswers[idx] || '').trim();
        
        // Simple mock algorithm to calculate score based on keyword intersections
        const words = userAns.toLowerCase().split(/\s+/);
        const idealWords = q.idealAnswer.toLowerCase().split(/\s+/);
        const uniqueIdeal = Array.from(new Set(idealWords.filter(w => w.length > 4)));
        
        let matchCount = 0;
        uniqueIdeal.forEach(w => {
          if (userAns.toLowerCase().includes(w)) matchCount++;
        });

        const matchPercent = uniqueIdeal.length > 0 ? (matchCount / uniqueIdeal.length) : 0;
        let score = 40; // baseline if user typed something
        if (userAns.length < 15) score = 10; // too short
        else {
          score = Math.min(100, Math.round(50 + (matchPercent * 50)));
        }

        totalPoints += score;

        let feedback = "A bit concise. Try explaining technical keywords in detail.";
        if (score >= 80) feedback = "Excellent! You explained key concepts accurately with correct terminology.";
        else if (score >= 60) feedback = "Good explanation. You captured the core concept, but could add more detail about implementation.";

        return {
          question: q.text,
          userAnswer: userAns,
          idealAnswer: q.idealAnswer,
          score,
          feedback
        };
      });

      const avgScore = Math.round(totalPoints / questions.length);
      setOverallScore(avgScore);
      setEvaluation(results);

      // Generate Strengths & Weaknesses based on average score
      let strengths = "Demonstrated baseline knowledge of core concepts. Able to structure technical replies.";
      let weaknesses = "Lacks detailed elaboration on practical parameters or system cycles.";
      let advice = "Build mini applications for these technologies and read documentation. Practice speaking out loud.";

      if (avgScore >= 80) {
        strengths = "Excellent technical depth, accurate term usages, clear distinction of complex structures.";
        weaknesses = "Minor architectural details could be further specified.";
        advice = "You are ready for coding rounds! Continue mock practice to sharpen performance.";
      } else if (avgScore >= 60) {
        strengths = "Good grasp of web fundamentals, correct identification of technology layers.";
        weaknesses = "Sometimes vague. Missing specifics on garbage collectors, virtual structures, or memory management.";
        advice = "Write down definitions. Build 1-2 projects where you directly configure these components (e.g., custom express middleware).";
      }

      setGeneralFeedback({ strengths, weaknesses, advice });

      // Save to local storage to update user profile XP / badges
      const userStr = localStorage.getItem('careerpath_currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Add XP
        const xpEarned = avgScore * 5;
        user.xp = (user.xp || 0) + xpEarned;
        
        // Award badge for interview completion
        if (!user.badges.includes('interview_complete')) {
          user.badges.push('interview_complete');
        }
        if (avgScore >= 85 && !user.badges.includes('interview_ace')) {
          user.badges.push('interview_ace');
        }
        localStorage.setItem('careerpath_currentUser', JSON.stringify(user));
      }

      setPhase('results');
    }, 3000);
  };

  const handleSkipQuestion = () => {
    setCurrentAnswer('Did not answer.');
    handleNextQuestion();
  };

  return (
    <Layout>
      <div style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ color: 'var(--text-inverse)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>AI Mock Interview</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>Practice real-world interview questions and receive instant AI performance analytics</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary" style={{ color: 'var(--text-inverse)', borderColor: 'rgba(255,255,255,0.3)' }}>
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: '900px' }}>
        {/* Setup phase */}
        {phase === 'setup' && (
          <div className="card glass-card" style={{ padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'var(--accent-bg)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageSquare style={{ width: 24, height: 24 }} />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Configure Interview Session</h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Select your career target and start a 5-question mock screening</span>
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label className="form-label" style={{ fontWeight: 'bold' }}>Target Role</label>
              <select
                className="form-input"
                value={selectedCareer}
                onChange={(e) => setSelectedCareer(e.target.value)}
                style={{ padding: '12px' }}
              >
                {careers.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--border)', marginBottom: 'var(--space-6)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>
                <Sparkles style={{ width: 16, height: 16, color: 'var(--accent)' }} /> Mock Screening Rules
              </h4>
              <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>You will be asked 5 technical questions based on {careers.find(c => c.id === selectedCareer)?.title || 'selected role'}.</li>
                <li>Type your answers clearly. Elaborate on details (aim for 2-4 sentences).</li>
                <li>Our Interview Feedback Analyzer will score each answer and generate general feedback.</li>
                <li>Completing the interview awards **XP** and unlocks achievement badges!</li>
              </ul>
            </div>

            <button onClick={startInterview} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              <PlayCircle style={{ width: 20, height: 20 }} /> Start Mock Interview
            </button>
          </div>
        )}

        {/* Interviewing Phase */}
        {phase === 'interviewing' && (
          <div className="card glass-card" style={{ padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--accent)' }}>
                Question {currentQIndex + 1} of {questions.length}
              </span>
              <div style={{ width: '120px' }}>
                <div className="progress-track" style={{ height: 6 }}>
                  <div className="progress-fill" style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%`, height: 6 }} />
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-6)', fontWeight: 'bold', lineHeight: '1.4' }}>
              Q: {questions[currentQIndex]?.text}
            </h3>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label className="form-label">Your Response</label>
              <textarea
                className="form-input"
                rows={8}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your explanation here. Use examples and mention tech stacks where relevant..."
                style={{ fontFamily: 'sans-serif', padding: '12px', fontSize: 'var(--text-sm)' }}
              />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Word count: {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words. Long, detailed answers get higher scores.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={handleSkipQuestion} className="btn btn-ghost">
                Skip Question
              </button>
              <button 
                onClick={handleNextQuestion} 
                disabled={!currentAnswer.trim()}
                className="btn btn-primary"
                style={{ opacity: currentAnswer.trim() ? 1 : 0.5 }}
              >
                {currentQIndex === questions.length - 1 ? 'Finish & Analyze' : 'Next Question'} <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        )}

        {/* Evaluating Phase */}
        {phase === 'evaluating' && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-6)' }}>
            <div className="spinner" style={{ margin: '0 auto var(--space-4)' }} />
            <h3 style={{ animation: 'pulse 1.5s infinite', margin: 0 }}>Analyzing Responses...</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: '8px' }}>
              Our Interview Feedback Analyzer is parsing your terminology, logical structures, and comparing against reference definitions.
            </p>
          </div>
        )}

        {/* Results Phase */}
        {phase === 'results' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* Header / Score Banner */}
            <div className="card glass-card" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-6)',
              background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--accent-bg) 100%)',
              borderLeft: '4px solid var(--accent)'
            }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Interview Complete
                </span>
                <h2 style={{ fontSize: 'var(--text-2xl)', marginTop: '4px', marginBottom: '8px' }}>
                  {careers.find(c => c.id === selectedCareer)?.title} Screen
                </h2>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>
                  XP and feedback badges have been saved to your dashboard!
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: overallScore >= 75 ? 'var(--success)' : 'var(--accent)', lineHeight: 1 }}>
                  {overallScore}%
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Average Readiness</span>
              </div>
            </div>

            {/* Strengths & Weaknesses (Interview Feedback Analyzer) */}
            <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
              <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                <h4 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                  <CheckCircle style={{ width: 18, height: 18 }} /> Core Strengths
                </h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{generalFeedback.strengths}</p>
              </div>

              <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
                <h4 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                  <AlertCircle style={{ width: 18, height: 18 }} /> Areas to Improve
                </h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{generalFeedback.weaknesses}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="card">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                <Award style={{ color: 'var(--accent)', width: 18, height: 18 }} /> Mentor Action Plan
              </h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 0 }}>
                {generalFeedback.advice}
              </p>
            </div>

            {/* Question Breakdown */}
            <div>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Detailed Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {evaluation.map((evalItem, index) => (
                  <div key={index} className="card" style={{ padding: 'var(--space-5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                      <strong style={{ fontSize: 'var(--text-sm)' }}>Question {index + 1}</strong>
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'bold',
                        color: evalItem.score >= 80 ? 'var(--success)' : evalItem.score >= 60 ? 'var(--info)' : 'var(--warning)',
                        backgroundColor: evalItem.score >= 80 ? 'var(--success-bg)' : evalItem.score >= 60 ? 'var(--info-bg)' : 'var(--warning-bg)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        Score: {evalItem.score}/100
                      </span>
                    </div>

                    <p style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                      {evalItem.question}
                    </p>

                    <div style={{ borderLeft: '3px solid var(--border)', paddingLeft: '12px', marginBottom: 'var(--space-4)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Your Answer:</span>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                        {evalItem.userAnswer || 'No response.'}
                      </p>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Ideal Sample Answer:</span>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0 }}>
                        {evalItem.idealAnswer}
                      </p>
                    </div>

                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
                      💡 <strong>Feedback:</strong> {evalItem.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
              <button onClick={() => setPhase('setup')} className="btn btn-primary">
                <RefreshCw style={{ width: 16, height: 16 }} /> Restart Practice Session
              </button>
              <Link to="/dashboard" className="btn btn-secondary">
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
