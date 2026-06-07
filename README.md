<<<<<<< HEAD
# Estou Aqui

Plataforma gratuita de apoio emocional humano para conectar pessoas que precisam conversar com voluntários aprovados, treinados e supervisionados.

Frase principal:
"Você não precisa passar por tudo sozinho. Existem pessoas dispostas a ouvir."

Frase secundária:
"Uma rede gratuita de apoio humano, feita por voluntários, para acolher quem precisa conversar."

## Aviso de segurança

O Estou Aqui não oferece terapia, diagnóstico, atendimento médico, psicológico ou psiquiátrico. Também não substitui CAPS, pronto atendimento, emergência, CVV ou outros serviços profissionais.

Em risco imediato:

- CVV: `188`
- SAMU: `192`
- Polícia / Emergência: `190`

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Axios, Socket.IO Client, React Hook Form, Zod, Lucide React
- Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Socket.IO, JWT, bcrypt, Zod, Helmet, CORS, express-rate-limit, dotenv
- Banco: PostgreSQL
- Deploy previsto: Netlify, Render e Neon

## Estrutura

```text
estou-aqui/
  apps/
    api/
    web/
```

## Como instalar

Na raiz:

```bash
npm install
```

## Como configurar `.env`

Copie os exemplos:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Variáveis principais da API:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- `PORT`
- `NODE_ENV`

Variáveis principais do frontend:

- `VITE_API_URL`
- `VITE_SOCKET_URL`

## Como rodar o banco

Crie um banco PostgreSQL local ou use um banco remoto, como Neon. Depois aponte `DATABASE_URL` para ele.

## Como rodar migrations

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev
```

O repositório já inclui uma migration inicial em `apps/api/prisma/migrations`.

## Como rodar seed

```bash
cd apps/api
npx prisma db seed
```

## Como iniciar backend

```bash
cd apps/api
npm install
npm run dev
```

Backend padrão:

- `http://localhost:3333`

## Como iniciar frontend

```bash
cd apps/web
npm install
npm run dev
```

Frontend padrão:

- `http://localhost:5173`

## Usuários seed

- Admin: `admin@estouaqui.local` / `Admin123456`
- Voluntário aprovado: `voluntario@estouaqui.local` / `Voluntario123456`
- Usuário comum: `usuario@estouaqui.local` / `Usuario123456`

## Fluxos principais

### Pessoa que precisa de ajuda

1. Cria conta e aceita termos.
2. Passa pela triagem de emergência.
3. Faz check-in emocional.
4. Cria pedido de apoio.
5. Aguarda voluntário aprovado.
6. Conversa por chat em tempo real.
7. Pode encerrar e denunciar.

### Voluntário

1. Cria conta.
2. Envia candidatura.
3. Conclui treinamento.
4. Aguarda aprovação.
5. Vê pedidos em espera.
6. Aceita um pedido.
7. Conversa, encerra e escalona quando necessário.

### Admin

1. Acompanha métricas.
2. Aprova, rejeita ou bloqueia voluntários.
3. Analisa conversas denunciadas.
4. Marca denúncias como resolvidas.
5. Vê eventos de segurança.

## O que já está funcional

- Monorepo com `apps/api` e `apps/web`
- Prisma schema completo com enums, relações e seed
- Migration inicial do banco
- Autenticação com JWT
- Senha com bcrypt
- Helmet, CORS por ambiente e rate limit
- Cadastro, login, `/auth/me` e exclusão de conta
- Check-in emocional
- Triagem de emergência com `SafetyEvent`
- Criação de pedido de apoio
- Regras de uma conversa ativa por usuário
- Regras de um atendimento ativo por voluntário no MVP
- Candidatura e treinamento de voluntário
- Aprovação administrativa
- Chat em tempo real com Socket.IO
- Bloqueio de telefone, e-mail e links no chat
- Encerramento e escalonamento de conversa
- Denúncias
- Painéis de voluntário e admin
- Termos, política de privacidade e termo do voluntário
- Interface mobile first com Tailwind

## Testes manuais obrigatórios

1. Criar usuário comum.
2. Aceitar termos.
3. Fazer check-in.
4. Marcar "não estou em emergência".
5. Criar pedido de apoio.
6. Logar como voluntário aprovado.
7. Ver pedido em espera.
8. Aceitar pedido.
9. Trocar mensagens em tempo real.
10. Encerrar conversa.
11. Fazer denúncia.
12. Logar como admin.
13. Ver denúncia.
14. Resolver denúncia.
15. Criar voluntário pendente.
16. Completar treinamento.
17. Admin aprovar.
18. Voluntário aprovado conseguir atender.
19. Voluntário pendente não conseguir atender.
20. Usuário em emergência ver tela de emergência e não chat comum.

## Checklist antes de produção

- Configurar HTTPS de ponta a ponta
- Revisar retenção de dados e políticas LGPD com apoio jurídico
- Adicionar observabilidade, auditoria e alertas operacionais
- Configurar filas e estratégia de presença para escalar sockets
- Implementar testes automatizados
- Fortalecer política de backup e recuperação
- Criar processo formal de moderação e supervisão
- Revisar acesso de admin a conteúdo sensível
- Definir canal oficial de suporte e privacidade
- Fazer threat modeling e pentest

## Limitações do MVP

- Sem atendimento profissional
- Sem diagnóstico
- Sem terapia
- Sem chamada de áudio ou vídeo
- Sem upload de arquivos
- Sem promessa de disponibilidade 24h
- Sem garantia de resposta imediata
- Sem atendimento de emergência dentro da plataforma
- Em emergência, o fluxo redireciona para serviços adequados
- Sem links clicáveis, telefone ou e-mail no chat

## O que ainda é recomendado antes de produção

- Testes automatizados de API e frontend
- Observabilidade e logs estruturados
- Revisão jurídica e de privacidade
- Moderação com trilhas de auditoria mais completas
- Gestão de incidentes e playbook para situações críticas
- Revisão de acessibilidade e UX com pessoas reais

## Comandos úteis

Na raiz:

```bash
npm install
npm run dev
npm run build
```

API:

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Web:

```bash
cd apps/web
npm run dev
```

