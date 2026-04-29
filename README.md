# Naviguide — Travel Habit Tracker

A local web app that tracks your travel habits, reads your calendar, and uses Claude AI to suggest optimized routes and nearby places.

## Setup (2 minutes)

### Option A — VS Code Live Server (recommended)
1. Open this folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. The app opens at `http://127.0.0.1:5500`

### Option B — Python (no extensions needed)
```bash
cd wayfarer
python3 -m http.server 3000
```
Then open `http://localhost:3000`

### Option C — Node
```bash
npx serve .
```

---

## Add your Claude API key (for AI features)

1. Go to [console.anthropic.com](https://console.anthropic.com) and create an API key
2. Click the status indicator in the bottom-left of the app
3. Paste your key and click Save

Your key is stored in your browser's localStorage — never sent anywhere except Anthropic's API.

---

## What the app does

| Tab | Description |
|-----|-------------|
| **Today** | Shows your calendar events with departure times and an AI-optimized route suggestion |
| **Log Trip** | Manually log trips (from, to, duration, mode, purpose). AI can suggest what to log. |
| **Habits** | Visualizes your frequent routes, busiest days, and transport modes. AI analyzes patterns. |
| **Discover** | Recommends nearby places that fit your routes and schedule |

---

## Connecting real data (next steps)

### Google Calendar
Replace the seed events in `src/data/store.js` with a real Google Calendar API call:
```
GET https://www.googleapis.com/calendar/v3/calendars/primary/events
Authorization: Bearer YOUR_OAUTH_TOKEN
```

### Google Maps routing
Add real travel time estimates by calling:
```
GET https://maps.googleapis.com/maps/api/directions/json
?origin=Home&destination=Capitol+Hill,Seattle&key=YOUR_KEY
```

### Location auto-detection
Use the browser Geolocation API to log trips automatically:
```javascript
navigator.geolocation.watchPosition(pos => {
  // log position changes, detect when you've arrived somewhere
});
```

---

## File structure

```
wayfarer/
├── index.html              # Entry point
├── src/
│   ├── app.js              # Nav, Claude API calls, key management
│   ├── data/
│   │   └── store.js        # Trip data, stats, seed calendar events
│   ├── components/
│   │   ├── today.js        # Today tab
│   │   ├── log.js          # Log trip tab
│   │   ├── habits.js       # Habits tab
│   │   └── discover.js     # Discover tab
│   └── styles/
│       └── main.css        # All styles
└── README.md
```
