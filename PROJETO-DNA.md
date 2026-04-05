# PROJETO-DNA — Roteiro de Coleta

> Documento vivo com todas as decisoes tecnicas, features e historico do projeto.
> Atualizado a cada entrega.

---

## Visao Geral

**Produto:** Roteiro de Coleta — SaaS de roteirizacao para lavanderias
**Stack:** HTML SPA (single file) + Cloudflare Workers + Workers KV
**Frontend:** GitHub Pages — `https://guandahouse.github.io/roteiro-lavanderia`
**Backend:** Cloudflare Worker — `https://roteiro-lavanderia.nigel-guandalini.workers.dev`
**Repo:** `guandahouse/roteiro-lavanderia`

---

## Arquitetura

### Frontend (index.html — SPA monolitico)
- ~8000+ linhas em arquivo unico
- Design system M1 com CSS variables (light/dark mode)
- i18n completo (PT/EN) via data-i18n attributes
- Google Maps API para visualizacao de rotas
- Motor de otimizacao v2: VRPTW + Simulated Annealing (client-side)
- Import: Trello cards, Excel (.xlsx), CSV, imagem (OCR via IA)

### Backend (src/worker.js — Cloudflare Worker)
- Autenticacao: JWT HMAC-SHA256 via Web Crypto API
- PBKDF2 (100k iterations, SHA-256) para hashing de senhas
- Google Sign-In: verificacao server-side do idToken
- Facebook Login: verificacao via Graph API
- KV Bindings:
  - `ROTEIRO_KV` — rotas em tempo real (publish/poll/status)
  - `USERS` — autenticacao, perfis, sync, admin
- Secrets: `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `TRELLO_APP_KEY`

### Integracao Trello
- OAuth via popup (chave no Worker, nao no cliente)
- Worker endpoint `/api/trello/auth-url` retorna URL de autorizacao
- Worker proxy `/api/trello` encaminha chamadas com key server-side
- Token salvo no localStorage do usuario

---

## Sistema de Planos

| Plano | Preco | Motoristas | Rotas/dia | Trello | Excel | IA | Hist | Cloud Sync |
|-------|-------|-----------|-----------|--------|-------|-----|------|------------|
| Free | R$0 | 1 | 1 | Nao | Nao | Nao | 7d | Nao |
| Pro | R$99 | 3 | Ilim. | Sim | Sim | Nao | 90d | Sim |
| Pro Max | R$199 | 10 | Ilim. | Sim | Sim | 200/mes | Ilim. | Sim |
| Ultimate | R$399 | Ilim. | Ilim. | Sim | Sim | Ilim. | Ilim. | Sim |

---

## Painel Administrativo

- Acesso: somente `nigel.guandalini@gmail.com` (superadmin)
- Tab "Admin" na navbar (icone escudo, visivel apenas para superadmin)
- Dashboard: Total usuarios, MRR, Ativos hoje, Novos (7d)
- Graficos donut SVG: por plano, status, provedor
- Tabela de usuarios: busca, filtros, ordenacao, paginacao
- Acoes: ver detalhes, alterar plano, ativar/desativar
- Exportar CSV
- Gerenciar planos (editar precos e limites)

### Endpoints Admin (Worker)
- `GET /api/admin/stats` — metricas do dashboard
- `GET /api/admin/users` — lista paginada com filtros
- `GET /api/admin/users/:id` — detalhes + sync summary
- `PUT /api/admin/users/:id/plan` — alterar plano
- `PUT /api/admin/users/:id/status` — ativar/desativar
- `GET /api/admin/users/export` — CSV
- `GET/PUT /api/admin/plans` — CRUD de planos

### KV Admin
- `admin:users:index` — array de user IDs
- `admin:plans` — definicoes de planos (override do DEFAULT_PLANS)

---

## UX / Design

### Navbar Premium (v5.3.0)
- Avatar circular 32px no canto direito da navbar
- Mostra inicial do nome (ou foto do Google se disponivel)
- Dropdown ao clicar: nome, email, provedor, link para configuracoes, botao sair
- Estilo Linear/Notion/Stripe
- Removido card "Conta" das Configuracoes (era janela branca feia)

### Bottom Navigation Mobile (v5.3.0)
- Abas de navegacao movidas para bottom bar fixa no mobile (<=768px)
- Estilo Instagram/WhatsApp/Uber — sempre visivel, polegar alcanca
- 5 icones SVG: Rota (mapa), Historico (relogio), Mapa (pin), Motorista (caminhao), Config (engrenagem)
- Desktop: abas inline no topo (sem mudanca visual)
- safe-area-inset-bottom para iPhones com notch
- Dark mode: fundo semi-transparente
- Toast e save-bar reposicionados acima da bottom nav

### Auth Flow
- Login obrigatorio (sem "Continuar sem conta")
- Google Sign-In: botao customizado + overlay invisivel do SDK (sem troca de visual, login direto)
- Facebook Login: desativado temporariamente (codigo preservado em comentarios)
- Email/senha com PBKDF2
- JWT com 30 dias de validade
- Auto-sync ao login
- Sem One Tap popup (prompt() removido)

### Dark Mode
- Toggle na navbar
- CSS variables para todas as cores
- FOUC prevention (script inline no <head>)

---

## Historico de Versoes

### v5.5.3 — 05/04/2026
- REFACTOR: SPA monolitico dividido em 3 arquivos para reduzir consumo de tokens
  - index.html: 8188 → 1223 linhas (estrutura HTML + scripts inline criticos)
  - style.css: 972 linhas (todo o CSS extraido)
  - app.js: 6053 linhas (todo o JS com 12 marcadores de secao)
- Marcadores SECTION no app.js: i18n, UTILS, CEP/GEOCODING, CLOUD SYNC, AUTH, ADMIN PANEL,
  INIT/STARTUP, MULTI-IMPORT, TRELLO, OPTIMIZATION ENGINE, GOOGLE MAPS, HISTORY

### v5.5.2 — 05/04/2026
- FIX #1: cfg-save-bar agora full-width fixo no rodape mobile (acima da bottom nav)
- FIX #2: Trello banner nao quebra palavra no meio (word-break:normal); credenciais persistem no mobile via re-leitura do localStorage quando popup fecha
- FIX #3: Google login funciona no primeiro clique — GIS SDK pre-carregado ao mostrar tela de login
- FIX #4: Admin panel com padding-top:64px no mobile para nao ficar atras da navbar
- FIX #5: Versao e botao "Sair da conta" no rodape do Painel Admin
- FIX #6: Mapa de Clientes — guard para google.maps nao carregado (retry automatico); dash-drawer com padding-bottom para nao ser cortado pela bottom nav
- FIX #7: Empty state "Nenhum cliente ainda" centralizado vertical e horizontalmente
- FIX #8: Historico — complemento nao duplicado se ja estiver no endereco
- FIX #9: Botao Voltar Android fecha popup do Historico (History API pushState)
- FIX #10: Atalhos de teclado (Enter/Esc) escondidos no mobile

### v5.5.1 — 05/04/2026
- FIX: Botao "Sair da conta" nao aparecia no mobile — _authUpdateConfigUI fazia early return
  quando cfg-account-card nao existia no HTML, impedindo o logoutWrap de ser mostrado

### v5.5.0 — 05/04/2026
- FIX: Google Sign-In mobile — duplo toque resolvido definitivamente
  - SDK carrega eager ao abrir tela de login, flag _googlePendingClick rastreia clique do usuario
  - Se SDK ainda carregando quando usuario clica, prompt() dispara automaticamente ao finalizar
  - Previne carregamento duplicado do script com flag _googleLoading
- NEW: Botao "Sair da conta" visivel na pagina Configuracoes (antes so existia no dropdown do avatar)
- FIX: Mapa de Clientes (heatmap) tela branca — mapa era criado em initGoogleMaps com div display:none
  - Removida criacao prematura; heatmap agora cria lazily em renderDashStats quando div esta visivel
  - Adicionado mapId no heatmap para consistencia com mapa principal
- NEW: Botao voltar do celular navega entre abas do app (pushState + popstate)
  - goPage() agora faz history.pushState a cada navegacao
  - popstate listener restaura a aba correta ao pressionar voltar
  - Evita que o botao voltar saia do browser

### v5.4.9 — 05/04/2026
- FIX: Google Sign-In mobile — dois problemas corrigidos
  - Duplo toque: SDK carregado de forma antecipada ao exibir tela de login (_authShowScreen chama _authGoogle)
  - "Sem conexao" apos selecionar conta: tratamento de erros melhorado em _handleGoogleCred
    - Timeout de 20s com AbortController (mensagem especifica se lento)
    - Erro de rede vs erro do servidor distinguidos com mensagens claras
    - Resposta nao-JSON do servidor tratada com status HTTP na mensagem
  - Worker: try/catch global no fetch handler — erros internos nao retornam mais HTML 500, retornam JSON
- FIX: Worker — adicionado try/catch global no handler principal (handleRequest) para sempre retornar JSON em caso de excecao nao tratada

### v5.4.8 — 05/04/2026
- FIX: Geocodificacao classificava enderecos na cidade errada (ex: Uberlandia)
  - Causa: _resolveGeoAnchor geocodificava cfg.base sem cidade, Google retornava 1a ocorrencia do Brasil
  - Fix: novos campos "Cidade" e "Estado (UF)" nas configuracoes
  - Quando preenchidos, sao usados diretamente na anchor — Google nao pode errar a cidade
  - Bump GEO_CACHE_VER para 5.4.8: limpa todos os resultados de geocoding cacheados errados

### v5.4.7 — 05/04/2026
- FIX: Cartoes voltavam apos limpar — abordagem definitiva via sessionStorage
  - clearAllClients seta sessionStorage rota_user_cleared=1
  - restoreActiveRoute verifica o flag e recusa restaurar se estiver setado
  - Nova importacao do Trello limpa o flag (restore volta a funcionar)
  - sessionStorage persiste no refresh mas e limpo ao fechar a aba

### v5.4.6 — 05/04/2026
- FIX: Causa raiz dos cartoes voltando apos limpar — race condition nos pollings
  - cloudPoll e startGestorPolling fazem awaits async: o clearInterval nao cancela fetches ja em voo
  - Quando a promise resolvia apos o clear, restaurava clients e re-salvava rota_ativa
  - Fix: snapshot de _currentRouteId antes de cada await, verificacao apos cada await
  - Se _currentRouteId mudou durante o await (rota limpa), abandona sem restaurar nada

### v5.4.5 — 05/04/2026
- FIX: Cartoes voltavam apos limpar rota e atualizar pagina (causa raiz)
  - autoSaveRoute agora remove rota_ativa IMEDIATAMENTE quando clients esta vazio
  - Antes usava setTimeout 300ms — qualquer render no intervalo podia vencer o remove

### v5.4.4 — 05/04/2026
- FIX: Botao salvar configuracoes agora flutua sozinho (sem barra de fundo)
  - Removidos background, border-top e backdrop-filter da cfg-save-bar
  - Botao fica no canto inferior direito com sombra sutil
  - Mobile: posicionado acima da bottom nav

### v5.4.3 — 05/04/2026
- FIX: Cartoes voltavam apos limpar rota e atualizar pagina
  - clearAllClients agora para o gestor polling e limpa _currentRouteId/_cloudHash
  - Sem isso, o polling continuava rodando, carregava do cloud e re-salvava no rota_ativa
- FIX: Tags criadas/renomeadas em Configuracoes agora sao aplicadas automaticamente aos cartoes ja na rota
  - Funcao _reapplyTagsToClients varre todos os clients e aplica tags cujo label aparece no nome/obs
  - Chamada em setTagLabel (renomear) e addNewTag (criar nova tag)
  - Nao remove tags existentes, apenas adiciona as novas que casarem
  - Toast informa quantos cartoes foram atualizados

### v5.4.2 — 05/04/2026
- FIX: Versao no rodape agora lida de constante APP_VERSION (nunca mais dessincroniza)
- FIX: Auto-deteccao de tags na importacao Trello restaurada
  - processCard agora varre o texto do cartao (titulo + descricao) contra os labels das tags configuradas pelo usuario
  - Matching por word-boundary (case-insensitive, sem acentos)
  - Fallback para tipo detectado pelo parser (coleta/entrega) se nenhuma tag casar
  - Suporta multiplas tags simultaneas no mesmo cartao

### v5.4.1 — 05/04/2026
- FIX: Botao "Salvar configuracoes" agora fixo no rodape da viewport (position:fixed) — nao precisa mais rolar para ver
  - Desktop: bottom:0, padding-bottom:65px no page-cfg para nao cobrir conteudo
  - Mobile: bottom:56px (acima da bottom nav), padding-bottom:121px

### v5.4.0 — 05/04/2026
- FEAT: Painel Administrativo completo no frontend (visivel apenas para superadmin)
  - Dashboard com stats: total usuarios, ativos hoje, novos 7 dias, MRR
  - Distribuicao por plano, status e provedor
  - Tabela de usuarios com busca, filtros e paginacao
  - Modal de detalhes do usuario (sync summary, historico de planos)
  - Acoes: alterar plano, ativar/desativar usuario
  - Cards de planos com features detalhadas
  - Exportar CSV de todos os usuarios
  - Aba "Admin" na navbar aparece apenas para superadmin (body.is-superadmin)
- FIX: Data removida da navbar (desktop e mobile) por decisao do Philip
- FIX: Dropdown leak na navbar — trocado `<button>` por `<div>` no nav-auth-btn
- FIX: Touch targets mobile 44px minimo (WCAG)
- FIX: Logo "Roteiro de Coleta" nao fechava mapa fullscreen (goPage ignorava rota)
- FIX: Conflito nome _admSort (variavel + funcao) causava SyntaxError fatal — renomeado pra _admSetSort
- FIX: Rodape duplicado "v5.2.0" hardcoded no final do HTML removido
- FIX: Texto "Roteiro de Coleta" removido do badge de versao em Configuracoes

### v5.3.1 — 05/04/2026
- FIX: Dropdown leak na navbar — itens "Configurações" e "Sair" apareciam inline no desktop
  - Root cause: `<button>` nao esconde filhos absolute+display:none em alguns browsers
  - Solucao: trocado `<button id="nav-auth-btn">` por `<div>` com role="button"
- FIX: Touch targets mobile — auth button e theme toggle agora 44px minimo (WCAG)
- FIX: Modal max-width ja coberto por CSS existente (calc(100vw - 32px) no 480px)

### v5.3.0 — 05/04/2026
- FEAT: Bottom navigation bar fixa no mobile (estilo Instagram/WhatsApp)
- FEAT: 5 icones SVG nas abas — sempre visiveis no rodape mobile
- FEAT: Google Sign-In reescrito — login direto sem troca de botao
  - Overlay invisivel do SDK sobre botao customizado
  - Removido One Tap popup (prompt())
  - auto_select:false, cancel_on_tap_outside:true
- FEAT: Facebook removido do login/cadastro (decisao Philip, codigo preservado)
- FIX: Touch scroll abria modal de edicao no mobile (threshold 10px)
- FIX: Debug overflow info (v4.7.8) visivel na tela — removido
- FIX: Endereco + CEP empilhados verticalmente no mobile (<=480px)
- FIX: Toast e cfg-save-bar reposicionados acima da bottom nav
- FIX: safe-area-inset-bottom para iPhones com notch

### v5.2.0 — 04/04/2026
- FEAT: Painel Administrativo completo (dashboard + usuarios + planos)
- FEAT: Navbar premium com avatar + dropdown (estilo Linear/Notion)
- FEAT: Trello OAuth via Worker (chave server-side, nao mais no cliente)
- FEAT: Role/plan/status em todos os endpoints de auth
- FEAT: User index (`admin:users:index`) para queries admin
- FIX: Removido card "Conta" das Configuracoes
- FIX: Worker reescrito completo (v5.2.0, ~530 linhas)

### v5.0.0 — 04/04/2026
- FEAT: Sistema de Contas + Login + Google OAuth + Sync
- FEAT: JWT auth com PBKDF2
- FEAT: Google Sign-In, Facebook Login, Email/senha
- FEAT: Cloud sync de configuracoes, tags, historico
- FIX: Login obrigatorio (removido "Continuar sem conta")
- FIX: Google FedCM NetworkError (trocado para renderButton)
- FIX: Google Maps API key hardcoded fallback

### v4.9.x — 04/04/2026
- FIX: Cards mapa reflexo exato
- FIX: Auto-restore silencioso
- FIX: Geocoding cidade no sufixo
- FIX: Motorista pula modal restaurar

### v4.8.x — 04/04/2026
- FEAT: Parser programatico Trello (zero IA)
- PERF: Batch 5 + geo async
- PERF: Haversine-first + OSRM race
- FIX: Dark mode FOUC prevention

### v4.7.x — 04/04/2026
- FEAT: i18n cobertura completa (EN/PT, 141 data-i18n)
- FEAT: Multi-Import (Excel/CSV) com mapeamento de colunas
- FIX: Mobile responsive (480px + 768px breakpoints)

### v4.6.x — 03-04/04/2026
- FEAT: Motor V2 VRPTW + Simulated Annealing
- FEAT: Time Windows + Clear All
- FEAT: ViaCEP Smart Merge
- PERF: Parallel geocoding

---

## Credenciais e Configuracao

### Google OAuth
- Client ID: `251116670672-eulttck17vcso97daub1n7gbruiku2bn.apps.googleusercontent.com`
- Origens autorizadas: `https://guandahouse.github.io`

### Cloudflare Worker
- Nome: `roteiro-lavanderia`
- KV ROTEIRO_KV: `fdd2a08017994c8681a99e034a7a6ecf`
- KV USERS: `fff395a3bd844ea589c1eafc339b0a4c`
- Secrets: AUTH_SECRET, GOOGLE_CLIENT_ID, TRELLO_APP_KEY

### SuperAdmin
- Email: `nigel.guandalini@gmail.com`
- Role: `superadmin` (atribuido automaticamente pelo Worker)

---

## Decisoes Tecnicas

1. **SPA monolitico** — tudo em index.html para simplicidade de deploy no GitHub Pages
2. **Cloudflare Workers** — serverless, edge computing, KV storage
3. **JWT client-side** — 30 dias, sem refresh token (SPA simples)
4. **PBKDF2 100k** — seguranca adequada para CF Workers (sem bcrypt nativo)
5. **Google overlay invisivel** — renderButton como overlay opacity:0.01 sobre botao customizado; sem prompt/One Tap; callback dispara login direto
6. **Motor client-side** — VRPTW + SA roda no browser, sem custo de servidor
7. **Trello key server-side** — seguranca, usuario nao precisa configurar nada
8. **Bottom nav mobile** — abas fixas no rodape (<=768px), desktop inline no topo; zero JS adicional, puro CSS
