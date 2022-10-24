
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const Database = require("../../Schemas/purse");
//Red roulette numbers: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, and 36.
//Black roulette numbers: 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, and 35.
//jak w zegarze 0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26.




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
        let colors = ("🟩,🟥,⬛,🟥,⬛,🟥,⬛,🟥,⬛,🟥,⬛,⬛,🟥,⬛,🟥,⬛,🟥,⬛,🟥,🟥,⬛,🟥,⬛,🟥,⬛,🟥,⬛,🟥,⬛,⬛,🟥,⬛,🟥,⬛,🟥,⬛,🟥") // od 0 do 36
        let colorsArray = colors.split(',');
        
        //wysylanie wiadomości
        embed.setTitle("==========RULETKA==========")
        embed.setDescription("loading...")
        interaction.reply({
            embeds: [embed]
        })

        // animacja etc.
        let spinCount = getRandom(10, 10)
        let firstSpin = getRandom(36, 36)

        let repeated = new Array(spinCount + firstSpin).fill(colorsArray).flat()
        let displayColorsArray = new Array()
        if(!interaction.isReplied) await delay(1) // bo czasami chcialo edytowac zanim wyslalo LMAO

        for(x=firstSpin; x<=spinCount + firstSpin; x++) {
            await delay(0.5)
            displayColorsArray.unshift(repeated[x])
            displayColorsArray.length = 5
            embed.setDescription("```---------------↓---------------\n       " + displayColorsArray.join(" ") + "\n---------------↑---------------```")
            await console.log(repeated[x])
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