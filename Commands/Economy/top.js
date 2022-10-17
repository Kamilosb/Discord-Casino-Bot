const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const Database = require("../../Schemas/purse")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("topka")
    .setDescription("Wyświetla topke pieniędzy"),
    async execute(interaction) {
        const embed = new EmbedBuilder().setColor("#4a72f5")
        const usersArray = await Database.find({}, { UserName: 1, User: 1, Amount: 1, _id:0})
        usersArray.sort(function(a, b){return b.Amount - a.Amount}); 
        embed.setTitle("Top 3 najbogatszych użytkowników: ")
        embed.setDescription("=====================")
        for(x = 0; x < 3; x++) {
            embed.addFields(
                { name: `${usersArray[x].UserName}` + `(Id: ${usersArray[x].User})`, value: `${usersArray[x].Amount}`}
            )

        }
        interaction.reply({
            embeds: [embed]
        })
    }
}