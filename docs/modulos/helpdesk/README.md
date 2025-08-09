# Módulo Helpdesk

## Visão Geral

O Módulo Helpdesk é um sistema completo de gestão de chamados e suporte técnico, projetado para gerenciar solicitações de atendimento de forma eficiente e organizada. O sistema permite o cadastro de departamentos, criação de tickets, acompanhamento de solicitações e integração com os demais módulos do CRM.

## Funcionalidades Principais

### 1. Gestão de Departamentos
- Cadastro de departamentos com configurações avançadas
- Associação departamento-grupo com opções recursivas
- Definição de escopo de atendimento
- Hierarquia organizacional flexível

### 2. Sistema de Tickets
- Criação de chamados com categorização
- Atribuição automática a departamentos
- Status de acompanhamento (Aberto, Em Andamento, Resolvido, Fechado)
- Priorização de solicitações
- Histórico completo de interações

### 3. Associação Departamento-Grupo
- **Modo Recursivo**: Departamento atende chamados de todos os subgrupos
- **Modo Não-Recursivo**: Atendimento restrito a grupos específicos
- Configuração flexível por departamento
- Visualização da estrutura hierárquica

### 4. Dashboard de Atendimento
- Métricas em tempo real
- Gráficos de desempenho
- Lista de chamados pendentes
- Estatísticas por departamento

### 5. Integração com Outros Módulos
- **WhatsApp**: Abertura de chamados diretamente das conversas
- **Clientes**: Vinculação automática com clientes cadastrados
- **Tarefas**: Criação de tarefas relacionadas aos chamados

## Estrutura de Dados

### Model Departamento (Prisma)

```prisma
model Departamento {
  id          String   @id @default(cuid())
  nome        String
  descricao   String?
  email       String?
  ativo       Boolean  @default(true)
  recursivo   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  grupos      DepartamentoGrupo[]
  chamados    Chamado[]
  
  @@map("departamentos")
}

model DepartamentoGrupo {
  id             String   @id @default(cuid())
  departamentoId String
  grupoId        String
  createdAt      DateTime @default(now())

  // Relacionamentos
  departamento   Departamento @relation(fields: [departamentoId], references: [id])
  grupo          Grupo       @relation(fields: [grupoId], references: [id])
  
  @@unique([departamentoId, grupoId])
  @@map("departamento_grupos")
}

model Grupo {
  id          String   @id @default(cuid())
  nome        String
  descricao   String?
  paiId       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  pai         Grupo?               @relation("GrupoHierarquia", fields: [paiId], references: [id])
  filhos      Grupo[]             @relation("GrupoHierarquia")
  departamentos DepartamentoGrupo[]
  
  @@map("grupos")
}
```

### Model Chamado (Prisma)

```prisma
model Chamado {
  id            String        @id @default(cuid())
  titulo        String
  descricao     String
  status        ChamadoStatus @default(ABERTO)
  prioridade    ChamadoPrioridade @default(MEDIA)
  departamentoId String
  clienteId     String?
  usuarioId     String?
  dataResposta  DateTime?
  dataFechamento DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relacionamentos
  departamento  Departamento  @relation(fields: [departamentoId], references: [id])
  cliente       Cliente?      @relation(fields: [clienteId], references: [id])
  usuario       Usuario?      @relation(fields: [usuarioId], references: [id])
  respostas     RespostaChamado[]
  
  @@map("chamados")
}

model RespostaChamado {
  id          String   @id @default(cuid())
  chamadoId   String
  mensagem    String
  usuarioId   String?
  anexo       String?
  createdAt   DateTime @default(now())

  // Relacionamentos
  chamado     Chamado  @relation(fields: [chamadoId], references: [id])
  usuario     Usuario? @relation(fields: [usuarioId], references: [id])
  
  @@map("respostas_chamados")
}

enum ChamadoStatus {
  ABERTO
  EM_ANDAMENTO
  RESPONDIDO
  RESOLVIDO
  FECHADO
  CANCELADO
}

enum ChamadoPrioridade {
  BAIXA
  MEDIA
  ALTA
  URGENTE
}
```

## Endpoints da API

### Departamentos

### GET /api/helpdesk/departamentos
- **Descrição**: Lista todos os departamentos
- **Resposta**: Lista de departamentos com grupos associados

### POST /api/helpdesk/departamentos
- **Descrição**: Cria um novo departamento
- **Corpo**: Dados do departamento
- **Resposta**: Departamento criado

### PUT /api/helpdesk/departamentos/[id]
- **Descrição**: Atualiza um departamento
- **Parâmetros**: ID do departamento
- **Corpo**: Dados atualizados
- **Resposta**: Departamento atualizado

### DELETE /api/helpdesk/departamentos/[id]
- **Descrição**: Exclui um departamento
- **Parâmetros**: ID do departamento
- **Resposta**: Confirmação de exclusão

### Chamados

### GET /api/helpdesk/chamados
- **Descrição**: Lista todos os chamados com filtros
- **Parâmetros**:
  - `page` (opcional): Número da página
  - `limit` (opcional): Limite de registros por página
  - `status` (opcional): Filtro por status
  - `departamentoId` (opcional): Filtro por departamento
  - `clienteId` (opcional): Filtro por cliente
- **Resposta**: Lista de chamados com metadados de paginação

### GET /api/helpdesk/chamados/[id]
- **Descrição**: Obtém detalhes de um chamado específico
- **Parâmetros**: ID do chamado
- **Resposta**: Dados completos do chamado com respostas

### POST /api/helpdesk/chamados
- **Descrição**: Cria um novo chamado
- **Corpo**: Dados do chamado
- **Resposta**: Chamado criado

### PUT /api/helpdesk/chamados/[id]
- **Descrição**: Atualiza um chamado
- **Parâmetros**: ID do chamado
- **Corpo**: Dados atualizados
- **Resposta**: Chamado atualizado

### POST /api/helpdesk/chamados/[id]/respostas
- **Descrição**: Adiciona uma resposta a um chamado
- **Parâmetros**: ID do chamado
- **Corpo**: Dados da resposta
- **Resposta**: Resposta criada

### GET /api/helpdesk/dashboard
- **Descrição**: Retorna dados para o dashboard do helpdesk
- **Resposta**: Métricas e estatísticas

## Componentes Principais

### DepartamentoForm
- Formulário de cadastro/edição de departamentos
- Seleção de grupos associados
- Configuração de modo recursivo
- Validação de dados

### DepartamentoList
- Lista de departamentos com status
- Indicadores de grupos associados
- Ações rápidas (editar, excluir)
- Visualização da estrutura hierárquica

### ChamadoForm
- Formulário completo de criação de chamados
- Seleção de departamento e cliente
- Definição de prioridade
- Campo de descrição rica
- Upload de anexos

### ChamadoList
- Lista paginada de chamados
- Filtros avançados
- Indicadores visuais de status
- Ações rápidas
- Ordenação por prioridade/data

### ChamadoDetail
- Detalhes completos do chamado
- Histórico de respostas
- Formulário de resposta
- Informações do cliente
- Timeline de interações

### HelpdeskDashboard
- Dashboard com métricas em tempo real
- Gráficos de desempenho
- Lista de chamados pendentes
- Estatísticas por departamento

## Fluxos de Trabalho

### 1. Cadastro de Departamento
1. Acessar módulo helpdesk
2. Navegar para departamentos
3. Clicar em "Novo Departamento"
4. Preencher dados básicos
5. Selecionar grupos associados
6. Definir modo recursivo
7. Salvar departamento

### 2. Criação de Chamado
1. Acessar módulo helpdesk
2. Clicar em "Novo Chamado"
3. Preencher título e descrição
4. Selecionar departamento
5. Vincular cliente (opcional)
6. Definir prioridade
7. Salvar chamado

### 3. Atendimento de Chamado
1. Acessar lista de chamados
2. Selecionar chamado para atendimento
3. Analisar descrição e histórico
4. Adicionar respostas conforme necessário
5. Atualizar status do chamado
6. Marcar como resolvido quando concluído

### 4. Abertura Rápida via WhatsApp
1. Na conversa WhatsApp, clicar ícone de helpdesk
2. Sistema abre sidebar de abertura rápida
3. Preencher título e descrição básica
4. Cliente é automaticamente vinculado
5. Selecionar departamento
6. Abrir chamado

## Validações e Regras de Negócio

### Validações de Campos
- **Departamento**: Nome obrigatório, mínimo 3 caracteres
- **Chamado**: Título obrigatório, mínimo 5 caracteres
- **Descrição**: Obrigatória, mínimo 10 caracteres
- **Departamento ID**: Obrigatório para chamados
- **Prioridade**: Obrigatória

### Regras de Negócio
- Departamentos recursivos atendem todos os subgrupos
- Departamentos não-recursivos atendem apenas grupos selecionados
- Chamados urgentes têm prioridade na exibição
- Não é possível editar chamados fechados
- Respostas só podem ser adicionadas a chamados abertos

## Sistema de Priorização

### Níveis de Prioridade
- **Urgente**: Atendimento imediato (SLA: 1 hora)
- **Alta**: Atendimento prioritário (SLA: 4 horas)
- **Média**: Atendimento normal (SLA: 24 horas)
- **Baixa**: Atendimento quando possível (SLA: 72 horas)

### SLA (Service Level Agreement)
- Tempo de resposta por prioridade
- Tempo de solução por prioridade
- Notificações de vencimento
- Relatórios de cumprimento

## Notificações

### Tipos de Notificações
- **Novo Chamado**: Notificação para departamento responsável
- **Resposta Adicionada**: Notificação para interessados
- **Status Alterado**: Notificação para cliente e equipe
- **SLA Atingido**: Alerta para gestores
- **Chamado Atrasado**: Alerta para equipe

### Canais de Notificação
- Notificações dentro do sistema
- Email para clientes
- WhatsApp para clientes
- Push notifications para equipe

## Segurança

- Controle de acesso por departamento
- Apenas usuários autorizados podem ver chamados
- Clientes só veem seus próprios chamados
- Validação de permissões para ações
- Auditoria de todas as operações

## Performance

- Paginação de resultados
- Indexação de campos de busca
- Cache de dados frequentes
- Lazy loading de relacionamentos
- Otimização de queries complexas

## Monitoramento

- Logs de todas as operações
- Métricas de tempo de resposta
- Taxa de resolução de chamados
- Cumprimento de SLA
- Satisfação dos clientes

## Integrações

### WhatsApp
- Abertura rápida de chamados
- Notificações para clientes
- Respostas via WhatsApp
- Anexos via WhatsApp

### Clientes
- Vinculação automática de chamados
- Histórico de atendimentos
- Dashboard de acompanhamento

### Tarefas
- Criação de tarefas relacionadas
- Acompanhamento de soluções
- Integração com processos

### Email
- Notificações por email
- Comunicação com clientes
- Templates personalizados

## Relatórios

### Tipos de Relatórios
- **Desempenho por Departamento**: Métricas de atendimento
- **SLA Cumprido**: Taxa de cumprimento por prioridade
- **Chamados por Status**: Distribuição atual
- **Tempo Médio de Resolução**: Análise de eficiência
- **Satisfação dos Clientes**: Pesquisas de satisfação

### Formatos de Exportação
- CSV
- Excel
- PDF
- JSON

## Configurações Avançadas

### Automatizações
- Atribuição automática de chamados
- Escalonamento automático
- Respostas automáticas
- Notificações programadas

### Personalização
- Campos personalizados por departamento
- Templates de resposta
- Fluxos de atendimento personalizados
- Regras de negócio específicas