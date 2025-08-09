# Documentação do Sistema CRM

## Visão Geral

Este documento descreve a arquitetura, módulos e funcionalidades do Sistema CRM desenvolvido em Next.js 15 com TypeScript.

## Estrutura do Projeto

```
src/
├── app/                    # Páginas e rotas da aplicação
│   ├── api/               # Endpoints da API
│   ├── clientes/          # Módulo de Clientes
│   ├── tarefas/           # Módulo de Tarefas
│   ├── helpdesk/          # Módulo de Helpdesk
│   ├── whatsapp/          # Módulo de WhatsApp
│   └── email/             # Módulo de Email
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   └── layout/           # Componentes de layout
├── lib/                  # Bibliotecas e utilitários
│   ├── db/               # Configuração do banco de dados
│   ├── auth/             # Configuração de autenticação
│   └── utils/            # Funções utilitárias
└── prisma/               # Schema do banco de dados
```

## Módulos do Sistema

### 1. Módulo de Clientes
- Cadastro e gerenciamento de clientes
- Integração com WhatsApp e Helpdesk
- Consulta rápida de informações

### 2. Módulo de Tarefas
- Sistema de gerenciamento de tarefas
- Atribuição a usuários
- Integração com WhatsApp

### 3. Módulo Helpdesk
- Sistema de gestão de chamados
- Cadastro de departamentos
- Associação departamento-grupo recursiva
- Histórico de solicitações

### 4. Módulo WhatsApp
- Interface similar ao WhatsApp Web
- Integração com WhatsMeow
- Ações rápidas para clientes, tarefas e helpdesk
- Sidebars para cadastro rápido

### 5. Módulo Email
- Cliente de email completo
- Configuração SMTP/IMAP
- Sincronização com provedores
- Gerenciamento de anexos

## Tecnologias Utilizadas

- **Frontend**: Next.js 15, React, TypeScript
- **Estilização**: Tailwind CSS, shadcn/ui
- **Banco de Dados**: SQLite com Prisma ORM
- **Autenticação**: NextAuth.js
- **Estado**: Zustand, TanStack Query
- **WhatsApp**: WhatsMeow
- **Email**: Protocolos SMTP/IMAP

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Banco de dados SQLite
- Configuração de ambiente

## Instalação

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente
4. Execute as migrações: `npm run db:push`
5. Inicie o servidor: `npm run dev`

## Documentação Detalhada

- [Documentação dos Módulos](./modulos/README.md)
- [Documentação da API](./api/README.md)
- [Webhooks Disponíveis](./webhooks/README.md)
- [Guia de Implantação em VPS](./IMPLANTACAO_VPS.md)

## Suporte

Para dúvidas ou suporte técnico, consulte a documentação específica de cada módulo ou entre em contato com a equipe de desenvolvimento.