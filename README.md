# GarapaCRM - Sistema CRM Completo

Um sistema CRM moderno e completo desenvolvido com Next.js 15, TypeScript e arquitetura limpa, oferecendo gestão de clientes, tarefas, atividades e comunicação integrada.

## 🚀 Funcionalidades Principais

### 📊 Dashboard Interativo
- Métricas em tempo real com visualização por grupos hierárquicos
- Cards informativos com totais de clientes, leads, tarefas ativas e receita
- Visualização de dados filtrados por permissões de acesso
- Ações rápidas para acesso rápido às funcionalidades principais

### 👥 Gestão de Clientes
- Cadastro completo com informações pessoais e profissionais
- Sistema de status (Lead, Prospect, Customer, Inactive, Lost)
- Tags personalizáveis para categorização
- Associação com grupos hierárquicos para segregação de dados
- Busca avançada com filtros

### ✅ Gestão de Tarefas
- Sistema completo de tarefas com atribuição, prioridades e status
- Integração com clientes e atividades
- Sistema de prioridades (Low, Medium, High, Urgent)
- Controle de prazos e responsáveis
- Kanban board para visualização organizada

### 🎯 Gestão de Atividades
- Criação e gerenciamento de atividades complexas
- Sistema de participantes com diferentes níveis de acesso
- Tarefas associadas a atividades
- Controle de status e prioridades
- Integração com clientes e grupos

### 📧 Comunicação Integrada
- **Email**: Sistema completo de envio e recebimento de emails
- **WhatsApp**: Integração para comunicação via WhatsApp
- **Helpdesk**: Sistema de tickets e suporte ao cliente

### 🔐 Controle de Acesso Avançado
- **RBAC (Role-Based Access Control)**: Sistema completo de permissões
- **Grupos Hierárquicos**: Organização em estrutura hierárquica com segregação de dados
- **Gestão de Usuários**: Administração completa de equipe com perfis e permissões

### 📈 Relatórios e Analytics
- Dashboard com métricas e visualizações em tempo real
- Relatórios detalhados por grupo e período
- Análise de desempenho e produtividade

## 🏗️ Arquitetura

O projeto segue uma arquitetura limpa com as seguintes camadas:

```
src/
├── domain/           # Entidades de domínio e regras de negócio
│   ├── entities/     # Entidades principais (User, Customer, Task, etc.)
│   └── enums/        # Enumerações do domínio
├── application/      # Casos de uso e serviços de aplicação
│   ├── repositories/ # Interfaces de repositórios
│   └── services/     # Serviços de aplicação (RBAC, etc.)
├── infrastructure/   # Implementações de infraestrutura
│   └── database/     # Repositórios Prisma
├── presentation/     # UI e páginas
│   ├── app/          # Páginas Next.js com App Router
│   └── components/   # Componentes React
└── lib/              # Utilitários e configurações
```

## 🛠️ Tecnologias

### Backend
- **Framework**: Next.js 15 com App Router
- **Linguagem**: TypeScript 5
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js
- **Arquitetura**: Clean Architecture, SOLID, DDD

### Frontend
- **Framework**: Next.js 15
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS 4
- **Componentes**: shadcn/ui
- **Ícones**: Lucide React
- **Gerenciamento de Estado**: Zustand, TanStack Query
- **UI Components**: Biblioteca completa de componentes acessíveis

### Comunicação
- **WebSocket**: Socket.io para comunicação em tempo real
- **Email**: Sistema integrado de envio de emails
- **WhatsApp**: Integração via API
- **Helpdesk**: Sistema de tickets e suporte

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- npm ou yarn

### 1. Clonar o repositório
```bash
git clone https://github.com/garapadev/garapamvp19.git
cd garapamvp19
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Configure as seguintes variáveis:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/garapacrm"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configurar o banco de dados
```bash
npm run db:push
npm run db:generate
```

### 5. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🗄️ Estrutura do Banco de Dados

### Schema Principal
```prisma
// RBAC
model User
model Role
model Permission
model UserRole
model RolePermission

// Grupos Hierárquicos
model Group
model UserGroup

// Entidades Principais
model Customer
model Task
model CustomerNote
model ActivityLog

// Atividades
model Activity
model ActivityTask
model ActivityParticipant
```

## 🔐 Sistema RBAC e Grupos

### Role-Based Access Control
- **User**: Usuários do sistema
- **Role**: Papéis (admin, manager, user)
- **Permission**: Permissões granulares
- **UserRole**: Associação entre usuários e papéis
- **RolePermission**: Associação entre papéis e permissões

### Grupos Hierárquicos
- **Group**: Estrutura hierárquica de organizações
- **UserGroup**: Associação entre usuários e grupos
- **Segregação de dados**: Usuários veem apenas dados dos seus grupos e subgrupos

### Exemplos de Permissões
- `customers:read` - Ler clientes
- `customers:create` - Criar clientes
- `tasks:read` - Ler tarefas
- `tasks:create` - Criar tarefas
- `activities:read` - Ler atividades
- `activities:create` - Criar atividades

## 📱 Módulos Disponíveis

### Dashboard (`/`)
- Visão geral do sistema
- Métricas filtradas por grupo
- Ações rápidas
- Atividades recentes

### Clientes (`/customers`)
- Gestão completa de clientes
- Cadastro, edição e exclusão
- Filtros e busca
- Visualização por grupo

### Tarefas (`/tasks`)
- Sistema de gestão de tarefas
- Kanban board
- Atribuição e prioridades
- Integração com clientes

### Atividades (`/activities`)
- Gestão de atividades complexas
- Participantes e tarefas associadas
- Controle de status e prioridades

### Email (`/email`)
- Sistema de envio de emails
- Configuração de SMTP
- Histórico de mensagens
- Templates de email

### WhatsApp (`/whatsapp`)
- Integração com WhatsApp
- Envio de mensagens
- Gestão de contatos
- Automação de respostas

### Helpdesk (`/helpdesk`)
- Sistema de tickets
- Departamentos e categorias
- Histórico de solicitações
- Respostas e anexos

### Relatórios (`/reports`)
- Análise de dados
- Gráficos e métricas
- Exportação de relatórios
- Filtros por período

### Configurações (`/settings`)
- Gestão de usuários
- Criação de grupos
- Configurações do sistema
- Permissões e acessos

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

## 🌟 Recursos Destaque

### Segregação de Dados por Grupos
- Usuários acessam apenas dados dos seus grupos
- Hierarquia de grupos com herança de permissões
- Visualização contextual no dashboard

### Interface Moderna e Responsiva
- Design limpo e intuitivo
- Totalmente responsivo para mobile e desktop
- Componentes acessíveis com shadcn/ui
- Tema claro/escuro suportado

### Sistema de Notificações
- Notificações em tempo real
- Alertas de tarefas e prazos
- Comunicação integrada

### API REST Completa
- Endpoints para todas as entidades
- Validação de dados com Zod
- Tratamento de erros robusto
- Documentação automática

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte, envie um email para suporte@garapacrm.com ou abra uma issue no GitHub.

---

Desenvolvido com ❤️ usando Next.js, TypeScript e Clean Architecture pela equipe GarapaDev
Desenvolvido com IA, tecnologicamente cearense para o mundo
