// src/App.js
import React, { useEffect, Component } from 'react';
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Welcome from './components/Welcome';
import PatientDashboard from './components/PatientDashboard';
import CaretakerDashboard from './components/CaretakerDashboard';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>Error: {this.state.error.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  useEffect(() => {
    console.log('AppContent mounted, location:', location.pathname);
    const protectedPaths = ['/dashboard', '/caretaker'];
    const publicPaths = ['/', '/register', '/welcome'];

    if (isAuthenticated) {
      if (!publicPaths.includes(location.pathname) && !protectedPaths.includes(location.pathname)) {
        navigate('/welcome', { replace: true });
      }
    } else if (!publicPaths.includes(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  const handleSwitch = (role) => {
    console.log('Switching to role:', role); // Debug log
    if (role === 'patient') {
      navigate('/dashboard');
    } else if (role === 'caretaker') {
      navigate('/caretaker');
    }
  };

  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Login onSuccess={() => navigate('/welcome')} />
            ) : (
              <Navigate to="/welcome" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <Register />
            ) : (
              <Navigate to="/welcome" replace />
            )
          }
        />
        <Route
          path="/welcome"
          element={
            isAuthenticated ? (
              <Welcome onSwitch={handleSwitch} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <PatientDashboard onSwitch={() => handleSwitch('caretaker')} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/caretaker"
          element={
            isAuthenticated ? (
              <CaretakerDashboard onSwitch={() => handleSwitch('patient')} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};

function App() {
  return <AppContent />;
}

export default App;