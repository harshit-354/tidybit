const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;
const path = require('path');
const fs = require('fs');
const SESSIONS_FILE = path.join(__dirname, 'sessions.json');

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    sessions: Object.keys(sessions).length,
    uptime: process.uptime()
  });
});

// Load sessions from disk on startup
let sessions = {};
try {
  if (fs.existsSync(SESSIONS_FILE)) {
    sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
    console.log(`📦 Loaded ${Object.keys(sessions).length} existing sessions from disk.`);
  }
} catch (err) {
  console.error('Failed to load sessions:', err);
}

const saveToDisk = () => {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    console.log(`💾 Sessions persistent to: ${SESSIONS_FILE}`);
  } catch (err) {
    console.error('❌ Failed to save sessions to disk:', err);
  }
};

// Create a new session
app.post('/api/sessions', (req, res) => {
  const session = req.body;
  if (!session || !session.id) {
    console.error('❌ Failed to create session: Missing ID');
    return res.status(400).json({ error: 'Invalid session data' });
  }
  const id = session.id.toLowerCase();
  sessions[id] = session;
  saveToDisk();
  console.log(`✅ Session Created: ${id} ("${session.title}")`);
  res.status(201).json(session);
});

// Get a session by ID
app.get('/api/sessions/:id', (req, res) => {
  const id = req.params.id.toLowerCase();
  const session = sessions[id];
  if (!session) {
    console.warn(`🔍 Session Lookup Failed: ${id} (Not Found)`);
    return res.status(404).json({ error: 'Session not found' });
  }
  console.log(`📡 Session Lookup Success: ${id}`);
  res.json(session);
});

// Update a session (join, start, save progress)
app.put('/api/sessions/:id', (req, res) => {
  const id = req.params.id.toLowerCase();
  const existing = sessions[id];
  if (!existing) {
    console.warn(`⚠️ Attempted update on missing session: ${id}`);
    return res.status(404).json({ error: 'Session not found' });
  }
  const updated = req.body;
  sessions[id] = updated;
  saveToDisk();
  console.log(`📝 Session Updated: ${id} (Status: ${updated.status})`);
  res.json(updated);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TidyBit Contest API running on port ${PORT}`);
  console.log(`👉 Access via Local: http://localhost:${PORT}`);
});
