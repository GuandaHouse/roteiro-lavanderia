# PROJETO-DNA — Roteiro de Coleta

> Documento vivo com todas as decisoes tecnicas, features e historico do projeto.
> Atualizado a cada entrega.
> Última atualização: 12/04/2026 — v5.9.34

---

## Regras de Atendimento — OBRIGATÓRIAS

1. **Versão SEMPRE incrementa** — toda atualização, mesmo 1 linha, muda o número da versão. Philip confirma visualmente que está no arquivo novo e não no antigo por cache.

2. **Sem looping de correção** — se uma correção falhar na 2ª tentativa, PARAR. Pensar diferente, pesquisar, buscar abordagem alternativa. Nunca repetir a mesma lógica esperando resultado diferente.

3. **Pensar em escala Brasil** — nunca presumir que o usuário está em São Paulo. Toda funcionalidade deve ser genérica e adaptável a qualquer cidade/estado.

4. **NUNCA implementar sem autorização explícita** — quando Philip diz "vai anotando", o assistente só anota e pergunta a próxima. ZERO código escrito. Só implementa quando Philip disser "pode começar" ou equivalente explícito. Implementar antes disso é quebra de confiança e não será tolerado.

5. **Fluxo de coleta de correções:**
   - Philip passa correção → assistente anota, confirma o entendimento e pergunta "qual a próxima?"
   - Após todas as correções coletadas → assistente aguarda "pode começar"
   - Só então implementa tudo de uma vez

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
- index.html + style.css + app.js (~6200 linhas em app.js; v5.9.8)
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

### v5.9.33–5.9.34 — 12/04/2026 — GEOCODING: BAIRROS ViaCEP NÃO INDEXADOS NO OSM
**Contexto**: Clientes importados do Trello com endereços de Barueri e São Paulo ficavam com badge "SEM LOCALIZAÇÃO". Problema persistia após múltiplas tentativas de ajuste de parâmetros.

**Causa raiz identificada** (lição de "questione a premissa fundamental"):
A cadeia ViaCEP → OSM montava queries COM o nome do bairro (ex: "Alphaville Empresarial", "Vila Madalena"). Esses nomes de bairro do ViaCEP **não existem no índice do OSM Nominatim** — retornam 0 resultados. A mesma rua + cidade **sem bairro** é encontrada normalmente. Nenhum ajuste de parâmetro resolveria — a premissa de incluir o bairro estava errada.

**v5.9.33** — Retry GEO-VC2 sem bairro:
- Após query com bairro ViaCEP falhar no OSM, tenta novamente sem o bairro
- Query: `[logr, num, cidade, uf, 'Brasil'].filter(Boolean).join(', ')`
- Log: `[GEO-VC2] addr → lat,lng (sem bairro)`

**v5.9.34** — Dois fixes adicionais descobertos em teste:
- **Fix 1 (Meire — rua com sufixo "B")**: `_parseAddrParts("Rua Bonnard, 132 B, Apto 365")` retornava `logr="Rua Bonnard, 132 B, Apto 365"` com `num=""` (sufixo "B" confunde o parser). A extração de `_rua` para ViaCEP incluía o número como parte do nome da rua, quebrando a busca. Fix: `.split(',')[0]` para garantir que só o nome da rua vai para o ViaCEP.
- **Fix 2 (Kelly — CEP sem cidade no texto)**: Endereço sem em-dash (sem segmentação de cidade) + âncora na cidade errada (Guarulhos) → ViaCEP por cidade não achava a rua. Fix: após o loop de busca por cidade falhar, faz lookup direto pelo CEP do cliente (`/ws/{cep}/json/`) para obter logradouro + cidade correta.
- Cadeia confirmada: `[GEO-CEP] lookup CEP 05187010 → Avenida Alexios Jafet, São Paulo` → `[GEO-VC2] → lat=-23.446775`

**Clientes resolvidos**: Meire Pultz (Barueri ✅), Kelly Lemes (São Paulo ✅), Celia (Vila Madalena ✅), Kauan Schumacher (sem cidade, usa âncora ✅).
**Não resolvível**: Catherine (sem cidade, sem CEP, sem em-dash — estruturalmente impossível com ferramentas gratuitas).

### v5.9.17–5.9.19 — 12/04/2026 — MOTOR DE OTIMIZAÇÃO REESCRITO
**Contexto**: Sistema não conseguia reproduzir a rota otimizada manualmente por Philip (111km, 3h55min, 0 violações, ordem: Elis→Pim→JFFB→V.C→Rosana→Giorge→Zica→Ana). Após múltiplas tentativas ajustando parâmetros do OSRM, foi identificado o problema raiz.

**Problema raiz**: OSRM e Google Maps divergem completamente em distâncias para São Paulo.
- OSRM dizia rota A = 78.9km → Google dizia = 131.5km (pior rota)
- OSRM dizia rota B = 135.6km → Google dizia = 111.0km (melhor rota)
- Os rankings estavam 100% invertidos. Ajustar parâmetros do OSRM era inútil — o dado era fundamentalmente errado para SP.
- Causa provável: OSRM usa dados OSM desatualizados para vias expressas de SP, subestimando trechos urbanos complexos.

**Solução implementada em 3 camadas:**

**Camada 1 — Google TSP (v5.9.17)**
Substituído o uso de OSRM+BF para ordenação por `DirectionsService` com `optimizeWaypoints: true`. O Google resolve o problema do caixeiro-viajante usando dados reais de tráfego, vias e conhecimento local. Os waypoints são passados SEM ordenação prévia; o Google devolve `waypoint_order` com a ordem ótima.

**Camada 2 — Correção de Janelas Horárias (v5.9.18)**
Google TSP otimiza por distância/tempo mas ignora time windows. Criada função `_fixWindowViolationsOrder(ord, matrix, gcIdx)`:
- Avalia a ordem do Google via `_evalOrder` (com osrmK=1.15 para ser conservador)
- Para cada cliente que chega após o deadline, testa movê-lo para posições anteriores (da mais próxima à mais distante da posição atual)
- Usa a posição mais tarde que ainda resolve a violação (mínima disrupção)
- Itera até 0 violações ou até não conseguir mais melhorar
- No caso real: V.C (deadline 14h) estava na posição 5 → movida para posição 4, chegando às 13:48 ✓

**Camada 3 — Re-request Directions (v5.9.19)**
Quando `_fixWindowViolationsOrder` muda a ordem, as `legs` do Directions original ficam desalinhadas (legs[3] correspondia a Rosana, não a V.C). Fix: nova chamada `DirectionsService` com `optimizeWaypoints: false` e a ordem corrigida pré-definida. Isso garante:
- ETAs exibidas calculadas sobre o trajeto real
- Polyline no mapa desenhando a rota correta
- Distância total refletindo a rota efetiva

**Resultado**: Sistema reproduz exatamente a rota manual de Philip — 111km, 0 violações, V.C às 13:48.

**Funções-chave no app.js:**
- `_fixWindowViolationsOrder(ord, matrix, gcIdx)` — pós-processamento de janelas (linha ~4721)
- `calcRoute()` — chamada Google TSP + window fix + re-request (linha ~6148)
- `_evalOrder(order, matrix, alpha, gcIdx)` — avaliação de custo com osrmK=1.15 para OSRM
- `estimateTimesOSRM(legs)` — cálculo de ETAs a partir de legs do Google

**Lição aprendida para o futuro:**
Se o motor de otimização voltar a dar ordens erradas, NÃO ajustar parâmetros (osrmK, alpha, etc.) — questionar primeiro se a fonte de dados de distâncias está correta. Testar: pegar a rota "ótima" do sistema e comparar com a rota manual no Google Maps. Se o Google discorda da fonte (OSRM/haversine), trocar a fonte, não os parâmetros.

Se precisar trocar por API gratuita no futuro: OSRM pode ser mantido para a matriz de distâncias (buildTimeMatrix) mas NUNCA para decidir a ordem final. A ordem deve sempre ser validada pelo Google Directions ou por outra fonte confiável de roteamento urbano.

### v5.9.8 — 12/04/2026
- FIX: Campos "Cidade" e "Estado (UF)" removidos das Configurações
  - Sistema extrai cidade/estado automaticamente via geocoding do endereço de partida
  - `_resolveGeoAnchor()` simplificado: remove `cidadeExplicita/ufExplicita`, usa só geocoding
  - `loadCfg()` limpa valores antigos (`cfg.cidade`, `cfg.uf`) do localStorage ao carregar
  - Placeholder dos campos de endereço atualizado para sugerir incluir cidade/estado

### v5.9.7 — 12/04/2026
- FIX: Bug "SEM LOCALIZAÇÃO" — clientes importados do Trello ficavam sem coordenadas
  - **Causa raiz**: mismatch de chaves no cache `rota_geo_locs` (chave longa vs chave curta)
  - `nominatim()` agora usa `_extractBaseAddr(addr)` antes de buscar em `rota_geo_locs`
  - `_resolveGeoAnchor()` bootstrap: quando endereço da empresa falha no OSM, extrai estado
    do histórico em `rota_addr_choices` / `rota_geo_locs` via regex `/ - ([A-Z]{2}), \d{5}/`
  - Auto-retry na inicialização: 3.5s após load, geocodifica todos os clientes sem coordenadas
  - Cache KV: `geo_v2_` → `geo_v3_` para invalidar entradas pré-ViaCEP com dados errados
  - `GEO_CACHE_VER` bumped para 5.9.7 (limpa cache local antigo)
  - Cache local: `geo_` → `geo3_` prefix (consistência com cache version)

### v5.9.6 — 12/04/2026
- FIX: Worker — ViaCEP rescue para OSM ZERO_RESULTS
  - Quando OSM retorna 0 resultados, extrai estado do endereço, consulta ViaCEP, constrói query canônica e retenta no OSM
  - Fix `_osmToGoogle()`: `estado.slice(0,2)` → `estado.replace(/[^A-Za-z]/g,'').slice(0,2).toUpperCase()` (correção de "SÃ" para "SP")
  - Cache KV: não serve entradas com `status !== 'OK'` (ZERO_RESULTS/REQUEST_DENIED ignorados)
  - Adicionado `STATE_CAPITALS` map para fallback de cidade por estado

### v5.9.5 — 11/04/2026
- FEAT: Google Geocoding API desativada permanentemente (custo R$60/dia — 3.219 chamadas indevidas)
  - Google Geocoding removido como fallback do Worker (só OSM Nominatim + ViaCEP)
  - Permissão "Geocoding API" revogada no Google Cloud Console
  - Stack atual: OSM Nominatim → KV cache → ViaCEP rescue (sem Google)

### v5.8.5 — 09/04/2026
- FIX: Normalizacao de endereco — formato padrao "Logradouro, No, Complemento — Bairro — Municipio"; sem duplicar separadores

### v5.8.4 — 09/04/2026
- FIX: _resolveTagId() corrige filtros hardcoded coleta/entrega para usar IDs customizados (tag_XXXX)

### v5.8.3 — 09/04/2026
- FIX: Plural dinamico nos resumos (7 Coletas / 1 Coleta)
- FIX: RETIRADAS/ENTREGAS volta a somar quantidade de itens (em vez de count de clientes)

### v5.8.2 — 09/04/2026
- FIX: updStats mostra contagem de clientes (col/ent.length) em vez de soma de qtd zerada
- FIX: Label "itens" renomeado para "paradas" nos resumos

### v5.8.1 — 09/04/2026
- FIX: Worker compara timestamps antes de aceitar tags/cfg — protege contra sobrescrita por versao mais antiga de outro dispositivo
- FIX: Tags e cfg nunca sobrescritos em sync de dispositivo desatualizado

### v5.8.0 — 09/04/2026
- FIX: Race condition no sync desktop/mobile — protege cfg, tags e rota contra sobrescrita dentro de 5s apos edicao local

### v5.5.4 — 05/04/2026
- FIX: botao "Salvar configuracoes" agora fixo no rodape no mobile (position:fixed!important forçado na media query)

### v5.5.3 — 05/04/2026
- FIX: cfg-save-bar mobile sem faixa preta — removido background:var(--bg) e border-top do override mobile
- FIX: botao centrado (left:50% + transform) no rodape fixo, sem container escuro
- REFACTOR: SPA monolitico dividido em 3 arquivos para reduzir consumo de tokens
  - index.html: 8188 → 1223 linhas (estrutura HTML + scripts inline criticos)
  - style.css: 972 linhas (todo o CSS extraido, com fix cfg-save-bar aplicado)
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
9. **Google Geocoding desativada** — custou R$60 em 1 dia (3.219 chamadas). Stack atual: OSM Nominatim (gratuito) + ViaCEP (gratuito) via Worker. Google Geocoding API revogada no Google Cloud Console. Não reverter.
10. **Cidade/UF extraídos do endereço de partida** — campos manuais removidos das Configurações (v5.9.8). `_resolveGeoAnchor()` extrai cidade e estado automaticamente via geocoding. Se o endereço base falhar no OSM, faz bootstrap do estado a partir de qualquer endereço já geocodificado no histórico (`rota_addr_choices` / `rota_geo_locs`).
11. **Cache de geocoding em 3 camadas** — (1) localStorage `geo3_` prefix, (2) KV `geo_v3_` no Worker com TTL 90 dias, (3) `rota_geo_locs` com chave curta (rua+número via `_extractBaseAddr`). Resultados ruins (ZERO_RESULTS/REQUEST_DENIED) nunca são cacheados.
12. **Fluxo de teste obrigatório** — quando um bug é difícil de corrigir, o assistente usa Claude em Chrome para testar visualmente como um usuário real. Nunca reportar "corrigido" sem ter visto com os próprios olhos na interface.
13. **Motor de otimização: Google TSP é soberano** — a ordem final de paradas é sempre determinada pelo Google Directions (`optimizeWaypoints:true`), não por OSRM. OSRM pode ser usado na matriz de distâncias (buildTimeMatrix) para heurísticas internas, mas o rankeamento final de rotas deve ser validado pelo Google. OSRM diverge sistematicamente do Google para roteamento urbano em SP (rankings 100% invertidos documentados em 12/04/2026). Se a ordem parecer errada, comparar diretamente com Google Maps antes de ajustar qualquer parâmetro interno.
14. **Correção de janelas horárias é pós-processamento** — `_fixWindowViolationsOrder` roda APÓS o Google TSP resolver a ordem base. Nunca tentar incorporar time windows no TSP do Google (ele ignora). A função move clientes com deadline violado para a posição mais tarde possível que ainda respeita o horário, minimizando disrupção na rota. Após a correção, sempre re-rodar Directions com a nova ordem para obter legs e ETAs precisas.
15. **Geocoding em 3 camadas de fallback** — (1) OSM Nominatim direto, (2) ViaCEP+OSM para clientes com c.cep (strip parênteses do bairro, tenta com bairro/sem bairro/logradouro canônico), (3) Em-dash city fallback para endereços "Rua X, 132 B, Apto 365 — Barueri" → extrai cidade do último segmento em-dash e reconstrói "Rua X, 132, Barueri, Brasil". Taxa alvo: ≥10/12 clientes por rota. Clientes sem cidade/CEP (ex: "Av. Jabaquara, 1744, Apto 1007" sem contexto) são estruturalmente irresolvíveis sem edição do usuário.
17. **Nomes de bairro do ViaCEP NÃO são indexados no OSM** (v5.9.33/34) — bairros como "Alphaville Empresarial", "Vila Madalena", "Jardim Ipanema (Zona Oeste)" existem no ViaCEP mas NÃO no índice do OSM Nominatim. Queries com esses bairros retornam ZERO_RESULTS. A solução é SEMPRE tentar a query sem o bairro (GEO-VC2) quando a query com bairro falha. Adicionalmente: quando `_parseAddrParts` não extrai `num` separado (endereços com sufixo como "132 B"), o nome da rua para ViaCEP deve usar `.split(',')[0]` para não incluir o número. E quando não há cidade no texto mas há CEP, fazer lookup direto pelo CEP (`/ws/{cep}/json/`) para obter a cidade correta (ignorando a âncora que pode ser outra cidade).

16. **`_geoFailCount[key]=0` não significa falha** — ao interpretar debug de geocoding: fail count 0 pode significar (a) nunca chamado OU (b) chamado e bem-sucedido (sucesso nunca incrementa o contador; `_geoFailReset` deleta a chave; ambos resultam em key=undefined=0). Verificar o resultado real (c.lat/c.lng) para confirmar sucesso, não o fail count.
