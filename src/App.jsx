import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { fetchSession, logout } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    fetchSession()
      .then(userData => {
        setUser(userData);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setError('');
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        setUser(null);
      })
      .catch(err => {
        console.error('Logout error:', err);
        setUser(null);
      });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={`app ${user ? 'dashboard-mode' : 'login-mode'}`}>
      <header className="app-header">
        <h1>Yacht Club Booking System</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.username}</span>
            <button 
              onClick={handleLogout} 
              className="logout-button"
            >
              Logout
            </button>
          </div>
        )}
      </header>
      
      <main className="app-main">
        {error && <div className="error-message">{error}</div>}
        
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Dashboard user={user} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

export default App;