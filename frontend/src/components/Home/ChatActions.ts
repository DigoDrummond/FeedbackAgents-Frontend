import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { addMessageToCurrentSession, Message, Session } from './ChatSlice';

const API_BASE = 'http://localhost:8000/api';

// Interfaces para respostas da API
interface SendMessageResponse {
  response: string;
  session_id: string;
  request_id: string;
}

interface LoadSessionResponse {
  sessao: Session;
  mensagens: Message[];
  total_mensagens: number;
}

// Helper para fazer requisições autenticadas
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro de comunicação' }));
    throw new Error(errorData.error || `Erro HTTP ${response.status}`);
  }

  return response.json();
};

// Carregar sessões do usuário
export const loadUserSessions = createAsyncThunk<
  Session[],
  void,
  { rejectValue: string }
>(
  'chat/loadUserSessions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE}/sessoes/`);
      return data.results || data; // Considerando paginação ou lista simples
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Erro ao carregar sessões');
    }
  }
);

// Carregar mensagens de uma sessão específica
export const loadSession = createAsyncThunk<
  LoadSessionResponse,
  string,
  { rejectValue: string }
>(
  'chat/loadSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE}/conversation/?session_id=${sessionId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Erro ao carregar sessão');
    }
  }
);

// Enviar mensagem
export const sendMessage = createAsyncThunk<
  SendMessageResponse,
  { message: string; sessionId?: string | null },
  { 
    rejectValue: string;
    state: RootState;
  }
>(
  'chat/sendMessage',
  async ({ message, sessionId }, { dispatch, rejectWithValue }) => {
    try {
      // Adicionar mensagem do usuário imediatamente à UI
      const userMessage: Message = {
        id: Date.now(), // ID temporário
        conteudo: message,
        remetente: 'user',
        timestamp: new Date().toISOString(),
        ordem: 0, // Será ajustado pelo backend
      };
      
      dispatch(addMessageToCurrentSession(userMessage));

      // Enviar para a API
      const requestBody: any = { message };
      if (sessionId) {
        requestBody.session_id = sessionId;
      }

      const data = await makeAuthenticatedRequest(`${API_BASE}/conversation/`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      // Adicionar resposta do assistente à UI
      const assistantMessage: Message = {
        id: Date.now() + 1, // ID temporário
        conteudo: data.response,
        remetente: 'assistant',
        timestamp: new Date().toISOString(),
        ordem: 0, // Será ajustado pelo backend
      };
      
      dispatch(addMessageToCurrentSession(assistantMessage));

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Erro ao enviar mensagem');
    }
  }
);

// Criar nova sessão
export const createNewSession = createAsyncThunk<
  Session,
  string,
  { rejectValue: string }
>(
  'chat/createNewSession',
  async (titulo, { rejectWithValue }) => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE}/sessoes/`, {
        method: 'POST',
        body: JSON.stringify({ titulo }),
      });
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Erro ao criar sessão');
    }
  }
);

// Editar título da sessão
export const updateSessionTitle = createAsyncThunk<
  Session,
  { sessionId: string; titulo: string },
  { rejectValue: string }
>(
  'chat/updateSessionTitle',
  async ({ sessionId, titulo }, { rejectWithValue }) => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE}/sessoes/${sessionId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ titulo }),
      });
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Erro ao atualizar sessão');
    }
  }
);

// Deletar sessão
export const deleteSession = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'chat/deleteSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      await makeAuthenticatedRequest(`${API_BASE}/sessoes/${sessionId}/`, {
        method: 'DELETE',
      });
      return sessionId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Erro ao deletar sessão');
    }
  }
);
