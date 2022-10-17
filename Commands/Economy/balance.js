const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const Database = require("../../Schemas/purse")

const embed = new EmbedBuilder().setColor("#32a852")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("balans")
    .setDescription("Sprawdza ilość pieniędzy na koncie")
    .addUserOption(options => options
        .setName("nick")
        .setDescription("Wybierz nazwę użytkownika które stan konta chcesz sprawdzić")
        .setRequired(false)
        ),
    async execute(interaction) {
        const { options } = interaction
        const target = options.getMember("nick") || interaction.user
        if(target == interaction.user) { //jeśli nasz portfel
            const targetId = target.id
            let userData = await Database.findOne({User: targetId})
            if(!userData) {
                embed.setTitle("Ilość środków na koncie wynosi:").setDescription("300")
                userData = await Database.create({ UserName: target.username, User: target.id, Amount: 300})
                interaction.reply({
                    embeds: [embed]
                })
            } else {
                embed.setTitle("Ilość środków na koncie wynosi:").setDescription(userData.Amount)
                interaction.reply({
                    embeds: [embed]
                })
            }
        } else { //jeśli czyiś portfel
            const target = options.getMember("nick")
            let userData = await Database.findOne({User: target.id})
            if(!userData) {
                embed.setTitle(`Ilość środków na koncie ${target.user.username} wynosi:`).setDescription("300")
                userData = await Database.create({ UserName: target.user.username, User: target.id, Amount: 300})
                interaction.reply({
                    embeds: [embed]
                })
            } else {
                embed.setTitle(`Ilość środków na koncie ${target.user.username} wynosi:`).setDescription(userData.Amount)
                interaction.reply({
                    embeds: [embed]
                })
            }
        }
    }
}