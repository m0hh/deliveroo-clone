const mongoose = require("mongoose")
const category = require("./category")

const resturantSchema = new mongoose.Schema({
    name :{
        type: String,
        required : true
    },
    short_description:{
        type: String,
        required: true
    },
    image:{
        type:String,
        required:true
    },
    lat:{
        type: Number
    },
    long:{
        type:Number
    },
    address:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"category",
        required:true
    },
    dishes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"dish"

    }]

})

module.exports= mongoose.model('resturant', resturantSchema)