// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFAToken, setTwoFAToken] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 🔥 ORIGINAL LOGIN (Step 1)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    console.log('API_BASE_URL:', API_BASE_URL);
    const fullURL = `${API_BASE_URL}/auth/login`;
    console.log('Attempting to fetch:', fullURL);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.email);
      formDataToSend.append('password', formData.password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        // 🔥 CHECK IF 2FA IS REQUIRED
        if (data.requires_2fa) {
          console.log('2FA required for user');
          setRequires2FA(true);
          return; // Stop here and show 2FA input
        }

        // Normal login success (no 2FA enabled)
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token_type', data.token_type);
        
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        router.push('/admin');
      } else {
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            const errorMessages = data.detail.map(err => err.msg).join(', ');
            setErrors({ general: errorMessages });
          } else {
            setErrors({ general: data.detail });
          }
        } else {
          setErrors({ general: 'Login failed' });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Unable to connect to server. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 2FA LOGIN (Step 2)
  // 🔥 2FA LOGIN (Step 2) - CORRECTED VERSION
const handle2FASubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrors({});

  console.log('2FA Token being sent:', twoFAToken);
  console.log('Token length:', twoFAToken.length);
  console.log('Is numeric:', /^\d+$/.test(twoFAToken));

  try {
    // 🔥 CHANGE: Send JSON instead of FormData
    const response = await fetch(`${API_BASE_URL}/auth/login/2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // 🔥 IMPORTANT: Set JSON header
      },
      body: JSON.stringify({  // 🔥 SEND AS JSON, NOT FORMDATA
        email: formData.email,
        password: formData.password,
        two_fa_token: twoFAToken
      }),
    });

    if (response.ok) {
      const data = await response.json();
      
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('2FA login successful');
      router.push('/admin');
    } else {
      const errorData = await response.json();
      
      let errorMessage = 'Invalid 2FA token';
      if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(err => err.msg).join(', ');
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
      }
      
      setErrors({ general: errorMessage });
    }
  } catch (error) {
    console.error('2FA login error:', error);
    setErrors({ general: 'Unable to connect to server' });
  } finally {
    setIsLoading(false);
  }
};

  // 🔥 2FA INPUT SCREEN
  if (requires2FA) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>Two-Factor Authentication</h1>
          <p className={styles.subtitle}>Enter the 6-digit code from Microsoft Authenticator</p>
          
          {errors.general && (
            <div className={styles.error}>{errors.general}</div>
          )}
          
          <form onSubmit={handle2FASubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="twoFAToken" className={styles.label}>
                Authenticator Code
              </label>
              <input
                type="text"
                id="twoFAToken"
                value={twoFAToken}
                onChange={(e) => setTwoFAToken(e.target.value)}
                placeholder="000000"
                maxLength="8" // Allow backup codes (8 chars) or TOTP (6 chars)
                className={`${styles.input} ${styles.tokenInput}`}
                autoComplete="off"
                autoFocus
              />
              <small className={styles.helpText}>
                Enter 6-digit code from app or 8-character backup code
              </small>
            </div>

            <button
              type="submit"
              disabled={isLoading || twoFAToken.length < 6}
              className={styles.submitButton}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className={styles.backToLogin}>
            <button 
              onClick={() => {
                setRequires2FA(false); 
                setTwoFAToken('');
                setErrors({});
              }}
              className={styles.linkButton}
              type="button"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 ORIGINAL LOGIN SCREEN
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Admin CMS Portal</p>
        
        {errors.general && (
          <div className={styles.error}>{errors.general}</div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.securityNotice}>
          <small>🔐 This is a private CMS portal for authorized personnel only</small>
        </div>
      </div>
    </div>
  );
}
