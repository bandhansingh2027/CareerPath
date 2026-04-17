import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Layout } from '../components/Layout';
import { quizService } from '../services/api';

export function Quiz() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    quizService.getQuestions()
      .then(data => {
        setQuestions(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load questions", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  // Calculate total steps based on unique steps in questions
  const totalSteps = [...new Set(questions.map(q => q.step))].length || 1;
  const currentQuestions = questions.filter(q => q.step === currentStep);
  const progress = (currentStep / totalSteps) * 100;

  const handleAnswer = (questionId, value, isMultiple) => {
    if (isMultiple) {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [questionId]: newAnswers });
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  const isStepComplete = () => {
    return currentQuestions.every(q => {
      if (!q.required) return true;
      const answer = answers[q.id];
      if (Array.isArray(answer)) return answer.length > 0;
      return !!answer;
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => window.scrollTo(0, 0), 10);
    } else {
      // Save answers in sessionStorage for Results page to pick up, or redirect to Results with state
      sessionStorage.setItem('careerpath_answers', JSON.stringify(answers));
      navigate('/results');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => window.scrollTo(0, 0), 10);
    } else {
      navigate('/');
    }
  };

  const stepTitles = ['Your Interests', 'Your Skills', 'Your Background', 'Your Preferences', 'Your Situation'];

  return (
    <Layout showFooter={false}>
      <div className="section-alt" style={{ borderBottom: '1px solid var(--border)', padding: 'var(--space-4) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>
              Step {currentStep} of {totalSteps}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 800, padding: 'var(--space-8) var(--space-6)' }}>
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
            {stepTitles[currentStep - 1] || 'Quiz'}
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-8)' }}>
            Answer honestly — this helps us find the best career paths for you
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {currentQuestions.map((question) => (
              <div key={question.id} style={{ paddingBottom: 'var(--space-8)', borderBottom: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>
                  {question.question}
                  {question.required ? <span style={{ color: 'var(--error)', marginLeft: 4 }}>*</span> : null}
                </h4>
                {question.description && (
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                    {question.description}
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {question.options?.map((option) => {
                    const isSelected = question.type === 'multiple'
                      ? (answers[question.id] || []).includes(option.id)
                      : answers[question.id] === option.id;

                    return (
                      <label key={option.id} className={`option-card ${isSelected ? 'option-card-selected' : ''}`}>
                        <input
                          type={question.type === 'multiple' ? 'checkbox' : 'radio'}
                          name={question.id}
                          value={option.id}
                          checked={isSelected}
                          onChange={() => handleAnswer(question.id, option.id, question.type === 'multiple')}
                        />
                        <span className="option-card-label">{option.label}</span>
                        {isSelected && <Check className="option-card-check" style={{ width: 18, height: 18 }} />}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)' }}>
          <button onClick={handleBack} className="btn btn-ghost">
            <ArrowLeft style={{ width: 16, height: 16 }} />
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="btn btn-primary"
            style={!isStepComplete() ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
          >
            {currentStep === totalSteps ? 'View Results' : 'Next'}
            <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </Layout>
  );
}
