import React, { useState } from 'react';
import './css/LoginPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from './config';

const createCaptcha = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let code = '';
  const rotations = [];

  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
    rotations.push(Math.random() * 20 - 10);
  }

  return { code, rotations };
};

const LoginPage = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captchaInput: ''
  });

  const [captchaData, setCaptchaData] = useState(() => createCaptcha());
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const generateCaptcha = () => {
    setCaptchaData(createCaptcha());
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

  };

  const validate = () => {

    let tempErrors = {};

    if (!formData.email) {
      tempErrors.email = 'Email is required';
    }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Enter valid email';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    }

    if (!formData.captchaInput) {
      tempErrors.captchaInput = 'Enter security code';
    }
    else if (formData.captchaInput !== captchaData.code) {
      tempErrors.captchaInput = 'Incorrect code';
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setIsSubmitting(true);
    setLoginError('');

    if (validate()) {

      try {

        const email = encodeURIComponent(formData.email);
        const password = encodeURIComponent(formData.password);

        const url = `${API_BASE_URL}/api/Users/login?email=${email}&password=${password}`;

        const response = await fetch(url, {
          method: 'POST'
        });

        if (response.ok) {

          const data = await response.json();

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data));
          console.log(data,'login');
          navigate('/dashboard');

        }
        else {

          setLoginError('Invalid email or password');

          generateCaptcha();

          setFormData({
            ...formData,
            captchaInput: ''
          });

        }

      }
      catch (error) {

        console.error(error);
        setLoginError('Server connection failed');

      }
      finally {

        setIsSubmitting(false);

      }

    }
    else {

      setIsSubmitting(false);
      setLoginError('Please fill correct details');

      generateCaptcha();

      setFormData({
        ...formData,
        captchaInput: ''
      });

    }

  };

  return (

    <div className="login-container">

      <div className="login-card">

        <div className="login-header">
          <div className="brand-logo">Login Account</div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          {loginError && (
            <div className="login-error-banner">{loginError}</div>
          )}

          {/* EMAIL */}

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
            />

            {errors.email && <span className="error-text">{errors.email}</span>}

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label>Password</label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>

            </div>

            {errors.password && <span className="error-text">{errors.password}</span>}

            {/* FORGOT PASSWORD */}

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

          </div>

          {/* CAPTCHA */}

          <div className="form-group captcha-group">

            <label>Security Code</label>

            <div className="captcha-container">

              <div className="captcha-display">

                {captchaData.code.split('').map((char, index) => (
                  <span
                    key={index}
                    style={{ transform: `rotate(${captchaData.rotations[index]}deg)` }}
                  >
                    {char}
                  </span>
                ))}

              </div>

              <button
                type="button"
                className="refresh-captcha"
                onClick={generateCaptcha}
              >
                ↻
              </button>

            </div>

            <input
              type="text"
              name="captchaInput"
              value={formData.captchaInput}
              onChange={handleChange}
              placeholder="Enter code"
            />

            {errors.captchaInput && (
              <span className="error-text">{errors.captchaInput}</span>
            )}

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        {/* FOOTER */}

        <div className="login-footer">

          <p>
            Don't have an account?{" "}
            <Link to="/create-user" className="create-user-link">
              Create User
            </Link>
          </p>

        </div>

      </div>

    </div>

  );

};

export default LoginPage;