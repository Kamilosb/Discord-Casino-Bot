const { SlashCommandBuilder, client } = require("discord.js")
const Database = require("../Schemas/purse")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("praca")
    .setDescription("Dodstajesz 300pln"),
    async execute(interaction) {
        let userData = await Database.findOne({User: interaction.user.id})
        if (client.cooldowns.has(interaction.user.id)) {
            // cooldown not ended
            interaction.reply({ content: "Komenda jest na cooldownie", ephemeral: true });
          } else {

            await Database.findOneAndUpdate({ User: interaction.user.id}, { $inc: {Amount: 300}})
            
            //now, set cooldown
            client.cooldowns.set(interaction.user.id, true);
        
            // After the time you specified, remove the cooldown
            setTimeout(() => {
              client.cooldowns.delete(interaction.user.id);
            }, client.COOLDOWN_SECONDS * 1000);
          }
    }

}