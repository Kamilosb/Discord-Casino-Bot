const { ChatInputCommandInteraction } = require("discord.js")

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction, client) {
        if(!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName)
        if(!command) return interaction.reply({
            content: "This command is outdated.",
            ephemeral: true
        })

        if(command.developer && interaction.user.id !== "426739369341091840") {
            return interaction.reply({
                content: "Ta komenda jest dostępna tylko dla dewelopera",
                ephemeral: true
            })
        }

        command.execute(interaction, client)
    }
}