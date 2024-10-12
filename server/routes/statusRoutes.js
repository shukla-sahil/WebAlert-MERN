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

    // Get the current time in UTC and convert it to IST
    const currentTimeUTC = new Date();
    const currentTimeIST = convertToIST(currentTimeUTC);

    console.log("Current Time in IST:", currentTimeIST);

    await Promise.all(organizations.map(async (org) => {
        // Check if the organization has maintenance windows and if it is currently in a maintenance window
        if (org.maintenanceWindows && Array.isArray(org.maintenanceWindows)) {
            const isUnderMaintenance = org.maintenanceWindows.some(window => {
                // Convert both start and end times of the maintenance window to IST
                const maintenanceStartIST = convertToIST(window.start);
                const maintenanceEndIST = convertToIST(window.end);

                console.log("Maintenance Start in IST:", maintenanceStartIST);
                console.log("Maintenance End in IST:", maintenanceEndIST);

                return currentTimeIST >= maintenanceStartIST && currentTimeIST <= maintenanceEndIST;
            });

            if (isUnderMaintenance) {
                console.log("Setting status to maintenance for org:", org._id);
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
