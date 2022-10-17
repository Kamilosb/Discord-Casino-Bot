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
            } else {
                return
            }
            
        }
        // userData = await Database.create({ UserName: target.username, User: target.id, Exp: 0, GuildId: guildId})

        interaction.reply({
            content: "Setup serwera ukończony poprawnie",
            ephemeral: true
        })
        // const embed = new EmbedBuilder().setColor("#4a72f5")
        // const usersArray = await Database.find({}, { UserName: 1, User: 1, Exp: 1, _id:0})
        // usersArray.sort(function(a, b){return b.Exp - a.Exp}); 
        // embed.setTitle("Użytkownicy serwera z największą ilością expa: ")
        // embed.setDescription("=====================")
        // for(x = 0; x < 5; x++) {
        //     embed.addFields(
        //         { name: `${usersArray[x].UserName}` + `(Id: ${usersArray[x].User})`, value: `${usersArray[x].Amount}`}
        //     )

        // }
        // interaction.reply({
        //     embeds: [embed]
        // })
    }
}