# Módulo WhatsApp

## Visão Geral

O Módulo WhatsApp é uma integração completa com a plataforma WhatsApp, utilizando a biblioteca WhatsMeow para proporcionar uma experiência similar ao WhatsApp Web, com funcionalidades avançadas de integração com os demais módulos do sistema CRM.

## Funcionalidades Principais

### 1. Interface WhatsApp Web-like
- Interface familiar e intuitiva
- Lista de conversas recentes
- Visualização de contatos e grupos
- Busca de conversas
- Indicadores de mensagens não lidas

### 2. Integração com Módulos CRM
- **Clientes**: Cadastro rápido e consulta de informações
- **Tarefas**: Criação de tarefas diretamente das conversas
- **Helpdesk**: Abertura de chamados a partir das conversas
- **Email**: Integração com comunicação por email

### 3. Sistema de Sidebars
- Sidebar de cadastro rápido de clientes
- Sidebar de criação de tarefas
- Sidebar de abertura de chamados
- Interface flutuante não intrusiva

### 4. Gerenciamento de Contatos
- Sincronização com contatos do sistema
- Identificação automática de clientes cadastrados
- Cadastro rápido de novos contatos
- Informações detalhadas de contato

### 5. Histórico de Conversas
- Armazenamento de histórico de mensagens
- Busca avançada no histórico
- Exportação de conversas
- Análise de interações

## Estrutura de Dados

### Model ConversaWhatsApp (Prisma)

```prisma
model ConversaWhatsApp {
  id          String   @id @default(cuid())
  telefone    String
  nome        String?
  isGroup     Boolean  @default(false)
  ultimoMensagem String?
  dataUltimaMensagem DateTime?
  naoLidas    Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  clienteId   String?
  mensagens   MensagemWhatsApp[]
  cliente     Cliente? @relation(fields: [clienteId], references: [id])
  
  @@unique([telefone])
  @@map("conversas_whatsapp")
}

model MensagemWhatsApp {
  id          String           @id @default(cuid())
  conversaId  String
  conteudo    String
  tipo        MensagemTipo     @default(TEXT)
  remetente   MensagemRemetente @default(CONTATO)
  lida        Boolean          @default(false)
  timestamp   DateTime
  mid         String?          // Message ID do WhatsApp
  anexo       String?
  createdAt   DateTime         @default(now())

  // Relacionamentos
  conversa    ConversaWhatsApp @relation(fields: [conversaId], references: [id])
  
  @@map("mensagens_whatsapp")
}

enum MensagemTipo {
  TEXT
  IMAGE
  VIDEO
  AUDIO
  DOCUMENT
  STICKER
  LOCATION
  CONTACT
}

enum MensagemRemetente {
  CONTATO
  USUARIO
}
```

## Endpoints da API

### Conversas

### GET /api/whatsapp/conversas
- **Descrição**: Lista todas as conversas
- **Parâmetros**:
  - `page` (opcional): Número da página
  - `limit` (opcional): Limite de registros por página
  - `search` (opcional): Termo de busca
- **Resposta**: Lista de conversas com metadados de paginação

### GET /api/whatsapp/conversas/[id]
- **Descrição**: Obtém detalhes de uma conversa específica
- **Parâmetros**: ID da conversa
- **Resposta**: Dados completos da conversa com mensagens

### GET /api/whatsapp/conversas/telefone/[telefone]
- **Descrição**: Busca conversa por número de telefone
- **Parâmetros**: Número de telefone
- **Resposta**: Conversa encontrada ou null

### Mensagens

### GET /api/whatsapp/conversas/[id]/mensagens
- **Descrição**: Lista mensagens de uma conversa
- **Parâmetros**: ID da conversa
- **Resposta**: Lista de mensagens

### POST /api/whatsapp/conversas/[id]/mensagens
- **Descrição**: Envia uma mensagem
- **Parâmetros**: ID da conversa
- **Corpo**: Dados da mensagem
- **Resposta**: Mensagem enviada

### PUT /api/whatsapp/mensagens/[id]/ler
- **Descrição**: Marca mensagem como lida
- **Parâmetros**: ID da mensagem
- **Resposta**: Confirmação

### Integração

### GET /api/whatsapp/verificar-cliente/[telefone]
- **Descrição**: Verifica se um telefone pertence a um cliente cadastrado
- **Parâmetros**: Número de telefone
- **Resposta**: Dados do cliente ou null

### POST /api/whatsapp/conversas/[id]/criar-cliente
- **Descrição**: Cria cliente a partir da conversa
- **Parâmetros**: ID da conversa
- **Corpo**: Dados do cliente
- **Resposta**: Cliente criado

### POST /api/whatsapp/conversas/[id]/criar-tarefa
- **Descrição**: Cria tarefa a partir da conversa
- **Parâmetros**: ID da conversa
- **Corpo**: Dados da tarefa
- **Resposta**: Tarefa criada

### POST /api/whatsapp/conversas/[id]/criar-chamado
- **Descrição**: Cria chamado a partir da conversa
- **Parâmetros**: ID da conversa
- **Corpo**: Dados do chamado
- **Resposta**: Chamado criado

## Componentes Principais

### WhatsAppLayout
- Layout principal similar ao WhatsApp Web
- Lista de conversas lateral
- Área de conversa principal
- Barra de busca
- Indicadores de status

### ConversaList
- Lista de conversas recentes
- Indicadores de mensagens não lidas
- Última mensagem visualizada
- Avatar e nome do contato
- Horário da última mensagem

### ConversaArea
- Área principal de conversa
- Cabeçalho com informações do contato
- Ícones de integração (Cliente, Tarefa, Helpdesk)
- Lista de mensagens
- Campo de envio de mensagens

### MensagemBubble
- Bolha de mensagem individual
- Formatação por tipo (texto, imagem, etc.)
- Indicador de status (enviada, lida)
- Horário da mensagem
- Avatar do remetente

### ClienteSidebar
- Sidebar para cadastro/visualização de clientes
- Formulário de cadastro rápido
- Exibição de dados do cliente
- Integração com conversa atual
- Ações rápidas

### TarefaSidebar
- Sidebar para criação de tarefas
- Formulário simplificado
- Vínculo automático com cliente
- Definição de prioridade
- Salvar tarefa

### HelpdeskSidebar
- Sidebar para abertura de chamados
- Formulário de chamado simplificado
- Seleção de departamento
- Vínculo automático com cliente
- Abrir chamado

## Fluxos de Trabalho

### 1. Envio de Mensagem
1. Selecionar conversa na lista
2. Digitar mensagem no campo de texto
3. Clicar em enviar ou pressionar Enter
4. Mensagem é enviada via WhatsMeow
5. Mensagem aparece na conversa com status "enviada"

### 2. Cadastro Rápido de Cliente
1. Na conversa, clicar ícone de cliente
2. Sistema verifica se telefone existe
3. Se não existir, abre sidebar de cadastro
4. Preencher dados básicos do cliente
5. Salvar cliente
6. Cliente fica vinculado à conversa

### 3. Criação de Tarefa
1. Na conversa, clicar ícone de tarefa
2. Sistema abre sidebar de tarefas
3. Preencher título e descrição
4. Cliente é automaticamente vinculado
5. Definir prioridade e prazo
6. Salvar tarefa

### 4. Abertura de Chamado
1. Na conversa, clicar ícone de helpdesk
2. Sistema abre sidebar de helpdesk
3. Preencher título e descrição
4. Cliente é automaticamente vinculado
5. Selecionar departamento
6. Abrir chamado

## Validações e Regras de Negócio

### Validações de Campos
- **Telefone**: Formato brasileiro válido
- **Mensagem**: Conteúdo não pode ser vazio
- **Cliente**: Nome obrigatório para cadastro
- **Tarefa**: Título obrigatório
- **Chamado**: Título e descrição obrigatórios

### Regras de Negócio
- Não enviar mensagens para contatos bloqueados
- Limitar tamanho de mensagens de texto
- Validar formatos de anexos
- Respeitar limites do WhatsApp
- Manter histórico de conversas

## Integração com WhatsMeow

### Configuração
- Autenticação via QR Code
- Gerenciamento de sessões
- Reconexão automática
- Tratamento de desconexões

### Funcionalidades Suportadas
- Envio de mensagens de texto
- Envio de mídias (imagens, vídeos, áudios)
- Recebimento de mensagens
- Status de mensagens (enviada, entregue, lida)
- Gerenciamento de contatos

### Limitações
- Respeitar limites da API do WhatsApp
- Não suporta spam ou mensagens em massa
- Requer conexão estável com internet
- Depende de sessões ativas

## Segurança

- Criptografia de ponta a ponta (via WhatsApp)
- Controle de acesso por usuário
- Auditoria de mensagens enviadas
- Proteção contra uso não autorizado
- Conformidade com políticas do WhatsApp

## Performance

- Cache de conversas recentes
- Paginação de mensagens antigas
- Lazy loading de mídias
- Otimização de renderização
- Gerenciamento eficiente de memória

## Monitoramento

- Status da conexão WhatsApp
- Taxa de entrega de mensagens
- Erros de envio
- Uso de recursos
- Performance da interface

## Integrações

### Clientes
- Verificação automática de contatos
- Cadastro rápido de clientes
- Histórico de conversas por cliente
- Informações do contato na interface

### Tarefas
- Criação de tarefas contextualizadas
- Vínculo automático com cliente
- Acompanhamento de atividades
- Notificações de atualizações

### Helpdesk
- Abertura de chamados contextualizados
- Vínculo automático com cliente
- Histórico de atendimentos
- Integração com departamentos

### Email
- Encaminhamento de conversas por email
- Notificações por email
- Templates de comunicação
- Integração com histórico

## Recursos Avançados

### Templates de Mensagem
- Templates pré-definidos
- Personalização com variáveis
- Uso em respostas rápidas
- Organização por categorias

### Automações
- Respostas automáticas
- Saudações personalizadas
- Agendamento de mensagens
- Fluxos de atendimento

### Análise de Dados
- Estatísticas de uso
- Análise de sentimentos
- Relatórios de produtividade
- Métricas de atendimento

## Configurações

### Preferências do Usuário
- Notificações personalizadas
- Tema da interface
- Configurações de privacidade
- Opções de exibição

### Configurações do Sistema
- Limites de envio
- Horários de funcionamento
- Respostas automáticas
- Integrações com outros sistemas

## Boas Práticas

### Uso do WhatsApp
- Respeitar políticas de uso
- Evitar spam ou mensagens em massa
- Manter comunicação profissional
- Responder em tempo hábil

### Gestão de Contatos
- Manter cadastro atualizado
- Categorizar contatos
- Documentar interações
- Respeitar privacidade

### Atendimento ao Cliente
- Ser claro e objetivo
- Manter tom profissional
- Documentar todas as interações
- Seguir fluxos definidos