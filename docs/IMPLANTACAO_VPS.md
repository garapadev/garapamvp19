# Guia de Implantação em VPS

## Visão Geral

Este guia fornece instruções detalhadas para implantar o Sistema CRM em um servidor VPS (Virtual Private Server). O processo inclui configuração do servidor, instalação de dependências, deploy da aplicação e configurações de produção.

## Pré-requisitos

### Requisitos Mínimos do Servidor
- **CPU**: 2 núcleos
- **RAM**: 4 GB
- **Armazenamento**: 50 GB SSD
- **Sistema Operacional**: Ubuntu 22.04 LTS
- **Banda Larga**: Conexão estável com internet

### Conhecimentos Necessários
- Conhecimento básico de Linux
- Noções de linha de comando
- Conceitos básicos de redes
- Gerenciamento de serviços web

## Passo 1: Configuração Inicial do Servidor

### 1.1 Conectar ao Servidor
```bash
ssh root@seu-servidor.com
```

### 1.2 Atualizar o Sistema
```bash
apt update && apt upgrade -y
```

### 1.3 Criar Usuário de Deploy
```bash
# Criar usuário
adduser deploy

# Dar permissões sudo
usermod -aG sudo deploy

# Fazer login como usuário deploy
su - deploy
```

### 1.4 Configurar Firewall
```bash
# Habilitar firewall
sudo ufw enable

# Permitir conexões essenciais
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Verificar status
sudo ufw status
```

## Passo 2: Instalação de Dependências

### 2.1 Instalar Node.js e npm
```bash
# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 2.2 Instalar PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 2.3 Instalar Nginx
```bash
sudo apt install nginx -y
```

### 2.4 Instalar Certbot (SSL)
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2.5 Instalar Banco de Dados (SQLite já vem com o projeto)
```bash
# SQLite já está incluído no projeto
# Para produção, você pode querer usar PostgreSQL:
# sudo apt install postgresql postgresql-contrib -y
```

## Passo 3: Configuração do Projeto

### 3.1 Clonar o Repositório
```bash
# Navegar para o diretório home
cd /home/deploy

# Clonar o repositório
git clone https://github.com/seu-usuario/seu-projeto.git

# Entrar no diretório do projeto
cd seu-projeto
```

### 3.2 Instalar Dependências do Projeto
```bash
npm install
```

### 3.3 Configurar Variáveis de Ambiente
```bash
# Criar arquivo .env
cp .env.example .env

# Editar arquivo .env
nano .env
```

**Exemplo de .env para produção:**
```env
# Configurações do Aplicativo
NODE_ENV=production
NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=sua_chave_secreta_aqui

# Configurações do Banco de Dados
DATABASE_URL="file:./dev.db"

# Configurações de Email (exemplo)
SMTP_HOST=smtp.seu-provedor.com
SMTP_PORT=587
SMTP_USER=seu-email@seu-provedor.com
SMTP_PASS=sua_senha

# Configurações WhatsApp (exemplo)
WHATSAPP_SESSION_PATH=./sessions

# Configurações de Segurança
JWT_SECRET=sua_chave_jwt_aqui
ENCRYPTION_KEY=sua_chave_de_criptografia_aqui
```

### 3.4 Gerar Build da Aplicação
```bash
npm run build
```

### 3.5 Configurar Banco de Dados
```bash
# Para SQLite (já configurado)
npm run db:push

# Se estiver usando PostgreSQL:
# npm run db:migrate
# npm run db:seed
```

## Passo 4: Configuração do PM2

### 4.1 Criar Arquivo de Configuração do PM2
```bash
# Criar arquivo ecosystem.config.js
nano ecosystem.config.js
```

**Conteúdo do ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'crm-system',
    script: 'npm',
    args: 'start',
    cwd: '/home/deploy/seu-projeto',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/deploy/seu-projeto/logs/err.log',
    out_file: '/home/deploy/seu-projeto/logs/out.log',
    log_file: '/home/deploy/seu-projeto/logs/combined.log',
    time: true
  }]
};
```

### 4.2 Iniciar Aplicação com PM2
```bash
# Criar diretório de logs
mkdir -p logs

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar com o sistema
pm2 startup
```

### 4.3 Comandos Úteis do PM2
```bash
# Ver status das aplicações
pm2 status

# Ver logs
pm2 logs crm-system

# Reiniciar aplicação
pm2 restart crm-system

# Parar aplicação
pm2 stop crm-system

# Monitorar aplicação
pm2 monit
```

## Passo 5: Configuração do Nginx

### 5.1 Criar Arquivo de Configuração do Nginx
```bash
sudo nano /etc/nginx/sites-available/seu-dominio.com
```

**Conteúdo do arquivo de configuração:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    # Configuração SSL
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Configuração de segurança
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy para a aplicação Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout aumentado para longas operações
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Configuração de arquivos estáticos
    location /_next/static/ {
        alias /home/deploy/seu-projeto/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Configuração de uploads
    client_max_body_size 50M;
    
    # Compressão
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### 5.2 Habilitar o Site
```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/seu-dominio.com /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

## Passo 6: Configuração de SSL

### 6.1 Obter Certificado SSL
```bash
# Obter certificado
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Testar renovação automática
sudo certbot renew --dry-run
```

### 6.2 Configurar Renovação Automática
```bash
# Adicionar cron job para renovação
sudo crontab -e
```

**Adicionar linha ao crontab:**
```bash
0 12 * * * /usr/bin/certbot renew --quiet
```

## Passo 7: Configuração de Backup

### 7.1 Criar Script de Backup
```bash
# Criar diretório de backups
sudo mkdir -p /backups
sudo chown deploy:deploy /backups

# Criar script de backup
nano /home/deploy/backup.sh
```

**Conteúdo do script de backup:**
```bash
#!/bin/bash

# Configurações
BACKUP_DIR="/backups"
PROJECT_DIR="/home/deploy/seu-projeto"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="crm_backup_$DATE.tar.gz"

# Criar backup
cd /home/deploy
tar -czf "$BACKUP_DIR/$BACKUP_NAME" seu-projeto/

# Manter apenas os últimos 7 dias de backup
find "$BACKUP_DIR" -name "crm_backup_*.tar.gz" -mtime +7 -delete

# Enviar notificação (opcional)
echo "Backup concluído: $BACKUP_NAME" | mail -s "Backup CRM" admin@seu-dominio.com
```

### 7.2 Tornar Script Executivo e Agendar
```bash
# Tornar script executável
chmod +x /home/deploy/backup.sh

# Adicionar ao crontab
crontab -e
```

**Adicionar linha ao crontab:**
```bash
0 2 * * * /home/deploy/backup.sh
```

## Passo 8: Monitoramento e Logs

### 8.1 Configurar Monitoramento Básico
```bash
# Instalar htop para monitoramento
sudo apt install htop -y

# Instalar monitor de disco
sudo apt install ncdu -y
```

### 8.2 Configurar Log Rotation
```bash
sudo nano /etc/logrotate.d/crm-system
```

**Conteúdo do arquivo de log rotation:**
```bash
/home/deploy/seu-projeto/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 deploy deploy
    postrotate
        pm2 reload crm-system
    endscript
}
```

### 8.3 Configurar Alertas por Email
```bash
# Instalar mailutils
sudo apt install mailutils -y

# Configurar email (opcional)
sudo nano /etc/postfix/main.cf
```

## Passo 9: Segurança Adicional

### 9.1 Configurar Fail2Ban
```bash
# Instalar fail2ban
sudo apt install fail2ban -y

# Copiar configuração padrão
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Editar configuração
sudo nano /etc/fail2ban/jail.local
```

**Adicionar configuração para Nginx:**
```ini
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
```

### 9.2 Reiniciar Fail2Ban
```bash
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

### 9.3 Configurar Autenticação de Dois Fatores (Opcional)
```bash
# Instalar Google Authenticator
sudo apt install libpam-google-authenticator -y

# Configurar para o usuário deploy
google-authenticator
```

## Passo 10: Testes Finais

### 10.1 Verificar Funcionamento
```bash
# Verificar status do PM2
pm2 status

# Verificar status do Nginx
sudo systemctl status nginx

# Verificar status do SSL
sudo certbot certificates

# Verificar uso de recursos
htop
```

### 10.2 Testar a Aplicação
- Acesse https://seu-dominio.com
- Verifique se todas as páginas funcionam
- Teste o login e cadastro
- Verifique o envio de emails
- Teste a integração com WhatsApp

### 10.3 Testar Performance
```bash
# Instalar ferramentas de teste
sudo apt install siege -y

# Testar carga básica
siege -c 10 -t 1M https://seu-dominio.com
```

## Manutenção Contínua

### Atualizações
```bash
# Atualizar o projeto
cd /home/deploy/seu-projeto
git pull origin main
npm install
npm run build
pm2 restart crm-system

# Atualizar o sistema
sudo apt update && sudo upgrade -y
```

### Monitoramento
```bash
# Verificar logs
pm2 logs

# Verificar uso de disco
df -h

# Verificar uso de memória
free -h

# Verificar processos
top
```

### Backup e Restauração
```bash
# Listar backups
ls -la /backups/

# Restaurar backup
tar -xzf /backups/crm_backup_YYYYMMDD_HHMMSS.tar.gz
```

## Solução de Problemas Comuns

### Problema: Aplicação não inicia
```bash
# Verificar logs do PM2
pm2 logs crm-system

# Verificar variáveis de ambiente
pm2 env crm-system

# Reiniciar aplicação
pm2 restart crm-system
```

### Problema: Nginx retorna 502 Bad Gateway
```bash
# Verificar status da aplicação
pm2 status

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Testar conexão com a aplicação
curl http://localhost:3000
```

### Problema: Certificado SSL expirou
```bash
# Renovar certificado manualmente
sudo certbot renew

# Recarregar Nginx
sudo systemctl reload nginx
```

### Problema: Alto uso de memória
```bash
# Verificar uso de memória
free -h

# Reiniciar aplicação
pm2 restart crm-system

# Ajustar instâncias do PM2
pm2 scale crm-system 2
```

## Contato e Suporte

Para dúvidas ou problemas durante a implantação:

- **Documentação**: [Documentação Completa](./README.md)
- **API Docs**: [Documentação da API](./api/README.md)
- **Webhooks**: [Webhooks Disponíveis](./webhooks/README.md)
- **Email**: suporte@seu-sistema.com
- **Status**: https://status.seu-sistema.com

## Referências

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/docs/)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)