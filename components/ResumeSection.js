// components/ResumeSection.js - Updated for MongoDB storage
import { useState, useEffect } from 'react';
import { FaDownload, FaEye, FaFilePdf, FaSync } from 'react-icons/fa';
import styles from '../styles/Dashboard.module.css';

const ResumeSection = () => {
  const [currentResume, setCurrentResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchCurrentResume();
  }, []);

  const fetchCurrentResume = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resumes/current`);
      
      if (response.ok) {
        const data = await response.json();
        setCurrentResume(data);
      } else if (response.status === 404) {
        setCurrentResume(null); // No resume found
      } else {
        setError('Failed to load resume');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      setError('Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResume = () => {
    if (currentResume) {
      window.open(`${API_BASE_URL}${currentResume.download_url}`, '_blank');
    }
  };

  const viewResume = () => {
    if (currentResume) {
      window.open(`${API_BASE_URL}/api/resumes/${currentResume.id}/view`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.resumeSection}>
        <h2>📄 My Resume</h2>
        <div className={styles.loading}>Loading resume...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.resumeSection}>
        <h2>📄 My Resume</h2>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className={styles.resumeSection}>
        <h2>📄 My Resume</h2>
        <div className={styles.noResumes}>
          <FaFilePdf className={styles.emptyIcon} />
          <p>No resume available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resumeSection}>
      <h2>📄 My Resume</h2>
      
      <div className={styles.resumeCard}>
        <div className={styles.resumeHeader}>
          <FaFilePdf className={styles.resumeIcon} />
          <div className={styles.resumeInfo}>
            <span className={styles.resumeSize}>
              {(currentResume.file_size / 1024 / 1024).toFixed(2)} MB
            </span>
            <span className={styles.versionBadge}>
              v{currentResume.version}
            </span>
          </div>
        </div>
        
        <h3 className={styles.resumeTitle}>
          Param Panwar - Resume
        </h3>
        
        <p className={styles.resumeDate}>
          Last Updated: {new Date(currentResume.uploaded_at).toLocaleDateString()}
        </p>
        
        <div className={styles.resumeActions}>
          <button
            onClick={viewResume}
            className={`${styles.actionBtn} ${styles.viewBtn}`}
          >
            <FaEye />
            View Resume
          </button>
          <button
            onClick={downloadResume}
            className={`${styles.actionBtn} ${styles.downloadBtn}`}
          >
            <FaDownload />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeSection;
