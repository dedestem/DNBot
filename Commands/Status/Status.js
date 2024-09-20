const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const path = require('path');
const currentDirectory = __dirname;
const filePath = path.join(currentDirectory, '..', '..', 'Internal', 'Uptimerobot.js');
const { GetMonitors } = require(filePath);

module.exports = {
    // Config
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription("Gives the DNServices status"),

    // Code
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const monitors = await GetMonitors();

            console.log(monitors);
            
            if (!monitors || monitors.length === 0) {
                await interaction.editReply('Er zijn geen monitors gevonden of er is een fout opgetreden.');
                return;
            }

            // Maak de embed
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('DNServices Status')
                .setTimestamp()
                .setFooter({ text: 'Uptime robot', iconURL: 'https://davidnet.net/Assets/Logos/Logo4.png' });

            // Voeg elke monitor toe aan de embed
            monitors.forEach(monitor => {
                const status = monitor.status === 2 ? '✅ Online' : '❌ Offline'; // Status 2 betekent online in Uptime Robot
                embed.addFields([
                    { name: monitor.friendly_name, value: `${status}\nURL: ${monitor.url}`, inline: false }
                ]);
            });

            // Stuur de embed als antwoord
            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(`An error occurred: ${error.message}`);
            await interaction.editReply('Er is een fout opgetreden bij het ophalen van de status.');
        }
    },
};
