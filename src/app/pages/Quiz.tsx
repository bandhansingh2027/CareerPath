import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Check, GraduationCap, Compass, Target, Sparkles } from 'lucide-react';
import { Layout } from '../components/Layout';
import { quizService } from '../services/api';

export function Quiz() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({
    education: '',
    interests: [],
    goal: ''
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    quizService.getQuestions()
      .then(data => {
        setQuestions(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load onboarding steps", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  const totalSteps = questions.length || 3;
  const currentQuestion = questions.find(q => q.step === currentStep);
  const progress = (currentStep / totalSteps) * 100;

  const handleSelectSingle = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSelectMultiple = (questionId: string, optionId: string) => {
    setAnswers(prev => {
      const currentList = prev[questionId] || [];
      const isSelected = currentList.includes(optionId);
      const newList = isSelected
        ? currentList.filter((id: string) => id !== optionId)
        : currentList.length < 3 
          ? [...currentList, optionId]
          : currentList; // Limit to 3 interests max
      return {
        ...prev,
        [questionId]: newList
      };
    });
  };

  const isStepComplete = () => {
    if (!currentQuestion) return false;
    const value = answers[currentQuestion.id];
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save answers
      sessionStorage.setItem('careerpath_answers', JSON.stringify(answers));
      
      // Save/Initialize currentUser for dashboard integration
      const educationLabel = currentQuestion?.options?.find((o: any) => o.id === answers.education)?.label || 'B.Tech Student';
      const goalLabel = questions.find(q => q.id === 'goal')?.options?.find((o: any) => o.id === answers.goal)?.label || 'Developer';
      
      const userProfile = {
        name: 'Guest Scholar',
        email: 'guest@college.edu',
        college: 'Aryabhatta University of Tech',
        year: educationLabel,
        savedCareers: [answers.goal],
        studyPlanProgress: 0,
        streakCount: 1,
        lastActiveDate: new Date().toDateString(),
        badges: ['explorer']
      };
      
      localStorage.setItem('careerpath_currentUser', JSON.stringify(userProfile));
      
      // Create a default study plan immediately based on career goal
      quizService.submitAnswers(answers).then(res => {
        const topMatch = res.recommendations[0];
        const defaultPlan = {
          careerId: topMatch.career.id,
          careerTitle: topMatch.career.title,
          experienceLevel: answers.education.includes('cs') || answers.education.includes('mca') ? 'Intermediate' : 'Beginner',
          hoursPerWeek: 15,
          weeks: topMatch.weeklyLearningPlan.map((desc: string, idx: number) => ({
            week: idx + 1,
            title: `Week ${idx + 1}: ${desc.split(':')[1]?.trim() || desc}`,
            hoursAllocated: 15,
            tasks: [
              { id: `w${idx+1}-t1`, label: `Learn: ${desc.split(':')[1]?.trim() || desc}`, completed: false, hours: 5 },
              { id: `w${idx+1}-t2`, label: `Build a mini application demonstrating this competency`, completed: false, hours: 6 },
              { id: `w${idx+1}-t3`, label: `Submit project code and review with AI Career Mentor`, completed: false, hours: 4 }
            ],
            resources: [
              { title: `${topMatch.career.title} Free Tutorial`, provider: 'freeCodeCamp', url: 'https://freecodecamp.org' },
              { title: 'Interactive Practice Sandbox', provider: 'StackBlitz', url: 'https://stackblitz.com' }
            ]
          })),
          createdAt: new Date().toLocaleDateString()
        };
        localStorage.setItem('careerpath_activeStudyPlan', JSON.stringify(defaultPlan));
      }).catch(console.error);

      navigate('/results');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  // Get icons for each step
  const getStepIcon = () => {
    if (currentStep === 1) return <GraduationCap style={{ width: 24, height: 24, color: 'var(--accent)' }} />;
    if (currentStep === 2) return <Compass style={{ width: 24, height: 24, color: 'var(--accent)' }} />;
    return <Target style={{ width: 24, height: 24, color: 'var(--accent)' }} />;
  };

  return (
    <Layout showFooter={false}>
      {/* Onboarding Header */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: 'var(--space-4) 0', backgroundColor: 'var(--bg-secondary)', backdropFilter: 'blur(10px)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--accent)' }}>
              Step {currentStep} of {totalSteps}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {currentStep === 1 ? 'Education' : currentStep === 2 ? 'Interests' : 'Career Target'}
            </span>
          </div>
          <div style={{ width: '150px' }}>
            <div className="progress-track" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${progress}%`, height: 6 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main onboarding container */}
      <div className="container" style={{ maxWidth: 700, padding: 'var(--space-12) var(--space-4)' }}>
        <div className="glass-card" style={{
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getStepIcon()}
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', margin: 0 }}>Career Mentor Onboarding</h2>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Zero boring questions. Only the essentials.</span>
            </div>
          </div>

          <h3 style={{ fontSize: 'var(--text-lg)', margin: 'var(--space-4) 0 var(--space-6)', fontWeight: 'var(--font-bold)', lineHeight: '1.4' }}>
            {currentQuestion?.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
            {currentQuestion?.options.map((option: any) => {
              const isSelected = currentQuestion.type === 'multiple'
                ? (answers[currentQuestion.id] || []).includes(option.id)
                : answers[currentQuestion.id] === option.id;

              return (
                <div
                  key={option.id}
                  onClick={() => currentQuestion.type === 'multiple' 
                    ? handleSelectMultiple(currentQuestion.id, option.id)
                    : handleSelectSingle(currentQuestion.id, option.id)
                  }
                  className={`option-card ${isSelected ? 'option-card-selected' : ''}`}
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 12px var(--glow-1)' : 'none',
                    border: isSelected ? '1.5px solid var(--accent)' : '1.5px solid var(--border)'
                  }}
                >
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                    {option.label}
                  </span>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: currentQuestion.type === 'multiple' ? '4px' : '50%',
                    border: '1.5px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected ? 'var(--accent)' : 'transparent',
                    borderColor: isSelected ? 'var(--accent)' : 'var(--border)'
                  }}>
                    {isSelected && <Check style={{ width: 12, height: 12, color: 'var(--text-inverse)' }} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-6)' }}>
            <button onClick={handleBack} className="btn btn-ghost">
              <ArrowLeft style={{ width: 16, height: 16 }} />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className="btn btn-primary"
              style={{
                opacity: isStepComplete() ? 1 : 0.5,
                cursor: isStepComplete() ? 'pointer' : 'not-allowed',
                boxShadow: isStepComplete() ? '0 4px 10px rgba(15, 118, 110, 0.2)' : 'none'
              }}
            >
              {currentStep === totalSteps ? (
                <>
                  Generate My Roadmap <Sparkles style={{ width: 14, height: 14 }} />
                </>
              ) : (
                <>
                  Continue <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}
