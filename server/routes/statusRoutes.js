const express = require('express');
const axios = require('axios');
const router = express.Router();

// Function to convert UTC time to IST by adding 5 hours and 30 minutes
const convertToIST = (utcDate) => {
    const date = new Date(utcDate);
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    return date;
};

router.post('/check-status', async (req, res) => {
    const { organizations } = req.body;
    const status = {};
    const currentTime = new Date();

    // Convert current time to IST
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const currentIST = new Date(currentTime.getTime() + istOffset);

    await Promise.all(organizations.map(async (org) => {
        // Check if the organization has maintenance windows and if it is currently in a maintenance window
        if (org.maintenanceWindows && Array.isArray(org.maintenanceWindows)) {
            const isUnderMaintenance = org.maintenanceWindows.some(window => {
                const windowStartIST = new Date(window.start).getTime() + istOffset; // Convert to IST
                const windowEndIST = new Date(window.end).getTime() + istOffset; // Convert to IST

                // Compare with current time in IST
                return currentIST.getTime() >= windowStartIST && currentIST.getTime() <= windowEndIST;
            });

            if (isUnderMaintenance) {
                status[org._id] = 'maintenance';
                return;
            }
        }

        // If not under maintenance, check the live status
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
