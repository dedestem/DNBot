// Discord JS
const { REST, Routes } = require('discord.js');

// Config & Secrets
const { clientId, guildId, token } = require('./Config.json');

// Node Components
const fs = require('node:fs');
const path = require('node:path');


// Main
const commands = [];

// Get all the commands in the folders
const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);


// Collect Commands
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Deploy Commands
const rest = new REST().setToken(token);
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
