import { useState } from 'react';
import { register, login } from '../services/api';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateUsername = (username) => {
    if (!username.trim()) {
      return 'Username is required';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, hyphens, and underscores';
    }
    if (username === 'dog') {
      return 'This username is not allowed';
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    if (isRegistering) {
      register(username)
        .then(() => {
          return login(username);
        })
        .then(userData => {
          onLogin(userData);
        })
        .catch(err => {
          setError(err.error || 'Registration failed');
          setLoading(false);
        });
    } else {
      login(username)
        .then(userData => {
          onLogin(userData);
        })
        .catch(err => {
          if (err.error === 'User not found. Please register first.') {
            setError('User not found. Please register first.');
          } else {
            setError(err.error || 'Login failed');
          }
          setLoading(false);
        });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="login-subtitle">
          {isRegistering 
            ? 'Join our exclusive yacht club community' 
            : 'Sign in to manage your yacht experiences'}
        </p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              className="form-input"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Please wait...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>
        
        <div className="toggle-mode">
          {isRegistering ? (
            <p>
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setError('');
                }}
                className="link-button"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              New to Yacht Club?{' '}
              <button 
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setError('');
                }}
                className="link-button"
              >
                Create account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;