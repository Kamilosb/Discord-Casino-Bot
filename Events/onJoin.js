const Database = require("../Schemas/levels")

module.exports = {
    name: "voiceStateUpdate",
    once: false,
    async execute(VoiceState) {
        function delay(n){ // w sekundach
            return new Promise(function(resolve){
                setTimeout(resolve,n*1000)
            })
        }
        
        function random(min, max) { // min and max included 
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
        const interval = setInterval(() => add(), 2000);
        // co 30 sekund daje od 2 do 5 punktów

        async function add() {
            let amount = random(2, 5)
            await delay(30)
            await Database.findOneAndUpdate({ User: VoiceState.member.id}, { $inc: {Exp: amount}})
            console.log(`adding ${VoiceState.member.username} -> ${amount}`)
        }


        // clearInterval(interval); // The interval will no longer run
    }

}