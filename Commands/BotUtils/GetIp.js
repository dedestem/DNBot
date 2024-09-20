const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const path = require('path');
const currentDirectory = __dirname;

const { getInternalIP, getExternalIP } = require(path.join(currentDirectory, '..', '..', 'Internal', 'GetIp.js'));

module.exports = {
	// Config
	data: new SlashCommandBuilder()
		.setName('ip')
		.setDescription("Returns the server's ip"),

	// Code
	async execute(interaction) {
		await interaction.deferReply();

        // Get the IPs asynchronously
        const externalIP = await getExternalIP();
        const internalIP = await getInternalIP();

        // Create the embed
        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("Server 1 IP's")
        .setTimestamp()
        .setFooter({ text: 'Server 1', iconURL: 'https://davidnet.net/Assets/Logos/Logo4.png' });

        // Add the ip's
        embed.addFields([
            { name: "External IP: ", value: externalIP, inline: false },
            { name: "Internal IP: ", value: internalIP, inline: false }
        ]);

        await interaction.editReply({ embeds: [embed] });
	},
};
