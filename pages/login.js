import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Demo credentials
  const validUsers = {
    mubeenahmad: 'Temp123!A',
    hamzanadeem: 'Temp456!B',
    saadbutt: 'Temp789!C'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (validUsers[username] && validUsers[username] === password) {
        // Store session
        localStorage.setItem('nsla_user', username);
        localStorage.setItem('nsla_session', Date.now());
        router.push('/dashboard');
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <>
      <Head>
        <title>NSLA CarShip - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0c5ca8 0%, #084380 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .login-container {
            width: 100%;
            max-width: 420px;
            padding: 20px;
          }
          .login-card {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .logo-section {
            text-align: center;
            margin-bottom: 32px;
          }
          .logo {
            width: 60px;
            height: 60px;
            margin: 0 auto 16px;
            background: #0c5ca8;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 32px;
            font-weight: bold;
          }
          h1 {
            font-size: 24px;
            color: #222;
            margin-bottom: 8px;
          }
          .subtitle {
            color: #666;
            font-size: 14px;
            margin-bottom: 24px;
          }
          .form-group {
            margin-bottom: 18px;
          }
          label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: #333;
            margin-bottom: 6px;
          }
          input {
            width: 100%;
            padding: 11px 14px;
            border: 1.5px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.2s;
            font-family: inherit;
          }
          input:focus {
            outline: none;
            border-color: #0c5ca8;
            background: #f9fbff;
            box-shadow: 0 0 0 3px rgba(12, 92, 168, 0.1);
          }
          .login-btn {
            width: 100%;
            padding: 12px;
            background: #0c5ca8;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            margin-top: 8px;
          }
          .login-btn:hover {
            background: #084380;
            transform: translateY(-1px);
            box-shadow: 0 8px 20px rgba(12, 92, 168, 0.3);
          }
          .login-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .error {
            background: #fee;
            color: #c33;
            padding: 12px;
            border-radius: 6px;
            font-size: 13px;
            margin-bottom: 18px;
            border-left: 3px solid #c33;
          }
          .demo-info {
            background: #f0f6ff;
            border: 1px solid #cce4ff;
            padding: 16px;
            border-radius: 6px;
            font-size: 12px;
            color: #0c5ca8;
            line-height: 1.6;
            margin-top: 24px;
          }
          .demo-info strong {
            color: #084380;
          }
          .demo-cred {
            background: white;
            padding: 8px 12px;
            border-radius: 4px;
            margin: 8px 0;
            font-family: 'Courier New', monospace;
            font-size: 11px;
          }
        `}</style>
      </Head>

      <div className="login-container">
        <div className="login-card">
          <div className="logo-section">
            <div className="logo">📦</div>
            <h1>NSLA CarShip</h1>
            <p className="subtitle">Carrier Management System</p>
          </div>

          {error && <div className="error">⚠️ {error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
              
          </div>
        </div>
      </div>
    </>
  );
}
