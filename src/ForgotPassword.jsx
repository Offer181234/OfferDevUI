import React, { useState } from 'react';
import './css/LoginPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from './config';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Please enter a valid email address';

    if (!formData.newPassword) tempErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 6) tempErrors.newPassword = 'Password must be at least 6 characters';

    if (formData.newPassword !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';

    setValidationErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/Users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.newPassword
        })
      });

      if (response.ok) {
        setMessage('Password reset successful. Redirecting to login...');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to reset password.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-logo">Reset Password</div>
          <p>Enter your email and new password</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {message && (
            <div className="login-error-banner" style={{ backgroundColor: '#ecfdf5', color: '#065f46', borderColor: '#10b981' }}>
              {message}
            </div>
          )}
          {error && (
            <div className="login-error-banner">{error}</div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className={validationErrors.email ? 'error' : ''}
            />
            {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className={validationErrors.newPassword ? 'error' : ''}
            />
            {validationErrors.newPassword && <span className="error-text">{validationErrors.newPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className={validationErrors.confirmPassword ? 'error' : ''}
            />
            {validationErrors.confirmPassword && <span className="error-text">{validationErrors.confirmPassword}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;