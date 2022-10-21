const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
require("dotenv").config()
//dhdhdh
const client = new Client({ 
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember]
});

const { loadEvents } = require("./Handlers/eventHandler")

client.events = new Collection();
client.commands = new Collection();

// łączenie z bazą danych
const { connect, default: mongoose } = require("mongoose")
connect(process.env.DB_URL)
mongoose.connection.once('open', () => {
    console.log("The client is now connected to database.")
})

loadEvents(client)
module.exports = { client }
client.login(process.env.TOKEN)
