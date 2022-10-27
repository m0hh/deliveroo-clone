const express = require("express")

const router = express.Router()
const Resturant = require('../models/resturant')
const multerConfig = require('../config/multer')
const path = require('path')
const auth = require('../middleware/auth')



router.get('/', async (req,res) => {
    try{
        const resturant =await  Resturant.find()
        res.status(200).json(resturant)
    }catch (err){
        res.status(500).json(err.message)
    }
})

router.post('/',auth,multerConfig.saveToUploads, async (req,res) => {
    const resturant = new Resturant({
        name : req.body.name,
        short_description: req.body.short_description,
        image: req.file.path,
        lat: req.body.lat,
        long:req.body.long,
        address:req.body.address,
        category:req.body.category,
    })
    try{
        const newResturant = await resturant.save()
        res.status(201).json(newResturant)
    }catch(err){
        res.status(500).json({message:err.message})
    }

})

router.get('/:id',getResturant,(req,res)=>{
    res.status(200).json(res.resturant)
})

//router.get('/image/:id', getCategory, (req,res) =>{
//    try{
//        res.status(200).sendFile(path.join(__dirname + "/../")+ res.category.image)
//    }catch (err){
//        res.status(500).json({message:err.message})
//    }
//})

router.delete('/:id',auth, getResturant,async (req,res) => {
    try {
        await res.resturant.remove()
        res.status(200).json({message:"Deleted"})
    }catch (err){
        res.status(500).json({message:err.message})
    }
})


router.patch('/:id',auth,multerConfig.saveToUploads, getResturant, async (req,res)=> {
    if(req.body.name != null){
        res.resturant.name = req.body.name
    }
    if(req.file != null){
        res.resturant.image = req.file.path
    }
    if(req.body.short_description != null){
        res.resturant.short_description = req.body.short_description
    }
    if(req.body.lat != null){
        res.resturant.lat = req.body.lat
    }
    if(req.body.long != null){
        res.resturant.long = req.body.long
    }
    if(req.body.address != null){
        res.resturant.address = req.body.address
    }
    if(req.body.category != null){
        res.resturant.category = req.body.category
    }
    try{
        const updatedResturant = await res.resturant.save()
        res.status(200).json(updatedResturant)
    }catch (err){
        res.status(500).json({message: err.message})
    }
})

//add a new dish to resturant
router.patch("/dish/:id",auth,getResturant,async (req,res)=>{
    try{
        if (res.resturant.dishes.includes(req.body.dish)){
            res.status(400).json({message:"dish already exists"})
        }else{
            res.resturant.dishes.push(req.body.dish)
            const newResturant = await res.resturant.save()
            res.status(200).json(newResturant)
        }
    }catch (err){
        res.status(500).json({message:err.message})
    }
})

//delete dish from resturant

router.patch("/deletedish/:id",auth,getResturant,async (req,res)=>{
    try{
        if (!res.resturant.dishes.includes(req.body.dish)){
            res.status(400).json({message:"dish is not in resturant"})
        }else{
            const index = res.resturant.dishes.indexOf(req.body.dish)
            res.resturant.dishes.splice(index,1)
            const newResturant = await res.resturant.save()
            res.status(200).json(newResturant)
        }
    }catch (err){
        res.status(500).json({message:err.message})
    }
})

router.patch("/addrating/:id",auth, getResturant, async (req,res)=> {
    try{
        if (!isNaN(res.resturant.rating)){
            console.log(req.body.rating)
            res.resturant.rating = (res.resturant.rating + req.body.rating) / 2
        }else{
            console.log(req.body.rating)
            res.resturant.rating = req.body.rating
        }
        const newResturant = await res.resturant.save()
        res.status(200).json(newResturant)
    }catch (err){
        res.status(500).json({message:err.message})
    }
})


async function getResturant(req,res,next){
    let resturant
    try{
        resturant = await Resturant.findById(req.params.id)
        if (resturant == null){
            return res.status(404).json({message:"Not Fund"})
        }
    }catch (err){
        res.status(500).json({message:err.message})
    }
    res.resturant = resturant
    next()
}


module.exports = router