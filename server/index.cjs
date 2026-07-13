const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file (for GEMINI_API_KEY)
// Using manual parsing to avoid adding dotenv as a dependency
const envPath = path.join(__dirname, '..', '.env');
try {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex > 0) {
          const key = trimmed.substring(0, eqIndex).trim();
          const value = trimmed.substring(eqIndex + 1).trim();
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    }
    console.log('📂 Loaded environment variables from .env');
  }
} catch (err) {
  console.warn('⚠️  Could not load .env file:', err.message);
}

const aiRoutes = require('./routes/aiRoutes.cjs');

const app = express();
const PORT = 3002;
const SESSIONS_FILE = path.join(__dirname, 'sessions.json');

// Memory store
let sessions = {};

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Request Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url} (from ${req.ip})`);
  next();
});

// AI Hint Assistant routes
app.use('/api', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    sessions: Object.keys(sessions).length,
    uptime: process.uptime()
  });
});

// Load sessions from disk on startup
try {
  if (fs.existsSync(SESSIONS_FILE)) {
    const data = fs.readFileSync(SESSIONS_FILE, 'utf8');
    if (data.trim()) {
      sessions = JSON.parse(data);
      console.log(`📦 LOADED: ${Object.keys(sessions).length} sessions from ${SESSIONS_FILE}`);
    }
  }
} catch (err) {
  console.error('❌ Failed to load sessions from disk:', err);
  sessions = {};
}

const saveToDisk = () => {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    console.log(`💾 SAVED: ${Object.keys(sessions).length} sessions to disk.`);
  } catch (err) {
    console.error('❌ DISK SAVE ERROR:', err);
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
  console.log(`📝 PUT /api/sessions/${id} (Update)`);

  if (!existing) {
    console.warn(`⚠️  UPDATE FAILED: Session ${id} not found`);
    return res.status(404).json({ error: 'Session not found' });
  }
  const updated = req.body;
  sessions[id] = updated;
  saveToDisk();
  res.json(updated);
});

// Clear all sessions (for debugging)
app.delete('/api/sessions', (req, res) => {
  sessions = {};
  saveToDisk();
  console.log('🧹 ALL SESSIONS CLEARED');
  res.json({ message: 'Success' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TidyBit Contest API running on port ${PORT}`);
  console.log(`👉 Local: http://localhost:${PORT}`);
  console.log(`📂 Persistence: ${SESSIONS_FILE}`);
});

server.on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please kill the other process or use a different port.`);
  }
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('☄️ Unhandled Rejection at:', promise, 'reason:', reason);
});
