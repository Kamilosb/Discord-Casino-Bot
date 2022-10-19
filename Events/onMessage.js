const Database = require("../Schemas/levels")

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        function random(min, max) { // min and max included 
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
        
        let userData = await Database.findOne({User: message.author.id})
        if(message.author.bot) return
        if(!userData) {
            embed.setTitle("Posiadasz ").setDescription("0 Expa")
            userData = await Database.create({ UserName: message.author.username, User: message.author.id, Exp: 0, GuildId: interaction.guild.id, MessageCount: 0})
            interaction.reply({
                embeds: [embed]
            })
        }
        await Database.findOneAndUpdate({ User: message.author.id}, { $set: {Exp: parseInt(userData.Exp) + random(20, 30)}})
        await Database.findOneAndUpdate({ User: message.author.id}, { $set: {MessageCount: parseInt(userData.MessageCount) + 1}})
        
    }
}