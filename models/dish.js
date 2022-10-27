const mongoose = require("mongoose")

const dishSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    short_description:{
        type: String,
        maxLength: 200
    },
    price :{
        type: Number
    },
    image : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('dish', dishSchema)