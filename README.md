# CRM System - Gestão de Clientes, Tarefas e Colaboradores

Um sistema CRM completo desenvolvido com Next.js 15, TypeScript e Clean Architecture, seguindo os princípios SOLID e Domain-Driven Design (DDD).

## 🚀 Funcionalidades

- **Gestão de Clientes**: Cadastro, edição, busca e organização de clientes com status, tags e informações detalhadas
- **Gestão de Tarefas**: Sistema completo de tarefas com atribuição, prioridades, status e prazos
- **Gestão de Colaboradores**: Administração de equipe com perfis e permissões
- **Controle de Permissões RBAC**: Sistema Role-Based Access Control completo com grupos, permissões e papéis
- **Dashboard Interativo**: Métricas e visualizações em tempo real
- **Arquitetura Limpa**: Estrutura organizada com Clean Architecture, SOLID e DDD

## 🏗️ Arquitetura

O projeto segue uma arquitetura limpa com as seguintes camadas:

```
src/
├── domain/           # Entidades de domínio e regras de negócio
│   ├── entities/     # Entidades principais (User, Customer, Task, etc.)
│   ├── valueobjects/ # Objetos de valor
│   └── aggregates/   # Agregados de domínio
├── application/      # Casos de uso e serviços de aplicação
│   ├── usecases/     # Casos de uso
│   ├── services/     # Serviços de aplicação
│   ├── dto/          # Data Transfer Objects
│   └── repositories/ # Interfaces de repositórios
├── infrastructure/   # Implementações de infraestrutura
│   ├── database/     # Repositórios e configurações de banco
│   ├── external/     # APIs externas
│   ├── messaging/    # Filas e mensageria
│   └── cache/        # Configurações de cache
└── presentation/     # Controllers, rotas e UI
    ├── controllers/  # Controllers da API
    ├── routes/       # Rotas da aplicação
    └── middleware/   # Middlewares
```

## 🛠️ Tecnologias

### Backend
- **Framework**: Next.js 15 com App Router
- **Linguagem**: TypeScript 5
- **Banco de Dados**: PostgreSQL 15 com PostGIS e pgvector
- **ORM**: Prisma
- **Cache**: Redis
- **Mensageria**: RabbitMQ
- **Autenticação**: NextAuth.js
- **Arquitetura**: Clean Architecture, SOLID, DDD

### Frontend
- **Framework**: Next.js 15
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS 4
- **Componentes**: shadcn/ui
- **Ícones**: Lucide React
- **Gerenciamento de Estado**: Zustand, TanStack Query

### Infraestrutura
- **Containerização**: Docker & Docker Compose
- **Banco de Dados**: PostgreSQL, MongoDB
- **Cache**: Redis
- **Filas**: RabbitMQ

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose
- npm ou yarn

### 1. Clonar o repositório
```bash
git clone <repositorio>
cd crm-system
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

### 4. Iniciar os serviços com Docker
```bash
docker-compose up -d
```

### 5. Configurar o banco de dados
```bash
npm run db:push
npm run db:generate
```

### 6. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🐳 Docker Services

O projeto inclui os seguintes serviços Docker:

- **PostgreSQL**: Banco de dados principal com PostGIS e pgvector
- **MongoDB**: Banco de dados para dados não estruturados
- **Redis**: Cache e sessões
- **RabbitMQ**: Filas de processamento assíncrono
- **PgAdmin**: Interface de gerenciamento PostgreSQL (opcional)
- **Mongo Express**: Interface de gerenciamento MongoDB (opcional)

### Iniciar serviços com ferramentas de administração
```bash
docker-compose --profile tools up -d
```

## 📊 API Endpoints

### Clientes
- `GET /api/customers` - Listar clientes
- `POST /api/customers` - Criar cliente
- `GET /api/customers/[id]` - Obter cliente por ID
- `PUT /api/customers/[id]` - Atualizar cliente
- `DELETE /api/customers/[id]` - Excluir cliente

### Tarefas
- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar tarefa
- `GET /api/tasks/[id]` - Obter tarefa por ID
- `PUT /api/tasks/[id]` - Atualizar tarefa
- `DELETE /api/tasks/[id]` - Excluir tarefa

### Usuários
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/[id]` - Obter usuário por ID
- `PUT /api/users/[id]` - Atualizar usuário
- `DELETE /api/users/[id]` - Excluir usuário

## 🔐 Sistema RBAC

O sistema implementa um controle de acesso baseado em papéis completo:

### Entidades RBAC
- **User**: Usuários do sistema
- **Role**: Papéis (ex: admin, manager, user)
- **Permission**: Permissões (ex: customers:read, tasks:create)
- **UserRole**: Associação entre usuários e papéis
- **RolePermission**: Associação entre papéis e permissões

### Exemplos de Permissões
- `customers:read` - Ler clientes
- `customers:create` - Criar clientes
- `customers:update` - Atualizar clientes
- `customers:delete` - Excluir clientes
- `tasks:read` - Ler tarefas
- `tasks:create` - Criar tarefas
- `tasks:update` - Atualizar tarefas
- `tasks:delete` - Excluir tarefas
- `users:read` - Ler usuários
- `users:create` - Criar usuários
- `users:update` - Atualizar usuários
- `users:delete` - Excluir usuários

## 🗄️ Estrutura do Banco de Dados

### PostgreSQL (Schema Prisma)
```prisma
// Entidades principais
model User
model Customer
model Task
model CustomerNote
model Activity

// RBAC
model Role
model Permission
model UserRole
model RolePermission
```

### MongoDB (Documentos)
- Logs de atividades
- Dados não estruturados
- Anexos e documentos

## 🎯 Principais Recursos

### Gestão de Clientes
- Cadastro completo com informações pessoais e profissionais
- Sistema de status (Lead, Prospect, Customer, Inactive, Lost)
- Tags personalizáveis para categorização
- Histórico de interações
- Busca avançada com filtros

### Gestão de Tarefas
- Criação e atribuição de tarefas
- Sistema de prioridades (Low, Medium, High, Urgent)
- Status tracking (Pending, In Progress, Completed, Cancelled)
- Prazos e lembretes
- Integração com clientes

### Dashboard
- Métricas em tempo real
- Gráficos e visualizações
- Cards informativos
- Atividades recentes
- Tarefas pendentes

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Compilar para produção
npm run start        # Iniciar servidor de produção
npm run lint         # Executar linting

# Banco de dados
npm run db:push      # Enviar schema para o banco
npm run db:generate  # Gerar Prisma Client
npm run db:migrate   # Executar migrações
npm run db:reset     # Resetar banco de dados
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte, envie um email para suporte@crm.com ou abra uma issue no GitHub.

---

Desenvolvido com ❤️ usando Next.js, TypeScript e Clean Architecture