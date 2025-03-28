import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setToken, setIsAuthenticated, setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1])) as { user: User };
        localStorage.setItem('token', token);
        setToken(token);
        setUser(decoded.user);
        setIsAuthenticated(true);
        navigate('/');
      } catch (error) {
        console.error('Error processing token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setToken, setIsAuthenticated, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
    </div>
  );
} 