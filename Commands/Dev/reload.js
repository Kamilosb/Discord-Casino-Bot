const { ChatInputCommandInteraction, SlashCommandBuilder, Client } = require("discord.js")
const { loadCommands } = require("../../Handlers/commandHandler")
const { loadEvents } = require("../../Handlers/eventHandler")

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloaduje bota.")
    .addSubcommand((options) => options
    .setName("events")
    .setDescription("Reloaduje eventy"))
    .addSubcommand((options) => options
    .setName("commands")
    .setDescription("Reloaduje komendy")),
    /**
     * 
     * @param { ChatInputCommandInteraction } interacion 
     * @param { Client } client 
     */
    execute(interacion, client) {
        const subCommand = interacion.options.getSubcommand();

        switch(subCommand) {
            case "events" : {
                for(const [key, value] of client.events)
                client.removeListener(`${key}`, value, true);
                loadEvents(client)
                interacion.reply({content: "Reloaded events", ephemeral: true})
            }
            break
            case "commands" : {
                loadCommands(client)
                interacion.reply({content: "Reloaded commands", ephemeral: true})
            }
            break
        }
    }
}