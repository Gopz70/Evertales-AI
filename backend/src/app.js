const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const storyRoutes = require('./routes/storyRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const aiRoutes = require('./routes/aiRoutes');
const audioRoutes = require('./routes/audioRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => res.json({ message: 'EverTales AI API is running' }));

app.use('/api', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', aiRoutes);
app.use('/api/audio', audioRoutes);

// 404 fallback
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
