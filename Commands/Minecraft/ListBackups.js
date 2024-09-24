const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
	// Command configuration
	data: new SlashCommandBuilder()
		.setName('listmcbackups')
		.setDescription('Lists all the backups'),

	// Command execution code
	async execute(interaction) {
		// Resolve the path to the Backups folder
		const backupsPath = path.join(os.homedir(), 'Desktop', 'DNBackend', 'MC', 'Backups');

		// Defer reply to handle long operations
		await interaction.deferReply();

		// Read the directory contents asynchronously
		fs.readdir(backupsPath, { withFileTypes: true }, async (err, files) => {
			if (err) {
				// Handle errors if the directory can't be read
				console.error(`Error reading directory: ${err}`);
				await interaction.editReply("Error reading the directory.");
				return;
			}

			// Filter to get only folder names
			const folders = files.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

			// If no folders found
			if (folders.length === 0) {
				await interaction.editReply("No folders found in the Backups directory.");
				return;
			}

			// Respond with the list of folder names
			await interaction.editReply(`Backups:\n${folders.join('\n')}`);
		});
	},
};
