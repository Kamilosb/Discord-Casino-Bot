const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const Database = require("../../Schemas/levels")

const embed = new EmbedBuilder().setColor("#32a852")

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
        const { options } = interaction
        const target = options.getMember("nick") || interaction.user
        
        if(target == interaction.user) { //jeśli nasz poziom
            const targetId = target.id
            let userData = await Database.findOne({User: targetId})
            if(!userData) {
                embed.setTitle("Posiadasz ").setDescription("0 Expa")
                userData = await Database.create({ UserName: target.username, User: target.id, Exp: 0, GuildId: interaction.guild.id, MessageCount: 0})
                interaction.reply({
                    embeds: [embed]
                })
            } else {
                embed.setTitle("Posiadasz ").setDescription(userData.Exp + " expa\noraz " + `${userData.MessageCount} wysłanych wiadomości`)
                interaction.reply({
                    embeds: [embed]
                })
            }
        } else { //jeśli czyiś poziom
            if(options.getMember("nick").user.bot) {
                interaction.reply({
                    content: "Boty nie zbierają expa!"
                })
                return
            }
            const target = options.getMember("nick")
            let userData = await Database.findOne({User: target.id})
            if(!userData) {
                embed.setTitle(`${target.user.username} posiada `).setDescription("0 Expa")
                userData = await Database.create({ UserName: target.user.username, User: target.id, Exp: 0, GuildId: interaction.guild.id, MessageCount: 0})
                interaction.reply({
                    embeds: [embed]
                })
            } else {
                embed.setTitle(`${target.user.username} posiada `).setDescription(userData.Exp + " expa\noraz " + `${userData.MessageCount} wysłanych wiadomości`)
                interaction.reply({
                    embeds: [embed]
                })
            }
        }
    }
}