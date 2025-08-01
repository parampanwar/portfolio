// components/TwoFASetup.js
import { useState } from 'react';
import styles from '../styles/TwoFA.module.css';

const TwoFASetup = ({ onComplete }) => {
  const [step, setStep] = useState(1); // 1: QR Code, 2: Verify
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verifyToken, setVerifyToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type') || 'Bearer';
    return {
      'Authorization': `${tokenType} ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const setup2FA = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/2fa/setup`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qr_code_url);
        setSecret(data.secret);
        setBackupCodes(data.backup_codes);
        setStep(2);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to setup 2FA');
      }
    } catch (error) {
      setError('Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FA = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/2fa/verify-setup`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ token: verifyToken }),
      });

      if (response.ok) {
        setStep(3);
        if (onComplete) onComplete();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Invalid token');
      }
    } catch (error) {
      setError('Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className={styles.container}>
        <h2>Setup Two-Factor Authentication</h2>
        <p>Secure your account with Microsoft Authenticator</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <button onClick={setup2FA} disabled={isLoading} className={styles.button}>
          {isLoading ? 'Setting up...' : 'Start Setup'}
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className={styles.container}>
        <h2>Scan QR Code</h2>
        
        <div className={styles.steps}>
          <p><strong>Step 1:</strong> Download Microsoft Authenticator from your app store</p>
          <p><strong>Step 2:</strong> Open the app and tap "Add account"</p>
          <p><strong>Step 3:</strong> Scan this QR code:</p>
        </div>

        <div className={styles.qrContainer}>
          <img src={qrCode} alt="2FA QR Code" className={styles.qrCode} />
        </div>

        <div className={styles.manualEntry}>
          <p>Can't scan? Enter this code manually:</p>
          <code className={styles.secret}>{secret}</code>
        </div>

        <div className={styles.verifySection}>
          <p><strong>Step 4:</strong> Enter the 6-digit code from Microsoft Authenticator:</p>
          <input
            type="text"
            value={verifyToken}
            onChange={(e) => setVerifyToken(e.target.value)}
            placeholder="000000"
            maxLength="6"
            className={styles.tokenInput}
          />
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button 
            onClick={verify2FA} 
            disabled={isLoading || verifyToken.length !== 6}
            className={styles.button}
          >
            {isLoading ? 'Verifying...' : 'Verify & Enable 2FA'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className={styles.container}>
        <h2>✅ 2FA Enabled Successfully!</h2>
        
        <div className={styles.backupCodes}>
          <h3>⚠️ Save These Backup Codes</h3>
          <p>Store these codes in a safe place. You can use them to access your account if you lose your phone:</p>
          
          <div className={styles.codes}>
            {backupCodes.map((code, index) => (
              <code key={index} className={styles.backupCode}>{code}</code>
            ))}
          </div>
          
          <p className={styles.warning}>
            Each backup code can only be used once. Keep them safe!
          </p>
        </div>

        <button onClick={() => onComplete?.()} className={styles.button}>
          Continue
        </button>
      </div>
    );
  }
};

export default TwoFASetup;
