const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/check-status', async (req, res) => {
    const { organizations } = req.body;
    const status = {};

    const currentTime = new Date();

    await Promise.all(organizations.map(async (org) => {
        // Check if the organization has maintenance windows and if it is currently in a maintenance window
        if (org.maintenanceWindows && Array.isArray(org.maintenanceWindows)) {
            console.log("in check");
            const isUnderMaintenance = org.maintenanceWindows.some(window =>
                currentTime >= new Date(window.start) && currentTime <= new Date(window.end)
            );

            if (isUnderMaintenance) {
                console.log("setting maintainenece");
                status[org._id] = 'maintenance';
                return;
            }
        }
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
