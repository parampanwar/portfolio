// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useAuth = (requireAdmin = false) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    checkAuth();
  }, []);

 const checkAuth = async () => {
  const token = localStorage.getItem('access_token');
  const tokenType = localStorage.getItem('token_type') || 'Bearer';
  
  if (!token) {
    setLoading(false);
    router.push('/login');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `${tokenType} ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      
      // 🔥 ADD THIS DEBUG LOGGING:
      console.log('User data received:', userData);
      console.log('Is admin?', userData.is_admin);
      console.log('Require admin?', requireAdmin);
      
      // Check if admin access is required
      if (requireAdmin && !userData.is_admin) {
        console.log('Admin access denied for user:', userData.email);
        alert('Access denied. Admin privileges required.');
        router.push('/login');
        return;
      }
      
      setUser(userData);
    } else {
      // Token is invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('user');
      router.push('/login');
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    router.push('/login');
  } finally {
    setLoading(false);
  }
};
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return { user, loading, logout };
};
