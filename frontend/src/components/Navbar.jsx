import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition">
        EverTales AI
      </Link>
      <div className="flex gap-1 text-sm text-gray-300 items-center">
        <Link to="/explore" className="hover:text-indigo-400 font-medium text-indigo-400 px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          🌍 Explore
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="px-4 py-2 rounded-lg hover:text-indigo-400 hover:bg-gray-800 transition">Dashboard</Link>
            <Link to="/stories" className="px-4 py-2 rounded-lg hover:text-indigo-400 hover:bg-gray-800 transition">My Stories</Link>
            <Link to="/timeline" className="px-4 py-2 rounded-lg hover:text-indigo-400 hover:bg-gray-800 transition">📅 Timeline</Link>
            <Link to="/profile" className="px-4 py-2 rounded-lg hover:text-indigo-400 hover:bg-gray-800 transition">Profile</Link>
            <span className="text-slate-600 mx-2">|</span>
            <span className="text-gray-400 font-medium">Hi, {user?.name?.split(' ')[0]}</span>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-950/20 px-4 py-2 rounded-lg transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 rounded-lg hover:text-indigo-400 hover:bg-gray-800 transition">Login</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition ml-2 shadow-sm hover:shadow-md">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
