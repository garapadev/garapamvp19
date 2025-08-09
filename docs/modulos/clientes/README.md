# Módulo de Clientes

## Visão Geral

O Módulo de Clientes é o componente central do sistema CRM, responsável pelo cadastro e gerenciamento completo de informações de clientes, com integração total com os demais módulos do sistema.

## Funcionalidades Principais

### 1. Cadastro de Clientes
- Formulário completo com campos personalizados
- Validação de dados em tempo real
- Upload de avatar e documentos
- Categorização por segmentos

### 2. Gerenciamento de Clientes
- Lista paginada com filtros avançados
- Busca por nome, email, telefone ou CPF/CNPJ
- Visualização em cards ou tabela
- Exportação de dados

### 3. Integração com WhatsApp
- Verificação automática de números cadastrados
- Cadastro rápido diretamente das conversas
- Histórico de conversas vinculado ao cliente
- Ações rápidas no cabeçalho da conversa

### 4. Integração com Helpdesk
- Abertura de chamados vinculados ao cliente
- Histórico de atendimentos
- Estatísticas de suporte por cliente

### 5. Integração com Tarefas
- Criação de tarefas relacionadas ao cliente
- Acompanhamento de atividades
- Histórico de interações

## Estrutura de Dados

### Model Cliente (Prisma)

```prisma
model Cliente {
  id          String   @id @default(cuid())
  nome        String
  email       String?  @unique
  telefone    String?
  cpfCnpj     String?  @unique
  endereco    String?
  cidade      String?
  estado      String?
  cep         String?
  avatar      String?
  segmento    String?
  observacoes String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  chamados    Chamado[]
  tarefas     Tarefa[]
  conversas   ConversaWhatsApp[]
  
  @@map("clientes")
}
```

## Endpoints da API

### GET /api/clientes
- **Descrição**: Lista todos os clientes com paginação e filtros
- **Parâmetros**:
  - `page` (opcional): Número da página
  - `limit` (opcional): Limite de registros por página
  - `search` (opcional): Termo de busca
  - `segmento` (opcional): Filtro por segmento
- **Resposta**: Lista de clientes com metadados de paginação

### GET /api/clientes/[id]
- **Descrição**: Obtém detalhes de um cliente específico
- **Parâmetros**: ID do cliente
- **Resposta**: Dados completos do cliente

### POST /api/clientes
- **Descrição**: Cria um novo cliente
- **Corpo**: Dados do cliente
- **Resposta**: Cliente criado

### PUT /api/clientes/[id]
- **Descrição**: Atualiza dados de um cliente
- **Parâmetros**: ID do cliente
- **Corpo**: Dados atualizados
- **Resposta**: Cliente atualizado

### DELETE /api/clientes/[id]
- **Descrição**: Exclui um cliente
- **Parâmetros**: ID do cliente
- **Resposta**: Confirmação de exclusão

### GET /api/clientes/verificar-telefone
- **Descrição**: Verifica se um telefone já está cadastrado
- **Parâmetros**: Número de telefone
- **Resposta**: Boolean indicando se existe

## Componentes Principais

### ClienteForm
- Formulário completo de cadastro/edição
- Validação de campos obrigatórios
- Upload de avatar
- Máscaras para CPF/CNPJ e telefone

### ClienteList
- Lista paginada de clientes
- Filtros avançados
- Ações rápidas (editar, excluir, visualizar)
- Exportação para CSV/Excel

### ClienteCard
- Card com informações resumidas
- Indicadores de status
- Ações rápidas
- Links para módulos integrados

### ClienteSidebar
- Sidebar para cadastro rápido
- Interface minimalista
- Integração com WhatsApp
- Validação básica

## Fluxos de Trabalho

### 1. Cadastro de Novo Cliente
1. Acessar módulo de clientes
2. Clicar em "Novo Cliente"
3. Preencher formulário
4. Validar dados
5. Salvar cliente

### 2. Cadastro Rápido via WhatsApp
1. Na conversa WhatsApp, clicar ícone de cliente
2. Sistema verifica se telefone existe
3. Se não existir, abre sidebar de cadastro rápido
4. Preencher dados básicos
5. Salvar cliente

### 3. Integração com Helpdesk
1. Ao abrir chamado, selecionar cliente
2. Sistema carrega histórico do cliente
3. Chamado fica vinculado ao cliente
4. Histórico disponível para consulta

## Validações e Regras de Negócio

### Validações de Campos
- **Nome**: Obrigatório, mínimo 3 caracteres
- **Email**: Formato válido, único
- **Telefone**: Formato brasileiro, único
- **CPF/CNPJ**: Formato válido, único
- **CEP**: Formato brasileiro

### Regras de Negócio
- Não permitir duplicidade de email
- Não permitir duplicidade de CPF/CNPJ
- Telefone deve estar no formato brasileiro
- Avatar deve ser imagem válida (JPG, PNG, GIF)

## Segurança

- Controle de acesso por perfil
- Validação de dados no frontend e backend
- Sanitização de inputs
- Proteção contra SQL injection
- Auditoria de alterações

## Performance

- Paginação de resultados
- Indexação de campos de busca
- Cache de dados frequentes
- Lazy loading de imagens
- Otimização de queries

## Monitoramento

- Logs de operações
- Métricas de uso
- Tempo de resposta
- Taxa de erros
- Uso de recursos

## Integrações

### WhatsApp
- Verificação automática de números
- Cadastro rápido de contatos
- Histórico de conversas

### Helpdesk
- Vinculação de chamados a clientes
- Histórico de atendimentos
- Estatísticas de suporte

### Tarefas
- Criação de tarefas vinculadas
- Acompanhamento de atividades
- Histórico de interações

### Email
- Comunicação com clientes
- Histórico de emails
- Templates personalizados