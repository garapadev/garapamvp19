# Módulo de Tarefas

## Visão Geral

O Módulo de Tarefas é responsável pelo gerenciamento completo de atividades e tarefas dentro do sistema CRM, permitindo a criação, atribuição, acompanhamento e conclusão de tarefas relacionadas a clientes, projetos e processos internos.

## Funcionalidades Principais

### 1. Gestão de Tarefas
- Criação de tarefas com descrição detalhada
- Atribuição a usuários responsáveis
- Definição de prazos e prioridades
- Status de acompanhamento (Pendente, Em Andamento, Concluída)
- Categorização por tipos

### 2. Integração com WhatsApp
- Criação rápida de tarefas diretamente das conversas
- Sidebar de cadastro rápido
- Vinculação automática com clientes
- Notificações de atualizações

### 3. Integração com Clientes
- Vinculação de tarefas a clientes específicos
- Histórico de atividades por cliente
- Dashboard de acompanhamento
- Relatórios de produtividade

### 4. Sistema de Prioridades
- Definição de níveis de prioridade (Baixa, Média, Alta, Urgente)
- Ordenação automática por prioridade
- Notificações para tarefas urgentes
- Escalonamento automático

### 5. Acompanhamento e Relatórios
- Dashboard com métricas em tempo real
- Gráficos de produtividade
- Relatórios por período
- Exportação de dados

## Estrutura de Dados

### Model Tarefa (Prisma)

```prisma
model Tarefa {
  id          String      @id @default(cuid())
  titulo      String
  descricao   String?
  status      TarefaStatus @default(PENDENTE)
  prioridade  TarefaPrioridade @default(MEDIA)
  dataVencimento DateTime?
  dataConclusao DateTime?
  clienteId   String?
  usuarioId   String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relacionamentos
  cliente     Cliente?    @relation(fields: [clienteId], references: [id])
  usuario     Usuario?    @relation(fields: [usuarioId], references: [id])
  
  @@map("tarefas")
}

enum TarefaStatus {
  PENDENTE
  EM_ANDAMENTO
  CONCLUIDA
  CANCELADA
}

enum TarefaPrioridade {
  BAIXA
  MEDIA
  ALTA
  URGENTE
}
```

## Endpoints da API

### GET /api/tarefas
- **Descrição**: Lista todas as tarefas com filtros e paginação
- **Parâmetros**:
  - `page` (opcional): Número da página
  - `limit` (opcional): Limite de registros por página
  - `status` (opcional): Filtro por status
  - `prioridade` (opcional): Filtro por prioridade
  - `clienteId` (opcional): Filtro por cliente
  - `usuarioId` (opcional): Filtro por usuário
- **Resposta**: Lista de tarefas com metadados de paginação

### GET /api/tarefas/[id]
- **Descrição**: Obtém detalhes de uma tarefa específica
- **Parâmetros**: ID da tarefa
- **Resposta**: Dados completos da tarefa

### POST /api/tarefas
- **Descrição**: Cria uma nova tarefa
- **Corpo**: Dados da tarefa
- **Resposta**: Tarefa criada

### PUT /api/tarefas/[id]
- **Descrição**: Atualiza dados de uma tarefa
- **Parâmetros**: ID da tarefa
- **Corpo**: Dados atualizados
- **Resposta**: Tarefa atualizada

### DELETE /api/tarefas/[id]
- **Descrição**: Exclui uma tarefa
- **Parâmetros**: ID da tarefa
- **Resposta**: Confirmação de exclusão

### PUT /api/tarefas/[id]/status
- **Descrição**: Atualiza o status de uma tarefa
- **Parâmetros**: ID da tarefa
- **Corpo**: Novo status
- **Resposta**: Tarefa atualizada

### GET /api/tarefas/dashboard
- **Descrição**: Retorna dados para o dashboard de tarefas
- **Resposta**: Métricas e estatísticas

## Componentes Principais

### TarefaForm
- Formulário completo de criação/edição
- Seleção de cliente vinculado
- Definição de prioridade e prazo
- Campo de descrição rica
- Validação de campos

### TarefaList
- Lista paginada de tarefas
- Filtros avançados
- Ordenação por prioridade/data
- Ações rápidas
- Indicadores visuais de status

### TarefaCard
- Card com informações resumidas
- Indicadores de prioridade e status
- Progresso visual
- Ações rápidas
- Links para módulos integrados

### TarefaSidebar
- Sidebar para cadastro rápido
- Interface minimalista
- Integração com WhatsApp
- Validação básica

### TarefaDashboard
- Dashboard com métricas em tempo real
- Gráficos de produtividade
- Lista de tarefas pendentes
- Estatísticas por status

## Fluxos de Trabalho

### 1. Criação de Tarefa
1. Acessar módulo de tarefas
2. Clicar em "Nova Tarefa"
3. Preencher formulário
4. Selecionar cliente vinculado (opcional)
5. Definir prioridade e prazo
6. Salvar tarefa

### 2. Criação Rápida via WhatsApp
1. Na conversa WhatsApp, clicar ícone de tarefa
2. Sistema abre sidebar de cadastro rápido
3. Preencher título e descrição básica
4. Cliente é automaticamente vinculado
5. Salvar tarefa

### 3. Acompanhamento de Tarefas
1. Acessar dashboard de tarefas
2. Visualizar métricas em tempo real
3. Filtrar por status ou prioridade
4. Atualizar status das tarefas
5. Marcar tarefas como concluídas

## Validações e Regras de Negócio

### Validações de Campos
- **Título**: Obrigatório, mínimo 5 caracteres
- **Descrição**: Opcional, máximo 1000 caracteres
- **Data Vencimento**: Deve ser futura
- **Prioridade**: Obrigatória
- **Status**: Obrigatório

### Regras de Negócio
- Tarefas urgentes têm prioridade na exibição
- Tarefas vencidas são destacadas visualmente
- Não é possível editar tarefas concluídas
- Apenas usuários autorizados podem excluir tarefas
- Tarefas sem prazo são consideradas de baixa prioridade

## Notificações

### Tipos de Notificações
- **Criação de Tarefa**: Notificação para usuário atribuído
- **Atualização de Status**: Notificação para interessados
- **Vencimento Próximo**: Alerta para tarefas próximas do vencimento
- **Tarefa Atrasada**: Alerta para tarefas vencidas

### Canais de Notificação
- Notificações dentro do sistema
- Email (opcional)
- WhatsApp (opcional)
- Push notifications (opcional)

## Segurança

- Controle de acesso por perfil
- Apenas usuários podem ver suas tarefas (por padrão)
- Administradores podem ver todas as tarefas
- Validação de permissões para ações
- Auditoria de alterações

## Performance

- Paginação de resultados
- Indexação de campos de busca
- Cache de dados frequentes
- Lazy loading de relacionamentos
- Otimização de queries complexas

## Monitoramento

- Logs de operações
- Métricas de produtividade
- Tempo de conclusão de tarefas
- Taxa de tarefas atrasadas
- Carga de trabalho por usuário

## Integrações

### WhatsApp
- Criação rápida de tarefas
- Notificações de atualizações
- Vinculação automática com clientes

### Clientes
- Vinculação de tarefas a clientes
- Histórico de atividades
- Dashboard de acompanhamento

### Helpdesk
- Criação de tarefas a partir de chamados
- Acompanhamento de soluções
- Integração com processos de suporte

### Email
- Notificações por email
- Comunicação sobre tarefas
- Lembretes automáticos

## Relatórios

### Tipos de Relatórios
- **Produtividade por Usuário**: Número de tarefas concluídas
- **Tarefas por Status**: Distribuição de tarefas por status
- **Tarefas por Prioridade**: Distribuição por nível de prioridade
- **Tarefas Atrasadas**: Lista de tarefas vencidas
- **Carga de Trabalho**: Distribuição por usuário

### Formatos de Exportação
- CSV
- Excel
- PDF
- JSON