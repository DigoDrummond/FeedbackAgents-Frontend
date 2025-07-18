import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../store';
import { authAPI } from '../../api';
import './auth.css';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
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
    
    // Validações básicas
    if (!formData.username || !formData.email || !formData.password || !formData.password_confirm) {
      dispatch(loginFailure('Por favor, preencha todos os campos obrigatórios'));
      return;
    }

    if (formData.password !== formData.password_confirm) {
      dispatch(loginFailure('As senhas não coincidem'));
      return;
    }

    if (formData.password.length < 8) {
      dispatch(loginFailure('A senha deve ter pelo menos 8 caracteres'));
      return;
    }

    dispatch(loginStart());
    
    try {
      const response = await authAPI.register(formData);
      dispatch(loginSuccess({
        user: response.user,
        token: response.tokens.access,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.username?.[0] || 
                          error.response?.data?.email?.[0] || 
                          error.response?.data?.detail || 
                          'Erro ao criar conta';
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="auth-form">
      <h2>Criar Conta</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuário: *</label>
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
          <label htmlFor="email">Email: *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="first_name">Nome:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Sobrenome:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha: *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password_confirm">Confirmar Senha: *</label>
          <input
            type="password"
            id="password_confirm"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>

      <p>
        Já tem uma conta?{' '}
        <button type="button" onClick={onSwitchToLogin} className="link-button">
          Entrar
        </button>
      </p>
    </div>
  );
};

export default RegisterForm; 