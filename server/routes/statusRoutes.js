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
            console.log("in check for org:", org._id);

            // Log current time and each window's start/end times
            console.log("Current time:", currentTime);

            org.maintenanceWindows.forEach(window => {
                console.log("Checking window:", {
                    start: window.start,
                    end: window.end,
                    parsedStart: new Date(window.start),
                    parsedEnd: new Date(window.end)
                });
            });

            const isUnderMaintenance = org.maintenanceWindows.some(window =>
                currentTime >= new Date(window.start) && currentTime <= new Date(window.end)
            );

            if (isUnderMaintenance) {
                console.log("setting maintenance for org:", org._id);
                status[org._id] = 'maintenance';
                return;
            }
        }

        // Check live status if not under maintenance
        try {
            console.log(`Checking live status for org: ${org._id}`);
            await axios.get(org.url);
            status[org._id] = 'live';
        } catch (error) {
            console.error(`Error checking status for org ${org._id}:`, error.message);
            status[org._id] = 'down';
        }
    }));

    res.json(status);
});

module.exports = router;
