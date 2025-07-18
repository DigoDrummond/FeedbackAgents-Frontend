import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  sendMessage, 
  loadSession, 
  loadUserSessions,
  createNewSession,
  updateSessionTitle,
  deleteSession
} from './ChatActions';

export interface Message {
  id: number;
  conteudo: string;
  remetente: 'user' | 'assistant';
  timestamp: string;
  ordem: number;
}

export interface Session {
  id: string;
  titulo: string;
  data_criacao: string;
  data_atualizacao: string;
  ativa: boolean;
  quantidade_mensagens: number;
}

export interface ChatState {
  // Estado atual da conversa
  currentSessionId: string | null;
  currentMessages: Message[];
  
  // Lista de sessões do usuário
  userSessions: Session[];
  
  // Estados de loading
  isLoadingSessions: boolean;
  isSendingMessage: boolean;
  isLoadingMessages: boolean;
  
  // Estado da UI
  inputMessage: string;
  
  // Estados de edição
  editingSessionId: string | null;
  editingSessionTitle: string;
  
  // Erros
  error: string | null;
}

const initialState: ChatState = {
  currentSessionId: null,
  currentMessages: [],
  userSessions: [],
  isLoadingSessions: false,
  isSendingMessage: false,
  isLoadingMessages: false,
  inputMessage: '',
  editingSessionId: null,
  editingSessionTitle: '',
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Ações síncronas para UI
    setInputMessage: (state, action: PayloadAction<string>) => {
      state.inputMessage = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    selectSession: (state, action: PayloadAction<string>) => {
      state.currentSessionId = action.payload;
      state.currentMessages = [];
    },
    
    clearCurrentSession: (state) => {
      state.currentSessionId = null;
      state.currentMessages = [];
    },
    
    addMessageToCurrentSession: (state, action: PayloadAction<Message>) => {
      state.currentMessages.push(action.payload);
    },
    
    startEditingSession: (state, action: PayloadAction<{ sessionId: string; currentTitle: string }>) => {
      state.editingSessionId = action.payload.sessionId;
      state.editingSessionTitle = action.payload.currentTitle;
    },
    
    cancelEditingSession: (state) => {
      state.editingSessionId = null;
      state.editingSessionTitle = '';
    },
    
    updateEditingTitle: (state, action: PayloadAction<string>) => {
      state.editingSessionTitle = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Carregar sessões do usuário
    builder
      .addCase(loadUserSessions.pending, (state) => {
        state.isLoadingSessions = true;
        state.error = null;
      })
      .addCase(loadUserSessions.fulfilled, (state, action) => {
        state.isLoadingSessions = false;
        state.userSessions = action.payload;
      })
      .addCase(loadUserSessions.rejected, (state, action) => {
        state.isLoadingSessions = false;
        state.error = action.payload as string;
      });

    // Carregar mensagens de uma sessão
    builder
      .addCase(loadSession.pending, (state) => {
        state.isLoadingMessages = true;
        state.error = null;
      })
      .addCase(loadSession.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        state.currentMessages = action.payload.mensagens;
        state.currentSessionId = action.payload.sessao.id;
      })
      .addCase(loadSession.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = action.payload as string;
      });

    // Enviar mensagem
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isSendingMessage = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSendingMessage = false;
        state.inputMessage = '';
        
        // Atualizar session_id se foi criada uma nova sessão
        if (action.payload.session_id) {
          state.currentSessionId = action.payload.session_id;
        }
        
        // A mensagem do usuário e resposta são adicionadas via addMessageToCurrentSession
        // durante o processo de envio
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSendingMessage = false;
        state.error = action.payload as string;
      });

    // Criar nova sessão
    builder
      .addCase(createNewSession.pending, (state) => {
        state.isLoadingSessions = true;
        state.error = null;
      })
      .addCase(createNewSession.fulfilled, (state, action) => {
        state.isLoadingSessions = false;
        state.userSessions.unshift(action.payload); // Adiciona no início da lista
        state.currentSessionId = action.payload.id;
        state.currentMessages = [];
      })
      .addCase(createNewSession.rejected, (state, action) => {
        state.isLoadingSessions = false;
        state.error = action.payload as string;
      });

    // Atualizar título da sessão
    builder
      .addCase(updateSessionTitle.pending, (state) => {
        state.error = null;
      })
      .addCase(updateSessionTitle.fulfilled, (state, action) => {
        // Atualizar a sessão na lista
        const sessionIndex = state.userSessions.findIndex(s => s.id === action.payload.id);
        if (sessionIndex !== -1) {
          state.userSessions[sessionIndex] = action.payload;
        }
        // Limpar estado de edição
        state.editingSessionId = null;
        state.editingSessionTitle = '';
      })
      .addCase(updateSessionTitle.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Deletar sessão
    builder
      .addCase(deleteSession.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        // Remover sessão da lista
        state.userSessions = state.userSessions.filter(s => s.id !== action.payload);
        // Se a sessão deletada era a atual, limpar o estado atual
        if (state.currentSessionId === action.payload) {
          state.currentSessionId = null;
          state.currentMessages = [];
        }
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setInputMessage,
  clearError,
  selectSession,
  clearCurrentSession,
  addMessageToCurrentSession,
  startEditingSession,
  cancelEditingSession,
  updateEditingTitle,
} = chatSlice.actions;

export default chatSlice.reducer;
