const express = require("express")

const router = express.Router()
const Dish = require('../models/dish')
const multerConfig = require('../config/multer')
const path = require('path')
const auth = require('../middleware/auth')



router.get('/', async (req,res) => {
    try{
        const dish =await  Dish.find()
        res.status(200).json(dish)
    }catch (err){
        res.status(500).json(err.message)
    }
})

router.post('/',auth,multerConfig.saveToUploads, async (req,res) => {
    const dish = new Dish({
        name : req.body.name,
        short_description: req.body.short_description,
        price:req.body.price,
        image: req.file.path
    })
    try{
        const newDish = await dish.save()
        res.status(201).json(newDish)
    }catch(err){
        res.status(500).json({message:err.message})
    }

})

router.get('/:id',getDish,(req,res)=>{
    res.status(200).json(res.dish)
})

//router.get('/image/:id', getCategory, (req,res) =>{
//    try{
//        res.status(200).sendFile(path.join(__dirname + "/../")+ res.category.image)
//    }catch (err){
//        res.status(500).json({message:err.message})
//    }
//})

router.delete('/:id',auth, getDish,async (req,res) => {
    try {
        await res.dish.remove()
        res.status(200).json({message:"Deleted"})
    }catch (err){
        res.status(500).json({message:err.message})
    }
})


router.patch('/:id',auth,multerConfig.saveToUploads, getDish, async (req,res)=> {
    if(req.body.name != null){
        res.dish.name = req.body.name
    }
    if(req.file != null){
        res.dish.image = req.file.path
    }
    if(req.body.short_description != null){
        res.dish.short_description = req.body.short_description
    }
    if(req.body.price != null){
        res.dish.price = req.body.price
    }
    try{
        const updatedDish = await res.dish.save()
        res.status(200).json(updatedDish)
    }catch (err){
        res.status(500).json({message: err.message})
    }
})


async function getDish(req,res,next){
    let dish
    try{
        dish = await Dish.findById(req.params.id)
        if (dish == null){
            return res.status(404).json({message:"Not Fund"})
        }
    }catch (err){
        res.status(500).json({message:err.message})
    }
    res.dish = dish
    next()
}


module.exports = router