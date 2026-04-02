// src/worker.js — Roteiro de Coleta: Worker completo
// Endpoints: proxy Anthropic/Trello + sync de rota (KV) + fallback ASSETS

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Max-Age': '86400',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function err(msg, status = 400) {
  return json({ error: msg }, status);
}

function quickHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // ═══════════════════════════════════════════
    // PROXY ENDPOINTS (Anthropic + Trello)
    // ═══════════════════════════════════════════

    if (path === '/api/anthropic' && request.method === 'POST') {
      try {
        const body = await request.json();
        if (!body.apiKey) return err('Missing apiKey');
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': body.apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify(body.body),
        });
        return json(await res.json());
      } catch (e) {
        return err('Anthropic proxy error: ' + e.message, 500);
      }
    }

    if (path === '/api/trello' && request.method === 'POST') {
      try {
        const body = await request.json();
        const ep = body.endpoint?.startsWith('/1') ? body.endpoint : '/1' + body.endpoint;
        const trelloUrl = body.url
          ? body.url
          : `https://api.trello.com${ep}${ep.includes('?') ? '&' : '?'}key=${body.key}&token=${body.token}`;
        const res = await fetch(trelloUrl, {
          method: body.method || 'GET',
          headers: { Accept: 'application/json' },
        });
        return json(await res.json());
      } catch (e) {
        return err('Trello proxy error: ' + e.message, 500);
      }
    }

    // ═══════════════════════════════════════════
    // ROUTE SYNC ENDPOINTS (KV)
    // ═══════════════════════════════════════════

    const KV = env.ROTEIRO_KV;
    if (!KV && path.startsWith('/api/route')) {
      return err('KV not configured. Bind ROTEIRO_KV namespace.', 500);
    }

    // POST /api/route/publish — Gestor publica rota
    if (path === '/api/route/publish' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { routeId, clients, order, cfg, date } = body;
        if (!routeId || !clients || !order) return err('Missing routeId, clients, or order');

        const route = {
          routeId,
          clients,
          order,
          cfg: cfg || {},
          date: date || new Date().toISOString().split('T')[0],
          version: 1,
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const raw = JSON.stringify(route);
        route._hash = quickHash(raw);

        await KV.put('route:' + routeId, JSON.stringify(route), { expirationTtl: 172800 });
        await KV.put('route:latest', routeId, { expirationTtl: 172800 });

        return json({ ok: true, routeId, version: route.version, hash: route._hash });
      } catch (e) {
        return err('Publish error: ' + e.message, 500);
      }
    }

    // GET /api/route/:id — Carrega rota completa
    const loadMatch = path.match(/^\/api\/route\/([^/]+)$/);
    if (loadMatch && request.method === 'GET') {
      const id = loadMatch[1] === 'latest' ? await KV.get('route:latest') : loadMatch[1];
      if (!id) return err('No route found', 404);
      const raw = await KV.get('route:' + id);
      if (!raw) return err('Route not found', 404);
      return json(JSON.parse(raw));
    }

    // GET /api/route/:id/poll — Polling leve (hash + version)
    const pollMatch = path.match(/^\/api\/route\/([^/]+)\/poll$/);
    if (pollMatch && request.method === 'GET') {
      const id = pollMatch[1] === 'latest' ? await KV.get('route:latest') : pollMatch[1];
      if (!id) return err('No route', 404);
      const raw = await KV.get('route:' + id);
      if (!raw) return err('Route not found', 404);
      const route = JSON.parse(raw);
      return json({ version: route.version, hash: route._hash, updatedAt: route.updatedAt });
    }

    // PUT /api/route/:id/status — Motorista atualiza status de um cliente
    if (path.match(/^\/api\/route\/[^/]+\/status$/) && request.method === 'PUT') {
      try {
        const id = path.split('/')[3];
        const raw = await KV.get('route:' + id);
        if (!raw) return err('Route not found', 404);
        const route = JSON.parse(raw);
        const body = await request.json();
        const { clientIdx, status, pay, obs, done } = body;

        if (clientIdx === undefined || clientIdx < 0 || clientIdx >= route.clients.length) {
          return err('Invalid clientIdx');
        }

        const c = route.clients[clientIdx];
        if (status !== undefined) c._motStatus = status;
        if (pay !== undefined) c._motPay = pay;
        if (obs !== undefined) c._motObs = obs;
        if (done !== undefined) c._motDone = done;

        route.version++;
        route.updatedAt = new Date().toISOString();
        const newRaw = JSON.stringify(route);
        route._hash = quickHash(newRaw);

        await KV.put('route:' + id, JSON.stringify(route), { expirationTtl: 172800 });

        return json({ ok: true, version: route.version, hash: route._hash });
      } catch (e) {
        return err('Status update error: ' + e.message, 500);
      }
    }

    // POST /api/route/:id/client — Gestor adiciona cliente na rota ativa
    if (path.match(/^\/api\/route\/[^/]+\/client$/) && request.method === 'POST') {
      try {
        const id = path.split('/')[3];
        const raw = await KV.get('route:' + id);
        if (!raw) return err('Route not found', 404);
        const route = JSON.parse(raw);
        const body = await request.json();
        const { client, insertAfterIdx } = body;

        if (!client || !client.nome || !client.endereco) {
          return err('Missing client data (nome, endereco)');
        }

        const newIdx = route.clients.length;
        route.clients.push(client);

        if (insertAfterIdx !== undefined && insertAfterIdx >= 0) {
          const orderPos = route.order.indexOf(insertAfterIdx);
          if (orderPos >= 0) {
            route.order.splice(orderPos + 1, 0, newIdx);
          } else {
            route.order.push(newIdx);
          }
        } else {
          route.order.push(newIdx);
        }

        route._newClient = { idx: newIdx, addedAt: new Date().toISOString() };
        route.version++;
        route.updatedAt = new Date().toISOString();
        const newRaw = JSON.stringify(route);
        route._hash = quickHash(newRaw);

        await KV.put('route:' + id, JSON.stringify(route), { expirationTtl: 172800 });

        return json({ ok: true, newIdx, version: route.version, hash: route._hash });
      } catch (e) {
        return err('Add client error: ' + e.message, 500);
      }
    }

    // ═══════════════════════════════════════════
    // FALLBACK — serve arquivos estáticos (index.html etc)
    // ═══════════════════════════════════════════
    return env.ASSETS.fetch(request);
  },
};
