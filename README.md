# Fintech Frontend - React + TypeScript + Vite

Frontend da aplicação de gestão financeira desenvolvida como projeto acadêmico.

## Tecnologias

- **React 19** + **TypeScript**
- **Vite** (Build tool )
- **React Router DOM** (Navegação SPA)
- **CSS Modules** (Estilização com escopo local)
- **Fetch API** (Requisições HTTP)

## Pré-requisitos

- Node.js 18+ instalado
- Backend (fintech-api) rodando em `http://localhost:8080`

## Instalação

```bash
# Instalar dependências
npm install
```

## ▶Executar

```bash
# Modo desenvolvimento (Hot Module Replacement)
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button/         # Botão com variantes
│   ├── Input/          # Input com label e erro
│   ├── Card/           # Card e subcomponentes
│   └── ProtectedRoute/ # Proteção de rotas
├── contexts/           # Contexts (useContext)
│   └── AuthContext.tsx # Estado global de autenticação
├── hooks/              # Hooks customizados
│   └── useAuth.ts      # Hook para consumir AuthContext
├── pages/              # Páginas da aplicação
│   ├── Login/          # Tela de login
│   └── Dashboard/      # Dashboard principal
├── services/           # Integração com API
│   ├── httpClient.ts   # Cliente HTTP (fetch)
│   └── auth.service.ts # Serviço de autenticação
├── types/              # Tipos TypeScript
│   └── auth.types.ts   # Tipos de autenticação
├── App.tsx             # Configuração de rotas
├── main.tsx            # Entry point
└── index.css           # CSS global + variáveis
```

## Autenticação

A autenticação utiliza **JWT** e **useContext** para gerenciamento de estado global:

1. Login envia credenciais para `/api/auth/login`
2. Token JWT é armazenado no `localStorage`
3. `AuthContext` gerencia estado do usuário
4. `ProtectedRoute` protege rotas autenticadas
5. Token é incluído automaticamente nas requisições

## Funcionalidades Implementadas

- ✅ Tela de Login
- ✅ Autenticação com JWT
- ✅ Dashboard básico
- ✅ Proteção de rotas
- ✅ Logout
- ✅ Exibição de informações do usuário

## Próximos Passos

- [ ] CRUD de Receitas
- [ ] CRUD de Despesas
- [ ] CRUD de Categorias
- [ ] Filtros e pesquisa
- [ ] Gráficos e relatórios
- [ ] Página de registro

## Conceitos do Curso Aplicados

Este projeto segue os conceitos ensinados no curso:

- **React com Vite** - Criado com `npm create vite@latest`
- **Componentização** - Componentes funcionais reutilizáveis
- **Props** - Passagem de dados entre componentes
- **useState** - Gerenciamento de estado local
- **useEffect** - Efeitos colaterais (localStorage)
- **useContext** - Estado global (AuthContext)
- **React Router** - SPA com navegação
- **CSS Modules** - Estilos com escopo local
- **Fetch API** - Consumo de API REST

## Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.
