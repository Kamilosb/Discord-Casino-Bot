const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Odpowiada 'pong'"),
    execute(interaction) {
        interaction.reply({
            content: "Pong!",
            ephermal: true
        })
    }
}