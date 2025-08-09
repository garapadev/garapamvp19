# Documentação da API

## Visão Geral

A API do Sistema CRM é construída sobre Next.js API Routes, seguindo os princípios RESTful para fornecer uma interface consistente e previsível para integração com outros sistemas e aplicações.

## Base URL

```
http://localhost:3000/api
```

## Autenticação

Todas as requisições à API requerem autenticação via Bearer Token:

```http
Authorization: Bearer <token>
```

## Formato de Resposta

Todas as respostas seguem o formato padrão:

### Sucesso
```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso"
}
```

### Erro
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem de erro"
  }
}
```

## Paginação

Endpoints que retornam listas suportam paginação:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Módulos da API

### 1. Módulo de Clientes
- [Documentação Completa](./clientes.md)
- [Especificação Swagger](./swagger-clientes.yaml)

### 2. Módulo de Tarefas
- [Documentação Completa](./tarefas.md)
- [Especificação Swagger](./swagger-tarefas.yaml)

### 3. Módulo Helpdesk
- [Documentação Completa](./helpdesk.md)
- [Especificação Swagger](./swagger-helpdesk.yaml)

### 4. Módulo WhatsApp
- [Documentação Completa](./whatsapp.md)
- [Especificação Swagger](./swagger-whatsapp.yaml)

### 5. Módulo Email
- [Documentação Completa](./email.md)
- [Especificação Swagger](./swagger-email.yaml)

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Requisição inválida |
| 401 | Unauthorized - Não autorizado |
| 403 | Forbidden - Acesso negado |
| 404 | Not Found - Recurso não encontrado |
| 422 | Unprocessable Entity - Dados inválidos |
| 500 | Internal Server Error - Erro interno do servidor |

## Tratamento de Erros

### Formato Padrão de Erro
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      }
    ]
  }
}
```

### Códigos de Erro Comuns

| Código | Descrição |
|--------|-----------|
| VALIDATION_ERROR | Erro de validação de dados |
| AUTHENTICATION_ERROR | Erro de autenticação |
| AUTHORIZATION_ERROR | Erro de autorização |
| NOT_FOUND | Recurso não encontrado |
| DUPLICATE_ENTRY | Entrada duplicada |
| DATABASE_ERROR | Erro no banco de dados |
| EXTERNAL_SERVICE_ERROR | Erro em serviço externo |

## Rate Limiting

A API implementa limitação de taxa para prevenir abusos:

- **Limite padrão**: 100 requisições por minuto
- **Limite burst**: 200 requisições por minuto
- **Headers de resposta**:
  - `X-RateLimit-Limit`: Limite total
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Tempo de reset

## Versionamento

A API utiliza versionamento por URL:

```
/api/v1/clientes
/api/v2/clientes
```

## Documentação Interativa

### Swagger UI
Acesse a documentação interativa em:
```
http://localhost:3000/api/docs
```

### OpenAPI Specification
Download da especificação completa:
```
http://localhost:3000/api/docs/swagger.yaml
```

## Exemplos de Uso

### JavaScript (Fetch)
```javascript
// Listar clientes
const response = await fetch('/api/clientes?page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

### cURL
```bash
# Criar cliente
curl -X POST http://localhost:3000/api/clientes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "(11) 99999-9999"
  }'
```

### Python (Requests)
```python
import requests

# Configurar headers
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Listar clientes
response = requests.get(
    'http://localhost:3000/api/clientes',
    headers=headers
)

data = response.json()
print(data)
```

## Webhooks

A API suporta webhooks para notificações em tempo real:

- [Documentação de Webhooks](../webhooks/README.md)
- [Configuração de Webhooks](../webhooks/configuracao.md)

## SDKs

### JavaScript/TypeScript
```bash
npm install @seu-sistema/crm-sdk
```

```javascript
import CRM from '@seu-sistema/crm-sdk';

const crm = new CRM({
  baseURL: 'http://localhost:3000/api',
  token: 'seu-token'
});

// Listar clientes
const clientes = await crm.clientes.list();
```

### Python
```bash
pip install seu-sistema-crm-sdk
```

```python
from seu_sistema_crm import CRM

crm = CRM(
    base_url='http://localhost:3000/api',
    token='seu-token'
)

# Listar clientes
clientes = crm.clientes.list()
```

## Testes

### Testes Automatizados
A API possui suíte completa de testes:

```bash
# Executar todos os testes
npm test

# Executar testes de um módulo específico
npm test -- clientes

# Executar testes com coverage
npm run test:coverage
```

### Testes Manuais
Use o Postman ou Insomnia para testar os endpoints:

1. Importe a coleção do Postman
2. Configure as variáveis de ambiente
3. Execute as requisições

## Monitoramento

### Logs
Todos os endpoints são logados para monitoramento:

```json
{
  "timestamp": "2024-01-01T10:00:00Z",
  "method": "GET",
  "path": "/api/clientes",
  "status": 200,
  "responseTime": 150,
  "userId": "user123"
}
```

### Métricas
Métricas disponíveis:

- Tempo de resposta por endpoint
- Taxa de erro por endpoint
- Uso da API por usuário
- Picos de tráfego

## Boas Práticas

### Para Desenvolvedores
- Use HTTPS em produção
- Valide todos os inputs
- Implemente retry para falhas
- Use cache quando apropriado
- Monitore o uso da API

### Para Integradores
- Armazene tokens de forma segura
- Implemente tratamento de erros
- Use paginação para grandes conjuntos de dados
- Respeite os limites de taxa
- Mantenha sua integração atualizada

## Suporte

### Documentação Adicional
- [Guia de Implementação](../IMPLANTACAO_VPS.md)
- [Documentação dos Módulos](../modulos/README.md)
- [Webhooks Disponíveis](../webhooks/README.md)

### Contato
Para dúvidas técnicas ou suporte à API:

- Email: suporte@seu-sistema.com
- Documentação: http://docs.seu-sistema.com
- Status: http://status.seu-sistema.com