const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Y-WebSocket Server Running\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    const room = req.url.slice(1) || 'default';
    ws.room = room;
    console.log(`[${new Date().toISOString()}] Client connected to room: ${room}`);

    ws.on('message', (message) => {
        // Broadcast to all clients in the same room
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN && client.room === ws.room) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log(`[${new Date().toISOString()}] Client disconnected from room: ${room}`);
    });
});

const PORT = 10000;
server.listen(PORT, () => {
    console.log(`\n✅ Y-WebSocket server is running on port ${PORT}`);
    console.log(`   Clients can connect to: ws://localhost:${PORT}/[room-name]\n`);
});
