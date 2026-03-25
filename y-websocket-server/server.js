const WebSocket = require('ws');
const http = require('http');
const Y = require('yjs');
const lib0 = require('lib0');
const encoding = lib0.encoding;
const decoding = lib0.decoding;
const syncProtocol = require('y-protocols/sync');
const awarenessProtocol = require('y-protocols/awareness');

// Message types matching y-websocket client
const messageSync = 0;
const messageAwareness = 1;

// In-memory store of Y.Doc per room
const docs = new Map();

/**
 * Get or create a Y.Doc for a given room name.
 */
function getYDoc(roomName) {
    if (docs.has(roomName)) return docs.get(roomName);
    
    const doc = new Y.Doc();
    doc.name = roomName;
    doc.conns = new Map(); // Map<WebSocket, Set<number>> (conn -> awareness client ids)
    doc.awareness = new awarenessProtocol.Awareness(doc);
    
    doc.awareness.setLocalState(null);
    
    // Listen for awareness changes and broadcast
    doc.awareness.on('update', ({ added, updated, removed }, conn) => {
        const changedClients = added.concat(updated, removed);
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, messageAwareness);
        encoding.writeVarUint8Array(encoder, 
            awarenessProtocol.encodeAwarenessUpdate(doc.awareness, changedClients)
        );
        const message = encoding.toUint8Array(encoder);
        
        doc.conns.forEach((_, c) => {
            if (c.readyState === WebSocket.OPEN) {
                c.send(message);
            }
        });
    });
    
    docs.set(roomName, doc);
    console.log(`[${new Date().toISOString()}] Created new Y.Doc for room: ${roomName}`);
    return doc;
}

/**
 * Send sync step 1 to a newly connected client.
 */
function sendSyncStep1(doc, conn) {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, doc);
    const message = encoding.toUint8Array(encoder);
    if (conn.readyState === WebSocket.OPEN) {
        conn.send(message);
    }
}

/**
 * Handle an incoming message from a client.
 */
function handleMessage(conn, doc, message) {
    try {
        const uint8 = new Uint8Array(message);
        const decoder = decoding.createDecoder(uint8);
        const messageType = decoding.readVarUint(decoder);
        
        switch (messageType) {
            case messageSync: {
                const encoder = encoding.createEncoder();
                encoding.writeVarUint(encoder, messageSync);
                syncProtocol.readSyncMessage(decoder, encoder, doc, conn);
                
                // If the encoder has content (sync step 2 response), send it back
                if (encoding.length(encoder) > 1) {
                    const reply = encoding.toUint8Array(encoder);
                    if (conn.readyState === WebSocket.OPEN) {
                        conn.send(reply);
                    }
                }
                break;
            }
            case messageAwareness: {
                const update = decoding.readVarUint8Array(decoder);
                awarenessProtocol.applyAwarenessUpdate(doc.awareness, update, conn);
                break;
            }
            default:
                console.warn(`[Warn] Unknown message type: ${messageType}`);
        }
    } catch (err) {
        console.error('[Error] Failed to handle message:', err.message);
    }
}

/**
 * Broadcast a document update to all connected clients except the sender.
 */
function broadcastUpdate(doc, update, origin) {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeUpdate(encoder, update);
    const message = encoding.toUint8Array(encoder);
    
    doc.conns.forEach((_, conn) => {
        if (conn !== origin && conn.readyState === WebSocket.OPEN) {
            conn.send(message);
        }
    });
}

// ─── HTTP + WebSocket Server ─────────────────────────────────────────

const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Y-WebSocket Collaboration Server Running\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => {
    const roomName = req.url.slice(1) || 'default';
    const doc = getYDoc(roomName);
    
    // Track this connection
    doc.conns.set(conn, new Set());
    
    console.log(`[${new Date().toISOString()}] Client connected to room: ${roomName} (total: ${doc.conns.size})`);

    // Listen for document updates and broadcast to other clients
    const updateHandler = (update, origin) => {
        broadcastUpdate(doc, update, origin);
    };
    doc.on('update', updateHandler);

    // Handle incoming messages
    conn.on('message', (message) => {
        handleMessage(conn, doc, message);
    });

    // Handle disconnection
    conn.on('close', () => {
        const controlledIds = doc.conns.get(conn);
        doc.conns.delete(conn);
        doc.off('update', updateHandler);
        
        // Remove awareness states for this client
        if (controlledIds) {
            awarenessProtocol.removeAwarenessStates(doc.awareness, Array.from(controlledIds), null);
        }
        
        // Clean up empty rooms after a delay (keep for 5 min in case of reconnection)
        if (doc.conns.size === 0) {
            setTimeout(() => {
                if (doc.conns.size === 0) {
                    doc.destroy();
                    docs.delete(roomName);
                    console.log(`[${new Date().toISOString()}] Room destroyed (empty): ${roomName}`);
                }
            }, 300000); // 5 minutes
        }
        
        console.log(`[${new Date().toISOString()}] Client disconnected from room: ${roomName} (remaining: ${doc.conns.size})`);
    });

    // Send initial sync step 1 to the new client (sends existing document state)
    sendSyncStep1(doc, conn);
    
    // Send existing awareness states to new client
    const awarenessStates = doc.awareness.getStates();
    if (awarenessStates.size > 0) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, messageAwareness);
        encoding.writeVarUint8Array(encoder,
            awarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys()))
        );
        if (conn.readyState === WebSocket.OPEN) {
            conn.send(encoding.toUint8Array(encoder));
        }
    }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`\n✅ Y-WebSocket Collaboration Server running on port ${PORT}`);
    console.log(`   Rooms are created on-demand when clients connect.`);
    console.log(`   Connect via: ws://localhost:${PORT}/[room-name]\n`);
});
