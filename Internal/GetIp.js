const os = require('os');
const https = require('https');

module.exports = {
    // Function to get the internal (local) IP
    getInternalIP() {
        const networkInterfaces = os.networkInterfaces();
        for (const interfaceName in networkInterfaces) {
            const interfaces = networkInterfaces[interfaceName];
            for (const i of interfaces) {
                // Check for IPv4 address and exclude internal loopback address
                if (i.family === 'IPv4' && !i.internal) {
                    return i.address;
                }
            }
        }
        return 'Internal IP not found';
    },

    // Function to get the external (public) IP
    getExternalIP() {
        return new Promise((resolve, reject) => {
            https.get('https://api.ipify.org?format=json', (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        resolve(parsedData.ip);
                    } catch (e) {
                        reject('Error parsing external IP response');
                    }
                });
            }).on('error', (err) => {
                reject('Error fetching external IP: ' + err.message);
            });
        });
    }
}