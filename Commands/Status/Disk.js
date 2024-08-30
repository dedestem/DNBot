// Get config
const path = require('path');
const currentDirectory = __dirname;
const filePath = path.join(currentDirectory, '..', '..', 'Config.json');
console.log(filePath);

// Secrets & Config
const { LastStartUTC } = require(filePath);

// Discord JS
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

// System information
const si = require('systeminformation');

// Format function
async function formatDiskUsage() {
    try {
        // Get disk stats
        const disk = await si.fsSize();
        
        // Assuming you want to use the first disk
        const diskInfo = disk[0];

        const totalDiskSpace = (diskInfo.size / (1024 * 1024 * 1024)).toFixed(2); // in GB
        const usedDiskSpace = (diskInfo.used / (1024 * 1024 * 1024)).toFixed(2); // in GB
        const freeDiskSpace = (diskInfo.available / (1024 * 1024 * 1024)).toFixed(2); // in GB

        return {
            totalDiskSpace,
            usedDiskSpace,
            freeDiskSpace
        };
    } catch (error) {
        console.error('Error fetching disk stats:', error);
        return {
            totalDiskSpace: 'Unknown',
            usedDiskSpace: 'Unknown',
            freeDiskSpace: 'Unknown'
        };
    }
}

// Main
module.exports = {
    // Config
    data: new SlashCommandBuilder()
        .setName('disk')
        .setDescription("Shows the disk usage of the server"),

    // Code
    async execute(interaction) {
        await interaction.deferReply();

        // Get disk usage
        const { totalDiskSpace, usedDiskSpace, freeDiskSpace } = await formatDiskUsage();

        // Maak de embed
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Disk Usage Status')
            .setTimestamp()
            .setFooter({ text: 'github.com/dedestem/DNBot', iconURL: 'https://davidnet.net/Assets/Logos/Logo4.png' });

        embed.addFields([
            { name: "Total Disk Space", value: `${totalDiskSpace} GB`, inline: false },
            { name: "Used Disk Space", value: `${usedDiskSpace} GB`, inline: false },
            { name: "Free Disk Space", value: `${freeDiskSpace} GB`, inline: false }
        ]);

        // Stuur de embed als antwoord
        await interaction.editReply({ embeds: [embed] });
    },
};
