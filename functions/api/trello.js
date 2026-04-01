export async function onRequestPost({ request }) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const { endpoint, key, token } = await request.json();
    if (!endpoint || !key || !token) {
      return new Response(JSON.stringify({ error: 'endpoint, key e token obrigatorios' }), { status: 400, headers });
    }
    const sep = endpoint.includes('?') ? '&' : '?';
    const url = `https://api.trello.com/1${endpoint}${sep}key=${key}&token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) return new Response(JSON.stringify({ error: `Trello ${res.status}`, detail: data }), { status: res.status, headers });
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 200, headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }});
}
