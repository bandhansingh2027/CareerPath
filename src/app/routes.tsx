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

export const router = createBrowserRouter([
  { path: '/', Component: Home },
  { path: '/careers', Component: Careers },
  { path: '/career/:id', Component: CareerDetail },
  { path: '/quiz', Component: Quiz },
  { path: '/results', Component: Results },
  { path: '/resources', Component: Resources },
  { path: '/compare', Component: Compare },
  { path: '/about', Component: About },
  { path: '*', Component: NotFound },
]);
