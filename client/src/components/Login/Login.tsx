import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { login, register } from './loginActions';
import { clearError } from './loginSlice';

const Login = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordTooShort = mode === 'register' && password.length > 0 && password.length < 8;

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (passwordTooShort) return;
    if (mode === 'register') {
      dispatch(register(name, email, password));
    } else {
      dispatch(login(email, password));
    }
  };

  const handleTryAgain = () => {
    dispatch(clearError());
  };

  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setName('');
    setEmail('');
    setPassword('');
    dispatch(clearError());
  };

  const isRateLimited = error?.type === 'rate_limited';
  const isEmailConflict = error?.type === 'conflict';
  const isNetworkError = error?.type === 'network';

  const errorTitle = isRateLimited ? 'Too Many Attempts'
    : isEmailConflict ? 'Email Already Registered'
    : isNetworkError ? 'Connection Error'
    : mode === 'register' ? 'Registration Failed'
    : 'Login Failed';

  const errorMessage = isEmailConflict
    ? 'An account with this email already exists. Sign in instead, or use a different email to register.'
    : isNetworkError
    ? 'Unable to connect to the server. Please check your internet connection and try again.'
    : error?.message ?? '';

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🎂</div>
        <h1>Birthday Board</h1>
        <p>Track and celebrate the birthdays that matter to you</p>

        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                className="input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`input${passwordTooShort ? ' input-error' : ''}`}
                placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === 'register' ? 8 : undefined}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {mode === 'register' && (
              passwordTooShort
                ? <span className="field-error">Password must be at least 8 characters</span>
                : <span className="field-hint">Must be at least 8 characters</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading || passwordTooShort}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="login-switch">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className="link-btn" onClick={toggleMode}>
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>

      {error && (
        <div className="modal-overlay">
          <div className="modal login-error-modal">
            <div className="login-error-icon">{isRateLimited ? '⏳' : isNetworkError ? '📡' : '⚠️'}</div>
            <h3>{errorTitle}</h3>
            <p>{errorMessage}</p>
            <button className="btn btn-primary btn-full" onClick={handleTryAgain}>
              {isRateLimited ? 'OK' : 'Try again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
