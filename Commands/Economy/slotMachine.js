const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const ascii = require("ascii-table")
const Database = require("../../Schemas/purse")

module.exports = {

    data: new SlashCommandBuilder()
    .setName("slotmachine")
    .setDescription("Wylosuj takie same owoce w poziomej lini i wygraj zwiększoną kwote!")
    .addNumberOption(options => options
        .setName("kwota")
        .setDescription("Wpisz kwotę jaką chcesz użyć")
        .setRequired(true)
        ),
    async execute(interaction) {
        const embed = new EmbedBuilder().setColor("#f90404")
        const { options } = interaction
        const bid = parseInt(options.getNumber("kwota"))
        let winMultiplier = 0;
        let paycheck = 0;
        const table = new ascii().setHeading("Slot 1", "Slot 2", "Slot 3")

        function randomFruit(fruits) {            
            return fruits[Math.floor(Math.random()*fruits.length)];
        }

        let userData = await Database.findOne({User: interaction.user.id})
        let amount = parseInt(userData.Amount)

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

        //główna pętla
        for(x = 0; x < 3; x++) {
            const fruits = ["🍊", "🍇", "🍆", "🥕", "🍅", "🫐", "🍒", "🍉", "🍌", "🍑", "🍈", "🥝", "🥥", "🧊"]
            const fruit1 = randomFruit(fruits)
            const fruit2 = randomFruit(fruits)
            const fruit3 = randomFruit(fruits)

            table.addRow(fruit1, fruit2, fruit3)
            //bonus + 5% za każdy lód do wina
            if(fruit1 == "🧊") {
                winMultiplier += 5
            }    
            if(fruit2 == "🧊") {
                winMultiplier += 5
            }    
            if(fruit3 == "🧊") {
                winMultiplier += 5
            }

            if(fruit1 == fruit2 && fruit2 == fruit3) {
                // fruit1 = "~~" + fruit1 + "~~"
                // fruit2 = "~~" + fruit2 + "~~"
                // fruit3 = "~~" + fruit3 + "~~"     
                if(winMultiplier > 0) {
                    paycheck = paycheck + bid * 5 * winMultiplier
                } else {
                    paycheck = paycheck + bid * 5
                }
                //trzy takie same
                //wyplac x5
            } else if (fruit1 == fruit2 || fruit2 == fruit3 || fruit1 == fruit3) {
                // if(fruit1 == fruit2) {
                //     fruit1 = "~~" + fruit1 + "~~"
                //     fruit2 = "~~" + fruit2 + "~~"
                // } else if (fruit2 == fruit3) {
                //     fruit3 = "~~" + fruit3 + "~~"
                //     fruit2 = "~~" + fruit2 + "~~"
                // } else if (fruit1 == fruit3) {
                //     fruit1 = "~~" + fruit1 + "~~"
                //     fruit3 = "~~" + fruit3 + "~~"
                // }
                if(winMultiplier > 0) {
                    paycheck = paycheck + bid * 1.5 * winMultiplier
                } else {
                    paycheck = paycheck + bid * 1.5
                }
                //dwa takie same
                //wyplac x2
            }
        }

        paycheck = parseInt(paycheck)
        // console.log(paycheck + " <- ostateczny paycheck")
        // embed o wygranej/przegranej
        if(paycheck > bid) {
            embed.setColor('#47ff00')
            embed.setTitle("Gratulacje! Właśnie wygrałeś:").setDescription(`***${paycheck}***`)
            await Database.findOneAndUpdate({ User: interaction.user.id}, { $set: {Amount: amount + paycheck}})
        } else {
            embed.setTitle(`Przegrałeś, więc straciłeś:`).setDescription(`***${bid}***`)
            await Database.findOneAndUpdate({ User: interaction.user.id}, { $set: {Amount: amount - bid}})
        }
        embed.addFields(
            {name: "Lodowy mnożnik wyniósł:", value: `${winMultiplier}`},
            {name: "***========𝐒𝐋𝐎𝐓 𝐌𝐀𝐂𝐇𝐈𝐍𝐄========***", value: "```\n"+ `${table}`+"```"}
        )

        interaction.reply({
            // content: "```\n"+ `${table}`+"```",
            embeds: [embed]
        })
    }
}