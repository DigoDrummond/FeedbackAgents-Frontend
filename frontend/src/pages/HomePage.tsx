import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { logout } from '../store';
import {
  loadUserSessions,
  loadSession,
  sendMessage,
  updateSessionTitle,
  deleteSession,
} from '../components/Home/ChatActions';
import {
  setInputMessage,
  selectSession,
  clearCurrentSession,
  startEditingSession,
  cancelEditingSession,
  updateEditingTitle,
  Session,
  Message,
} from '../components/Home/ChatSlice';
import './HomePage.css';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    currentSessionId,
    currentMessages,
    userSessions,
    isLoadingSessions,
    isSendingMessage,
    isLoadingMessages,
    inputMessage,
    editingSessionId,
    editingSessionTitle,
    error 
  } = useAppSelector((state) => state.chat);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carregar sessões do usuário ao montar o componente
    dispatch(loadUserSessions());
  }, [dispatch]);

  useEffect(() => {
    // Auto scroll para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // useEffect para recarregar sessões quando uma nova sessão é criada
  useEffect(() => {
    // Recarregar sessões quando termina o envio de uma mensagem e temos uma sessão atual
    // mas ela não está na lista de sessões (indica que foi criada uma nova sessão)
    if (!isSendingMessage && currentSessionId) {
      const sessionExists = userSessions.some(session => session.id === currentSessionId);
      if (!sessionExists && !isLoadingSessions) {
        dispatch(loadUserSessions());
      }
    }
  }, [isSendingMessage, currentSessionId, userSessions, isLoadingSessions, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isSendingMessage) return;
    
    dispatch(sendMessage({ 
      message: inputMessage.trim(), 
      sessionId: currentSessionId 
    }));
  };

  const handleSelectSession = (sessionId: string) => {
    dispatch(selectSession(sessionId));
    dispatch(loadSession(sessionId));
  };

  const handleNewChat = () => {
    dispatch(clearCurrentSession());
  };

  const handleStartEdit = (sessionId: string, currentTitle: string) => {
    dispatch(startEditingSession({ sessionId, currentTitle }));
  };

  const handleCancelEdit = () => {
    dispatch(cancelEditingSession());
  };

  const handleSaveEdit = () => {
    if (editingSessionId && editingSessionTitle.trim()) {
      dispatch(updateSessionTitle({ 
        sessionId: editingSessionId, 
        titulo: editingSessionTitle.trim() 
      }));
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta conversa? Esta ação não pode ser desfeita.')) {
      dispatch(deleteSession(sessionId));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="home-container">
      {/* Sidebar com sessões */}
      <div className="sidebar">
        {/* Header do sidebar */}
        <div className="sidebar-header">
          <div className="sidebar-header-content">
            <h2 className="sidebar-title">SOLIRIS</h2>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        </div>

        {/* Botão nova conversa */}
        <div className="new-chat-container">
          <button onClick={handleNewChat} className="new-chat-button">
            ✨ Nova Conversa
          </button>
        </div>

        {/* Lista de sessões */}
        <div className="sessions-container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {isLoadingSessions ? (
            <div className="loading-message">
              Carregando sessões...
            </div>
          ) : (
            userSessions.map((session: Session) => {
              
              return (
                <div
                  key={session.id}
                  className={`session-card ${currentSessionId === session.id ? 'active' : ''}`}
                >
                  {/* Área principal da sessão */}
                  <div
                    className="session-content"
                    onClick={() => editingSessionId !== session.id && handleSelectSession(session.id)}
                  >
                    {/* Título editável */}
                    {editingSessionId === session.id ? (
                      <input
                        type="text"
                        value={editingSessionTitle}
                        onChange={(e) => dispatch(updateEditingTitle(e.target.value))}
                        onKeyPress={handleEditKeyPress}
                        onBlur={handleSaveEdit}
                        autoFocus
                        className="session-edit-input"
                      />
                    ) : (
                      <div className="session-title">
                        {session.titulo}
                      </div>
                    )}
                    
                    <div className="session-meta">
                      {session.quantidade_mensagens} mensagens • {formatDate(session.data_atualizacao)}
                    </div>
                  </div>

                  {/* Botões de ação */}
                  {editingSessionId === session.id ? (
                    <div className="session-buttons" style={{ opacity: 1 }}>
                      <button onClick={handleSaveEdit} className="session-action-button save">
                        ✓
                      </button>
                      <button onClick={handleCancelEdit} className="session-action-button cancel">
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="session-buttons">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(session.id, session.titulo);
                        }}
                        className="session-action-button edit"
                        title="Editar nome"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                        className="session-action-button delete"
                        title="Deletar conversa"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Área principal do chat */}
      <div className="chat-main">
        {/* Área de mensagens */}
        <div className="messages-area">
          {currentMessages.length === 0 && !currentSessionId ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <h3>Bem-vindo ao SOLIRIS! 🚀</h3>
                <p>Selecione uma conversa existente ou inicie uma nova para começar a conversar com nossos agentes de IA especializados.</p>
              </div>
            </div>
          ) : (
            <>
              {isLoadingMessages && (
                <div className="loading-message">
                  Carregando mensagens...
                </div>
              )}
              
              {currentMessages.map((message: Message, index: number) => (
                <div
                  key={`${message.id}-${index}`}
                  className={`message-container ${message.remetente}`}
                >
                  <div className={`message-bubble ${message.remetente}`}>
                    <div className="message-content">
                      {message.conteudo}
                    </div>
                    <div className="message-timestamp">
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isSendingMessage && (
                <div className="loading-indicator">
                  <div className="loading-bubble">
                    Pensando...
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Área de input */}
        <div className="input-area">
          <div className="input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => dispatch(setInputMessage(e.target.value))}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem aqui... ✨"
              disabled={isSendingMessage}
              className="message-input"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isSendingMessage}
              className="send-button"
            >
              {isSendingMessage ? '📤' : 'Enviar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 