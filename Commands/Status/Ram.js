// Get config
const path = require('path');
const currentDirectory = __dirname;
const filePath = path.join(currentDirectory, '..', '..', 'Config.json');
console.log(filePath);

// Secrets & Config
const { } = require(filePath);

// Discord JS
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

// System information
const si = require('systeminformation');

// Format function
async function formatMemoryUsage() {
    try {
        // Get system memory stats
        const memory = await si.mem();
        
        const totalMemory = (memory.total / (1024 * 1024 * 1024)).toFixed(2); // in GB
        const usedMemory = (memory.active / (1024 * 1024 * 1024)).toFixed(2); // in GB

        return {
            totalMemory,
            usedMemory
        };
    } catch (error) {
        console.error('Error fetching memory stats:', error);
        return {
            totalMemory: 'Unknown',
            usedMemory: 'Unknown'
        };
    }
}

// Main
module.exports = {
    // Config
    data: new SlashCommandBuilder()
        .setName('ram')
        .setDescription("Shows the RAM usage of the selfhosted server 1"),

    // Code
    async execute(interaction) {
        await interaction.deferReply();

        // Get memory usage
        const { totalMemory, usedMemory } = await formatMemoryUsage();

        // Maak de embed
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('RAM Usage Status')
            .setTimestamp()
            .setFooter({ text: 'Selfhosted Server #1', iconURL: 'https://davidnet.net/Assets/Logos/Logo4.png' });

        embed.addFields([
            { name: "Total Memory", value: `${totalMemory} GB`, inline: false },
            { name: "Used Memory", value: `${usedMemory} GB`, inline: false }
        ]);

        // Stuur de embed als antwoord
        await interaction.editReply({ embeds: [embed] });
    },
};
