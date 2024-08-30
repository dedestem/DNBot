// Dynamische import voor node-fetch
let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();

// Config & Secrets
const { Uptimerobot_ReadKey } = require('../Config.json');
const ApiUrl = 'https://api.uptimerobot.com/v2/getMonitors';

// Request Headers
const data = new URLSearchParams({
    'api_key': Uptimerobot_ReadKey,
    'format': 'json'
});

// Main API Code
async function getMonitors() {
    try {
        // Zorg ervoor dat fetch correct is geïmporteerd
        while (!fetch) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Maak de API-aanroep
        const response = await fetch(ApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        });

        // Controleer of de aanvraag succesvol was
        if (response.ok) {
            // Parse de JSON-respons
            const monitors = await response.json();

            // Controleer of de API-aanroep succesvol was
            if (monitors.stat === 'ok') {
                return monitors.monitors;
            } else {
                console.error(`Error: ${monitors.error.message}`);
                return null;
            }
        } else {
            console.error(`Failed to connect to Uptime Robot API: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        return null;
    }
}

// Processor
module.exports = {
    async GetMonitors() {
        const monitors = await getMonitors();
        
        if (monitors) {
            console.log("Monitors Information:\n");
            monitors.forEach(monitor => {
                console.log(`ID: ${monitor.id}`);
                console.log(`Name: ${monitor.friendly_name}`);
                console.log(`Status: ${monitor.status}`);
                console.log(`Uptime Ratio: ${monitor.uptime_ratio}`);
                console.log(`Type: ${monitor.type}`);
                console.log(`URL/IP: ${monitor.url}\n`);
            });
            return monitors;
        } else {
            console.warn("No Uptime Robot monitors found or an error occurred.");
            return null;
        }
    }
};
