# ✅ Módulo de Tarefas

O módulo de tarefas do CRM System oferece uma solução completa para gestão de projetos e atividades, permitindo criar, organizar, acompanhar e concluir tarefas de forma eficiente e colaborativa.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Interface do Usuário](#interface-do-usuário)
- [API Endpoints](#api-endpoints)
- [Modelo de Dados](#modelo-de-dados)
- [Workflows](#workflows)
- [Integrações](#integrações)
- [Melhores Práticas](#melhores-práticas)
- [Solução de Problemas](#solução-de-problemas)

## 🎯 Visão Geral

O módulo de tarefas foi projetado para ajudar equipes a gerenciar seu trabalho de forma organizada, com ferramentas visuais como Kanban boards, listas detalhadas e calendários integrados.

### Características Principais

- 📋 **Kanban Board**: Visualização em quadro Kanban com arrastar e soltar
- 📅 **Calendário Integrado**: Visualização de tarefas em formato de calendário
- 👥 **Atribuição de Equipe**: Atribua tarefas a membros específicos da equipe
- 🏷️ **Tags e Categorias**: Organize tarefas com etiquetas flexíveis
- ⏰ **Lembretes Automáticos**: Notificações para prazos e vencimentos
- 📊 **Relatórios**: Análise de produtividade e desempenho

### Benefícios

- **Organização**: Todas as tarefas centralizadas e organizadas
- **Visibilidade**: Acompanhamento claro do progresso das atividades
- **Colaboração**: Trabalho em equipe eficiente e coordenado
- **Produtividade**: Foco no que realmente importa com priorização inteligente

## ✨ Funcionalidades

### 1. Gestão de Tarefas

#### Criação de Tarefas
- **Formulário Rápido**: Crie tarefas em segundos com informações essenciais
- **Template de Tarefas**: Use templates para tarefas recorrentes
- **Criação em Massa**: Crie múltiplas tarefas de uma vez
- **Importação**: Importe tarefas de outras ferramentas

#### Edição e Atualização
- **Edição Inline**: Atualize tarefas diretamente da lista
- **Histórico de Alterações**: Acompanhe todas as mudanças
- **Comentários**: Adicione comentários e discussões nas tarefas
- **Anexos**: Anexe arquivos e documentos às tarefas

### 2. Visualizações Múltiplas

#### Kanban Board
Visualize suas tarefas em um quadro Kanban interativo:

```
┌─────────────────────────────────────────────────────────────┐
│ ✅ Tarefas                           [+] [⚙️] [📊]         │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Buscar tarefas...          [Filtros] [Nova Tarefa]       │
├─────────────────────────────────────────────────────────────┤
│ 📊 Progresso: 45% (9/20 concluídas)                        │
├─────────────────────────────────────────────────────────────┤
│ 📋 Quadro Kanban                                          │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │   A Fazer   │ │ Em Andamento│ │  Revisão    │ │Concluído│ │
│ │    (5)      │ │    (8)      │ │    (4)      │ │  (3)   │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
│                                                             │
│ [Tarefa 1]     [Tarefa 6]     [Tarefa 11]    [Tarefa 16]│
│ [Tarefa 2]     [Tarefa 7]     [Tarefa 12]    [Tarefa 17]│
│ [Tarefa 3]     [Tarefa 8]     [Tarefa 13]    [Tarefa 18]│
│ [Tarefa 4]     [Tarefa 9]     [Tarefa 14]             │
│ [Tarefa 5]     [Tarefa 10]    [Tarefa 15]             │
└─────────────────────────────────────────────────────────────┘
```

#### Lista Detalhada
Visualização em formato de lista com todas as informações:

```
┌─────────────────────────────────────────────────────────────┐
│ 📋 Lista de Tarefas                                            │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Buscar... [Filtros] [Ordenar] [Exportar]                   │
├─────────────────────────────────────────────────────────────┤
│ ┌─┬─────────────────────┬────────┬────────┬────────┬─────┐ │
│ │✓│ Título              │Respons│Prio   │Prazo   │Ações│ │
│ ├─┼─────────────────────┼────────┼────────┼────────┼─────┤ │
│ │ │Follow up cliente     │Maria  │Alta   │Hoje   │✏🗑️│ │
│ │ │Reunião equipe       │João   │Média  │Amanhã │✏🗑️│ │
│ │ │Atualizar documentação│Ana    │Baixa  │Semana │✏🗑️│ │
│ └─┴─────────────────────┴────────┴────────┴────────┴─────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Calendário
Visualização de tarefas em formato de calendário:

```
┌─────────────────────────────────────────────────────────────┐
│ 📅 Calendário de Tarefas             [Mês] [Semana] [Dia]  │
├─────────────────────────────────────────────────────────────┤
│ ← Janeiro 2024 →                                          │
├────────┬────────┬────────┬────────┬────────┬────────┬────────┤
│ Dom   │ Seg   │ Ter   │ Qua   │ Qui   │ Sex   │ Sáb   │
├────────┼────────┼────────┼────────┼────────┼────────┼────────┤
│       │   1   │   2   │   3   │   4   │   5   │   6   │
│   7   │   8   │   9   │  10   │  11   │  12   │  13   │
│  14   │  15   │  16   │  17   │  18   │  19   │  20   │
│  21   │  22   │  23   │  24   │  25   │  26   │  27   │
│  28   │  29   │  30   │  31   │       │       │       │
└────────┴────────┴────────┴────────┴────────┴────────┴────────┘
│ 📋 Tarefas do dia: 15/01                                  │
│ • 10:00 - Reunião com equipe                              │
│ • 14:00 - Follow up cliente João                          │
│ • 16:00 - Atualizar documentação                         │
└─────────────────────────────────────────────────────────────┘
```

### 3. Gestão de Equipe

#### Atribuição de Tarefas
- **Atribuição Individual**: Atribua tarefas a membros específicos
- **Atribuição em Grupo**: Atribua a grupos ou departamentos
- **Balanceamento de Carga**: Visualize a carga de trabalho da equipe
- **Substituição**: Reatribua tarefas quando necessário

#### Colaboração
- **Comentários**: Discuta tarefas com a equipe
- **Menções**: Mencione colegas usando @
- **Notificações**: Alertas automáticos para menções e atribuições
- **Histórico**: Acompanhe todas as interações

### 4. Priorização e Prazos

#### Sistema de Prioridade
- **Níveis de Prioridade**: Baixa, Média, Alta, Urgente
- **Cores Visuais**: Codificação por cores para fácil identificação
- **Ordenação Automática**: Tarefas ordenadas por prioridade
- **Alertas**: Notificações para tarefas urgentes

#### Gestão de Prazos
- **Datas de Vencimento**: Defina prazos claros
- **Lembretes**: Configure lembretes automáticos
- **Sobrecarga**: Visualize tarefas atrasadas
- **Previsão**: Planeje com base em prazos futuros

## 🖥️ Interface do Usuário

### Formulário de Criação de Tarefa

```
┌─────────────────────────────────────────────────────────────┐
│ ➕ Nova Tarefa                                  [X]      │
├─────────────────────────────────────────────────────────────┤
│ 📝 Informações Básicas                                   │
│ Título: [Follow up inicial com cliente                     ] │
│ Descrição: [Fazer contato inicial para apresentar        ] │
│           [proposta de serviços e agendar reunião         ] │
│                                                             │
│ 👥 Responsável: [Maria Santos ▼]                          │
│ 🏷️ Tags: [Importante] [Follow-up] [+ Adicionar]         │
│                                                             │
│ 📅 Prazo: [15/01/2024 14:00 ▼]                          │
│ ⚡ Prioridade: [Alta ▼]                                   │
│                                                             │
│ 🔔 Lembretes: [ ] 1 dia antes [ ] No dia do vencimento     │
│                                                             │
│ [💾 Criar Tarefa] [🔄 Limpar] [❌ Cancelar]                │
└─────────────────────────────────────────────────────────────┘
```

### Detalhes da Tarefa

```
┌─────────────────────────────────────────────────────────────┐
│ 📋 Follow up inicial com cliente               [✏️] [🗑️] │
├─────────────────────────────────────────────────────────────┤
│ 📊 Status: Em Andamento | Prioridade: Alta                   │
│ 👤 Responsável: Maria Santos | 📅 Vence: 15/01/2024      │
│                                                             │
│ 📝 Descrição                                               │
│ Fazer contato inicial com o cliente para apresentar        │
│ proposta de serviços e agendar reunião de follow up.        │
│                                                             │
│ 💬 Comentários (3)                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Maria: Precisamos focar nos requisitos do cliente      │ │
│ │ [15/01 14:30]                                         │ │
│ │                                                         │ │
│ │ João: Vou preparar a proposta comercial               │ │
│ │ [15/01 15:45]                                         │ │
│ │                                                         │ │
│ │ Ana: Reunião agendada para sexta-feira às 10h           │ │
│ │ [15/01 16:20]                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ 📎 Anexos (2)                                             │
│ 📄 proposta.pdf (2.1 MB)  📄 briefing.docx (856 KB)       │
│                                                             │
│ 📈 Atividades Relacionadas                                │
│ • Cliente: Tech Solutions Ltda                           │
│ • Tarefa pai: Projeto Onboarding                          │
│                                                             │
│ 📊 Histórico                                              │
│ Criado: 15/01/2024 10:30 por João Silva                   │
│ Atualizado: 15/01/2024 16:20 por Ana Santos               │
└─────────────────────────────────────────────────────────────┘
```

## 🔌 API Endpoints

### Listar Tarefas
```http
GET /api/tasks
```

**Parâmetros:**
- `page`: Número da página (default: 1)
- `limit`: Itens por página (default: 20, max: 100)
- `search`: Termo de busca
- `status`: Filtro por status (pending, in_progress, completed, cancelled)
- `priority`: Filtro por prioridade (low, medium, high, urgent)
- `assigneeId`: Filtro por responsável
- `dueDateFrom`: Data inicial de vencimento
- `dueDateTo`: Data final de vencimento
- `tags`: Filtro por tags (separadas por vírgula)

**Exemplo:**
```bash
curl -X GET "https://api.crm-system.com/v1/tasks?status=pending&priority=high&assigneeId=user_123" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Criar Tarefa
```http
POST /api/tasks
```

**Body:**
```json
{
  "title": "Follow up inicial com cliente",
  "description": "Fazer contato inicial para apresentar proposta de serviços",
  "priority": "high",
  "status": "pending",
  "dueDate": "2024-01-15T14:00:00Z",
  "assigneeId": "user_123",
  "customerId": "cust_456",
  "tags": ["importante", "follow-up"]
}
```

### Buscar Tarefa
```http
GET /api/tasks/{id}
```

### Atualizar Tarefa
```http
PUT /api/tasks/{id}
```

**Body:**
```json
{
  "title": "Follow up inicial com cliente",
  "description": "Fazer contato inicial para apresentar proposta de serviços",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2024-01-15T14:00:00Z",
  "assigneeId": "user_123",
  "tags": ["importante", "follow-up", "urgente"]
}
```

### Atualizar Status
```http
PATCH /api/tasks/{id}/status
```

**Body:**
```json
{
  "status": "completed"
}
```

### Atribuir Tarefa
```http
POST /api/tasks/{id}/assign
```

**Body:**
```json
{
  "assigneeId": "user_456"
}
```

### Excluir Tarefa
```http
DELETE /api/tasks/{id}
```

### Criar Tarefa via WhatsApp
```http
POST /api/whatsapp/tasks/create
```

**Body:**
```json
{
  "title": "Título da tarefa",
  "description": "Descrição da tarefa",
  "priority": "medium",
  "contactName": "João Silva",
  "contactPhone": "+5511999999999"
}
```

## 📊 Modelo de Dados

### Task Schema
```typescript
interface Task {
  id: string                    // UUID único
  title: string                  // Título da tarefa
  description?: string           // Descrição detalhada
  status: TaskStatus             // Status da tarefa
  priority: TaskPriority         // Prioridade da tarefa
  dueDate?: string               // Data de vencimento
  assigneeId?: string           // ID do responsável
  customerId?: string           // ID do cliente vinculado
  tags: string[]               // Array de tags
  attachments?: TaskAttachment[] // Anexos
  comments?: TaskComment[]       // Comentários
  parentId?: string             // ID da tarefa pai (para subtarefas)
  createdAt: string            // Data de criação
  updatedAt: string            // Data de atualização
  completedAt?: string         // Data de conclusão
}

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface TaskAttachment {
  id: string
  filename: string
  size: number
  url: string
  uploadedAt: string
}

interface TaskComment {
  id: string
  authorId: string
  content: string
  createdAt: string
  mentions?: string[]
}
```

### Exemplo de Uso
```typescript
const task: Task = {
  id: "task_123456",
  title: "Follow up inicial com cliente",
  description: "Fazer contato inicial para apresentar proposta de serviços e agendar reunião",
  status: "in_progress",
  priority: "high",
  dueDate: "2024-01-15T14:00:00Z",
  assigneeId: "user_123",
  customerId: "cust_456",
  tags: ["importante", "follow-up", "venda"],
  attachments: [
    {
      id: "att_123",
      filename: "proposta.pdf",
      size: 2100000,
      url: "/uploads/proposta.pdf",
      uploadedAt: "2024-01-15T10:30:00Z"
    }
  ],
  comments: [
    {
      id: "com_123",
      authorId: "user_456",
      content: "Vou preparar a proposta comercial",
      createdAt: "2024-01-15T15:45:00Z",
      mentions: ["user_123"]
    }
  ],
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T16:20:00Z"
};
```

## 🔄 Workflows

### 1. Workflow de Gestão de Tarefas

```
Criação → Planejamento → Execução → Revisão → Conclusão
```

**Passos:**
1. **Criação**: Definir título, descrição, prioridade e prazo
2. **Planejamento**: Atribuir responsável e definir recursos
3. **Execução**: Realizar as atividades planejadas
4. **Revisão**: Verificar qualidade e completeness
5. **Conclusão**: Marcar como concluída e documentar aprendizados

### 2. Workflow de Colaboração

```
Atribuição → Comunicação → Coordenação → Entrega → Feedback
```

**Passos:**
1. **Atribuição**: Atribuir tarefa ao responsável adequado
2. **Comunicação**: Discutir detalhes e expectativas
3. **Coordenação**: Alinhar com outras tarefas e equipe
4. **Entrega**: Entregar a tarefa dentro do prazo
5. **Feedback**: Receber e fornecer feedback sobre o trabalho

### 3. Workflow de Priorização

```
Coleta → Análise → Priorização → Execução → Monitoramento
```

**Passos:**
1. **Coleta**: Reunir todas as tarefas pendentes
2. **Análise**: Avaliar impacto e urgência
3. **Priorização**: Ordenar por importância e urgência
4. **Execução**: Focar nas tarefas mais importantes
5. **Monitoramento**: Acompanhar progresso e ajustar prioridades

## 🔗 Integrações

### 1. Integração com Módulo de Clientes

As tarefas podem ser vinculadas a clientes específicos:

```typescript
// Criar tarefa vinculada a cliente
const task = {
  title: "Follow up inicial",
  description: "Fazer contato inicial com o cliente",
  customerId: "cust_456",
  priority: "medium",
  dueDate: "2024-01-20T18:00:00Z"
};
```

### 2. Integração com Módulo de Atividades

Tarefas podem gerar atividades automáticas:

```typescript
// Atividade gerada ao criar tarefa
const activity = {
  type: "task_created",
  title: "Tarefa criada: Follow up inicial",
  taskId: "task_123",
  customerId: "cust_456"
};
```

### 3. Integração com Módulo Helpdesk

Tarefas podem ser criadas a partir de tickets:

```typescript
// Criar tarefa a partir de ticket
const task = {
  title: "Resolver problema de acesso ao sistema",
  description: "Ticket #123456 - Problema relatado pelo cliente",
  ticketId: "ticket_123",
  priority: "high",
  assigneeId: "user_123"
};
```

### 4. Integração com WhatsApp

Crie tarefas diretamente das conversas do WhatsApp:

```typescript
// Criar tarefa via WhatsApp
const task = {
  title: "Retornar ligação do cliente",
  description: "Cliente ligou solicitando orçamento",
  contactName: "João Silva",
  contactPhone: "+5511999999999",
  priority: "medium"
};
```

### 5. Integração com Calendário

Tarefas com prazos aparecem no calendário:

```typescript
// Evento de calendário gerado
const calendarEvent = {
  title: "Vencimento: Follow up inicial",
  start: "2024-01-15T14:00:00Z",
  taskId: "task_123",
  type: "task_due"
};
```

## 💡 Melhores Práticas

### 1. Gestão de Tarefas

#### Definição Clara
- **Títulos Específicos**: Use títulos claros e acionáveis
- **Descrições Detalhadas**: Inclua contexto e instruções
- **Critérios de Aceite**: Defina quando a tarefa está concluída
- **Dependencies**: Identifique dependências entre tarefas

#### Priorização Eficaz
- **Matriz de Eisenhower**: Classifique por urgência e importância
- **Valor do Negócio**: Priorize tarefas com maior impacto
- **Dependências**: Considere tarefas que bloqueiam outras
- **Capacidade**: Balanceie carga de trabalho da equipe

### 2. Colaboração

#### Comunicação Clara
- **Comentários Contextuais**: Adicione informações relevantes
- **Menções Adequadas**: Use @ para notificar pessoas específicas
- **Atualizações de Status**: Mantenha o status sempre atualizado
- **Feedback Construtivo**: Forneça feedback útil e oportuno

#### Responsabilidade
- **Atribuição Clara**: Atribua um único responsável quando possível
- **Prazos Realistas**: Defina prazos alcançáveis
- **Autonomia**: Permita que a equipe decida como executar
- **Accountability**: Mantenha responsáveis pelas entregas

### 3. Organização

#### Estruturação
- **Hierarquia**: Use subtarefas para tarefas complexas
- **Categorização**: Use tags e categorias consistentes
- **Templates**: Crie templates para tarefas recorrentes
- **Padronização**: Mantenha formato consistente

#### Manutenção
- **Limpeza Regular**: Arquive ou exclua tarefas concluídas
- **Revisão Periódica**: Revise e ajuste prioridades
- **Documentação**: Documente processos e aprendizados
- **Melhoria Contínua**: Otimize processos baseado em feedback

### 4. Performance

#### Eficiência
- **Automação**: Automatize tarefas repetitivas
- **Templates**: Use templates para tarefas comuns
- **Batch Processing**: Agrupe tarefas similares
- **Delegação**: Delegue tarefas quando possível

#### Monitoramento
- **Métricas**: Acompanhe tempo de conclusão e produtividade
- **Bottlenecks**: Identifique gargalos no processo
- **Tendências**: Analise padrões e tendências
- **Ajustes**: Faça ajustes baseados em dados

## 🚨 Solução de Problemas

### Problemas Comuns

#### 1. Tarefas Não Concluídas

**Causa:**
- Prazos irreais
- Falta de clareza nos requisitos
- Sobrecarga da equipe
- Falta de priorização

**Solução:**
- Revise e ajuste prazos
- Clarifique requisitos e expectativas
- Balanceie carga de trabalho
- Implemente sistema de priorização

#### 2. Sobrecarga de Tarefas

**Causa:**
- Muitas tarefas simultâneas
- Falta de delegação
- Procrastinação
- Escopo mal definido

**Solução:**
- Use sistema de priorização
- Delegue tarefas adequadas
- Quebre tarefas grandes em menores
- Defina escopo claro

#### 3. Falta de Colaboração

**Causa:**
- Comunicação inadequada
- Responsabilidades mal definidas
- Ferramentas inadequadas
- Falta de alinhamento

**Solução:**
- Melhore canais de comunicação
- Defina responsabilidades claras
- Use ferramentas colaborativas
- Alinhe equipe regularmente

#### 4. Problemas de Qualidade

**Causa:**
- Pressa por entrega
- Falta de revisão
- Treinamento insuficiente
- Processos mal definidos

**Solução:**
- Implemente processo de revisão
- Invista em treinamento
- Defina padrões de qualidade
- Balanceie velocidade e qualidade

### Ferramentas de Diagnóstico

#### 1. Análise de Produtividade
```typescript
// Função para analisar produtividade
function analyzeProductivity(tasks: Task[]) {
  const completed = tasks.filter(t => t.status === 'completed');
  const overdue = tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
  );
  
  return {
    completionRate: (completed.length / tasks.length) * 100,
    overdueRate: (overdue.length / tasks.length) * 100,
    averageCompletionTime: calculateAverageCompletionTime(completed)
  };
}
```

#### 2. Balanceamento de Carga
```typescript
// Função para balancear carga de trabalho
function balanceWorkload(tasks: Task[], teamMembers: string[]) {
  const workload = teamMembers.map(member => ({
    member,
    tasks: tasks.filter(t => t.assigneeId === member).length,
    highPriority: tasks.filter(t => 
      t.assigneeId === member && t.priority === 'high'
    ).length
  }));
  
  return workload.sort((a, b) => b.tasks - a.tasks);
}
```

#### 3. Identificação de Gargalos
```typescript
// Função para identificar gargalos
function identifyBottlenecks(tasks: Task[]) {
  const statusCounts = {
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };
  
  const bottleneck = statusCounts.inProgress > statusCounts.completed * 2 
    ? 'Muitas tarefas em andamento, poucas conclusões'
    : 'Fluxo de trabalho normal';
  
  return bottleneck;
}
```

### Script de Manutenção

```bash
#!/bin/bash
# task_maintenance.sh - Script de manutenção do módulo de tarefas

echo "=== CRM Tasks Maintenance ==="
DATE=$(date +%Y%m%d)

# Backup do banco de dados
echo "1. Creating backup..."
pg_dump crm_production > /backups/tasks_$DATE.sql

# Atualizar status de tarefas atrasadas
echo "2. Updating overdue tasks..."
psql crm_production -c "UPDATE tasks SET status = 'overdue' WHERE due_date < NOW() AND status = 'pending';"

# Enviar notificações de lembrete
echo "3. Sending reminder notifications..."
psql crm_production -c "CALL send_task_reminders();"

# Arquivar tarefas concluídas antigas
echo "4. Archiving old completed tasks..."
psql crm_production -c "CALL archive_completed_tasks(90);" # 90 dias

# Atualizar estatísticas
echo "5. Updating statistics..."
psql crm_production -c "REFRESH MATERIALIZED VIEW task_statistics;"

echo "=== Maintenance Complete ==="
```

---

## 📞 Suporte

Para dúvidas ou problemas com o módulo de tarefas:

- **Documentação**: Consulte os exemplos neste documento
- **API Reference**: Verifique a documentação da API
- **Templates**: Use os templates disponíveis no sistema
- **Contato**: support@crm-system.com

**Importante**: Mantenha suas tarefas organizadas e atualizadas para máxima produtividade!