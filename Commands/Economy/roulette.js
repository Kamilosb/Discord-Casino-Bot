const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const Database = require("../../Schemas/purse");

let colors = ("🟩,🟥,⬛,🟥,⬛,🟥,⬛,🟥,⬛,🟥,⬛,⬛,🟥,⬛,🟥,⬛,🟥,⬛,🟥,🟥,⬛,🟥,⬛,🟥,⬛,🟥,⬛,🟥,⬛,⬛,🟥,⬛,🟥,⬛,🟥,⬛,🟥") // od 0 do 36
let colorsArray = colors.split(',');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ruletka")
    .setDescription("Wylosuj obstawiony!")
    .addStringOption(options => options
        .setName("kolor")
        .setDescription("Wpisz kolor na jaki chcesz postawić")
        .setRequired(true)
        .addChoices(
            {name: 'zielony', value: 'zielony'},
            {name: 'czarny', value: 'czarny'},
            {name: 'czerwony', value: 'czerwony'}
        )
    )
    .addNumberOption(options => options
        .setName("kwota")
        .setDescription("Wpisz kwotę jaka chcesz obstawić")
        .setRequired(true)
    ),

    async execute(interaction) { 
        function getRandom(min, max) { // min and max included 
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
        
        function delay(n){ // w sekundach
            return new Promise(function(resolve){
                setTimeout(resolve,n*1000)
            })
        }

        const { options } = interaction
        const bid = parseInt(options.getNumber("kwota"))
        let userData = await Database.findOne({User: interaction.user.id})

        //zabezpieczenia 
        if(bid <= 0) {
            interaction.reply({
                content: "Minimalna kwota wynosi 1"
            })
            return
        }
        
        if(bid > userData.Amount) {
            interaction.reply({
                content: "Nie masz wystarczającej ilości pieniędzy na koncie!\nBy sprawdzić stan konta użyj komendy **/balans**"
            })
            return
        }

        const embed = new EmbedBuilder().setColor("#4a72f5")

        
        //wysylanie wiadomości
        embed.setTitle("==========RULETKA==========")
        embed.setDescription("Loading...")
        interaction.reply({
            embeds: [embed]
        })

        let spinCount = 0
        let firstSpin = 0
        // animacja etc.
        spinCount = getRandom(4, 15)
        firstSpin = getRandom(5, 36)

        let repeated = new Array(spinCount + firstSpin).fill(colorsArray).flat()
        let displayColorsArray = new Array()
        if(!interaction.isReplied) await delay(1) // bo czasami chcialo edytowac zanim wyslalo LMAO

        for(x=firstSpin; x<=spinCount + firstSpin; x++) {
            await delay(0.5)
            displayColorsArray.unshift(repeated[x])
            displayColorsArray.length = 5
            embed.setDescription("```---------------↓---------------\n       " + displayColorsArray.join(" ") + "\n---------------↑---------------```")
            console.log(repeated[x])
            await interaction.editReply({embeds: [embed]})
        }

        let amount = parseInt(userData.Amount)
        let winningColor = "";

        if(displayColorsArray[4] == "🟩") {
            winningColor = 'zielony'
        } else if (displayColorsArray[4] == "🟥") {
            winningColor = 'czerwony'
        } else {
            winningColor = 'czarny'
        }
        if (winningColor == options.getString("kolor")) {
            if (winningColor == 'zielony') {
                embed.addFields(
                    {name: "Wygrywa kolor: ", value: displayColorsArray[4]},
                    {name: "Wygrana kwota wynosi: ", value: `${(bid*14)}`}
                )
                interaction.editReply({embeds: [embed]})
                await Database.findOneAndUpdate({ User: interaction.user.id}, { $set: {Amount: amount + (bid*14)}})
            } else {
                embed.addFields(
                    {name: "Wygrywa kolor: ", value: displayColorsArray[4]},
                    {name: "Wygrana kwota wynosi: ", value: `${(bid*2)}`})
                    
                interaction.editReply({embeds: [embed]})
                await Database.findOneAndUpdate({ User: interaction.user.id}, { $set: {Amount: amount + (bid*2)}})
            }
        } else { //przegrana
            embed.addFields([
                {name: "Wygrywa kolor:", value: displayColorsArray[4]},
                {name: "A ty obstawiłeś " + options.getString("kolor") + ", więc przegrywasz:", value: `${(bid)}`}
            ])
            interaction.editReply({embeds: [embed]})
            await Database.findOneAndUpdate({ User: interaction.user.id}, { $set: {Amount: amount - bid}})
        }
    
    }
}