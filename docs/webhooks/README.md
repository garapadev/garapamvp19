# Webhooks Disponíveis

## Visão Geral

Os webhooks permitem que sua aplicação receba notificações em tempo real sobre eventos que ocorrem no Sistema CRM. Quando um evento acontece, o sistema envia uma requisição POST para a URL configurada com os dados do evento.

## Configuração

### 1. Configurar URL de Webhook

Para configurar webhooks, você precisa:

1. Acessar as configurações do sistema
2. Navegar para "Webhooks" ou "Integrações"
3. Adicionar a URL do seu endpoint
4. Selecionar os eventos que deseja receber

### 2. Formato da URL

A URL do webhook deve ser:
- Uma URL pública e acessível
- Usar HTTPS (recomendado)
- Suportar requisições POST
- Retornar respostas rápidas (timeout de 5 segundos)

### 3. Segurança

Todos os webhooks incluem um cabeçalho de assinatura para verificação:

```http
X-Webhook-Signature: sha256=abc123...
```

Para verificar a assinatura:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(digest, 'hex')
  );
}
```

## Eventos Disponíveis

### 1. Eventos de Clientes

#### cliente.criado
Disparado quando um novo cliente é cadastrado.

**Payload:**
```json
{
  "event": "cliente.criado",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "id": "cliente_123",
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "(11) 99999-9999",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

#### cliente.atualizado
Disparado quando os dados de um cliente são atualizados.

**Payload:**
```json
{
  "event": "cliente.atualizado",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "id": "cliente_123",
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "(11) 99999-9999",
    "updatedAt": "2024-01-01T10:00:00Z",
    "alteracoes": {
      "telefone": {
        "anterior": "(11) 88888-8888",
        "novo": "(11) 99999-9999"
      }
    }
  }
}
```

#### cliente.excluido
Disparado quando um cliente é excluído.

**Payload:**
```json
{
  "event": "cliente.excluido",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "id": "cliente_123",
    "nome": "João Silva",
    "excluidoEm": "2024-01-01T10:00:00Z"
  }
}
```

### 2. Eventos de Tarefas

#### tarefa.criada
Disparado quando uma nova tarefa é criada.

**Payload:**
```json
{
  "event": "tarefa.criada",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "id": "tarefa_123",
    "titulo": "Configurar sistema",
    "descricao": "Configurar o sistema CRM",
    "status": "PENDENTE",
    "prioridade": "ALTA",
    "dataVencimento": "2024-01-05T10:00:00Z",
    "clienteId": "cliente_123",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

#### tarefa.atualizada
Disparado quando uma tarefa é atualizada.

**Payload:**
```json
{
  "event": "tarefa.atualizada",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "id": "tarefa_123",
    "titulo": "Configurar sistema",
    "status": "EM_ANDAMENTO",
    "prioridade": "ALTA",
    "updatedAt": "2024-01-01T10:00:00Z",
    "alteracoes": {
      "status": {
        "anterior": "PENDENTE",
        "novo": "EM_ANDAMENTO"
      }
    }
  }
}
```

#### tarefa.concluida
Disparado quando uma tarefa é marcada como concluída.

**Payload:**
```json
{
  "event": "tarefa.concluida",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "id": "tarefa_123",
    "titulo": "Configurar sistema",
    "dataConclusao": "2024-01-01T10:00:00Z",
    "tempoTotal": "2h 30m"
  }
}
```

### 3. Eventos de Helpdesk

#### chamado.aberto
Disparado quando um novo chamado é aberto.

**Payload:**
```json
{
  "event": "chamado.aberto",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "id": "chamado_123",
    "titulo": "Problema no sistema",
    "descricao": "O sistema não está funcionando",
    "status": "ABERTO",
    "prioridade": "URGENTE",
    "departamentoId": "dept_123",
    "clienteId": "cliente_123",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

#### chamado.atualizado
Disparado quando um chamado é atualizado.

**Payload:**
```json
{
  "event": "chamado.atualizado",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "id": "chamado_123",
    "status": "EM_ANDAMENTO",
    "updatedAt": "2024-01-01T10:00:00Z",
    "alteracoes": {
      "status": {
        "anterior": "ABERTO",
        "novo": "EM_ANDAMENTO"
      }
    }
  }
}
```

#### chamado.respondido
Disparado quando uma resposta é adicionada a um chamado.

**Payload:**
```json
{
  "event": "chamado.respondido",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "chamadoId": "chamado_123",
    "respostaId": "resposta_123",
    "mensagem": "Estamos verificando o problema",
    "usuarioId": "usuario_123",
    "respondidoEm": "2024-01-01T10:00:00Z"
  }
}
```

#### chamado.resolvido
Disparado quando um chamado é marcado como resolvido.

**Payload:**
```json
{
  "event": "chamado.resolvido",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "id": "chamado_123",
    "dataResolucao": "2024-01-01T10:00:00Z",
    "tempoResolucao": "4h 15m",
    "usuarioResolucao": "usuario_123"
  }
}
```

### 4. Eventos de WhatsApp

#### whatsapp.mensagem.recebida
Disparado quando uma mensagem é recebida via WhatsApp.

**Payload:**
```json
{
  "event": "whatsapp.mensagem.recebida",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "conversaId": "conversa_123",
    "mensagemId": "msg_123",
    "remetente": "5511999999999",
    "conteudo": "Olá, preciso de ajuda",
    "tipo": "TEXT",
    "recebidoEm": "2024-01-01T10:00:00Z"
  }
}
```

#### whatsapp.mensagem.enviada
Disparado quando uma mensagem é enviada via WhatsApp.

**Payload:**
```json
{
  "event": "whatsapp.mensagem.enviada",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "conversaId": "conversa_123",
    "mensagemId": "msg_123",
    "destinatario": "5511999999999",
    "conteudo": "Olá, como posso ajudar?",
    "tipo": "TEXT",
    "enviadoEm": "2024-01-01T10:00:00Z"
  }
}
```

#### whatsapp.conversa.criada
Disparado quando uma nova conversa é criada.

**Payload:**
```json
{
  "event": "whatsapp.conversa.criada",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "id": "conversa_123",
    "telefone": "5511999999999",
    "nome": "João Silva",
    "isGroup": false,
    "criadaEm": "2024-01-01T10:00:00Z"
  }
}
```

### 5. Eventos de Email

#### email.recebido
Disparado quando um novo email é recebido.

**Payload:**
```json
{
  "event": "email.recebido",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "contaId": "conta_123",
    "mensagemId": "email_123",
    "assunto": "Dúvida sobre o sistema",
    "remetente": "joao@example.com",
    "conteudo": "Gostaria de saber mais sobre o sistema",
    "recebidoEm": "2024-01-01T10:00:00Z"
  }
}
```

#### email.enviado
Disparado quando um email é enviado.

**Payload:**
```json
{
  "event": "email.enviado",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "contaId": "conta_123",
    "mensagemId": "email_123",
    "assunto": "Resposta sobre o sistema",
    "destinatario": "joao@example.com",
    "enviadoEm": "2024-01-01T10:00:00Z"
  }
}
```

## Tratamento de Respostas

### Respostas Esperadas

Seu endpoint deve retornar uma resposta HTTP 2xx para confirmar o recebimento:

```json
{
  "success": true,
  "message": "Webhook recebido com sucesso"
}
```

### Retentativas

Se o seu endpoint retornar um erro (status 4xx ou 5xx), o sistema tentará novamente:

- **1ª tentativa**: Imediata
- **2ª tentativa**: 1 minuto depois
- **3ª tentativa**: 5 minutos depois
- **4ª tentativa**: 15 minutos depois
- **5ª tentativa**: 1 hora depois

Após 5 tentativas sem sucesso, o webhook será marcado como falhou.

## Boas Práticas

### 1. Performance
- Retorne respostas rápidas (menos de 5 segundos)
- Processamento pesado deve ser assíncrono
- Use filas para processamento em background

### 2. Segurança
- Valide sempre a assinatura do webhook
- Use HTTPS em produção
- Limpe e valide todos os dados recebidos
- Implemente rate limiting

### 3. Confiabilidade
- Implemente idempotência
- Use logs para auditoria
- Monitore falhas de entrega
- Tenha um sistema de retentativas próprio

### 4. Monitoramento
- Monitore o tempo de resposta
- Acompanhe taxas de erro
- Configure alertas para falhas
- Mantenha estatísticas de uso

## Exemplo de Implementação

### Node.js/Express

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

const WEBHOOK_SECRET = 'sua_chave_secreta';

app.use(express.json());

app.post('/webhook', (req, res) => {
  // Verificar assinatura
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifySignature(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Assinatura inválida' });
  }
  
  // Processar evento
  const event = req.body;
  
  switch (event.event) {
    case 'cliente.criado':
      handleClienteCriado(event.data);
      break;
    case 'tarefa.criada':
      handleTarefaCriada(event.data);
      break;
    // ... outros eventos
  }
  
  // Retornar resposta rápida
  res.json({ success: true });
});

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature.replace('sha256=', ''), 'hex'),
    Buffer.from(digest, 'hex')
  );
}

function handleClienteCriado(data) {
  // Processar criação de cliente
  console.log('Novo cliente criado:', data);
}

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

### Python/Flask

```python
from flask import Flask, request, jsonify
import hmac
import hashlib
import json

app = Flask(__name__)

WEBHOOK_SECRET = 'sua_chave_secreta'

@app.route('/webhook', methods=['POST'])
def webhook():
    # Verificar assinatura
    signature = request.headers.get('X-Webhook-Signature', '')
    payload = request.get_data(as_text=True)
    
    if not verify_signature(payload, signature, WEBHOOK_SECRET):
        return jsonify({'error': 'Assinatura inválida'}), 401
    
    # Processar evento
    event = request.get_json()
    
    if event['event'] == 'cliente.criado':
        handle_cliente_criado(event['data'])
    elif event['event'] == 'tarefa.criada':
        handle_tarefa_criada(event['data'])
    # ... outros eventos
    
    return jsonify({'success': True})

def verify_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(
        signature.replace('sha256=', ''),
        expected_signature
    )

def handle_cliente_criado(data):
    # Processar criação de cliente
    print(f"Novo cliente criado: {data}")

if __name__ == '__main__':
    app.run(port=3000)
```

## Testes

### Teste Local
Use ferramentas como ngrok para testar webhooks localmente:

```bash
ngrok http 3000
```

### Teste de Assinatura
Use este endpoint para testar a verificação de assinatura:

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: sha256=$(echo -n '{"test": true}' | openssl dgst -sha256 -hmac 'sua_chave_secreta' -binary | hexdump -ve '1/1 "%.2x"')" \
  -d '{"test": true}'
```

## Suporte

Para dúvidas ou problemas com webhooks:

- **Documentação**: [Documentação da API](../api/README.md)
- **Contato**: suporte@seu-sistema.com
- **Status**: [Status do Sistema](https://status.seu-sistema.com)

## Referências

- [Webhooks MDN](https://developer.mozilla.org/en-US/docs/Web/API/Webhooks_API)
- [REST Hooks](https://resthooks.org/)
- [Webhook Security Best Practices](https://www.twilio.com/docs/webhooks/webhooks-security)