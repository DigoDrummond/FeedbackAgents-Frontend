import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { logout } from '../store';
import {
  loadUserSessions,
  loadSession,
  sendMessage,
  createNewSession,
  updateSessionTitle,
  deleteSession,
} from '../components/Home/ChatActions';
import {
  setInputMessage,
  clearError,
  selectSession,
  clearCurrentSession,
  startEditingSession,
  cancelEditingSession,
  updateEditingTitle,
  Session,
  Message,
} from '../components/Home/ChatSlice';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
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
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Sidebar com sessões */}
      <div style={{
        width: '320px',
        backgroundColor: '#fff',
        borderRight: '1px solid #dee2e6',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header do sidebar */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #dee2e6',
          backgroundColor: '#f8f9fa',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>FeedbackAgents</h2>
            <button 
              onClick={handleLogout}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Sair
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>
            Olá, {user?.first_name || user?.username}!
          </p>
        </div>

        {/* Botão nova conversa */}
        <div style={{ padding: '1rem' }}>
          <button
            onClick={handleNewChat}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            + Nova Conversa
          </button>
        </div>

        {/* Lista de sessões */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '0 1rem 1rem'
        }}>
          {error && (
            <div style={{
              padding: '0.5rem',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {isLoadingSessions ? (
            <div style={{ textAlign: 'center', color: '#6c757d' }}>
              Carregando sessões...
            </div>
          ) : (
            userSessions.map((session: Session) => {
              const isEditing = editingSessionId === session.id;
              
              return (
                <div
                  key={session.id}
                  style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    backgroundColor: currentSessionId === session.id ? '#e3f2fd' : '#f8f9fa',
                    borderRadius: '8px',
                    border: currentSessionId === session.id ? '2px solid #2196f3' : '1px solid #dee2e6',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isEditing) {
                      const buttons = e.currentTarget.querySelector('.session-buttons') as HTMLElement;
                      if (buttons) buttons.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isEditing) {
                      const buttons = e.currentTarget.querySelector('.session-buttons') as HTMLElement;
                      if (buttons) buttons.style.opacity = '0';
                    }
                  }}
                >
                {/* Área principal da sessão */}
                <div
                  onClick={() => editingSessionId !== session.id && handleSelectSession(session.id)}
                  style={{
                    cursor: editingSessionId === session.id ? 'default' : 'pointer',
                  }}
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
                      style={{
                        width: '100%',
                        padding: '0.25rem',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        border: '1px solid #007bff',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        marginBottom: '0.25rem',
                      }}
                    />
                  ) : (
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      {session.titulo}
                    </div>
                  )}
                  
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                    {session.quantidade_mensagens} mensagens • {formatDate(session.data_atualizacao)}
                  </div>
                </div>

                {/* Botões de ação */}
                {editingSessionId === session.id ? (
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    display: 'flex',
                    gap: '0.25rem',
                  }}>
                    <button
                      onClick={handleSaveEdit}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                      }}
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                                 ) : (
                   <div 
                     className="session-buttons"
                     style={{
                       position: 'absolute',
                       top: '0.5rem',
                       right: '0.5rem',
                       display: 'flex',
                       gap: '0.25rem',
                       opacity: 0,
                       transition: 'opacity 0.2s',
                     }}
                   >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(session.id, session.titulo);
                      }}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                      }}
                      title="Editar nome"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                      }}
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
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Área de mensagens */}
        <div style={{
          flex: 1,
          padding: '1rem',
          overflowY: 'auto',
          backgroundColor: '#fff',
        }}>
          {currentMessages.length === 0 && !currentSessionId ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: '#6c757d',
            }}>
              <div>
                <h3>Bem-vindo ao FeedbackAgents!</h3>
                <p>Selecione uma conversa existente ou inicie uma nova para começar a conversar com nossos agentes inteligentes.</p>
              </div>
            </div>
          ) : (
            <>
              {isLoadingMessages && (
                <div style={{ textAlign: 'center', color: '#6c757d', marginBottom: '1rem' }}>
                  Carregando mensagens...
                </div>
              )}
              
              {currentMessages.map((message: Message, index: number) => (
                <div
                  key={`${message.id}-${index}`}
                  style={{
                    display: 'flex',
                    justifyContent: message.remetente === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '0.75rem 1rem',
                      borderRadius: '18px',
                      backgroundColor: message.remetente === 'user' ? '#007bff' : '#f8f9fa',
                      color: message.remetente === 'user' ? 'white' : '#333',
                      wordWrap: 'break-word',
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {message.conteudo}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      marginTop: '0.25rem',
                      opacity: 0.7,
                    }}>
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isSendingMessage && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '18px',
                    backgroundColor: '#f8f9fa',
                    color: '#6c757d',
                  }}>
                    Agente está digitando...
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Área de input */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #dee2e6',
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-end',
          }}>
            <textarea
              value={inputMessage}
              onChange={(e) => dispatch(setInputMessage(e.target.value))}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem aqui..."
              disabled={isSendingMessage}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #dee2e6',
                borderRadius: '20px',
                resize: 'none',
                minHeight: '44px',
                maxHeight: '120px',
                fontFamily: 'inherit',
                fontSize: '1rem',
                outline: 'none',
              }}
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isSendingMessage}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: !inputMessage.trim() || isSendingMessage ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: !inputMessage.trim() || isSendingMessage ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                minWidth: '80px',
              }}
            >
              {isSendingMessage ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 