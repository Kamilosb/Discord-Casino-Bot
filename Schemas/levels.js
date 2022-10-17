const { model, Schema } = require("mongoose")

module.exports = model("levels", new Schema({
    UserName: String,
    User: String,
    Exp: String,
    GuildId: String,
    MessageCount: String
}))