# 📚 API Documentation - Swagger/OpenAPI

A API do CRM System está completamente documentada utilizando o padrão OpenAPI 3.0. Esta documentação fornece uma visão completa de todos os endpoints disponíveis, seus parâmetros, respostas e exemplos de uso.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Como Acessar](#como-acessar)
- [Autenticação](#autenticação)
- [Estrutura da API](#estrutura-da-api)
- [Endpoints por Módulo](#endpoints-por-módulo)
- [Modelos de Dados](#modelos-de-dados)
- [Códigos de Status](#códigos-de-status)
- [Rate Limiting](#rate-limiting)
- [Exemplos de Uso](#exemplos-de-uso)
- [Testando a API](#testando-a-api)

## 🎯 Visão Geral

A API REST do CRM System segue os princípios RESTful e fornece acesso programático a todas as funcionalidades do sistema. A API está organizada por módulos lógicos, cada um com seus próprios endpoints.

### Características Principais

- 🔄 **RESTful**: Arquitetura REST com recursos bem definidos
- 🔐 **Segura**: Autenticação JWT com refresh tokens
- 📊 **Documentada**: Especificação OpenAPI 3.0 completa
- 🚀 **Performática**: Respostas JSON eficientes
- 🛡️ **Validada**: Validação robusta de entrada e saída
- 📈 **Versionada**: Controle de versão da API

## 🌐 Como Acessar

### Swagger UI
A interface interativa do Swagger está disponível em:

```
https://seu-dominio.com/api/docs
```

### OpenAPI Specification
O arquivo de especificação OpenAPI está disponível em:

```
https://seu-dominio.com/api/docs/swagger.json
```

### Download da Especificação
```bash
# Baixar especificação OpenAPI
curl -o openapi.yaml https://seu-dominio.com/api/docs/swagger.json

# Baixar versão YAML
curl -o openapi.yaml https://seu-dominio.com/api/docs/swagger.yaml
```

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Todos os endpoints protegidos requerem um token válido no header `Authorization`.

### Fluxo de Autenticação

1. **Login**: Obter token de acesso
2. **Refresh**: Renovar token expirado
3. **Acesso**: Usar token em requisições protegidas

### Exemplo de Login

```bash
curl -X POST https://seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

### Resposta de Login
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "usuario@exemplo.com",
      "name": "João Silva"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Usando o Token
```bash
curl -X GET https://seu-dominio.com/api/customers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🏗️ Estrutura da API

### Base URL
```
https://seu-dominio.com/api
```

### Versão da API
A API é versionada através do header `Accept`:

```http
Accept: application/vnd.crm.v1+json
```

### Estrutura de Respostas

Todas as respostas seguem um formato consistente:

#### Resposta de Sucesso
```json
{
  "success": true,
  "data": {
    // Dados específicos do endpoint
  },
  "message": "Operação realizada com sucesso",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Resposta de Erro
```json
{
  "success": false,
  "error": "Descrição do erro",
  "details": "Detalhes adicionais do erro",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 📦 Endpoints por Módulo

### 1. 🏢 Módulo de Clientes

#### Listar Clientes
```http
GET /api/customers
```

**Parâmetros de Query:**
- `page`: Número da página (default: 1)
- `limit`: Itens por página (default: 20, max: 100)
- `search`: Termo de busca
- `status`: Filtro por status (active, inactive)
- `sortBy`: Campo para ordenação
- `sortOrder`: Direção da ordenação (asc, desc)

**Exemplo:**
```bash
curl -X GET "https://seu-dominio.com/api/customers?page=1&limit=10&search=joao" \
  -H "Authorization: Bearer TOKEN"
```

#### Criar Cliente
```http
POST /api/customers
```

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "phone": "+5511999999999",
  "company": "Tech Solutions Ltda",
  "status": "active"
}
```

#### Buscar Cliente
```http
GET /api/customers/{id}
```

#### Atualizar Cliente
```http
PUT /api/customers/{id}
```

#### Excluir Cliente
```http
DELETE /api/customers/{id}
```

### 2. ✅ Módulo de Tarefas

#### Listar Tarefas
```http
GET /api/tasks
```

**Parâmetros de Query:**
- `page`: Número da página
- `limit`: Itens por página
- `status`: Filtro por status (pending, in_progress, completed, cancelled)
- `priority`: Filtro por prioridade (low, medium, high, urgent)
- `assigneeId`: Filtro por responsável
- `dueDateFrom`: Data inicial de vencimento
- `dueDateTo`: Data final de vencimento

#### Criar Tarefa
```http
POST /api/tasks
```

**Body:**
```json
{
  "title": "Título da tarefa",
  "description": "Descrição detalhada",
  "priority": "medium",
  "status": "pending",
  "dueDate": "2024-01-20T18:00:00Z",
  "assigneeId": "123",
  "tags": ["importante", "follow-up"]
}
```

#### Atualizar Status da Tarefa
```http
PATCH /api/tasks/{id}/status
```

#### Atribuir Tarefa
```http
POST /api/tasks/{id}/assign
```

### 3. 📅 Módulo de Atividades

#### Listar Atividades
```http
GET /api/activities
```

#### Criar Atividade
```http
POST /api/activities
```

**Body:**
```json
{
  "type": "call",
  "title": "Ligação para cliente",
  "description": "Follow up sobre proposta",
  "customerId": "123",
  "scheduledAt": "2024-01-16T14:00:00Z"
}
```

### 4. 📧 Módulo de Email

#### Configurar Conta de Email
```http
POST /api/email/config
```

**Body:**
```json
{
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "user": "seu-email@gmail.com",
    "password": "sua-senha"
  },
  "imap": {
    "host": "imap.gmail.com",
    "port": 993,
    "secure": true,
    "user": "seu-email@gmail.com",
    "password": "sua-senha"
  }
}
```

#### Listar Mensagens
```http
GET /api/email/messages
```

#### Enviar Email
```http
POST /api/email/send
```

**Body:**
```json
{
  "to": "destinatario@email.com",
  "subject": "Assunto do email",
  "body": "Conteúdo do email",
  "attachments": ["file1.pdf", "file2.jpg"]
}
```

### 5. 🎧 Módulo Helpdesk

#### Listar Departamentos
```http
GET /api/helpdesk/departments
```

#### Criar Departamento
```http
POST /api/helpdesk/departments
```

**Body:**
```json
{
  "name": "TI - Suporte Técnico",
  "description": "Suporte técnico e infraestrutura",
  "isRecursive": true,
  "groups": ["1", "2", "3"]
}
```

#### Listar Tickets
```http
GET /api/helpdesk/tickets
```

#### Criar Ticket
```http
POST /api/helpdesk/tickets
```

**Body:**
```json
{
  "title": "Problema com acesso ao sistema",
  "description": "Usuário não consegue fazer login",
  "department": "TI - Suporte Técnico",
  "priority": "high",
  "contactName": "João Silva",
  "contactPhone": "+5511999999999"
}
```

### 6. 📱 Módulo WhatsApp

#### Verificar Cliente via WhatsApp
```http
GET /api/whatsapp/customers/check?phone=+5511999999999
```

#### Criar Cliente via WhatsApp
```http
POST /api/whatsapp/customers/create
```

**Body:**
```json
{
  "name": "João Silva",
  "phone": "+5511999999999",
  "email": "joao.silva@email.com",
  "company": "Tech Solutions Ltda"
}
```

#### Criar Tarefa via WhatsApp
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

#### Criar Ticket via WhatsApp
```http
POST /api/whatsapp/helpdesk/create
```

**Body:**
```json
{
  "title": "Título do chamado",
  "description": "Descrição do problema",
  "department": "TI - Suporte Técnico",
  "priority": "high",
  "contactName": "João Silva",
  "contactPhone": "+5511999999999"
}
```

## 📊 Modelos de Dados

### Customer
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "status": "active | inactive",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Task
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "pending | in_progress | completed | cancelled",
  "priority": "low | medium | high | urgent",
  "dueDate": "string",
  "assigneeId": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Activity
```json
{
  "id": "string",
  "type": "call | email | meeting | task",
  "title": "string",
  "description": "string",
  "customerId": "string",
  "scheduledAt": "string",
  "completedAt": "string",
  "createdAt": "string"
}
```

### HelpdeskTicket
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "open | in_progress | resolved | closed",
  "priority": "low | medium | high | urgent",
  "department": "string",
  "contactName": "string",
  "contactPhone": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

## 📈 Códigos de Status

### Sucesso
- `200 OK`: Requisição bem sucedida
- `201 Created`: Recurso criado com sucesso
- `204 No Content`: Requisição bem sucedida sem conteúdo

### Erros de Cliente
- `400 Bad Request`: Requisição inválida
- `401 Unauthorized`: Não autenticado
- `403 Forbidden`: Sem permissão
- `404 Not Found`: Recurso não encontrado
- `422 Unprocessable Entity`: Validação falhou
- `429 Too Many Requests`: Muitas requisições

### Erros de Servidor
- `500 Internal Server Error`: Erro interno do servidor
- `502 Bad Gateway`: Gateway inválido
- `503 Service Unavailable`: Serviço indisponível

## ⚡ Rate Limiting

A API implementa rate limiting para prevenir abuso:

### Limites Padrão
- **Autenticado**: 1000 requisições por hora
- **Não autenticado**: 100 requisições por hora
- **Upload de arquivos**: 10MB por arquivo

### Headers de Rate Limit
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 💡 Exemplos de Uso

### Exemplo Completo - Fluxo de Cliente

```bash
#!/bin/bash

# 1. Login
LOGIN_RESPONSE=$(curl -s -X POST https://seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }')

# Extrair token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')

# 2. Criar cliente
CUSTOMER_RESPONSE=$(curl -s -X POST https://seu-dominio.com/api/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "phone": "+5511999999999",
    "company": "Tech Solutions Ltda"
  }')

# Extrair ID do cliente
CUSTOMER_ID=$(echo $CUSTOMER_RESPONSE | jq -r '.data.id')

echo "Cliente criado com ID: $CUSTOMER_ID"

# 3. Criar tarefa para o cliente
TASK_RESPONSE=$(curl -s -X POST https://seu-dominio.com/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Follow up inicial",
    "description": "Fazer contato inicial com o cliente",
    "priority": "medium",
    "customerId": "'$CUSTOMER_ID'"
  }')

echo "Tarefa criada: $(echo $TASK_RESPONSE | jq -r '.data.title')"

# 4. Listar todos os clientes
curl -s -X GET https://seu-dominio.com/api/customers \
  -H "Authorization: Bearer $TOKEN" | jq '.data'
```

### Exemplo com Python
```python
import requests
import json

# Configuração
BASE_URL = "https://seu-dominio.com/api"
TOKEN = "seu-token-aqui"

# Headers
headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Criar cliente
customer_data = {
    "name": "Maria Santos",
    "email": "maria.santos@email.com",
    "phone": "+5511888888888",
    "company": "Digital Agency"
}

response = requests.post(
    f"{BASE_URL}/customers",
    headers=headers,
    json=customer_data
)

if response.status_code == 201:
    customer = response.json()["data"]
    print(f"Cliente criado: {customer['name']} (ID: {customer['id']})")
else:
    print(f"Erro: {response.json()['error']}")
```

### Exemplo com JavaScript
```javascript
// Configuração
const BASE_URL = 'https://seu-dominio.com/api';
const TOKEN = 'seu-token-aqui';

// Headers
const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
};

// Criar tarefa
async function createTask(taskData) {
    try {
        const response = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(taskData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('Tarefa criada:', result.data);
            return result.data;
        } else {
            console.error('Erro:', result.error);
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// Usar a função
createTask({
    title: 'Reunião de follow-up',
    description: 'Discutir proposta de serviços',
    priority: 'high',
    dueDate: '2024-01-20T15:00:00Z'
}).then(task => {
    console.log('Tarefa criada com ID:', task.id);
});
```

## 🧪 Testando a API

### Usando cURL
```bash
# Testar health check
curl https://seu-dominio.com/api/health

# Testar login
curl -X POST https://seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Usando Postman
1. Importe a coleção Postman disponível em: `/docs/api/postman/crm-system.postman_collection.json`
2. Configure as variáveis de ambiente
3. Execute as requisições

### Usando Insomnia
1. Importe a especificação OpenAPI: `https://seu-dominio.com/api/docs/swagger.json`
2. Configure a autenticação
3. Teste os endpoints

### Script de Teste Automático
```bash
#!/bin/bash

# Teste básico da API
echo "=== Teste da API CRM System ==="

# Testar health check
echo "1. Health Check..."
curl -s https://seu-dominio.com/api/health | jq .

# Testar login
echo "2. Login..."
LOGIN_RESPONSE=$(curl -s -X POST https://seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.com","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')
echo "Token obtido: ${TOKEN:0:20}..."

# Testar listagem de clientes
echo "3. Listar clientes..."
curl -s -X GET https://seu-dominio.com/api/customers \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'

echo "=== Teste concluído ==="
```

---

## 📞 Suporte da API

Para dúvidas ou problemas com a API:

- **Documentação**: Consulte os exemplos neste documento
- **Swagger UI**: Interface interativa em `/api/docs`
- **Logs**: Verifique os logs da aplicação para erros
- **Contato**: api-support@seu-dominio.com

**Importante**: Mantenha seu token de acesso seguro e nunca o exponha em código cliente!