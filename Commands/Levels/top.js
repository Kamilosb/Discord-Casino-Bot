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

        // function calculateRequiredExp(xpAmount) {
        //     level = parseInt(level)
        //     console.log(level + " -> " + (level * 100) + ((level - 1) * 100))
        //     return (level * 100) + ((level - 1) * 100)
        // }

        function roundUp(num, precision) {
            precision = Math.pow(10, precision)
            return Math.ceil(num * precision) / precision
        }

        function calculateLevel(xpAmount) { 
            return parseInt(xpAmount)/100
        }

        for(x = 0; x < 5; x++) {
            let level = calculateLevel(usersArray[x].Exp)
            let reqExp = roundUp(level, 0) * 100
            embed.addFields(
                { name: `${usersArray[x].UserName}` + " -> " + `${level | 0}`, value:`${usersArray[x].Exp}` + "/" + `${reqExp}`}
            )
        }

        interaction.reply({
            embeds: [embed]
        })
    }
}