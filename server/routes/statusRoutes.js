const express = require("express");
const axios = require("axios");
const router = express.Router();
const puppeteer = require("puppeteer") ;

// Function to convert UTC time to IST by adding 5 hours and 30 minutes
const convertToIST = (utcDate) => {
  const date = new Date(utcDate);
  date.setHours(date.getHours() + 5);
  date.setMinutes(date.getMinutes() + 30);
  return date;
};

router.post("/check-status", async (req, res) => {
  const { organizations } = req.body;
  const status = {};
  const currentTime = new Date();

  // Convert current time to IST
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  const currentIST = new Date(currentTime.getTime() + istOffset);

  await Promise.all(
    organizations.map(async (org) => {
      // Check if the organization has maintenance windows and if it is currently in a maintenance window
      if (org.maintenanceWindows && Array.isArray(org.maintenanceWindows)) {
        const isUnderMaintenance = org.maintenanceWindows.some((window) => {
          const windowStartIST = new Date(window.start).getTime() + istOffset; // Convert to IST
          const windowEndIST = new Date(window.end).getTime() + istOffset; // Convert to IST

          // Compare with current time in IST
          return (
            currentIST.getTime() >= windowStartIST &&
            currentIST.getTime() <= windowEndIST
          );
        });

        if (isUnderMaintenance) {
          status[org._id] = "maintenance";
          return;
        }
      }
            status[org._id] = await checkStatusWithPuppeteer(org.url);
      
      // If not under maintenance, check the live status
    })
  );

  res.json(status);
});

let browserInstance = null;

// Initialize Puppeteer (Single Instance)
const initPuppeteer = async () => {
    if (!browserInstance) {
        browserInstance = await puppeteer.launch({ headless: true });
    }
    return browserInstance;
};

const checkStatusWithPuppeteer = async (url) => {
    try {
        const browser = await initPuppeteer();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 });
        // console.log(`${url} is up`);
        await page.close(); // Close only the page, not the browser
        return 'live';
    } catch (error) {
        // console.error(`${url} might be down:`, error.message);
        return 'down';
    }
};
module.exports = router;
