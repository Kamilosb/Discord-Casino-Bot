const { SlashCommandBuilder } = require("discord.js")
const Database = require("../../Schemas/levels")

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup serwera pod poziomy"),
    async execute(interaction) {
        const guildId = interaction.guild.id

        // /console.log(member.user.username)
        const members = await interaction.guild.members.fetch({cache : true});
        console.log(members)
        await members.forEach(member => addToDataBase(member))
        async function addToDataBase(member) {
            if(member.user.bot) return
            if (!(await Database.findOne({User: member.user.id}) && Database.findOne({GuildId: guildId}))) {
                Database.create({ UserName: member.user.username, User: member.user.id, Exp: 0, GuildId: guildId, MessageCount: 0})
                console.log(`Nie ma w bazie ${member.user.username}`)
            } else return
        }
        // userData = await Database.create({ UserName: target.username, User: target.id, Exp: 0, GuildId: guildId}
        interaction.reply({
            content: "Setup serwera ukończony poprawnie",
            ephemeral: true
        })
    }
}