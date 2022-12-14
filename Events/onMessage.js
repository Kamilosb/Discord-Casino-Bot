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
            userData = await Database.create({ UserName: message.author.username, User: message.author.id, Exp: 0, GuildId: message.guild.id, MessageCount: 0})
        }
        await Database.findOneAndUpdate({ User: message.author.id}, { $set: {Exp: parseInt(userData.Exp) + random(20, 30)}})
        await Database.findOneAndUpdate({ User: message.author.id}, { $set: {MessageCount: parseInt(userData.MessageCount) + 1}})
        
    }
}