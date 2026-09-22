const fs = require('fs');
(async () => {
  const API = process.env.API || 'http://localhost:4001';
  const fetch = global.fetch;
  const out = { steps: [] };

  try {
    // Login as receiver (user_2) to get token
    const loginRes = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: 'user_2' })
    });
    const loginJson = await loginRes.json();
    out.steps.push({ step: 'login', result: loginJson });
    const token2 = loginJson.token;

    // Send friend request from user_1 -> user_2
    const frRes = await fetch(`${API}/api/friend-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: 'user_1', receiverId: 'user_2' })
    });
    const frJson = await frRes.json();
    out.steps.push({ step: 'friend-request', result: frJson });
    const reqId = frJson.request?.id;

    // Respond to request (accept) and expect server to create chat
    const respRes = await fetch(`${API}/api/respond-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: reqId, status: 'accepted' })
    });
    const respJson = await respRes.json();
    out.steps.push({ step: 'respond-request', result: respJson });

    // List chats for user_2
    const listRes = await fetch(`${API}/api/chats`, {
      headers: { Authorization: `Bearer ${token2}` }
    });
    const listJson = await listRes.json();
    out.steps.push({ step: 'list-chats', result: listJson });

    fs.writeFileSync('./test_result.json', JSON.stringify(out, null, 2));
    console.log('wrote test_result.json');
  } catch (e) {
    out.error = String(e);
    try { fs.writeFileSync('./test_result.json', JSON.stringify(out, null, 2)); } catch {}
    console.error('test flow error', e);
  }
})();
