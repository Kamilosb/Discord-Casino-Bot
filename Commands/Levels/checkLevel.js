const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const Database = require("../../Schemas/levels")



module.exports = {
    data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Sprawdza poziom expa na danym serwerze")
    .addUserOption(options => options
        .setName("nick")
        .setDescription("Wybierz nazwę użytkownika którego poziom chcesz sprawdzić")
        .setRequired(false)
        ),
    async execute(interaction) {
        const embed = new EmbedBuilder().setColor("#32a852")
        const { options } = interaction
        const target = options.getMember("nick") || interaction.user

        function roundUp(num, precision) {
            precision = Math.pow(10, precision)
            return Math.ceil(num * precision) / precision
        }

        function calculateLevel(xpAmount) { 
            return parseInt(xpAmount)/100
        }

        if(target == interaction.user) { //jeśli nasz poziom
            const targetId = target.id
            let userData = await Database.findOne({User: targetId})
            if(!userData) {
                embed.setTitle("Posiadasz ").setDescription("0 Expa\noraz 0 wysłanych wiadomości")
                userData = await Database.create({ UserName: target.username, User: target.id, Exp: 0, GuildId: interaction.guild.id, MessageCount: 0})
                interaction.reply({
                    embeds: [embed]
                })
            } else {
                let level = calculateLevel(userData.Exp)
                let reqExp = roundUp(level, 0) * 100
                embed.setTitle(`Twój poziom wynosi: ${level | 0}`).setDescription("Posiadasz: " + userData.Exp + "/" + reqExp + " expa\noraz " + `${userData.MessageCount} wysłanych wiadomości`)
                // embed.addFields(
                //     { name: `Poziom` + " -> " + `${level | 0}`, value:`${userData.Exp}` + "/" + `${reqExp}`}
                // )
                interaction.reply({
                    embeds: [embed]
                })
            }
        } else { //jeśli czyiś poziom
            const target = options.getMember("nick")
            let userData = await Database.findOne({User: target.id})
            if(!userData) {
                embed.setTitle(`${target.user.username} posiada `).setDescription("0 Expa")
                userData = await Database.create({ UserName: target.user.username, User: target.id, Exp: 0, GuildId: interaction.guild.id, MessageCount: 0})
                interaction.reply({
                    embeds: [embed]
                })
            } else {
                let level = calculateLevel(userData.Exp)
                let reqExp = roundUp(level, 0) * 100
                embed.setTitle(`Poziom ${target.user.username} wynosi: ${level | 0}`).setDescription("Oraz posiada: " + userData.Exp + "/" + reqExp + " expa\ni " + `${userData.MessageCount} wysłanych wiadomości`)
                interaction.reply({
                    embeds: [embed]
                })
            }
        }
    }
}