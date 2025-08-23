# 🚀 FeedbackAgents - Interface Frontend

## 📖 Sobre o Projeto

O **FeedbackAgents-Frontend** é uma interface gráfica desenvolvida para comunicação com os agentes de IA do sistema de **Agentes de Feedback ao Colaborador**. Este projeto faz parte de uma solução completa de inteligência artificial voltada para gestão de recursos humanos e desenvolvimento profissional.

### 🎯 Objetivo Principal

Criar uma plataforma web que permite aos usuários interagir de forma conversacional com agentes de IA especializados em fornecer feedback personalizado aos colaboradores, baseado em:

- **📊 Folha de Ponto**: Análise de cumprimento de horários e padrões comportamentais
- **📈 Avaliação de Desempenho (AVD)**: Identificação de tendências positivas e negativas
- **🎯 Plano de Desenvolvimento Individual (PDI)**: Sugestões automatizadas de aprimoramento
- **👤 Perfil PROFILER**: Personalização baseada no perfil comportamental do colaborador

### ✨ Funcionalidades Principais

- 🔐 **Sistema de Autenticação**: Login e registro seguro de usuários
- 💬 **Chat Conversacional**: Interface intuitiva para comunicação com agentes de IA
- 📝 **Gerenciamento de Sessões**: Criação, edição e exclusão de conversas
- 🔄 **Histórico de Conversas**: Acesso completo ao histórico de interações
- 📱 **Interface Responsiva**: Design moderno e adaptável a diferentes dispositivos
- ⚡ **Tempo Real**: Comunicação em tempo real com feedback instantâneo

### 🏗️ Arquitetura Técnica

- **Frontend**: React 19 + TypeScript
- **Gerenciamento de Estado**: Redux Toolkit
- **Roteamento**: React Router DOM
- **Comunicação HTTP**: Axios
- **Interface**: CSS customizado com design moderno
- **Autenticação**: JWT Tokens com refresh automático

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 16 ou superior)
- **npm** (normalmente instalado junto com o Node.js)
- **Git** (para clonagem do repositório)

### 📥 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/FeedbackAgents-Frontend.git
   cd FeedbackAgents-Frontend
   ```

2. **Navegue até o diretório frontend:**
   ```bash
   cd frontend
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

### ⚙️ Configuração

1. **Configure as variáveis de ambiente:**
   
   Crie um arquivo `.env` na pasta `frontend/` baseado no arquivo `.env.example`:
   ```bash
   # Para desenvolvimento local
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```bash
   # Desenvolvimento
   REACT_APP_API_URL=http://localhost:8000
   
   # Produção (substitua pela sua URL real)
   # REACT_APP_API_URL=https://sua-api-de-producao.com
   ```

2. **Certifique-se de que o backend está rodando:**
   
   O frontend precisa se comunicar com o backend dos agentes de feedback. Certifique-se de que o serviço backend esteja rodando na URL configurada.

### 🎬 Executando em Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm start
```

O aplicativo será aberto automaticamente em: `http://localhost:3000`

### 🏗️ Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `build/`.

### 🧪 Executando Testes

Para executar os testes automatizados:

```bash
npm test
```

### 📦 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm test` - Executa testes automatizados
- `npm run eject` - Ejeta configurações (irreversível)

## 🌐 Deploy

### Azure Static Web Apps

O projeto está configurado para deploy no Azure Static Web Apps. O arquivo `staticwebapp.config.json` contém as configurações necessárias para roteamento SPA.

### Netlify/Vercel

O arquivo `public/_redirects` está configurado para deploy em plataformas como Netlify.

## 🔧 Estrutura do Projeto

```
frontend/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── auth/          # Componentes de autenticação
│   │   └── Home/          # Componentes da página principal
│   ├── pages/             # Páginas da aplicação
│   ├── api.ts             # Configuração da API
│   ├── store.ts           # Configuração do Redux
│   └── hooks.ts           # Hooks customizados
├── package.json           # Dependências e scripts
└── tsconfig.json          # Configuração TypeScript
```

## 🔐 Autenticação

O sistema utiliza autenticação JWT com os seguintes endpoints:

- `POST /api/auth/login/` - Login de usuário
- `POST /api/auth/register/` - Registro de novo usuário
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/profile/` - Perfil do usuário

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é parte do trabalho de iniciação científica sobre **Agentes de Feedback ao Colaborador** desenvolvido por Rodrigo Drummond.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos canais oficiais do projeto.

---

**Desenvolvido com ❤️ para revolucionar o feedback corporativo através da Inteligência Artificial**