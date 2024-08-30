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

// Format function
function formatUTCDate(utcTimestamp) {
    // Create a new Date object from the UTC timestamp
    const date = new Date(utcTimestamp);

    // Define options for formatting the date
    const options = {
        weekday: 'long',    // e.g., 'Friday'
        year: 'numeric',    // e.g., '2024'
        month: 'long',      // e.g., 'August'
        day: 'numeric',     // e.g., '30'
        hour: '2-digit',    // e.g., '07 AM'
        minute: '2-digit',  // e.g., '19'
        second: '2-digit',  // e.g., '23'
        timeZoneName: 'short' // e.g., 'UTC'
    };

    // Format the date using Intl.DateTimeFormat
    return date.toLocaleDateString('en-US', options) + ' ' +
           date.toLocaleTimeString('en-US', options);
}


// Main
module.exports = {
    // Config
    data: new SlashCommandBuilder()
        .setName('botstatus')
        .setDescription("Gives the DNBot status"),

    // Code
    async execute(interaction) {
        await interaction.deferReply();

        // Maak de embed
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('DNBot Status')
            .setTimestamp()
            .setFooter({ text: 'Uptime robot', iconURL: 'https://davidnet.net/Assets/Logos/Logo4.png' });

        embed.addFields([
            { name: "Bot", value: `✅ Online`, inline: false }
        ]);

        const utcTimestamp = formatUTCDate(LastStartUTC);
        console.log(utcTimestamp);

        embed.addFields([
            { name: "Last reboot", value: utcTimestamp, inline: false }
        ]);

        // Stuur de embed als antwoord
        await interaction.editReply({ embeds: [embed] });
    },
};
