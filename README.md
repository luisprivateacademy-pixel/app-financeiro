# 💎 Finanças v2 — Controle Mensal + Diário

App PWA de controle financeiro pessoal, agora com **backend na nuvem** (Supabase) e login com Google. Dados sincronizados, seguros, e acessíveis de qualquer celular.

## ✨ Recursos

### 💳 Financeiro (aba principal)
- **Contas mensais**: adicione contas com dia de vencimento, valor, categoria
- **4 status**: Pendente, Pago, Parcial, Atrasado (automático após vencimento)
- **Recorrentes mensais**: cadastre uma vez, aparece todo mês
- **Recorrentes semanais** ⭐ NOVO: ex. "toda segunda-feira", gera as ocorrências automaticamente no mês
- **Parcelamentos**: distribui automaticamente nos próximos meses (ex: 3/12)
- **Filtros**: veja só pendentes, atrasadas, parciais ou pagas
- **Progresso do mês**: barra visual de quanto você já pagou

### 🧾 Diário ⭐ NOVO
- Registre gastos avulsos do dia a dia (gás, cigarro, café, mercado, etc.)
- Agrupamento automático por dia
- Total do mês + total de hoje + média por dia
- Tudo com data e categoria

### 🏷️ Categorias personalizáveis ⭐ NOVO
- 11 categorias padrão criadas automaticamente
- Crie quantas quiser (nome + emoji + tipo)
- Escolha se cada categoria vale pra "contas", "gastos" ou "ambos"
- Edite ou exclua a qualquer momento

### 📊 Dashboard ⭐ NOVO
- Balanço geral do mês (contas + gastos diários)
- Ranking de categorias (com barras de proporção)
- Histórico dos últimos 3 meses

### ☁️ Nuvem
- Login com Google
- Dados salvos no Supabase (Postgres)
- Sincroniza entre celulares — troca de aparelho e não perde nada
- **Custo zero** no plano free do Supabase

---

## 📱 Como instalar no celular

### Android (Chrome)
1. Abra o link do app no Chrome
2. Toque no menu (⋮) → **Adicionar à tela inicial** / **Instalar app**
3. Login com Google na primeira vez
4. Pronto, vira um ícone na tela inicial

### iPhone (Safari)
1. Abra o link do app no **Safari** (precisa ser Safari mesmo)
2. Toque no botão de **compartilhar** (□↑)
3. Role e toque em **Adicionar à Tela de Início**
4. Login com Google na primeira vez

---

## 🚀 Deploy

### Opção 1: Vercel (recomendado)

1. Crie conta grátis em [vercel.com](https://vercel.com) (login com GitHub)
2. Clique em **Add New → Project**
3. Conecte o repositório GitHub OU arraste a pasta descompactada
4. Deploy — link gerado em 30 segundos

### Opção 2: GitHub Pages

1. Repositório novo no GitHub (público)
2. Upload dos 5 arquivos
3. Settings → Pages → branch `main` → salvar
4. Link disponível em `seu-usuario.github.io/nome-do-repo`

### Opção 3: Netlify

Arraste a pasta em [app.netlify.com/drop](https://app.netlify.com/drop) — link na hora.

> ⚠️ **Importante**: O login com Google só funciona em HTTPS. As três opções acima já entregam HTTPS automaticamente.

---

## 🔐 Configuração de OAuth Google

O app já vem configurado com credenciais Supabase. Mas o Google OAuth precisa que o **domínio do seu deploy** esteja autorizado. Após fazer o deploy:

1. Vá no [Google Cloud Console](https://console.cloud.google.com) → seu projeto → **APIs & Services → Credentials**
2. Clique no OAuth 2.0 Client ID que você criou
3. Em **Authorized JavaScript origins**, adicione a URL do seu app (ex: `https://seu-app.vercel.app`)
4. Em **Authorized redirect URIs**, mantenha a URL do Supabase (já configurada)
5. Salve

---

## 📂 Arquivos do projeto

```
index.html       → o app completo (HTML + CSS + JS + Supabase client)
manifest.json    → metadados PWA
sw.js            → service worker (cache offline)
icon-192.png     → ícone 192x192
icon-512.png     → ícone 512x512
```

Sem build, sem framework, sem dependências além do CDN do Supabase.

---

## 🗄️ Estrutura de dados (Supabase)

6 tabelas com Row Level Security ativado (cada usuário só vê os próprios dados):

- `profiles` — dados do usuário
- `bills` — contas mensais/semanais
- `recurrings` — regras de recorrência
- `daily_expenses` — gastos diários
- `categories` — categorias personalizadas
- `push_subscriptions` — reservado para notificações push (etapa futura)

---

## 🎨 Design

- Tema: dark mode editorial com acento verde-limão (`#c4ff47`)
- Tipografia: **Fraunces** (display itálico) + **Manrope** (UI) + **JetBrains Mono** (números)
- Layout mobile-first com bottom nav (3 abas)
- Modais estilo iOS (bottom sheet), glassmorphism
- Micro-animações suaves

---

## 🔧 Manutenção

Todas as ações do app são feitas via UI — não precisa mexer no banco. Se um dia precisar:

- **Ver dados brutos**: Supabase → Table Editor
- **Backup manual**: Supabase → Database → Backups (feito automaticamente pelo Supabase no plano free)
- **Trocar credenciais**: edite a seção `CONFIG` no topo do `<script>` no `index.html`

---

**v2.0** · Feito pra durar. Bom uso 💚
