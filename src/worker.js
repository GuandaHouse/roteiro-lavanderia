export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const CORS = {'Access-Control-Allow-Origin':'*','Content-Type':'application/json'};
    if (request.method === 'OPTIONS') return new Response(null,{status:200,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
    if (url.pathname === '/api/trello' && request.method === 'POST') {
      try {
        const {endpoint,key,token} = await request.json();
        if (!endpoint||!key||!token) return new Response(JSON.stringify({error:'missing params'}),{status:400,headers:CORS});
        const sep = endpoint.includes('?')?'&':'?';
        const res = await fetch('https://api.trello.com/1'+endpoint+sep+'key='+key+'&token='+token);
        return new Response(JSON.stringify(await res.json()),{status:res.status,headers:CORS});
      } catch(e){return new Response(JSON.stringify({error:e.message}),{status:500,headers:CORS});}
    }
    if (url.pathname === '/api/anthropic' && request.method === 'POST') {
      try {
        const {apiKey,body} = await request.json();
        if (!apiKey||!body) return new Response(JSON.stringify({error:'missing params'}),{status:400,headers:CORS});
        const res = await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},body:JSON.stringify(body)});
        return new Response(JSON.stringify(await res.json()),{status:res.status,headers:CORS});
      } catch(e){return new Response(JSON.stringify({error:e.message}),{status:500,headers:CORS});}
    }
    return env.ASSETS.fetch(request);
  }
};