import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { Quiz } from './pages/Quiz';
import { Results } from './pages/Results';
import { Careers } from './pages/Careers';
import { CareerDetail } from './pages/CareerDetail';
import { Resources } from './pages/Resources';
import { Compare } from './pages/Compare';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';
import { SkillGapAnalyzer } from './pages/SkillGapAnalyzer';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { StudyPlan } from './pages/StudyPlan';
import { CareerReport } from './pages/CareerReport';
import { Feedback } from './pages/Feedback';

export const router = createBrowserRouter([
  { path: '/', Component: Home },
  { path: '/careers', Component: Careers },
  { path: '/career/:id', Component: CareerDetail },
  { path: '/skill-gap/:careerId', Component: SkillGapAnalyzer },
  { path: '/quiz', Component: Quiz },
  { path: '/results', Component: Results },
  { path: '/resources', Component: Resources },
  { path: '/compare', Component: Compare },
  { path: '/about', Component: About },
  { path: '/auth', Component: Auth },
  { path: '/dashboard', Component: Dashboard },
  { path: '/resume-analyzer', Component: ResumeAnalyzer },
  { path: '/study-plan', Component: StudyPlan },
  { path: '/career-report/:careerId', Component: CareerReport },
  { path: '/feedback', Component: Feedback },
  { path: '*', Component: NotFound },
]);

