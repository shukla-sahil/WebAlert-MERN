const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/check-status', async (req, res) => {
    const { organizations } = req.body;
    const status = {};

    await Promise.all(organizations.map(async (org) => {
        try {
            await axios.get(org.url);
            status[org._id] = 'live';
        } catch {
            status[org._id] = 'down';
        }
    }));
    res.json(status);
});
module.exports = router;
