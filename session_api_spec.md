# Backend Session API Specification

This document outlines the API endpoints needed to support advanced session features (chat, recording) when ready.

---

## Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| Video Conferencing | ✅ Working | Uses Jitsi Meet (no backend needed) |
| Whiteboard | ✅ Working | Excalidraw (client-side) |
| Session Chat | ❌ Hidden | Requires backend implementation |
| Recording Upload | ❌ Hidden | Requires backend implementation |

---

## Required Endpoints

### 1. Session Messages (Chat)

**GET `/sessions/:id/messages`**
- **Auth**: Bearer token (student/tutor)
- **Response**: 
```json
[
  {
    "id": "uuid",
    "from": "John Doe",
    "text": "Hello!",
    "created_at": "2025-01-01T10:00:00Z"
  }
]
```

**POST `/sessions/:id/messages`**
- **Auth**: Bearer token (student/tutor)
- **Body**: `{ "text": "Hello!" }`
- **Response**: Created message object

---

### 2. Session Recordings

**POST `/sessions/:id/recordings`**
- **Auth**: Bearer token (tutor only)
- **Content-Type**: `multipart/form-data`
- **Body**: `{ "file": <binary> }`
- **Response**: `{ "id": "uuid", "url": "https://..." }`

**GET `/sessions/:id/recordings`**
- **Auth**: Bearer token (student/tutor)
- **Response**: Array of recording objects

---

## Database Schema Additions

### SessionMessage Table
```sql
CREATE TABLE session_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES bookings(id),
    user_id UUID NOT NULL REFERENCES users(id),
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### SessionRecording Table
```sql
CREATE TABLE session_recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES bookings(id),
    uploaded_by UUID NOT NULL REFERENCES users(id),
    file_url TEXT NOT NULL,
    file_size_bytes INTEGER,
    duration_seconds INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Implementation Priority

1. **Session Messages** - Enables in-session chat (low complexity)
2. **Session Recordings** - Requires file storage (S3/Cloudinary)

> **Note**: Until these are implemented, Jitsi's built-in chat is available via the toolbar.
