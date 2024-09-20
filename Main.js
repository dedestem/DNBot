// Discord JS
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Node Componements
const fs = require('node:fs');
const path = require('node:path');

// Config & Secrets
const { token } = require('./Config.json');
client.commands = new Collection();

// Internal Modules
const { Init } = require("./Internal/OnStart.js");

// Collect Commands
const CommandsRootPath = path.join(__dirname, 'Commands');
const CommandFolders = fs.readdirSync(CommandsRootPath);

for (const folder of CommandFolders) {
	const commandsPath = path.join(CommandsRootPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Collect Events
const eventsPath = path.join(__dirname, 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Connect Events
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Start
console.log("Running");
Init();
console.log("Running bot");
client.login(token);
