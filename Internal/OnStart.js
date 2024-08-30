const fs = require('fs');
const path = require('path'); // Add this for path handling

// Resolve the absolute path to the config file
const filePath = path.resolve(__dirname, '../Config.json'); // Adjust the path if necessary

function UpdateBootVab() {
    // Update the lastboot vab
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        let jsonData = JSON.parse(data);
        jsonData.LastStartUTC = new Date().toISOString(); // Use the current date-time in ISO format

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Boot time successfully noted');
            }
        });
    });
}

module.exports = {
    Init() {
        UpdateBootVab();
    }
};
