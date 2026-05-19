import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/HomePage';
import BrowsePage from '../pages/BrowsePage';
import SkillDetailPage from '../pages/SkillDetailPage';
import SearchResultPage from '../pages/SearchResultPage';
import CommunityPage from '../pages/CommunityPage';
import PostDetailPage from '../pages/PostDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import SubmitSkillPage from '../pages/SubmitSkillPage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'skills', element: <BrowsePage /> },
      { path: 'skills/:slug', element: <SkillDetailPage /> },
      { path: 'search', element: <SearchResultPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'community/:type', element: <CommunityPage /> },
      { path: 'posts/:id', element: <PostDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'submit-skill', element: <SubmitSkillPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
