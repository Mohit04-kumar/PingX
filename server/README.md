PingX Development Server

This lightweight server provides simple REST endpoints and a Socket.IO realtime socket for local development.

Run:

```bash
cd server
npm install
npm start
```

API endpoints:
- `GET /api/users?query=` — search registered demo users
- `POST /api/friend-request` — send friend request { senderId, receiverId }
- `POST /api/respond-request` — respond to a request { requestId, status }
- `GET /api/products?query=` — simple product search
- `POST /api/ai` — AI proxy (requires `VITE_GEMINI_API_KEY` in env)

Socket.IO:
- Connect to the server and `join` a room string; emit `send_message` with `{ room, message }` to broadcast to the room.

This server is intentionally minimal and for local development only.
