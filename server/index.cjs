const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// In-memory session store (shared across all clients)
const sessions = {};

// Create a new session
app.post('/api/sessions', (req, res) => {
  const session = req.body;
  if (!session || !session.id) {
    return res.status(400).json({ error: 'Invalid session data' });
  }
  sessions[session.id] = session;
  res.status(201).json(session);
});

// Get a session by ID
app.get('/api/sessions/:id', (req, res) => {
  const session = sessions[req.params.id];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

// Update a session (join, start, save progress)
app.put('/api/sessions/:id', (req, res) => {
  const existing = sessions[req.params.id];
  if (!existing) {
    return res.status(404).json({ error: 'Session not found' });
  }
  const updated = req.body;
  sessions[req.params.id] = updated;
  res.json(updated);
});

app.listen(PORT, () => {
  console.log(`🚀 TidyBit Contest API running on http://localhost:${PORT}`);
});
