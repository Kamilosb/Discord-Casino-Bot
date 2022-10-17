const { model, Schema } = require("mongoose")

module.exports = model("balance", new Schema({
    UserName: String,
    User: String,
    Amount: String
}))