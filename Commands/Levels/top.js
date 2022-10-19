const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const Database = require("../../Schemas/levels")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("topka_expa")
    .setDescription("Wyświetla topke poziomów"),
    async execute(interaction) {
        const embed = new EmbedBuilder().setColor("#4a72f5")
        const usersArray = await Database.find({}, { UserName: 1, User: 1, Exp: 1, _id:0})
        usersArray.sort(function(a, b){return b.Exp - a.Exp}); 
        embed.setTitle("Użytkownicy serwera z największą ilością expa: ")
        embed.setDescription("===============================================")

        for(x = 0; x < 5; x++) {
            embed.addFields(
                { name: `${usersArray[x].UserName}` + `(Id: ${usersArray[x].User})`, value: `${usersArray[x].Exp}`}
            )
        }
        interaction.reply({
            embeds: [embed]
        })
    }
}