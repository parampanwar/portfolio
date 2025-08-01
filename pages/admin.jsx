// pages/admin.js
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaTrash, FaDownload, FaUpload, FaFilePdf, FaEye, FaSignOutAlt, FaUser } from "react-icons/fa";
import styles from '../styles/MyDashboard.module.css';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

const AdminContent = () => {
    const { user, logout, loading } = useAuth(true); // Require admin access
    const [uploadedResumes, setUploadedResumes] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Load existing resumes on component mount
    useEffect(() => {
        if (user) {
            loadResumes();
        }
    }, [user]);

    // Missing functions that were referenced in JSX
    const handleFileSelect = (file) => {
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('Please select a PDF file only');
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const downloadResume = (resume) => {
        window.open(`${API_BASE_URL}/api/resumes/${resume.id}/download`, '_blank');
    };

    const deleteResume = async (resumeId) => {
        if (window.confirm('Are you sure you want to delete this resume?')) {
            try {
                const token = localStorage.getItem('access_token');
                const tokenType = localStorage.getItem('token_type') || 'Bearer';
                
                const response = await fetch(`${API_BASE_URL}/api/resumes/${resumeId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `${tokenType} ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    loadResumes(); // Refresh the list
                    alert('Resume deleted successfully!');
                } else {
                    const errorData = await response.json();
                    alert(`Delete failed: ${errorData.detail || 'Please try again'}`);
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Delete failed. Please try again.');
            }
        }
    };

    const loadResumes = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const tokenType = localStorage.getItem('token_type') || 'Bearer';
            
            const response = await fetch(`${API_BASE_URL}/api/resumes`, {
                headers: {
                    'Authorization': `${tokenType} ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setUploadedResumes(data);
            } else {
                console.error('Failed to load resumes');
            }
        } catch (error) {
            console.error('Error loading resumes:', error);
        }
    };

    const uploadResume = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('resume', selectedFile);

        try {
            const token = localStorage.getItem('access_token');
            const tokenType = localStorage.getItem('token_type') || 'Bearer';
            
            const response = await fetch(`${API_BASE_URL}/api/upload-resume`, {
                method: 'POST',
                headers: {
                    'Authorization': `${tokenType} ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const newResume = await response.json();
                loadResumes(); // Refresh the list
                setSelectedFile(null);
                alert('Resume uploaded successfully!');
            } else {
                const errorData = await response.json();
                alert(`Upload failed: ${errorData.detail || 'Please try again'}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // Add loading check to prevent null user error
    if (!user) {
        return (
            <div className={styles.dashboard}>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <p>Loading admin dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.container}>
                {/* Header with User Info and Logout */}
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>
                            Welcome {user.email}
                            <FaUser className={styles.userIcon} />
                        </h1>
                        <p className={styles.subtitle}>Admin Dashboard - Upload, manage, and organize resumes</p>
                    </div>
                    <button onClick={logout} className={styles.logoutButton}>
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>

                {/* Upload Section */}
                <div className={styles.uploadSection}>
                    <h2 className={styles.sectionTitle}>
                        <FaUpload className={styles.uploadIcon} />
                        Upload New Resume
                    </h2>

                    {/* Drag & Drop Area */}
                    <div
                        className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <FaFilePdf className={styles.dropzoneIcon} />
                        <p className={styles.dropzoneText}>
                            {selectedFile ? selectedFile.name : 'Drag & drop your resume here or click to browse'}
                        </p>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                            className={styles.fileInput}
                            id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className={styles.browseButton}>
                            Browse Files
                        </label>
                    </div>

                    {/* Upload Button */}
                    {selectedFile && (
                        <div className={styles.uploadButtonContainer}>
                            <button
                                onClick={uploadResume}
                                disabled={isUploading}
                                className={styles.uploadButton}
                            >
                                {isUploading ? 'Uploading...' : 'Upload Resume'}
                                <FaUpload />
                            </button>
                        </div>
                    )}
                </div>

                {/* Uploaded Resumes Section */}
                <div className={styles.resumeSection}>
                    <h2 className={styles.sectionTitle}>
                        <FaFilePdf className={styles.resumeIcon} />
                        Uploaded Resumes ({uploadedResumes.length})
                    </h2>

                    {uploadedResumes.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FaFilePdf className={styles.emptyStateIcon} />
                            <p className={styles.emptyStateText}>No resumes uploaded yet</p>
                        </div>
                    ) : (
                        <div className={styles.resumeGrid}>
                            {uploadedResumes.map((resume, index) => (
                                <div key={resume.id} className={styles.resumeCard}>
                                    <div className={styles.resumeCardHeader}>
                                        <FaFilePdf className={styles.resumeCardIcon} />
                                        <span className={styles.resumeSize}>
                                            {resume.file_size ? `${(resume.file_size / 1024 / 1024).toFixed(2)} MB` : 'PDF'}
                                        </span>
                                    </div>

                                    <h3 className={styles.resumeTitle} title={resume.filename}>
                                        {resume.original_name || resume.filename || `Resume ${index + 1}`}
                                    </h3>

                                    <p className={styles.resumeDate}>
                                        Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}
                                        {resume.version > 1 && (
                                            <span className={styles.versionBadge}> v{resume.version}</span>
                                        )}
                                    </p>

                                    <div className={styles.actionButtons}>
                                        <button
                                            onClick={() => window.open(`${API_BASE_URL}/api/resumes/${resume.id}/view`, '_blank')}
                                            className={`${styles.actionButton} ${styles.viewButton}`}
                                        >
                                            <FaEye />
                                            View
                                        </button>
                                        <button
                                            onClick={() => downloadResume(resume)}
                                            className={`${styles.actionButton} ${styles.downloadButton}`}
                                        >
                                            <FaDownload />
                                            Download
                                        </button>
                                        <button
                                            onClick={() => deleteResume(resume.id)}
                                            className={`${styles.actionButton} ${styles.deleteButton}`}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Statistics */}
                <div className={styles.statsSection}>
                    <div className={styles.statCard}>
                        <h3 className={`${styles.statNumber} ${styles.statNumberBlue}`}>
                            {uploadedResumes.length}
                        </h3>
                        <p className={styles.statLabel}>Total Resumes</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3 className={`${styles.statNumber} ${styles.statNumberGreen}`}>
                            {uploadedResumes.filter(r => new Date(r.uploaded_at) > new Date(Date.now() - 7*24*60*60*1000)).length}
                        </h3>
                        <p className={styles.statLabel}>Recent Uploads</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3 className={`${styles.statNumber} ${styles.statNumberPurple}`}>
                            {uploadedResumes.reduce((total, resume) => total + (resume.file_size || 0), 0) > 0 
                                ? `${(uploadedResumes.reduce((total, resume) => total + (resume.file_size || 0), 0) / 1024 / 1024).toFixed(1)} MB`
                                : '0 MB'
                            }
                        </h3>
                        <p className={styles.statLabel}>Total Storage</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Admin = () => {
    return (
        <ProtectedRoute requireAdmin={true}>
            <AdminContent />
        </ProtectedRoute>
    );
};

export default Admin;
