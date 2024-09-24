const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
	// Command configuration
	data: new SlashCommandBuilder()
		.setName('lastmcbackup')
		.setDescription('Tells the latestbackup.txt'),

	// Command execution code
	async execute(interaction) {
		// Path to the file you want to read
        const filePath = path.join(os.homedir(), 'Desktop/DNBackend/MC/Backups/latest_backup.txt');

		// Defer the reply to give time for file reading
		await interaction.deferReply();

		// Read the file asynchronously
		fs.readFile(filePath, 'utf8', async (err, data) => {
			if (err) {
				// Handle file read errors
				console.error(`Error reading file: ${err}`);
				await interaction.editReply("Error reading the file.");
				return;
			}

			// Send the file content in the reply
			await interaction.editReply(`File contents:\n\`\`\`${data}\`\`\``);
		});
	},
};
