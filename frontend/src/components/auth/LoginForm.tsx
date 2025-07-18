import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../store';
import { authAPI } from '../../api';
import './auth.css';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      dispatch(loginFailure('Por favor, preencha todos os campos'));
      return;
    }

    dispatch(loginStart());
    
    try {
      const response = await authAPI.login(formData.username, formData.password);
      dispatch(loginSuccess({
        user: response.user,
        token: response.tokens.access,
      }));
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.detail || 'Erro ao fazer login'));
    }
  };

  return (
    <div className="auth-form">
      <h2>Entrar</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuário:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p>
        Não tem uma conta?{' '}
        <button type="button" onClick={onSwitchToRegister} className="link-button">
          Registre-se
        </button>
      </p>
    </div>
  );
};

export default LoginForm; 