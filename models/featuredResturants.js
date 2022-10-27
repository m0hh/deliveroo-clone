const mongoose = require("mongoose")

const fResturantsSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    short_description:{
        type:String,
        maxLength:200
    },
    resturants: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'resturant'
    }]
})

module.exports = mongoose.model('fresturants', fResturantsSchema)