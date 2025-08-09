# Documentação dos Módulos

## Índice

1. [Módulo de Clientes](./clientes/README.md)
2. [Módulo de Tarefas](./tarefas/README.md)
3. [Módulo Helpdesk](./helpdesk/README.md)
4. [Módulo WhatsApp](./whatsapp/README.md)
5. [Módulo Email](./email/README.md)

## Visão Geral dos Módulos

O sistema CRM é composto por cinco módulos principais que trabalham de forma integrada para fornecer uma solução completa de gestão de relacionamento com clientes.

### Integração entre Módulos

- **Clientes ↔ WhatsApp**: Cadastro rápido de clientes diretamente das conversas
- **Clientes ↔ Helpdesk**: Abertura de chamados vinculados a clientes
- **Tarefas ↔ WhatsApp**: Criação de tarefas a partir de conversas
- **Helpdesk ↔ WhatsApp**: Abertura de chamados diretamente das conversas
- **Email ↔ Todos**: Comunicação integrada com outros módulos

## Fluxo de Trabalho Típico

1. **Contato Inicial**: Cliente entra em contato via WhatsApp ou Email
2. **Cadastro**: Se não existir, cadastro rápido do cliente
3. **Atendimento**: Abertura de chamado no Helpdesk se necessário
4. **Tarefas**: Criação de tarefas relacionadas ao atendimento
5. **Acompanhamento**: Monitoramento de todas as interações

## Arquitetura Comum

Todos os módulos seguem o mesmo padrão de arquitetura:

- **Frontend**: Componentes React com shadcn/ui
- **Backend**: API RESTful com Next.js API Routes
- **Banco de Dados**: Models Prisma com relacionamentos
- **Estado**: Zustand para estado local, TanStack Query para servidor
- **Autenticação**: NextAuth.js para controle de acesso

## Padrões de Código

- TypeScript com tipagem estrita
- Componentes reutilizáveis
- API RESTful com padrões consistentes
- Tratamento de erros centralizado
- Validação de dados no frontend e backend