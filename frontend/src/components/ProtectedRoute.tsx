import { useEffect } from 'react';
import { useAuth } from '../hooks/UseAuth';
import { ProtectedRouteProps } from '../types';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user?.actor) return;
    if (!user?.isAuthenticated) {
      alert('You are not authorized to access this page, no role found');
      window.location.replace('/404');
    }
    if (user?.isAuthenticated && user?.role === '') {
      navigate('/welcome');
    }
    // if (user?.isAuthenticated && (user?.role === 'doctor' || user?.role === 'patient')) {
    //   navigate('/dashboard');
    // }
  }, [user]);
  return children;
}
