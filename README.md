# 💎 Finanças — Controle Mensal

App PWA de controle financeiro pessoal. Funciona no celular como app de verdade, totalmente offline, com dados salvos localmente.

## ✨ Recursos

- **Mobile-first**: layout dark mode otimizado para celular
- **Dívidas recorrentes**: cadastra uma vez, aparece todo mês
- **Parcelamentos automáticos**: distribui parcelas nos próximos meses
- **4 status**: Pendente, Pago, Parcial e Atrasado (automático quando passa do vencimento)
- **Backup**: exporta/importa todos os dados em JSON
- **PWA**: instalável como app no celular (Android e iOS)
- **Funciona offline** depois de instalado
- **Custo zero** pra sempre — sem servidor, sem login, sem mensalidade

---

## 📱 Como instalar no celular

### Android (Chrome)
1. Abra o link do app no Chrome
2. Toque no menu (⋮) → **Adicionar à tela inicial** / **Instalar app**
3. Pronto, vira um ícone na tela inicial

### iPhone (Safari)
1. Abra o link do app no Safari (precisa ser Safari mesmo)
2. Toque no botão de **compartilhar** (□↑)
3. Role e toque em **Adicionar à Tela de Início**

---

## 🚀 Como fazer o deploy (3 opções, todas grátis)

### Opção 1: Vercel (mais fácil — recomendado)

1. Crie uma conta grátis em [vercel.com](https://vercel.com) (pode logar com GitHub)
2. Clique em **Add New → Project**
3. Arraste a pasta inteira (`index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`) ou conecte um repositório GitHub
4. Clique em **Deploy**
5. Em ~30 segundos você recebe um link tipo `seu-app.vercel.app`

### Opção 2: GitHub Pages

1. Crie um repositório novo no [github.com](https://github.com) (público, nome qualquer)
2. Faça upload de todos os 5 arquivos
3. Vá em **Settings → Pages**
4. Em "Source", selecione **Deploy from a branch** → branch `main` → pasta `/ (root)`
5. Salve. Em ~1 minuto seu app está em `seu-usuario.github.io/nome-do-repo`

### Opção 3: Netlify (drag-and-drop)

1. Crie conta em [netlify.com](https://netlify.com)
2. Na home, arraste a pasta toda direto pra área "Drop to deploy"
3. Pronto, link gerado na hora

> **Importante**: O service worker (`sw.js`) só funciona em HTTPS. Todas essas três opções já entregam HTTPS automaticamente.

---

## 💾 Backup dos dados

Como os dados ficam salvos no celular, é importante fazer backup às vezes:

- Abra o **menu** (☰) → **Exportar backup (JSON)**
- Salve o arquivo em algum lugar seguro (Google Drive, e-mail, etc.)
- Pra restaurar: menu → **Importar backup** → escolha o JSON

> ⚠️ Se você desinstalar o app, limpar dados do navegador, ou trocar de celular **sem fazer backup**, os dados se perdem. Faça backup mensalmente pra evitar dor de cabeça.

---

## 📂 Arquivos do projeto

```
index.html       → o app inteiro (HTML + CSS + JS)
manifest.json    → metadados pra PWA (nome, ícones, cores)
sw.js            → service worker (cache offline)
icon-192.png     → ícone 192x192
icon-512.png     → ícone 512x512
```

Tudo num só lugar, sem build, sem dependências.

---

## 🎨 Design

- Tema: dark mode editorial com acento verde-limão (`#c4ff47`)
- Tipografia: **Fraunces** (display itálico) + **Manrope** (UI) + **JetBrains Mono** (números)
- Animações suaves, glassmorphism nos modais
- Pensado pra polegar (FAB centralizado, modais por baixo)

---

Feito pra durar. Bom uso 💚
