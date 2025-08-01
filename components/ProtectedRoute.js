// components/ProtectedRoute.js
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/MyDashboard.module.css';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth(requireAdmin);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return children;
};

export default ProtectedRoute;
