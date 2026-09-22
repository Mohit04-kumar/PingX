const data = require('./data');
console.log('initial chats:', data.chats.map(c=>c.id));
const req = { id: `req_${Date.now()}`, senderId: 'user_1', receiverId: 'user_2', status: 'pending', createdAt: new Date().toISOString() };
data.friendRequests.push(req);
console.log('friendRequests now:', data.friendRequests.map(r=>r.id));
const created = data.createChat({ participants: [req.senderId, req.receiverId], type: 'direct', messages: [] });
console.log('created chat id:', created.id);
console.log('chats now:', data.chats.map(c=>c.id));
