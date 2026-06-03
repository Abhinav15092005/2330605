const express = require('express');
const { Log } = require('../logging_middleware/logger');

const app = express();
app.use(express.json());

app.get('/api/health', async (req, res) => {
    await Log('backend', 'info', 'handler', 'Health check called');
    res.json({ status: 'OK', message: 'Server running' });
});

app.post('/api/notifications', async (req, res) => {
    await Log('backend', 'info', 'handler', 'Notification created');
    res.json({ status: 'success', data: req.body });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    Log('backend', 'info', 'utils', `Server started on port ${PORT}`);
});