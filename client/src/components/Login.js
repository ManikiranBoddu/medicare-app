// src/components/Login.js
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => axios.post('http://localhost:3001/api/auth/login', data, {
      headers: { 'Content-Type': 'application/json' },
    }),
    onSuccess: (response) => {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      navigate('/welcome');
    },
    onError: (error) => {
      console.error('Login error:', error.response?.data?.error || error.message);
    },
  });

  useEffect(() => {
    const isValid = formData.email.length > 0 && formData.password.length >= 6;
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      mutation.mutate(formData);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="background-decoration">
        <div className="circle top-right"></div>
        <div className="circle bottom-left"></div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="logo-section">
            <div className="logo">
              <span>M</span>
            </div>
            <h1>MediCare Companion</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  aria-describedby="email-error"
                />
              </div>
              {mutation.isError && !formData.email && (
                <span id="email-error" className="error-text">Email is required</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="icon">🔒</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Enter your password"
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="toggle-password"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {mutation.isError && !formData.password && (
                <span id="password-error" className="error-text">Password must be at least 6 characters</span>
              )}
            </div>

            <div className="options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  aria-label="Remember me"
                />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={mutation.isLoading || !isFormValid}
              className="submit-button"
              aria-label="Sign in"
            >
              {mutation.isLoading ? (
                <span className="loading">
                  <span className="spinner"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {mutation.isError && (
              <div className="error-message" id="error-message">
                <span>⚠️</span>
                <p>{mutation.error.response?.data?.error || 'An error occurred during login'}</p>
              </div>
            )}
          </form>

          <div className="signup-link">
            <p>
              Don't have an account?{' '}
              <a href="/register" aria-label="Create account">Create account</a>
            </p>
          </div>
        </div>

        <div className="footer">
          <p>
            By signing in, you agree to our{' '}
            <a href="/terms" aria-label="Terms of Service">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" aria-label="Privacy Policy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;