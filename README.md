# GarapaCRM - Sistema CRM Completo

Um sistema CRM moderno e completo desenvolvido com Next.js 15, TypeScript e arquitetura limpa, oferecendo gestão de clientes, tarefas, atividades e comunicação integrada. **Preparado para multitenancy com arquitetura single tenant atual.**

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

### 🏢 Arquitetura Multitenant Preparada
- **Single Tenant Mode**: Operação atual com tenant único
- **Estrutura Pronta**: Arquitetura preparada para evolução para multitenancy
- **Isolamento de Dados**: Tenant ID em todas as entidades principais
- **Context Management**: Sistema de contexto de tenant para fácil escalabilidade

## 🏗️ Arquitetura Multitenant

### Visão Geral
O GarapaCRM foi projetado com uma arquitetura que permite fácil evolução de single tenant para multitenant:

```
┌─────────────────────────────────────────────────────────────┐
│                    Arquitetura Atual (Single Tenant)          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Frontend      │  │   Backend      │  │   Database     │ │
│  │   (Next.js)     │  │   (API Routes) │  │   (PostgreSQL) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│           │                     │                     │        │
│           └─────────────────────┼─────────────────────┘        │
│                                 │                              │
│                    ┌─────────────────┐                        │
│                    │ Tenant Context │                        │
│                    │ (Default)      │                        │
│                    └─────────────────┘                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               Arquitetura Futura (Multitenant)               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Frontend      │  │   Backend      │  │   Database     │ │
│  │   (Next.js)     │  │   (API Routes) │  │   (PostgreSQL) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│           │                     │                     │        │
│  ┌─────────────────┐           │           ┌─────────────────┐ │
│  │ Tenant A       │           │           │ Tenant A Data   │ │
│  │ (tenant-a.com)│           │           │ (tenant_a_*)    │ │
│  ├─────────────────┤           │           ├─────────────────┤ │
│  │ Tenant B       │           │           │ Tenant B Data   │ │
│  │ (tenant-b.com)│           │           │ (tenant_b_*)    │ │
│  └─────────────────┘           │           └─────────────────┘ │
│           │                     │                              │
│           └─────────────────────┼─────────────────────┘        │
│                                 │                              │
│                    ┌─────────────────┐                        │
│                    │ Tenant Context │                        │
│                    │ (Dynamic)      │                        │
│                    └─────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Chave

#### 1. Tenant Context System
- **`TenantProvider`**: Contexto React para gerenciamento de tenant
- **`useTenant()`**: Hook para acessar informações do tenant
- **`getServerTenantId()`**: Função para obter tenant ID no servidor
- **`createTenantFilter()`**: Utilitário para criar filtros de tenant em queries

#### 2. Middleware de Tenant Detection
- **`middleware.ts`**: Interceptador de requisições para identificação de tenant
- **Headers de Debug**: Informações de tenant para desenvolvimento
- **Preparado para**: Subdomínio, path, header ou cookie-based tenant resolution

#### 3. Banco de Dados com Tenant Isolation
Todas as entidades principais incluem `tenantId` com valor padrão `"default"`:

```prisma
model User {
  id       String   @id @default(cuid())
  // ... outros campos
  tenantId String   @default("default") // Tenant isolation
}

model Customer {
  id       String   @id @default(cuid())
  // ... outros campos
  tenantId String   @default("default") // Tenant isolation
}

model Task {
  id       String   @id @default(cuid())
  // ... outros campos
  tenantId String   @default("default") // Tenant isolation
}
```

#### 4. Repositórios com Tenant Awareness
- **Tenant Filtering**: Todas as queries incluem filtro de tenant
- **Segurança**: Dados isolados por tenant automaticamente
- **Performance**: Índices otimizados para consultas com tenant

#### 5. API Routes com Tenant Context
- **Automatic Tenant Isolation**: Endpoints API aplicam filtros de tenant
- **Server-side Tenant ID**: Obtido automaticamente em cada requisição
- **Consistência**: Garantia de isolamento de dados em todas as operações

### Estrutura de Diretórios

```
src/
├── lib/
│   ├── tenant-context.ts      # Tenant management system
│   ├── db.ts                 # Database connection
│   └── auth.ts               # Authentication setup
├── middleware.ts             # Tenant detection middleware
├── app/
│   ├── layout.tsx            # Root layout with TenantProvider
│   ├── page.tsx              # Dashboard with tenant awareness
│   └── api/                  # API routes with tenant filtering
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx       # UI with tenant information
│   └── ui/
└── infrastructure/
    └── database/
        └── repositories/      # Tenant-aware repositories
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

### Multitenancy Infrastructure
- **Tenant Context**: Sistema de gerenciamento de tenant
- **Middleware**: Tenant detection e routing
- **Database Isolation**: Tenant ID em todas as entidades
- **API Security**: Filtros automáticos de tenant em todas as rotas

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
# Multitenancy (opcional - futuro)
# NEXT_PUBLIC_MULTITENANT="true"
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

## 🔄 Migração para Multitenant

### Passo 1: Ativar Modo Multitenant
```env
NEXT_PUBLIC_MULTITENANT="true"
```

### Passo 2: Configurar Tenant Resolution
No `middleware.ts`, implemente a lógica de detecção de tenant:

```typescript
// Exemplo: Detecção por subdomínio
const hostname = request.nextUrl.hostname
const subdomain = hostname.split('.')[0]
const tenantId = await getTenantBySubdomain(subdomain)
```

### Passo 3: Atualizar Tenant Provider
Modifique `tenant-context.ts` para suportar tenants dinâmicos:

```typescript
// No lugar do tenant fixo, busque dinamicamente
const tenant = await getCurrentTenant(request)
```

### Passo 4: Migração de Dados
```sql
-- Adicionar tenant_id a registros existentes
UPDATE users SET tenant_id = 'legacy' WHERE tenant_id = 'default';
UPDATE customers SET tenant_id = 'legacy' WHERE tenant_id = 'default';
-- ... para todas as tabelas
```

## 🗄️ Estrutura do Banco de Dados

### Schema Principal com Tenant Isolation
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

// Entidades Principais (com tenant isolation)
model Customer
model Task
model CustomerNote
model ActivityLog

// Atividades
model Activity
model ActivityTask
model ActivityParticipant
```

## 📱 Módulos Disponíveis

### Dashboard (`/`)
- Visão geral do sistema
- Métricas filtradas por tenant
- Ações rápidas
- Atividades recentes

### Clientes (`/customers`)
- Gestão completa de clientes
- Cadastro, edição e exclusão
- Filtros e busca
- Visualização por grupo e tenant

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
- Filtros por período e tenant

### Configurações (`/settings`)
- Gestão de usuários
- Criação de grupos
- Configurações do sistema
- Permissões e acessos

## 🌟 Recursos Destaque

### Arquitetura Multitenant Escalável
- **Single Tenant Mode**: Operação simplificada atualmente
- **Estrutura Preparada**: Pronto para evolução sem refatoração
- **Isolamento Completo**: Dados, sessões e permissões por tenant
- **Performance Otimizada**: Queries eficientes com tenant filtering

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

Para suporte, envie um email para suporte@garapacrm.com ou abra uma issue no GitHub.

---

Desenvolvido com ❤️ usando Next.js, TypeScript e Clean Architecture pela equipe GarapaDev
Desenvolvido com IA, tecnologicamente cearense para o mundo
