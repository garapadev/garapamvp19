# 📡 Webhooks Documentation

Os webhooks do CRM System permitem que sua aplicação receba notificações em tempo real sobre eventos importantes que ocorrem no sistema. Esta documentação cobre todos os webhooks disponíveis, como configurá-los e como processar as notificações.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Configuração](#configuração)
- [Segurança](#segurança)
- [Webhooks Disponíveis](#webhooks-disponíveis)
- [Formato das Notificações](#formato-das-notificações)
- [Retry Policy](#retry-policy)
- [Exemplos de Implementação](#exemplos-de-implementação)
- [Testando Webhooks](#testando-webhooks)
- [Solução de Problemas](#solução-de-problemas)

## 🎯 Visão Geral

Webhooks são URLs que você configura para receber notificações HTTP POST quando eventos específicos ocorrem no CRM System. Isso permite que sua aplicação reaja imediatamente a mudanças, sem precisar consultar a API periodicamente.

### Características Principais

- 🔄 **Tempo Real**: Notificações instantâneas quando eventos ocorrem
- 🔐 **Seguros**: Assinaturas HMAC para verificação de autenticidade
- 📊 **Confiáveis**: Sistema de retry com backoff exponencial
- 🛡️ **Flexíveis**: Filtros para receber apenas eventos relevantes
- 📈 **Escaláveis**: Suporte a múltiplos endpoints por evento

### Fluxo de Webhook

```
Evento no CRM → Processamento → Envia Webhook → Sua Aplicação → Confirmação
```

## ⚙️ Configuração

### 1. Configurar Webhook URL

Você pode configurar webhooks através da API ou do painel administrativo:

#### Via API
```bash
curl -X POST https://seu-dominio.com/api/webhooks/config \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://sua-app.com/webhooks/crm",
    "events": ["customer.created", "task.updated"],
    "secret": "sua-chave-secreta"
  }'
```

#### Via Painel Administrativo
1. Acesse Configurações → Webhooks
2. Clique em "Adicionar Webhook"
3. Preencha os campos:
   - **URL**: Endpoint para receber notificações
   - **Eventos**: Selecione os eventos desejados
   - **Secret**: Chave para assinatura HMAC

### 2. Estrutura de Configuração

```json
{
  "id": "webhook_123",
  "url": "https://sua-app.com/webhooks/crm",
  "events": [
    "customer.created",
    "customer.updated",
    "task.created",
    "task.completed"
  ],
  "secret": "whsec_your_secret_key_here",
  "active": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "lastTriggeredAt": "2024-01-15T11:00:00Z"
}
```

## 🔒 Segurança

### Assinatura HMAC

Cada requisição de webhook inclui uma assinatura HMAC-SHA256 no header `X-Webhook-Signature` para verificar a autenticidade da notificação.

#### Verificação da Assinatura

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// Exemplo de uso em Express.js
app.post('/webhooks/crm', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Processar webhook...
});
```

#### Exemplo em Python
```python
import hmac
import hashlib
import json

def verify_webhook_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected_signature, signature)

# Exemplo de uso com Flask
@app.route('/webhooks/crm', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Webhook-Signature')
    payload = request.get_data(as_text=True)
    
    if not verify_webhook_signature(payload, signature, WEBHOOK_SECRET):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Processar webhook...
```

### Headers de Segurança

Cada requisição de webhook inclui os seguintes headers:

```http
Content-Type: application/json
X-Webhook-Signature: sha256=abc123...
X-Webhook-ID: whk_123456
X-Webhook-Event: customer.created
X-Webhook-Delivery: del_123456
User-Agent: CRM-System-Webhook/1.0
```

## 📦 Webhooks Disponíveis

### 1. 🏢 Webhooks de Clientes

#### customer.created
Acionado quando um novo cliente é criado.

**Payload:**
```json
{
  "event": "customer.created",
  "data": {
    "id": "cust_123456",
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "phone": "+5511999999999",
    "company": "Tech Solutions Ltda",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "webhookId": "whk_123456",
  "deliveryId": "del_123456"
}
```

#### customer.updated
Acionado quando um cliente é atualizado.

**Payload:**
```json
{
  "event": "customer.updated",
  "data": {
    "id": "cust_123456",
    "name": "João Silva",
    "email": "joao.silva.novo@email.com",
    "phone": "+5511999999999",
    "company": "Tech Solutions Ltda",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "previousData": {
    "email": "joao.silva@email.com"
  },
  "timestamp": "2024-01-15T11:00:00Z",
  "webhookId": "whk_123456",
  "deliveryId": "del_123457"
}
```

#### customer.deleted
Acionado quando um cliente é excluído.

**Payload:**
```json
{
  "event": "customer.deleted",
  "data": {
    "id": "cust_123456",
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "phone": "+5511999999999"
  },
  "timestamp": "2024-01-15T11:30:00Z",
  "webhookId": "whk_123456",
  "deliveryId": "del_123458"
}
```

### 2. ✅ Webhooks de Tarefas

#### task.created
Acionado quando uma nova tarefa é criada.

**Payload:**
```json
{
  "event": "task.created",
  "data": {
    "id": "task_123456",
    "title": "Follow up inicial",
    "description": "Fazer contato inicial com o cliente",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2024-01-20T18:00:00Z",
    "assigneeId": "user_123",
    "customerId": "cust_123456",
    "tags": ["importante", "follow-up"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "webhookId": "whk_123456",
  "deliveryId": "del_123459"
}
```

#### task.updated
Acionado quando uma tarefa é atualizada.

**Payload:**
```json
{
  "event": "task.updated",
  "data": {
    "id": "task_123456",
    "title": "Follow up inicial",
    "description": "Fazer contato inicial com o cliente",
    "status": "in_progress",
    "priority": "medium",
    "dueDate": "2024-01-20T18:00:00Z",
    "assigneeId": "user_123",
    "customerId": "cust_123456",
    "tags": ["importante", "follow-up"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "previousData": {
    "status": "pending"
  },
  "timestamp": "2024-01-15T11:00:00Z",
  "webhookId": "whk_123456",
  "deliveryId": "del_123460"
}
```

#### task.completed
Acionado quando uma tarefa é marcada como concluída.

**Payload:**
```json
{
  "event": "task.completed",
  "data": {
    "id": "task_123456",
    "title": "Follow up inicial",
    "description": "Fazer contato inicial com o cliente",
    "status": "completed",
    "priority": "medium",
    "dueDate": "2024-01-20T18:00:00Z",
    "assigneeId": "user_123",
    "customerId": "cust_123456",
    "completedAt": "2024-01-15T11:00:00Z",
    "tags": ["importante", "follow-up"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "timestamp": "2024-01-15T11:00:00Z",
  "webhookId": "whk_123456",
  "deliveryId": "del_123461"
}
```

### 3. 🎧 Webhooks de Helpdesk

#### ticket.created
Acionado quando um novo ticket é criado.

**Payload:**
```json
{
  "event": "ticket.created",
  "data": {
    "id": "ticket_123456",
    "title": "Problema com acesso ao sistema",
    "description": "Usuário não consegue fazer login",
    "status": "open",
    "priority": "high",
    "department": "TI - Suporte Técnico",
    "contactName": "João Silva",
    "contactPhone": "+5511999999999",
    "assigneeId": "user_123",
    "tags": ["login", "acesso"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "webhookId": "whk_123456",
  "deliveryId": "del_123462"
}
```

#### ticket.status_changed
Acionado quando o status de um ticket muda.

**Payload:**
```json
{
  "event": "ticket.status_changed",
  "data": {
    "id": "ticket_123456",
    "title": "Problema com acesso ao sistema",
    "description": "Usuário não consegue fazer login",
    "status": "in_progress",
    "priority": "high",
    "department": "TI - Suporte Técnico",
    "contactName": "João Silva",
    "contactPhone": "+5511999999999",
    "assigneeId": "user_123",
    "tags": ["login", "acesso"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "previousData": {
    "status": "open"
  },
  "timestamp": "2024-01-15T11:00:00Z",
  "webhookId": "whk_123456",
  "deliveryId": "del_123463"
}
```

### 4. 📱 Webhooks de WhatsApp

#### whatsapp.message_received
Acionado quando uma mensagem é recebida via WhatsApp.

**Payload:**
```json
{
  "event": "whatsapp.message_received",
  "data": {
    "id": "msg_123456",
    "from": "+5511999999999",
    "to": "+5511888888888",
    "content": {
      "type": "text",
      "text": "Olá, preciso de ajuda com o sistema"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "contactName": "João Silva"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "webhookId": "whk_123456",
  "deliveryId": "del_123464"
}
```

#### whatsapp.message_sent
Acionado quando uma mensagem é enviada via WhatsApp.

**Payload:**
```json
{
  "event": "whatsapp.message_sent",
  "data": {
    "id": "msg_123457",
    "from": "+5511888888888",
    "to": "+5511999999999",
    "content": {
      "type": "text",
      "text": "Olá! Como posso ajudar?"
    },
    "timestamp": "2024-01-15T10:31:00Z",
    "status": "delivered"
  },
  "timestamp": "2024-01-15T10:31:00Z",
  "webhookId": "whk_123456",
  "deliveryId": "del_123465"
}
```

## 📋 Formato das Notificações

### Estrutura Padrão

Todas as notificações de webhook seguem esta estrutura:

```json
{
  "event": "string",           // Tipo do evento
  "data": "object",           // Dados do evento
  "previousData": "object",    // (Opcional) Dados anteriores para eventos de atualização
  "timestamp": "string",       // Timestamp do evento
  "webhookId": "string",      // ID do webhook
  "deliveryId": "string"      // ID único da entrega
}
```

### Campos Comuns

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `event` | String | Identificador do evento (ex: `customer.created`) |
| `data` | Object | Dados principais do evento |
| `previousData` | Object | Dados anteriores (apenas para eventos de atualização) |
| `timestamp` | String | ISO 8601 timestamp de quando o evento ocorreu |
| `webhookId` | String | ID do webhook que foi acionado |
| `deliveryId` | String | ID único desta entrega específica |

## 🔄 Retry Policy

O sistema implementa uma política de retry robusta para garantir que as notificações sejam entregues mesmo que seu endpoint esteja temporariamente indisponível.

### Configuração de Retry

| Tentativa | Intervalo | Timeout |
|-----------|----------|---------|
| 1 | Imediato | 5 segundos |
| 2 | 1 minuto | 10 segundos |
| 3 | 5 minutos | 15 segundos |
| 4 | 15 minutos | 30 segundos |
| 5 | 1 hora | 60 segundos |

### Condições de Retry

O sistema tentará novamente nas seguintes situações:

- **Timeout**: Sua aplicação não responde dentro do tempo limite
- **5xx Errors**: Erros de servidor (500, 502, 503, 504)
- **429 Too Many Requests**: Sua aplicação está sobrecarregada
- **Connection Errors**: Falha na conexão de rede

### Desativação Automática

Um webhook será automaticamente desativado se:

- Falhar 10 vezes consecutivas
- Retornar `410 Gone` consistentemente
- Retornar `401 Unauthorized` consistentemente

Você pode reativar webhooks desativados através da API ou do painel administrativo.

## 💡 Exemplos de Implementação

### 1. Servidor Node.js/Express

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Middleware para verificar assinatura
function verifyWebhook(req, res, next) {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.WEBHOOK_SECRET;
  
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  next();
}

// Endpoint de webhook
app.post('/webhooks/crm', verifyWebhook, (req, res) => {
  const { event, data } = req.body;
  
  console.log(`Received webhook event: ${event}`);
  
  try {
    switch (event) {
      case 'customer.created':
        handleCustomerCreated(data);
        break;
      case 'task.completed':
        handleTaskCompleted(data);
        break;
      case 'ticket.created':
        handleTicketCreated(data);
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }
    
    // Responder imediatamente
    res.status(200).json({ received: true });
    
    // Processar assincronamente
    processWebhookAsync(event, data);
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function handleCustomerCreated(customer) {
  console.log(`New customer created: ${customer.name}`);
  // Enviar email de boas-vindas
  // Atualizar sistemas externos
  // etc.
}

function handleTaskCompleted(task) {
  console.log(`Task completed: ${task.title}`);
  // Notificar responsável
  // Atualizar métricas
  // etc.
}

function handleTicketCreated(ticket) {
  console.log(`New ticket created: ${ticket.title}`);
  // Notificar equipe de suporte
  // Criar alerta no sistema de monitoramento
  // etc.
}

async function processWebhookAsync(event, data) {
  // Processamento pesado ou integrações com outros sistemas
  try {
    // Integrar com ERP, CRM externo, etc.
    await integrateWithExternalSystem(event, data);
  } catch (error) {
    console.error('Error in async processing:', error);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});
```

### 2. Servidor Python/Flask

```python
from flask import Flask, request, jsonify
import hmac
import hashlib
import json
import threading
from datetime import datetime

app = Flask(__name__)

def verify_webhook_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected_signature, signature)

@app.route('/webhooks/crm', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Webhook-Signature')
    payload = request.get_data(as_text=True)
    secret = app.config['WEBHOOK_SECRET']
    
    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 401
    
    try:
        webhook_data = json.loads(payload)
        event = webhook_data['event']
        data = webhook_data['data']
        
        print(f"Received webhook event: {event}")
        
        # Processar em thread separada para não bloquear
        thread = threading.Thread(target=process_webhook, args=(event, data))
        thread.start()
        
        return jsonify({'received': True}), 200
        
    except Exception as e:
        print(f"Error processing webhook: {e}")
        return jsonify({'error': 'Internal server error'}), 500

def process_webhook(event, data):
    """Processar webhook de forma assíncrona"""
    try:
        if event == 'customer.created':
            handle_customer_created(data)
        elif event == 'task.completed':
            handle_task_completed(data)
        elif event == 'ticket.created':
            handle_ticket_created(data)
        else:
            print(f"Unhandled event: {event}")
            
    except Exception as e:
        print(f"Error in async processing: {e}")

def handle_customer_created(customer):
    print(f"New customer created: {customer['name']}")
    # Lógica de negócio aqui

def handle_task_completed(task):
    print(f"Task completed: {task['title']}")
    # Lógica de negócio aqui

def handle_ticket_created(ticket):
    print(f"New ticket created: {ticket['title']}")
    # Lógica de negócio aqui

if __name__ == '__main__':
    app.config['WEBHOOK_SECRET'] = 'your-secret-key'
    app.run(port=5000)
```

### 3. Servidor PHP/Laravel

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class WebhookController extends Controller
{
    public function handleCrmWebhook(Request $request)
    {
        // Verificar assinatura
        $signature = $request->header('X-Webhook-Signature');
        $payload = $request->getContent();
        $secret = config('services.crm.webhook_secret');
        
        if (!$this->verifySignature($payload, $signature, $secret)) {
            return response()->json(['error' => 'Invalid signature'], 401);
        }
        
        try {
            $webhookData = json_decode($payload, true);
            $event = $webhookData['event'];
            $data = $webhookData['data'];
            
            Log::info("Received webhook event: {$event}");
            
            // Processar webhook
            $this->processWebhook($event, $data);
            
            return response()->json(['received' => true]);
            
        } catch (\Exception $e) {
            Log::error("Error processing webhook: {$e->getMessage()}");
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
    
    private function verifySignature($payload, $signature, $secret)
    {
        $expectedSignature = hash_hmac('sha256', $payload, $secret);
        return hash_equals($expectedSignature, $signature);
    }
    
    private function processWebhook($event, $data)
    {
        switch ($event) {
            case 'customer.created':
                $this->handleCustomerCreated($data);
                break;
            case 'task.completed':
                $this->handleTaskCompleted($data);
                break;
            case 'ticket.created':
                $this->handleTicketCreated($data);
                break;
            default:
                Log::warning("Unhandled webhook event: {$event}");
        }
    }
    
    private function handleCustomerCreated($customer)
    {
        Log::info("New customer created: {$customer['name']}");
        
        // Enviar email de boas-vindas
        Mail::to($customer['email'])->send(new WelcomeEmail($customer));
        
        // Integrar com outros sistemas
        $this->integrateWithErp($customer);
    }
    
    private function handleTaskCompleted($task)
    {
        Log::info("Task completed: {$task['title']}");
        
        // Notificar responsável
        if ($task['assigneeId']) {
            $assignee = User::find($task['assigneeId']);
            $assignee->notify(new TaskCompletedNotification($task));
        }
    }
    
    private function handleTicketCreated($ticket)
    {
        Log::info("New ticket created: {$ticket['title']}");
        
        // Notificar equipe de suporte
        $supportTeam = User::where('role', 'support')->get();
        foreach ($supportTeam as $member) {
            $member->notify(new NewTicketNotification($ticket));
        }
    }
    
    private function integrateWithErp($customer)
    {
        // Lógica de integração com ERP externo
        // ...
    }
}
```

## 🧪 Testando Webhooks

### 1. Usando a CLI do CRM System

```bash
# Testar webhook específico
crm webhook:test --event customer.created \
  --url https://sua-app.com/webhooks/crm \
  --secret sua-chave-secreta

# Testar com payload personalizado
crm webhook:test --event task.completed \
  --url https://sua-app.com/webhooks/crm \
  --secret sua-chave-secreta \
  --payload '{"id":"task_123","title":"Test task"}'
```

### 2. Usando cURL

```bash
# Simular webhook de cliente criado
curl -X POST https://sua-app.com/webhooks/crm \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: sha256=$(echo -n '{"event":"customer.created","data":{"id":"cust_123","name":"Test Customer"}}' | openssl dgst -sha256 -hmac 'sua-chave-secreta' -binary | hexdump -v -e '/1 "%02x"' | tr -d ' \n')" \
  -d '{
    "event": "customer.created",
    "data": {
      "id": "cust_123",
      "name": "Test Customer",
      "email": "test@example.com",
      "phone": "+5511999999999"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "webhookId": "whk_123",
    "deliveryId": "del_123"
  }'
```

### 3. Usando ngrok para Testes Locais

```bash
# Iniciar ngrok
ngrok http 3000

# Configurar webhook com URL do ngrok
curl -X POST https://seu-dominio.com/api/webhooks/config \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://seu-ngrok-url.ngrok.io/webhooks/crm",
    "events": ["customer.created", "task.updated"],
    "secret": "sua-chave-secreta"
  }'

# Verificar logs do ngrok
ngrok http 3000 --log=stdout
```

### 4. Ferramentas Online

- **Webhook.site**: Gera URLs temporárias para testar webhooks
- **RequestBin**: Captura requisições HTTP para depuração
- **Postman**: Enviar requisições de teste com assinaturas HMAC

## 🚨 Solução de Problemas

### Problemas Comuns

#### 1. Webhooks não estão sendo recebidos

**Causas possíveis:**
- URL do webhook está incorreta ou inacessível
- Webhook está desativado
- Filtros de eventos não estão configurados corretamente

**Soluções:**
- Verifique se a URL está acessível publicamente
- Confirme o status do webhook no painel administrativo
- Teste a URL com ferramentas como curl ou Postman

#### 2. Assinatura inválida

**Causas possíveis:**
- Chave secreta está incorreta
- Payload está sendo modificado antes da verificação
- Headers estão sendo manipulados pelo proxy/reverse proxy

**Soluções:**
- Verifique a chave secreta no painel administrativo
- Certifique-se de que está usando o payload bruto para verificação
- Desabilite qualquer manipulação automática de JSON

#### 3. Timeouts frequentes

**Causas possíveis:**
- Seu endpoint está lento para responder
- Processamento síncrono está bloqueando a resposta
- Problemas de rede

**Soluções:**
- Responda imediatamente com status 200
- Mova o processamento pesado para background jobs
- Otimize o desempenho do seu endpoint

#### 4. Eventos faltando

**Causas possíveis:**
- Eventos não estão selecionados na configuração
- Webhook está temporariamente desativado por falhas
- Filtros de eventos estão muito restritos

**Soluções:**
- Verifique a configuração de eventos no webhook
- Confirme o status de ativação do webhook
- Revise os logs de entrega no painel administrativo

### Ferramentas de Depuração

#### 1. Logs do Sistema

```bash
# Verificar logs de entrega de webhooks
crm webhook:logs --id whk_123

# Verificar estatísticas de webhooks
crm webhook:stats --id whk_123

# Listar webhooks configurados
crm webhook:list
```

#### 2. Monitoramento em Tempo Real

```javascript
// Adicionar logging detalhado
app.post('/webhooks/crm', (req, res) => {
  console.log('=== Webhook Received ===');
  console.log('Headers:', req.headers);
  console.log('Event:', req.body.event);
  console.log('Data:', JSON.stringify(req.body.data, null, 2));
  console.log('========================');
  
  // ... resto do processamento
});
```

#### 3. Teste de Carga

```bash
# Testar múltiplos webhooks simultâneos
for i in {1..10}; do
  curl -X POST https://sua-app.com/webhooks/crm \
    -H "Content-Type: application/json" \
    -H "X-Webhook-Signature: sha256=test_signature" \
    -d '{"event":"test","data":{"id":"'$i'"}}' &
done
```

### Melhores Práticas

#### 1. Performance
- Sempre responda com status 200 imediatamente
- Use filas para processamento assíncrono
- Implemente rate limiting no seu endpoint
- Monitore o tempo de processamento

#### 2. Segurança
- Nunca exponha sua chave secreta
- Use HTTPS para todos os endpoints
- Valide todas as assinaturas
- Implemente rate limiting

#### 3. Confiabilidade
- Implemente idempotência no processamento
- Use filas com retry automático
- Monitore e alerte sobre falhas
- Tenha um plano de rollback

#### 4. Monitoramento
- Logue todos os webhooks recebidos
- Monitore taxas de sucesso/falha
- Configure alertas para falhas consecutivas
- Rastreie o tempo de processamento

---

## 📞 Suporte

Para dúvidas ou problemas com webhooks:

- **Documentação**: Consulte os exemplos neste documento
- **Painel Administrativo**: Verifique logs e estatísticas
- **Logs**: Analise os logs de entrega e processamento
- **Contato**: webhooks@crm-system.com

**Importante**: Mantenha seus endpoints de webhook seguros e monitorados!