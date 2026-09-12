import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import AddStory from '../pages/AddStory.jsx';
import StoryLibrary from '../pages/StoryLibrary.jsx';
import StoryDetails from '../pages/StoryDetails.jsx';
import EditStory from '../pages/EditStory.jsx';
import UserProfile from '../pages/UserProfile.jsx';
import ChangePasswordPage from '../pages/ChangePasswordPage.jsx';
import TimelineView from '../pages/TimelineView.jsx';
import ExploreMemories from '../pages/ExploreMemories.jsx';
import PublicStoryDetails from '../pages/PublicStoryDetails.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/explore" element={<ExploreMemories />} />
      <Route path="/public/stories/:id" element={<PublicStoryDetails />} />

      {/* Protected routes — require login */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/stories" element={<ProtectedRoute><StoryLibrary /></ProtectedRoute>} />
      <Route path="/timeline" element={<ProtectedRoute><TimelineView /></ProtectedRoute>} />
      <Route path="/stories/new" element={<ProtectedRoute><AddStory /></ProtectedRoute>} />
      <Route path="/stories/:id" element={<ProtectedRoute><StoryDetails /></ProtectedRoute>} />
      <Route path="/stories/:id/edit" element={<ProtectedRoute><EditStory /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default AppRoutes;
