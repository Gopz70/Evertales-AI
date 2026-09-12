import AppRoutes from './routes/AppRoutes.jsx';
import Navbar from './components/Navbar.jsx';
import FloatingActionButton from './components/FloatingActionButton.jsx';
import { useAuth } from './context/AuthContext.jsx';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-black">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <AppRoutes />
      </main>
      {isAuthenticated && <FloatingActionButton />}
    </div>
  );
}

export default App;
