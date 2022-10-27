const express = require("express")
require('dotenv').config()
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

app.use(express.static(__dirname+'/images'));


mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true})
const db = mongoose.connection
db.on('error', (error)=>console.loh(error))
db.once('open', () => console.log("connected to datbase"))

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

const categoryRouter = require('./routes/category.js')
app.use('/category', categoryRouter)

const dishRouter = require("./routes/dish")
app.use('/dish', dishRouter)

const resturantRouter = require('./routes/resturants')
app.use('/resturant', resturantRouter)

const fresturantRouter = require('./routes/fresturants')
app.use('/fresturants', fresturantRouter)

const userRouter = require('./routes/user')
app.use('/user', userRouter)

app.listen(3000, () => console.log("server started"))