# Módulo Email

## Visão Geral

O Módulo Email é um cliente de email completo integrado ao sistema CRM, permitindo aos usuários gerenciar suas comunicações por email diretamente da plataforma, com configuração flexível de servidores SMTP/IMAP e sincronização com provedores de email.

## Funcionalidades Principais

### 1. Cliente de Email Completo
- Interface similar a clientes de email tradicionais
- Caixa de entrada com mensagens organizadas
- Visualização de emails em lista ou preview
- Busca avançada de emails
- Filtros e pastas personalizadas

### 2. Configuração SMTP/IMAP
- Configuração flexível de múltiplas contas
- Suporte aos principais provedores (Gmail, Outlook, Yahoo, etc.)
- Teste de conexão automático
- Gerenciamento de credenciais seguras
- Sincronização periódica

### 3. Composição de Emails
- Editor de texto rico com formatação
- Anexos múltiplos
- Templates personalizados
- Assinaturas configuráveis
- Rascunhos automáticos

### 4. Gerenciamento de Contatos
- Integração com módulo de clientes
- Catálogo de endereços
- Grupos de contatos
- Importação/Exportação de contatos
- Busca avançada de contatos

### 5. Integração com Outros Módulos
- **Clientes**: Vinculação de emails a clientes
- **Tarefas**: Criação de tarefas a partir de emails
- **Helpdesk**: Criação de chamados a partir de emails
- **WhatsApp**: Encaminhamento de conversas

## Estrutura de Dados

### Model ContaEmail (Prisma)

```prisma
model ContaEmail {
  id          String   @id @default(cuid())
  nome        String
  email       String
  smtpServer  String
  smtpPort    Int
  smtpUser    String
  smtpPassword String
  imapServer  String
  imapPort    Int
  imapUser    String
  imapPassword String
  ativa       Boolean  @default(true)
  ultimaSincronizacao DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  mensagens   MensagemEmail[]
  
  @@map("contas_email")
}

model MensagemEmail {
  id          String           @id @default(cuid())
  contaId     String
  messageId   String           @unique
  assunto     String
  conteudo    String
  htmlConteudo String?
  remetente   String
  destinatarios String
  cc          String?
  bcc         String?
  dataRecebimento DateTime
  dataLeitura  DateTime?
  lida        Boolean          @default(false)
  importante  Boolean          @default(false)
  pasta       String           @default("INBOX")
  anexos      String[]
  createdAt   DateTime         @default(now())

  // Relacionamentos
  conta       ContaEmail       @relation(fields: [contaId], references: [id])
  
  @@map("mensagens_email")
}
```

## Endpoints da API

### Contas de Email

### GET /api/email/contas
- **Descrição**: Lista todas as contas de email configuradas
- **Resposta**: Lista de contas de email

### POST /api/email/contas
- **Descrição**: Cria uma nova conta de email
- **Corpo**: Dados da conta (SMTP/IMAP)
- **Resposta**: Conta criada

### PUT /api/email/contas/[id]
- **Descrição**: Atualiza uma conta de email
- **Parâmetros**: ID da conta
- **Corpo**: Dados atualizados
- **Resposta**: Conta atualizada

### DELETE /api/email/contas/[id]
- **Descrição**: Exclui uma conta de email
- **Parâmetros**: ID da conta
- **Resposta**: Confirmação de exclusão

### POST /api/email/contas/[id]/testar
- **Descrição**: Testa a conexão da conta de email
- **Parâmetros**: ID da conta
- **Resposta**: Resultado do teste de conexão

### Mensagens

### GET /api/email/mensagens
- **Descrição**: Lista mensagens de email com filtros
- **Parâmetros**:
  - `page` (opcional): Número da página
  - `limit` (opcional): Limite de registros por página
  - `contaId` (opcional): Filtro por conta
  - `pasta` (opcional): Filtro por pasta
  - `search` (opcional): Termo de busca
- **Resposta**: Lista de mensagens com metadados de paginação

### GET /api/email/mensagens/[id]
- **Descrição**: Obtém detalhes de uma mensagem específica
- **Parâmetros**: ID da mensagem
- **Resposta**: Dados completos da mensagem

### POST /api/email/mensagens
- **Descrição**: Envia uma nova mensagem
- **Corpo**: Dados da mensagem
- **Resposta**: Mensagem enviada

### PUT /api/email/mensagens/[id]/ler
- **Descrição**: Marca mensagem como lida
- **Parâmetros**: ID da mensagem
- **Resposta**: Confirmação

### PUT /api/email/mensagens/[id]/importante
- **Descrição**: Marca/desmarca mensagem como importante
- **Parâmetros**: ID da mensagem
- **Resposta**: Confirmação

### Sincronização

### POST /api/email/sincronizar/[contaId]
- **Descrição**: Inicia sincronização manual de uma conta
- **Parâmetros**: ID da conta
- **Resposta**: Status da sincronização

### GET /api/email/sincronizar/status/[contaId]
- **Descrição**: Verifica status da sincronização
- **Parâmetros**: ID da conta
- **Resposta**: Status atual da sincronização

## Componentes Principais

### EmailLayout
- Layout principal do cliente de email
- Barra lateral com pastas e contas
- Lista de mensagens
- Área de visualização de email
- Barra de ferramentas

### ContaEmailForm
- Formulário de configuração de conta
- Campos para SMTP e IMAP
- Teste de conexão integrado
- Validação de dados
- Gerenciamento de credenciais

### MensagemList
- Lista de mensagens com preview
- Indicadores de status (lida, importante)
- Informações de remetente e assunto
- Data de recebimento
- Ações rápidas

### MensagemView
- Visualização completa do email
- Renderização de HTML
- Lista de anexos
- Ações (responder, encaminhar, excluir)
- Informações do remetente

### ComposeEmail
- Formulário de composição de email
- Editor de texto rico
- Gerenciamento de anexos
- Seleção de contatos
- Templates e assinaturas

### EmailSidebar
- Barra lateral com navegação
- Lista de pastas (INBOX, Sent, Drafts, etc.)
- Contas de email configuradas
- Indicadores de mensagens não lidas
- Busca rápida

## Fluxos de Trabalho

### 1. Configuração de Conta de Email
1. Acessar módulo de email
2. Clicar em "Configurar Conta"
3. Preencher dados SMTP (servidor, porta, usuário, senha)
4. Preencher dados IMAP (servidor, porta, usuário, senha)
5. Testar conexão
6. Salvar configuração

### 2. Sincronização de Emails
1. Após configurar conta, sistema inicia sincronização
2. Emails são baixados via IMAP
3. Mensagens são armazenadas localmente
4. Sincronização periódica automática
5. Possibilidade de sincronização manual

### 3. Envio de Email
1. Clicar em "Nova Mensagem"
2. Preencher destinatários (To, CC, BCC)
3. Digitar assunto
4. Compor mensagem com editor rico
5. Anexar arquivos se necessário
6. Clicar em "Enviar"

### 4. Organização de Emails
1. Visualizar lista de mensagens
2. Usar filtros e pastas
3. Marcar emails como lidos/não lidos
4. Marcar emails como importantes
5. Mover emails entre pastas

## Validações e Regras de Negócio

### Validações de Campos
- **Email**: Formato válido obrigatório
- **Servidores SMTP/IMAP**: Endereços válidos
- **Portas**: Números válidos (geralmente 587, 465, 993)
- **Credenciais**: Usuário e senha obrigatórios
- **Assunto**: Obrigatório para envio

### Regras de Negócio
- Não enviar emails sem destinatário
- Validar formato de endereços de email
- Limitar tamanho de anexos
- Respeitar limites de envio por hora
- Manter histórico de mensagens enviadas

## Protocolos Suportados

### SMTP (Simple Mail Transfer Protocol)
- Envio de mensagens
- Autenticação (PLAIN, LOGIN)
- Segurança (TLS, SSL)
- Portas comuns: 587 (TLS), 465 (SSL)

### IMAP (Internet Message Access Protocol)
- Recebimento de mensagens
- Sincronização de pastas
- Gerenciamento de estados (lida, excluída)
- Portas comuns: 143 (sem SSL), 993 (SSL)

## Segurança

- Criptografia de credenciais
- Conexões seguras (SSL/TLS)
- Autenticação de dois fatores quando disponível
- Validação de certificados
- Proteção contra acesso não autorizado

## Performance

- Paginação de mensagens
- Cache de mensagens recentes
- Lazy loading de anexos
- Sincronização incremental
- Otimização de queries

## Monitoramento

- Status das conexões SMTP/IMAP
- Taxa de entrega de emails
- Erros de envio/recebimento
- Tempo de sincronização
- Uso de armazenamento

## Integrações

### Clientes
- Vinculação de emails a clientes
- Histórico de comunicação
- Busca de emails por cliente
- Importação de contatos

### Tarefas
- Criação de tarefas a partir de emails
- Encaminhamento de emails para tarefas
- Acompanhamento de ações
- Notificações

### Helpdesk
- Criação de chamados a partir de emails
- Conversão de emails em tickets
- Respostas automáticas
- Integração com departamentos

### WhatsApp
- Encaminhamento de emails para WhatsApp
- Integração de comunicação
- Sincronização de contatos
- Histórico unificado

## Recursos Avançados

### Templates de Email
- Templates pré-definidos
- Personalização com variáveis
- Organização por categorias
- Uso em respostas rápidas

### Assinaturas
- Assinaturas personalizadas
- HTML e texto simples
- Imagens e links
- Múltiplas assinaturas por usuário

### Filtros e Regras
- Filtros automáticos
- Regras de organização
- Movimentação entre pastas
- Respostas automáticas

### Busca Avançada
- Busca por conteúdo
- Busca por remetente/destinatário
- Busca por data
- Busca por anexos
- Operadores lógicos

## Configurações

### Preferências do Usuário
- Layout da interface
- Opções de exibição
- Notificações
- Assinaturas padrão

### Configurações do Sistema
- Limites de anexos
- Frequência de sincronização
- Retenção de mensagens
- Políticas de segurança

## Boas Práticas

### Gestão de Emails
- Manter caixa de entrada organizada
- Usar pastas e filtros
- Responder em tempo hábil
- Arquivar emails antigos

### Segurança
- Usar senhas fortes
- Habilitar autenticação de dois fatores
- Não compartilhar credenciais
- Manter software atualizado

### Produtividade
- Usar templates para mensagens recorrentes
- Configurar regras automáticas
- Organizar por prioridades
- Manter comunicação clara e objetiva

## Troubleshooting

### Problemas Comuns
- Falha na conexão SMTP/IMAP
- Erros de autenticação
- Problemas com certificados SSL
- Lentidão na sincronização
- Emails não enviados/recebidos

### Soluções
- Verificar configurações de servidor
- Testar conexão manualmente
- Verificar firewalls e antivírus
- Atualizar configurações de porta
- Consultar logs do sistema