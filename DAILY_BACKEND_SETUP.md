# Backend Daily.co Setup

## Environment Variable Required

Add this to your backend `.env` file (or Render environment variables):

```env
DAILY_API_KEY=789297481c0144ac8496d8a012c54b02bafc24c4c7c9ae0f941c4215b7a1fcc3
```

## Files Created

### 1. Daily.co Service
**Location:** `src/daily/daily.service.ts`

Handles:
- Room creation for each session
- Meeting token generation with owner/participant roles
- Automatic room expiration (2 hours)

### 2. Sessions Controller Update
**Location:** `src/sessions/sessions.controller.ts`

New endpoint: `GET /sessions/:id/daily-token`

Returns:
```json
{
  "roomUrl": "https://yourteam.daily.co/k12-session-xxx",
  "token": "eyJhbGc..."
}
```

## How It Works

1. **Tutor/Admin joins** → `isOwner: true` → Full meeting controls
2. **Student joins** → `isOwner: false` → Participant mode
3. **Room auto-expires** after 2 hours
4. **Each session** gets a unique room name

## Deployment Steps

1. Add `DAILY_API_KEY` to Render environment variables
2. Redeploy backend
3. Test session joining

**Ready to test once backend is redeployed!**
