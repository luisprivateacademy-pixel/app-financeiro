# 🔔 Finanças v4 — Push Notifications

Nova funcionalidade: **notificações push reais**, todo dia às 8h da manhã (BR), avisando de contas que vencem em 3, 2, 1 dia ou hoje.

Funciona **mesmo com o app fechado**, como notificação nativa do celular.

---

## ⚠️ Antes de subir, você precisa configurar 5 coisas

Se subir os arquivos sem fazer isso, o app continua funcionando (só o botão de notificações vai dar erro). Todas as etapas abaixo são **obrigatórias** pra push funcionar.

---

## 📋 PASSO 1 — Pegar a Service Role Key do Supabase

Essa chave é diferente da anon key. Ela dá acesso admin ao banco e vai **só no backend**, nunca no frontend.

1. Vai no painel do Supabase → seu projeto `financas-pessoal`
2. Menu lateral → **Settings** → **API**
3. Encontra a seção **Project API keys**
4. **Copia a `service_role` key** (aquela marcada como "secret")
5. **Guarda ela num lugar seguro**

⚠️ **NUNCA cole essa chave no código do app** ou compartilhe. Ela vai só nas env vars da Vercel.

---

## 🔧 PASSO 2 — Subir os arquivos v4 pro GitHub

1. Descompacta o zip da v4
2. Vai no seu repo GitHub → **Add file** → **Upload files**
3. Arrasta **todos os arquivos**, incluindo a **pasta `api/`**

> ⚠️ **Importante**: certifica que a pasta `api/` foi upada com o arquivo dentro. Se você arrastar só os arquivos soltos e não a pasta, o cron não vai funcionar.

4. Commit message: `v4 - push notifications + backend`
5. Commit

---

## 🌐 PASSO 3 — Configurar 4 Environment Variables na Vercel

Vai no painel da Vercel → projeto `app-financeiro` → **Settings** → **Environment Variables**.

Adiciona essas 4 variáveis (cria uma por vez, clica em **Save** entre cada):

| Nome | Valor | Ambientes |
|------|-------|-----------|
| `SUPABASE_URL` | `https://fhdyiufzsnphzgdwhfss.supabase.co` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE` | (a service_role key do passo 1) | Production, Preview, Development |
| `VAPID_PUBLIC_KEY` | `BJIDtsogokBhU15G8VzOYGL63CphzUD77ZKNPZzPCWYVfqTmJRXjBethkaaPS_6QB7EXSqBEsiptVJjEoqYbv7U` | Production, Preview, Development |
| `VAPID_PRIVATE_KEY` | `cbjtsfZu5CLZkP5K-6tnCdzjR_A8h-p-fjOZAClSKxs` | Production, Preview, Development |

---

## 🚀 PASSO 4 — Redeploy

Depois de adicionar as env vars, precisa forçar um redeploy pra elas terem efeito:

1. Na Vercel, aba **Deployments**
2. Nos 3 pontinhos do último deploy → **Redeploy**
3. Espera terminar (~30-60s)

---

## 📱 PASSO 5 — Ativar notificações no seu iPhone

1. Abre o app PWA "Finanças" no iPhone (o instalado, não pelo Safari)
2. Se pedir pra atualizar, atualiza (ou desinstala e reinstala pra pegar a v4)
3. Menu (☰) → **Ativar notificações**
4. iOS vai pedir permissão — **Permitir**
5. O botão vira "✓ Notificações ativas"

---

## 🧪 Como testar

**Teste 1 — Notificação de verdade:**
- Cria uma conta com vencimento **hoje**, **amanhã**, **em 2 dias** ou **em 3 dias**
- Amanhã às 8h da manhã, sua notificação chega

**Teste 2 — Testar cron manualmente sem esperar até amanhã:**
- Na Vercel, aba **Deployments** → último deploy → clica em **Functions** → **send-notifications** → **Invoke**
- OU acessa a URL do seu app + `/api/send-notifications` (vai dar 401, mas confirma que a função existe)

**Teste 3 — Ver logs do cron:**
- Vercel → projeto → aba **Logs** ou **Observability**
- Procura por invocações da `/api/send-notifications`
- Vai mostrar quantas notificações enviou

---

## 🔍 Se não chegar notificação

Ordem de investigação:

1. **Confirmou que o iPhone é PWA instalado via Safari** (não Chrome)?
2. **iOS 16.4 ou superior**?
3. **Botão "Notificações ativas"** apareceu no menu?
4. **Env vars configuradas** na Vercel e foi feito redeploy?
5. **Tabela `push_subscriptions`** no Supabase tem uma linha com seu user_id?
6. **Logs da Vercel** mostram execução do cron?
7. **iPhone com bateria/dados/wifi** no horário?

---

## ⚙️ Como mudar horário depois

Edita o arquivo `vercel.json`. O formato é cron UTC:

- `"schedule": "0 11 * * *"` → **11h UTC = 8h BR** (atual)
- `"schedule": "0 9 * * *"` → 6h BR
- `"schedule": "0 15 * * *"` → 12h BR
- `"schedule": "0 23 * * *"` → 20h BR

Commit → Vercel redeploy sozinha.

⚠️ Vercel Hobby só permite **1 cron por dia**. Não dá pra rodar a cada hora.

---

## 📂 Arquivos do projeto v4

```
index.html            → o app completo
manifest.json         → metadados PWA
sw.js                 → service worker (agora com push handler)
icon-192.png          → ícone
icon-512.png          → ícone
package.json          → dependências do backend
vercel.json           → configuração do cron
api/
  └── send-notifications.js  → função que envia push (roda todo dia 8h BR)
```

---

## 💰 Custo

**R$ 0,00**. Vercel Hobby, Supabase Free, sem taxas de push (Web Push é gratuito).

---

**v4.0** · Push notifications reais rodando 🔔
