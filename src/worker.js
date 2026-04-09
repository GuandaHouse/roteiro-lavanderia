// src/worker.js — Roteiro de Coleta: Worker completo v5.2.0
// Endpoints: Auth + Admin Panel + Sync + Route KV + Proxy + ASSETS fallback
//
// KV BINDINGS:
//   - ROTEIRO_KV (rotas em tempo real)
//   - USERS (autenticação, perfis, sync, admin)
//
// SECRETS (wrangler secret put):
//   - AUTH_SECRET — chave HMAC para JWT (min 32 chars)
//   - GOOGLE_CLIENT_ID — (opcional) verificação de audience
//   - TRELLO_APP_KEY — chave do Power-Up Trello para OAuth

const SUPER_ADMIN_EMAIL = 'nigel.guandalini@gmail.com';

const DEFAULT_PLANS = {
  free:     { name: 'Free',     price: 0,   motoristas: 1,  rotasDia: 1,   importTrello: false, importExcel: false, ia: false, iaCreditsMes: 0,   histDays: 7,   cloudSync: false, whatsapp: false, pod: false, relatorios: false, apiAccess: false, whiteLabel: false, suportePrio: false },
  pro:      { name: 'Pro',      price: 99,  motoristas: 3,  rotasDia: -1,  importTrello: true,  importExcel: true,  ia: false, iaCreditsMes: 0,   histDays: 90,  cloudSync: true,  whatsapp: true,  pod: false, relatorios: false, apiAccess: false, whiteLabel: false, suportePrio: false },
  promax:   { name: 'Pro Max',  price: 199, motoristas: 10, rotasDia: -1,  importTrello: true,  importExcel: true,  ia: true,  iaCreditsMes: 200, histDays: -1,  cloudSync: true,  whatsapp: true,  pod: true,  relatorios: true,  apiAccess: false, whiteLabel: false, suportePrio: false },
  ultimate: { name: 'Ultimate', price: 399, motoristas: -1, rotasDia: -1,  importTrello: true,  importExcel: true,  ia: true,  iaCreditsMes: -1,  histDays: -1,  cloudSync: true,  whatsapp: true,  pod: true,  relatorios: true,  apiAccess: true,  whiteLabel: true,  suportePrio: true  },
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
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

// ═══════════════════════════════════════════════════════════════
// CRYPTO HELPERS
// ═══════════════════════════════════════════════════════════════

const ENC = new TextEncoder();
const DEC = new TextDecoder();

function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', ENC.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: ENC.encode(salt), iterations: 100000, hash: 'SHA-256' },
    key, 256
  );
  return b64url(bits);
}

async function signJWT(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const key = await crypto.subtle.importKey('raw', ENC.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const h = b64url(ENC.encode(JSON.stringify(header)));
  const p = b64url(ENC.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign('HMAC', key, ENC.encode(`${h}.${p}`));
  return `${h}.${p}.${b64url(sig)}`;
}

async function verifyJWT(token, secret) {
  try {
    const [h, p, s] = token.split('.');
    const key = await crypto.subtle.importKey('raw', ENC.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('HMAC', key, b64urlDecode(s), ENC.encode(`${h}.${p}`));
    if (!valid) return null;
    const payload = JSON.parse(DEC.decode(b64urlDecode(p)));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch (e) { return null; }
}

function generateId() {
  return crypto.randomUUID();
}

// ═══════════════════════════════════════════════════════════════
// ADMIN HELPERS
// ═══════════════════════════════════════════════════════════════

function getUserRole(email) {
  return email === SUPER_ADMIN_EMAIL ? 'superadmin' : 'user';
}

function makeUserPublic(user) {
  const { passwordHash, salt, ...safe } = user;
  return safe;
}

function userResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider || 'email',
    role: getUserRole(user.email),
    plan: user.plan || 'free',
    status: user.status || 'active',
    picture: user.picture || null,
  };
}

async function makeToken(user, env) {
  return signJWT(
    { sub: user.id, email: user.email, role: getUserRole(user.email), exp: Math.floor(Date.now() / 1000) + 30 * 86400 },
    env.AUTH_SECRET
  );
}

async function addToUserIndex(env, userId) {
  const raw = await env.USERS.get('admin:users:index');
  const index = raw ? JSON.parse(raw) : [];
  if (!index.includes(userId)) {
    index.push(userId);
    await env.USERS.put('admin:users:index', JSON.stringify(index));
  }
}

async function requireAdmin(request, env) {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const payload = await verifyJWT(auth.slice(7), env.AUTH_SECRET);
  if (!payload) return null;
  if (payload.role !== 'superadmin') return null;
  return payload;
}

// ═══════════════════════════════════════════════════════════════
// AUTH HANDLERS
// ═══════════════════════════════════════════════════════════════

async function handleRegister(request, env) {
  const { name, email, password } = await request.json();
  if (!name || !email || !password) return json({ ok: false, error: 'Campos obrigatorios: nome, email, senha' }, 400);
  if (password.length < 8) return json({ ok: false, error: 'Senha deve ter no minimo 8 caracteres' }, 400);
  if (!email.includes('@')) return json({ ok: false, error: 'Email invalido' }, 400);

  const existing = await env.USERS.get(`email:${email.toLowerCase()}`);
  if (existing) return json({ ok: false, error: 'Este email ja esta cadastrado' }, 409);

  const userId = generateId();
  const salt = generateId();
  const passwordHash = await hashPassword(password, salt);

  const user = {
    id: userId,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash, salt,
    provider: 'email',
    role: getUserRole(email.toLowerCase().trim()),
    plan: 'free',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  await env.USERS.put(`user:${userId}`, JSON.stringify(user));
  await env.USERS.put(`email:${email.toLowerCase()}`, userId);
  await addToUserIndex(env, userId);

  const token = await makeToken(user, env);

  return json({
    ok: true, token, isNew: true,
    user: userResponse(user)
  });
}

async function handleLogin(request, env) {
  const { email, password } = await request.json();
  if (!email || !password) return json({ ok: false, error: 'Email e senha obrigatorios' }, 400);

  const userId = await env.USERS.get(`email:${email.toLowerCase()}`);
  if (!userId) return json({ ok: false, error: 'Email ou senha incorretos' }, 401);

  const userData = await env.USERS.get(`user:${userId}`);
  if (!userData) return json({ ok: false, error: 'Conta nao encontrada' }, 401);

  const user = JSON.parse(userData);
  const hash = await hashPassword(password, user.salt);
  if (hash !== user.passwordHash) return json({ ok: false, error: 'Email ou senha incorretos' }, 401);

  user.lastLogin = new Date().toISOString();
  if (!user.role) user.role = getUserRole(user.email);
  if (!user.plan) user.plan = 'free';
  if (!user.status) user.status = 'active';
  await env.USERS.put(`user:${userId}`, JSON.stringify(user));
  await addToUserIndex(env, userId);

  const token = await makeToken(user, env);

  return json({
    ok: true, token,
    user: userResponse(user)
  });
}

async function handleForgot(request, env) {
  return json({ ok: true, message: 'Se o email existir, um link sera enviado.' });
}

async function handleGoogleAuth(request, env) {
  const { idToken } = await request.json();
  if (!idToken) return json({ ok: false, error: 'Token ausente' }, 400);

  const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
  if (!verifyRes.ok) return json({ ok: false, error: 'Token Google invalido' }, 401);

  const gUser = await verifyRes.json();
  if (env.GOOGLE_CLIENT_ID && gUser.aud !== env.GOOGLE_CLIENT_ID) {
    return json({ ok: false, error: 'Token nao pertence a esta aplicacao' }, 401);
  }

  const googleId = gUser.sub;
  const email = gUser.email?.toLowerCase();
  const name = gUser.name || gUser.given_name || email;
  const picture = gUser.picture || null;

  let userId = await env.USERS.get(`google:${googleId}`);
  let isNew = false;

  if (!userId) {
    userId = await env.USERS.get(`email:${email}`);
    if (userId) {
      await env.USERS.put(`google:${googleId}`, userId);
      const userData = JSON.parse(await env.USERS.get(`user:${userId}`));
      userData.googleId = googleId;
      userData.picture = picture;
      userData.provider = userData.provider === 'email' ? 'google' : userData.provider;
      if (!userData.role) userData.role = getUserRole(email);
      if (!userData.plan) userData.plan = 'free';
      if (!userData.status) userData.status = 'active';
      await env.USERS.put(`user:${userId}`, JSON.stringify(userData));
    } else {
      userId = generateId();
      isNew = true;
      const user = {
        id: userId, name, email, googleId, picture,
        provider: 'google',
        role: getUserRole(email),
        plan: 'free',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      await env.USERS.put(`user:${userId}`, JSON.stringify(user));
      await env.USERS.put(`email:${email}`, userId);
      await env.USERS.put(`google:${googleId}`, userId);
    }
  }

  const userData = JSON.parse(await env.USERS.get(`user:${userId}`));
  userData.lastLogin = new Date().toISOString();
  userData.picture = picture || userData.picture;
  if (!userData.role) userData.role = getUserRole(email);
  if (!userData.plan) userData.plan = 'free';
  if (!userData.status) userData.status = 'active';
  await env.USERS.put(`user:${userId}`, JSON.stringify(userData));
  await addToUserIndex(env, userId);

  const token = await makeToken(userData, env);

  return json({
    ok: true, token, isNew,
    user: userResponse(userData)
  });
}

async function handleFacebookAuth(request, env) {
  const { accessToken } = await request.json();
  if (!accessToken) return json({ ok: false, error: 'Token ausente' }, 400);

  const fbRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`);
  if (!fbRes.ok) return json({ ok: false, error: 'Token Facebook invalido' }, 401);

  const fbUser = await fbRes.json();
  const fbId = fbUser.id;
  const email = fbUser.email?.toLowerCase();
  const name = fbUser.name || email;
  const picture = fbUser.picture?.data?.url || null;

  if (!email) return json({ ok: false, error: 'Facebook nao retornou email. Verifique as permissoes.' }, 400);

  let userId = await env.USERS.get(`facebook:${fbId}`);
  let isNew = false;

  if (!userId) {
    userId = await env.USERS.get(`email:${email}`);
    if (userId) {
      await env.USERS.put(`facebook:${fbId}`, userId);
      const userData = JSON.parse(await env.USERS.get(`user:${userId}`));
      userData.facebookId = fbId;
      userData.picture = picture;
      if (!userData.role) userData.role = getUserRole(email);
      if (!userData.plan) userData.plan = 'free';
      if (!userData.status) userData.status = 'active';
      await env.USERS.put(`user:${userId}`, JSON.stringify(userData));
    } else {
      userId = generateId();
      isNew = true;
      const user = {
        id: userId, name, email, facebookId: fbId, picture,
        provider: 'facebook',
        role: getUserRole(email),
        plan: 'free',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      await env.USERS.put(`user:${userId}`, JSON.stringify(user));
      await env.USERS.put(`email:${email}`, userId);
      await env.USERS.put(`facebook:${fbId}`, userId);
    }
  }

  const userData = JSON.parse(await env.USERS.get(`user:${userId}`));
  userData.lastLogin = new Date().toISOString();
  if (!userData.role) userData.role = getUserRole(email);
  if (!userData.plan) userData.plan = 'free';
  if (!userData.status) userData.status = 'active';
  await env.USERS.put(`user:${userId}`, JSON.stringify(userData));
  await addToUserIndex(env, userId);

  const token = await makeToken(userData, env);

  return json({
    ok: true, token, isNew,
    user: userResponse(userData)
  });
}

// ═══════════════════════════════════════════════════════════════
// DATA SYNC HANDLERS
// ═══════════════════════════════════════════════════════════════

async function authenticateRequest(request, env) {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return verifyJWT(auth.slice(7), env.AUTH_SECRET);
}

async function handleSyncGet(request, env) {
  const payload = await authenticateRequest(request, env);
  if (!payload) return json({ ok: false, error: 'Nao autenticado' }, 401);
  const data = await env.USERS.get(`sync:${payload.sub}`);
  return json({ ok: true, data: data ? JSON.parse(data) : null });
}

async function handleSyncPost(request, env) {
  const payload = await authenticateRequest(request, env);
  if (!payload) return json({ ok: false, error: 'Nao autenticado' }, 401);
  const body = await request.json();

  // v5.8.1: Conflict resolution — proteger tags e cfg com timestamps
  // Buscar dados existentes para comparar versões
  const existingRaw = await env.USERS.get(`sync:${payload.sub}`);
  if (existingRaw) {
    const existing = JSON.parse(existingRaw);
    // Tags: só sobrescreve se incoming é mais recente OU igual (mesmo dispositivo)
    if (body.tags && (body.tagsUpdatedAt || 0) < (existing.tagsUpdatedAt || 0)) {
      body.tags = existing.tags;
      body.tagsUpdatedAt = existing.tagsUpdatedAt;
    }
    // Cfg: mesma lógica
    if (body.cfg && (body.cfgUpdatedAt || 0) < (existing.cfgUpdatedAt || 0)) {
      body.cfg = existing.cfg;
      body.cfgUpdatedAt = existing.cfgUpdatedAt;
    }
  }

  const serialized = JSON.stringify(body);
  if (serialized.length > 2 * 1024 * 1024) {
    return json({ ok: false, error: 'Dados muito grandes. Reduza o historico.' }, 413);
  }
  await env.USERS.put(`sync:${payload.sub}`, serialized);
  return json({ ok: true });
}

// ═══════════════════════════════════════════════════════════════
// ADMIN HANDLERS
// ═══════════════════════════════════════════════════════════════

async function handleAdminStats(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return err('Acesso negado', 403);

  const raw = await env.USERS.get('admin:users:index');
  const index = raw ? JSON.parse(raw) : [];

  let totalUsers = index.length;
  const byPlan = {}, byStatus = {}, byProvider = {};
  let mrr = 0, activeToday = 0, newThisWeek = 0;
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const weekAgo = new Date(now - 7 * 86400000).toISOString();

  const plans = JSON.parse(await env.USERS.get('admin:plans') || 'null') || DEFAULT_PLANS;

  for (const uid of index) {
    const uRaw = await env.USERS.get(`user:${uid}`);
    if (!uRaw) continue;
    const u = JSON.parse(uRaw);
    const plan = u.plan || 'free';
    const status = u.status || 'active';
    const provider = u.provider || 'email';

    byPlan[plan] = (byPlan[plan] || 0) + 1;
    byStatus[status] = (byStatus[status] || 0) + 1;
    byProvider[provider] = (byProvider[provider] || 0) + 1;

    if (status === 'active' && plans[plan]) mrr += plans[plan].price || 0;
    if (u.lastLogin && u.lastLogin.startsWith(todayStr)) activeToday++;
    if (u.createdAt && u.createdAt >= weekAgo) newThisWeek++;
  }

  return json({ totalUsers, byPlan, byStatus, byProvider, mrr, activeToday, newThisWeek });
}

async function handleAdminUsers(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return err('Acesso negado', 403);

  const url = new URL(request.url);
  const search = (url.searchParams.get('search') || '').toLowerCase();
  const filterPlan = url.searchParams.get('plan') || '';
  const filterStatus = url.searchParams.get('status') || '';
  const sort = url.searchParams.get('sort') || 'createdAt';
  const dir = url.searchParams.get('dir') || 'desc';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);

  const raw = await env.USERS.get('admin:users:index');
  const index = raw ? JSON.parse(raw) : [];

  let users = [];
  for (const uid of index) {
    const uRaw = await env.USERS.get(`user:${uid}`);
    if (!uRaw) continue;
    const u = makeUserPublic(JSON.parse(uRaw));
    if (!u.plan) u.plan = 'free';
    if (!u.status) u.status = 'active';

    if (search && !(u.name || '').toLowerCase().includes(search) && !(u.email || '').toLowerCase().includes(search)) continue;
    if (filterPlan && u.plan !== filterPlan) continue;
    if (filterStatus && u.status !== filterStatus) continue;

    users.push(u);
  }

  // Sort
  users.sort((a, b) => {
    const va = (a[sort] || '').toString().toLowerCase();
    const vb = (b[sort] || '').toString().toLowerCase();
    return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const total = users.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  users = users.slice(start, start + limit);

  return json({ users, total, page, totalPages, limit });
}

async function handleAdminUserDetail(request, env, userId) {
  const admin = await requireAdmin(request, env);
  if (!admin) return err('Acesso negado', 403);

  const uRaw = await env.USERS.get(`user:${userId}`);
  if (!uRaw) return err('Usuario nao encontrado', 404);
  const u = makeUserPublic(JSON.parse(uRaw));

  // Sync summary
  const syncRaw = await env.USERS.get(`sync:${userId}`);
  if (syncRaw) {
    const sync = JSON.parse(syncRaw);
    u.syncSummary = {
      lastSync: sync.savedAt || null,
      hasCfg: !!sync.cfg,
      tagsCount: sync.tags?.length || 0,
      histCount: sync.hist?.length || 0,
    };
  }

  return json(u);
}

async function handleAdminUpdatePlan(request, env, userId) {
  const admin = await requireAdmin(request, env);
  if (!admin) return err('Acesso negado', 403);

  const { plan } = await request.json();
  if (!plan) return err('Plano obrigatorio');

  const uRaw = await env.USERS.get(`user:${userId}`);
  if (!uRaw) return err('Usuario nao encontrado', 404);
  const u = JSON.parse(uRaw);

  const oldPlan = u.plan || 'free';
  u.plan = plan;
  if (!u.planHistory) u.planHistory = [];
  u.planHistory.push({ from: oldPlan, to: plan, date: new Date().toISOString(), by: admin.email });

  await env.USERS.put(`user:${userId}`, JSON.stringify(u));
  return json({ ok: true, plan });
}

async function handleAdminUpdateStatus(request, env, userId) {
  const admin = await requireAdmin(request, env);
  if (!admin) return err('Acesso negado', 403);

  const { status } = await request.json();
  if (!['active', 'inactive'].includes(status)) return err('Status invalido');

  const uRaw = await env.USERS.get(`user:${userId}`);
  if (!uRaw) return err('Usuario nao encontrado', 404);
  const u = JSON.parse(uRaw);
  u.status = status;
  await env.USERS.put(`user:${userId}`, JSON.stringify(u));
  return json({ ok: true, status });
}

async function handleAdminGetPlans(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return err('Acesso negado', 403);
  const plans = JSON.parse(await env.USERS.get('admin:plans') || 'null') || DEFAULT_PLANS;
  return json(plans);
}

async function handleAdminUpdatePlans(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return err('Acesso negado', 403);
  const plans = await request.json();
  // Merge with defaults to preserve boolean fields
  const merged = { ...DEFAULT_PLANS };
  for (const k of Object.keys(plans)) {
    if (merged[k]) merged[k] = { ...merged[k], ...plans[k] };
  }
  await env.USERS.put('admin:plans', JSON.stringify(merged));
  return json({ ok: true });
}

async function handleAdminExport(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return err('Acesso negado', 403);

  const raw = await env.USERS.get('admin:users:index');
  const index = raw ? JSON.parse(raw) : [];

  let csv = 'ID,Nome,Email,Provedor,Plano,Status,Criado em,Ultimo Login\n';
  for (const uid of index) {
    const uRaw = await env.USERS.get(`user:${uid}`);
    if (!uRaw) continue;
    const u = JSON.parse(uRaw);
    const esc = (s) => '"' + (s || '').replace(/"/g, '""') + '"';
    csv += `${esc(u.id)},${esc(u.name)},${esc(u.email)},${esc(u.provider)},${esc(u.plan || 'free')},${esc(u.status || 'active')},${esc(u.createdAt)},${esc(u.lastLogin)}\n`;
  }

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="usuarios.csv"',
      ...CORS_HEADERS,
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// MAIN FETCH HANDLER
// ═══════════════════════════════════════════════════════════════

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (e) {
      return json({ ok: false, error: 'Erro interno do servidor: ' + e.message }, 500);
    }
  }
};

async function handleRequest(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // ═══════════════════════════════════════════
    // AUTH ENDPOINTS
    // ═══════════════════════════════════════════

    if (path === '/api/auth/register' && method === 'POST') return handleRegister(request, env);
    if (path === '/api/auth/login' && method === 'POST') return handleLogin(request, env);
    if (path === '/api/auth/forgot' && method === 'POST') return handleForgot(request, env);
    if (path === '/api/auth/google' && method === 'POST') return handleGoogleAuth(request, env);
    if (path === '/api/auth/facebook' && method === 'POST') return handleFacebookAuth(request, env);

    // SYNC ENDPOINTS
    if (path === '/api/user/sync' && method === 'GET') return handleSyncGet(request, env);
    if (path === '/api/user/sync' && method === 'POST') return handleSyncPost(request, env);

    // ═══════════════════════════════════════════
    // ADMIN ENDPOINTS
    // ═══════════════════════════════════════════

    if (path === '/api/admin/stats' && method === 'GET') return handleAdminStats(request, env);
    if (path === '/api/admin/users' && method === 'GET') return handleAdminUsers(request, env);
    if (path === '/api/admin/users/export' && method === 'GET') return handleAdminExport(request, env);
    if (path === '/api/admin/plans' && method === 'GET') return handleAdminGetPlans(request, env);
    if (path === '/api/admin/plans' && method === 'PUT') return handleAdminUpdatePlans(request, env);

    // Admin user detail/actions
    const adminUserMatch = path.match(/^\/api\/admin\/users\/([^/]+)$/);
    if (adminUserMatch && method === 'GET') return handleAdminUserDetail(request, env, adminUserMatch[1]);

    const adminPlanMatch = path.match(/^\/api\/admin\/users\/([^/]+)\/plan$/);
    if (adminPlanMatch && method === 'PUT') return handleAdminUpdatePlan(request, env, adminPlanMatch[1]);

    const adminStatusMatch = path.match(/^\/api\/admin\/users\/([^/]+)\/status$/);
    if (adminStatusMatch && method === 'PUT') return handleAdminUpdateStatus(request, env, adminStatusMatch[1]);

    // ═══════════════════════════════════════════
    // PROXY ENDPOINTS (Anthropic + Trello)
    // ═══════════════════════════════════════════

    if (path === '/api/anthropic' && method === 'POST') {
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

    // v5.2.0: Trello auth URL — returns OAuth URL with server-side key
    if (path === '/api/trello/auth-url' && method === 'GET') {
      const tkey = env.TRELLO_APP_KEY;
      if (!tkey) return err('TRELLO_APP_KEY not configured', 500);
      const returnUrl = url.searchParams.get('return_url') || 'https://guandahouse.github.io/roteiro-lavanderia';
      const authUrl = `https://trello.com/1/authorize?expiration=never&name=Roteiro+de+Coleta&scope=read&response_type=token&key=${tkey}&return_url=${encodeURIComponent(returnUrl + '?trello_auth=1')}`;
      return json({ ok: true, authUrl, key: tkey });
    }

    if (path === '/api/trello' && method === 'POST') {
      try {
        const body = await request.json();
        const tkey = body.key || env.TRELLO_APP_KEY;
        const ep = body.endpoint?.startsWith('/1') ? body.endpoint : '/1' + body.endpoint;
        const trelloUrl = body.url
          ? body.url
          : `https://api.trello.com${ep}${ep.includes('?') ? '&' : '?'}key=${tkey}&token=${body.token}`;
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

    // POST /api/route/publish
    if (path === '/api/route/publish' && method === 'POST') {
      try {
        const body = await request.json();
        const { routeId, clients, order, cfg, date } = body;
        if (!routeId || !clients || !order) return err('Missing routeId, clients, or order');

        const route = {
          routeId, clients, order,
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

    // GET /api/route/:id
    const loadMatch = path.match(/^\/api\/route\/([^/]+)$/);
    if (loadMatch && method === 'GET') {
      const id = loadMatch[1] === 'latest' ? await KV.get('route:latest') : loadMatch[1];
      if (!id) return err('No route found', 404);
      const raw = await KV.get('route:' + id);
      if (!raw) return err('Route not found', 404);
      return json(JSON.parse(raw));
    }

    // GET /api/route/:id/poll
    const pollMatch = path.match(/^\/api\/route\/([^/]+)\/poll$/);
    if (pollMatch && method === 'GET') {
      const id = pollMatch[1] === 'latest' ? await KV.get('route:latest') : pollMatch[1];
      if (!id) return err('No route', 404);
      const raw = await KV.get('route:' + id);
      if (!raw) return err('Route not found', 404);
      const route = JSON.parse(raw);
      return json({ version: route.version, hash: route._hash, updatedAt: route.updatedAt });
    }

    // PUT /api/route/:id/status
    if (path.match(/^\/api\/route\/[^/]+\/status$/) && method === 'PUT') {
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

    // POST /api/route/:id/client
    if (path.match(/^\/api\/route\/[^/]+\/client$/) && method === 'POST') {
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
    // FALLBACK — serve arquivos estáticos
    // ═══════════════════════════════════════════
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response('Not found', { status: 404, headers: CORS_HEADERS });
}
