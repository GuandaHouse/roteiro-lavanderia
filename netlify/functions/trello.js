exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { endpoint, key, token } = JSON.parse(event.body);

    if (!endpoint || !key || !token) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'endpoint, key e token sao obrigatorios' }) };
    }

    // Monta a URL da API do Trello
    const sep = endpoint.includes('?') ? '&' : '?';
    const url = `https://api.trello.com/1${endpoint}${sep}key=${key}&token=${token}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `Trello retornou ${response.status}: ${errorText}` })
      };
    }

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno: ' + err.message })
    };
  }
};