import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'patient' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => axios.post('http://localhost:3001/api/auth/register', data, {
      headers: { 'Content-Type': 'application/json' },
    }),
    onSuccess: (response) => {
      console.log('Registration successful:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      navigate('/welcome', { state: { message: 'Registration successful!' } });
    },
    onError: (error) => {
      console.error('Registration error:', error.response?.data?.error || error.message);
    },
  });

  const isFormValid =
    formData.email.trim().length > 0 &&
    formData.password.trim().length >= 6 &&
    !!formData.role;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log('Form data updated:', { ...formData, [e.target.name]: e.target.value }, 'isFormValid:', isFormValid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      console.log('Submitting form data:', formData);
      mutation.mutate(formData);
    } else {
      console.log('Form is invalid, not submitting:', formData);
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
            <p>Sign up to get started</p>
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
                <span id="password-error" className="error-text">*Password must be at least 6 characters</span>
              {mutation.isError && !formData.password && (
                <span id="password-error" className="error-text">Password must be at least 6 characters</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="role-select"
              >
                <option value="patient">Patient</option>
                <option value="caretaker">Caretaker</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={mutation.isLoading || !isFormValid}
              className="submit-button"
              aria-label="Register"
            >
              {mutation.isLoading ? (
                <span className="loading">
                  <span className="spinner"></span>
                  Registering...
                </span>
              ) : (
                'Register'
              )}
            </button>

            {mutation.isError && (
              <div className="error-message" id="error-message">
                <span>⚠️</span>
                <p>{mutation.error.response?.data?.error || 'An error occurred during registration'}</p>
              </div>
            )}
          </form>

          <div className="signup-link">
            <p>
              Already have an account?{' '}
              <a href="/" aria-label="Login">Login</a>
            </p>
          </div>
        </div>

        <div className="footer">
          <p>
            By registering, you agree to our{' '}
            <a href="/terms" aria-label="Terms of Service">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" aria-label="Privacy Policy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;