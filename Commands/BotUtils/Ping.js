const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	// Config
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription("Calculate the bot's reaction time"),

	// Code
	async execute(interaction) {
		const startTime = Date.now();

		await interaction.deferReply();

		const endTime = Date.now();
		const ping = endTime - startTime;

		await interaction.editReply(`Ponged in ${ping} ms!`);
	},
};
