# 🚀 Guia de Implementação em Produção

Este guia detalha o processo completo para implantar o CRM System em um servidor VPS (Virtual Private Server).

## 📋 Sumário

- [Pré-requisitos](#pré-requisitos)
- [Escolha do Servidor](#escolha-do-servidor)
- [Configuração Inicial do Servidor](#configuração-inicial-do-servidor)
- [Instalação das Dependências](#instalação-das-dependências)
- [Configuração da Aplicação](#configuração-da-aplicação)
- [Banco de Dados](#banco-de-dados)
- [PM2 - Process Manager](#pm2---process-manager)
- [Nginx - Proxy Reverso](#nginx---proxy-reverso)
- [SSL/TLS com Let's Encrypt](#ssltls-com-lets-encrypt)
- [Monitoramento e Logs](#monitoramento-e-logs)
- [Backup e Segurança](#backup-e-segurança)
- [Atualizações e Manutenção](#atualizações-e-manutenção)
- [Solução de Problemas](#solução-de-problemas)

## 🎯 Pré-requisitos

### Requisitos Mínimos do Servidor
- **CPU**: 2 cores
- **RAM**: 4GB
- **Armazenamento**: 50GB SSD
- **Sistema Operacional**: Ubuntu 20.04 LTS ou superior
- **Banda Larga**: Conexão estável com internet

### Conhecimentos Necessários
- Conhecimento básico de linha de comando Linux
- Noções de redes e DNS
- Git básico
- Conceitos de Node.js e npm

## 🖥️ Escolha do Servidor

### Opções Recomendadas

#### 1. DigitalOcean
- **Plano Recomendado**: Droplet de $20/mês (4GB RAM, 2 CPU, 80GB SSD)
- **Vantagens**: Fácil configuração, painel intuitivo, bom suporte
- **Link**: [DigitalOcean](https://www.digitalocean.com/)

#### 2. Vultr
- **Plano Recomendado**: High Frequency $20/mês (4GB RAM, 2 CPU, 64GB SSD)
- **Vantagens**: Alto desempenho, preços competitivos
- **Link**: [Vultr](https://www.vultr.com/)

#### 3. Linode
- **Plano Recomendado**: Linode 4GB ($20/mês)
- **Vantagens**: Estável, bom desempenho, suporte 24/7
- **Link**: [Linode](https://www.linode.com/)

#### 4. AWS Lightsail
- **Plano Recomendado**: $20/mês (4GB RAM, 2 CPU, 80GB SSD)
- **Vantagens**: Integração com ecossistema AWS, escalável
- **Link**: [AWS Lightsail](https://aws.amazon.com/lightsail/)

## ⚙️ Configuração Inicial do Servidor

### 1. Acessar o Servidor
```bash
# SSH para o servidor
ssh root@seu-ip-servidor

# Atualizar senha do root
passwd
```

### 2. Criar Usuário de Deploy
```bash
# Criar novo usuário
adduser deploy

# Adicionar ao grupo sudo
usermod -aG sudo deploy

# Fazer login como novo usuário
su - deploy
```

### 3. Configurar Firewall
```bash
# Habilitar firewall
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP e HTTPS
sudo ufw allow http
sudo ufw allow https

# Verificar status
sudo ufw status
```

### 4. Atualizar Sistema
```bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Instalar pacotes essenciais
sudo apt install -y git curl wget htop vim tree unzip
```

## 📦 Instalação das Dependências

### 1. Instalar Node.js
```bash
# Adicionar repositório NodeSource 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Instalar Node.js
sudo apt-get install -y nodejs

# Verificar instalação
node --version  # Deve mostrar v18.x
npm --version   # Deve mostrar 9.x
```

### 2. Instalar PM2
```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Verificar instalação
pm2 --version
```

### 3. Instalar Nginx
```bash
# Instalar Nginx
sudo apt install nginx -y

# Iniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar status
sudo systemctl status nginx
```

### 4. Instalar Certbot (SSL)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y
```

## 🏗️ Configuração da Aplicação

### 1. Clonar o Repositório
```bash
# Navegar para diretório home
cd ~

# Clonar repositório (substitua URL pela do seu repositório)
git clone https://github.com/your-username/crm-system.git

# Entrar no diretório do projeto
cd crm-system
```

### 2. Instalar Dependências
```bash
# Instalar dependências do projeto
npm install

# Instalar dependências de produção
npm install --production
```

### 3. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar arquivo de ambiente
nano .env
```

Conteúdo do `.env`:
```env
# Ambiente
NODE_ENV=production
PORT=3000

# Banco de Dados
DATABASE_URL="file:./production.db"

# Autenticação
NEXTAUTH_SECRET="seu-secret-key-muito-seguro-aqui"
NEXTAUTH_URL="https://seu-dominio.com"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"

# WhatsApp
WHATSAPP_SESSION_PATH="./sessions"
WHATSAPP_WEBHOOK_URL="https://seu-dominio.com/api/whatsapp/webhook"

# Uploads
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10485760"

# API Keys
OPENAI_API_KEY="sua-api-key-da-openai"
```

### 4. Buildar a Aplicação
```bash
# Buildar para produção
npm run build

# Verificar se build foi bem sucedido
ls -la .next
```

## 🗄️ Banco de Dados

### 1. Configurar Prisma
```bash
# Gerar Prisma Client
npx prisma generate

# Aplicar migrations (se existirem)
npx prisma migrate deploy

# Se não tiver migrations, usar db push
npx prisma db push
```

### 2. (Opcional) Popular Banco de Dados
```bash
# Se tiver um script de seed
npx prisma db seed
```

### 3. Verificar Banco de Dados
```bash
# Verificar se arquivo do banco foi criado
ls -la production.db

# (Opcional) Instalar SQLite browser para visualização
sudo apt install sqlitebrowser -y
```

## 🔄 PM2 - Process Manager

### 1. Criar Configuração PM2
```bash
# Criar arquivo de configuração
nano ecosystem.config.js
```

Conteúdo do `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'crm-system',
    script: 'npm',
    args: 'start',
    cwd: '/home/deploy/crm-system',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'file:./production.db'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
```

### 2. Criar Diretório de Logs
```bash
mkdir -p logs
```

### 3. Iniciar Aplicação com PM2
```bash
# Iniciar aplicação
pm2 start ecosystem.config.js

# Verificar status
pm2 status

# Verificar logs
pm2 logs crm-system

# Salvar configuração PM2
pm2 save

# Configurar PM2 para iniciar com o sistema
pm2 startup
```

### 4. Comandos PM2 Úteis
```bash
# Reiniciar aplicação
pm2 restart crm-system

# Parar aplicação
pm2 stop crm-system

# Remover aplicação
pm2 delete crm-system

# Monitorar em tempo real
pm2 monit

# Listar todos os processos
pm2 list

# Verificar uso de memória
pm2 info crm-system
```

## 🌐 Nginx - Proxy Reverso

### 1. Criar Configuração do Site
```bash
# Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/crm-system
```

Conteúdo do arquivo:
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

    # Headers de segurança
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy para aplicação Node.js
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
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Configuração para uploads grandes
    client_max_body_size 10M;
    
    # Configuração para WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Arquivos estáticos (opcional, para melhor performance)
    location /_next/static/ {
        alias /home/deploy/crm-system/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. Habilitar Site
```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/crm-system /etc/nginx/sites-enabled/

# Remover site default (opcional)
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

## 🔒 SSL/TLS com Let's Encrypt

### 1. Obter Certificado SSL
```bash
# Parar Nginx temporariamente
sudo systemctl stop nginx

# Obter certificado
sudo certbot certonly --standalone -d seu-dominio.com -d www.seu-dominio.com

# Iniciar Nginx novamente
sudo systemctl start nginx
```

### 2. Configurar Renovação Automática
```bash
# Adicionar cron job para renovação automática
sudo crontab -e
```

Adicionar a seguinte linha:
```cron
0 12 * * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```

### 3. Verificar Certificado
```bash
# Verificar status do certificado
sudo certbot certificates

# Testar renovação seca
sudo certbot renew --dry-run
```

## 📊 Monitoramento e Logs

### 1. Configurar Log Rotation
```bash
# Instalar pm2-logrotate
pm2 install pm2-logrotate

# Configurar rotação de logs
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
```

### 2. Monitorar com PM2
```bash
# Monitorar em tempo real
pm2 monit

# Verificar status detalhado
pm2 info crm-system

# Verificar uso de recursos
pm2 info crm-system
```

### 3. Configurar Monitoramento do Sistema
```bash
# Instalar ferramentas de monitoramento
sudo apt install htop iotop nethogs -y

# Monitorar processos
htop

# Monitorar I/O de disco
iotop

# Monitorar uso de rede
nethogs
```

### 4. Configurar Logs do Nginx
```bash
# Verificar logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Configurar log rotation do Nginx
sudo nano /etc/logrotate.d/nginx
```

## 💾 Backup e Segurança

### 1. Script de Backup Automático
```bash
# Criar diretório de backup
sudo mkdir -p /backups
sudo chown deploy:deploy /backups

# Criar script de backup
nano /home/deploy/backup.sh
```

Conteúdo do script:
```bash
#!/bin/bash

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/home/deploy/crm-system"

# Criar diretório de backup diário
mkdir -p $BACKUP_DIR/daily

# Backup do banco de dados
cp $APP_DIR/production.db $BACKUP_DIR/daily/database_$DATE.db

# Backup dos uploads
tar -czf $BACKUP_DIR/daily/uploads_$DATE.tar.gz -C $APP_DIR uploads 2>/dev/null || true

# Backup dos arquivos de configuração
tar -czf $BACKUP_DIR/daily/config_$DATE.tar.gz -C $APP_DIR .env ecosystem.config.js 2>/dev/null || true

# Remover backups antigos (manter 7 dias)
find $BACKUP_DIR/daily -name "*.db" -mtime +7 -delete
find $BACKUP_DIR/daily -name "*.tar.gz" -mtime +7 -delete

# Backup semanal (domingo)
if [ $(date +%u) -eq 7 ]; then
    mkdir -p $BACKUP_DIR/weekly
    cp $BACKUP_DIR/daily/database_$DATE.db $BACKUP_DIR/weekly/
    cp $BACKUP_DIR/daily/uploads_$DATE.tar.gz $BACKUP_DIR/weekly/ 2>/dev/null || true
    cp $BACKUP_DIR/daily/config_$DATE.tar.gz $BACKUP_DIR/weekly/ 2>/dev/null || true
    
    # Remover backups semanais antigos (manter 4 semanas)
    find $BACKUP_DIR/weekly -name "*.db" -mtime +28 -delete
    find $BACKUP_DIR/weekly -name "*.tar.gz" -mtime +28 -delete
fi

echo "Backup completed at $DATE"
```

```bash
# Tornar script executável
chmod +x /home/deploy/backup.sh

# Adicionar ao crontab
crontab -e
```

Adicionar as linhas:
```cron
# Backup diário às 2 da manhã
0 2 * * * /home/deploy/backup.sh

# Backup semanal completo (domingo às 3 da manhã)
0 3 * * 0 /home/deploy/backup.sh && rsync -avz /backups/ user@backup-server:/backups/crm-system/
```

### 2. Configuração de Segurança
```bash
# Configurar fail2ban para proteção contra brute force
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Configurar firewall avançado
sudo ufw limit ssh
sudo ufw allow from seu-ip to any port 22
```

### 3. Atualizações de Segurança
```bash
# Configurar atualizações automáticas de segurança
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades

# Verificar atualizações disponíveis
sudo apt list --upgradable

# Atualizar sistema (manual quando necessário)
sudo apt update && sudo apt upgrade -y
```

## 🔄 Atualizações e Manutenção

### 1. Processo de Deploy Atualizado
```bash
# Entrar no diretório do projeto
cd /home/deploy/crm-system

# Fazer pull das alterações
git pull origin main

# Instalar novas dependências
npm install

# Buildar aplicação
npm run build

# Reiniciar aplicação
pm2 restart crm-system
```

### 2. Rollback em Caso de Problemas
```bash
# Verificar logs
pm2 logs crm-system

# Reverter para commit anterior
git checkout HEAD~1

# Buildar e reiniciar
npm run build
pm2 restart crm-system
```

### 3. Manutenção do Banco de Dados
```bash
# Fazer backup antes de migrations
./backup.sh

# Rodar novas migrations
npx prisma migrate deploy

# Reiniciar aplicação
pm2 restart crm-system
```

## 🚨 Solução de Problemas

### 1. Problemas Comuns

#### Aplicação não inicia
```bash
# Verificar logs
pm2 logs crm-system

# Verificar status do PM2
pm2 status

# Verificar portas em uso
sudo netstat -tulpn | grep :3000

# Verificar uso de memória
free -h
```

#### Erros de SSL
```bash
# Verificar certificado
sudo certbot certificates

# Testar configuração Nginx
sudo nginx -t

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log
```

#### Problemas de Banco de Dados
```bash
# Verificar se arquivo do banco existe
ls -la production.db

# Verificar permissões
ls -la production.db

# Tentar acessar o banco
sqlite3 production.db ".tables"
```

#### Alta Uso de CPU/Memória
```bash
# Monitorar processos
htop

# Verificar uso de memória da aplicação
pm2 info crm-system

# Reiniciar se necessário
pm2 restart crm-system

# Aumentar instâncias se o servidor permitir
pm2 scale crm-system 4
```

### 2. Comandos Úteis para Diagnóstico
```bash
# Verificar espaço em disco
df -h

# Verificar uso de memória
free -h

# Verificar carga do sistema
uptime

# Verificar processos ativos
ps aux | grep node

# Verificar conexões de rede
netstat -tulpn

# Verificar logs do sistema
sudo journalctl -xe
```

### 3. Script de Diagnóstico Completo
```bash
# Criar script de diagnóstico
nano /home/deploy/diagnose.sh
```

Conteúdo do script:
```bash
#!/bin/bash

echo "=== CRM System Diagnostics ==="
echo "Date: $(date)"
echo

echo "=== System Information ==="
echo "OS: $(uname -a)"
echo "Uptime: $(uptime)"
echo

echo "=== Disk Usage ==="
df -h
echo

echo "=== Memory Usage ==="
free -h
echo

echo "=== CPU Usage ==="
echo "Load Average: $(uptime | awk -F'load average:' '{ print $2 }')"
echo

echo "=== Node.js Version ==="
node --version
npm --version
echo

echo "=== PM2 Status ==="
pm2 status
echo

echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager
echo

echo "=== Firewall Status ==="
sudo ufw status
echo

echo "=== Port 3000 Status ==="
sudo netstat -tulpn | grep :3000
echo

echo "=== Recent Logs ==="
echo "Application Logs (last 10 lines):"
pm2 logs crm-system --lines 10
echo

echo "Nginx Error Logs (last 5 lines):"
sudo tail -n 5 /var/log/nginx/error.log
echo

echo "=== Database Check ==="
if [ -f "/home/deploy/crm-system/production.db" ]; then
    echo "Database file exists"
    ls -la /home/deploy/crm-system/production.db
else
    echo "Database file NOT found!"
fi
echo

echo "=== SSL Certificate ==="
sudo certbot certificates --no-permissions
echo

echo "=== Diagnostics Complete ==="
```

```bash
# Tornar script executável
chmod +x /home/deploy/diagnose.sh

# Executar diagnóstico
./diagnose.sh
```

---

## 📞 Suporte

Em caso de problemas durante a instalação ou configuração:

1. **Verifique os logs** da aplicação e do sistema
2. **Consulte a documentação** específica de cada módulo
3. **Verifique os requisitos** do sistema
4. **Entre em contato** com o suporte técnico

**Importante**: Mantenha seu sistema sempre atualizado e faça backups regularmente!