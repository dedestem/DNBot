const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

module.exports = {
	// Command configuration
	data: new SlashCommandBuilder()
		.setName('loadmcbackup')
		.setDescription('Loads a specified Minecraft backup')
		.addStringOption(option =>
			option.setName('backup')
				.setDescription('The name of the backup to load')
				.setRequired(true)
		),

	// Command execution code
	async execute(interaction) {
		// Get the backup name from the user input
		const backupName = interaction.options.getString('backup');

		// Define the path to the latest_backup.txt and the stop batch file
		const backupsDir = path.join(os.homedir(), 'Desktop', 'DNBackend', 'MC', 'Backups');
        const MCDir = path.join(os.homedir(), 'Desktop', 'DNBackend', 'MC');
		const latestBackupPath = path.join(backupsDir, 'latest_backup.txt');
		const StopScript = path.join(MCDir, 'Stop.sh');
		const StartScript = path.join(MCDir, 'Start.sh'); // Assuming you have a batch file to load backups

		// Defer the reply while processing
		await interaction.deferReply();

		// Check if the provided backup folder exists
		const backupFolderPath = path.join(backupsDir, backupName);
		if (!fs.existsSync(backupFolderPath)) {
			await interaction.editReply(`Error: Backup folder "${backupName}" does not exist.`);
			return;
		}

		// Execute the stop batch file to stop the server
		exec(`"${StopScript}"`, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing STOP: ${error}`);
			interaction.followUp('Error stopping the server.');
			return;
		}
		
		// Log output from the stop batch
		console.log(`STOP output: ${stdout}`);
		console.error(`STOP error output: ${stderr}`);

		// Update latest_backup.txt with the provided backup name
		fs.writeFile(latestBackupPath, "Backups/"+backupName, async (err) => {
			if (err) {
				console.error(`Error writing to latest_backup.txt: ${err}`);
				await interaction.editReply('Error updating the latest backup.');
				return;
			}

				// After stopping, execute the load backup batch file
				exec(`"${StartScript}"`, (error, stdout, stderr) => {
					if (error) {
						console.error(`Error executing Start: ${error}`);
						interaction.followUp('Error loading the backup.');
						return;
					}

					// Log output from the load backup batch
					console.log(`START output: ${stdout}`);
					console.error(`START error output: ${stderr}`);

					// Successfully loaded the backup
					interaction.followUp(`Backup "${backupName}" has been loaded successfully. Try joining the server`);
				});
			});
		});
	},
};
