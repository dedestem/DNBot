const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	// Config
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears all messages in the current channel'),

	// Code
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const channel = interaction.channel;
		const messages = await channel.messages.fetch();

		await channel.bulkDelete(messages);
		await interaction.editReply('Channel cleared!');
	},
};
