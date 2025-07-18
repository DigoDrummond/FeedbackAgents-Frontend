import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { LoginForm, RegisterForm } from '../components/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isLoginMode, setIsLoginMode] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '1rem'
    }}>
      {isLoginMode ? (
        <LoginForm onSwitchToRegister={() => setIsLoginMode(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLoginMode(true)} />
      )}
    </div>
  );
};

export default LoginPage; 