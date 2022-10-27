const express = require("express")

const router = express.Router()
const Catgory = require('../models/category')
const multerConfig = require('../config/multer')
const path = require('path')
const auth = require('../middleware/auth')


router.get('/', async (req,res) => {
    try{
        const categories =await  Catgory.find()
        res.status(200).json(categories)
    }catch (err){
        res.status(500).json(err.message)
    }
})

router.post('/',auth,multerConfig.saveToUploads, async (req,res) => {
    const category = new Catgory({
        name : req.body.name,
        image: req.file.path
    })
    try{
        const newCategory = await category.save()
        res.status(201).json(newCategory)
    }catch(err){
        res.status(500).json({message:err.message})
    }

})

router.get('/:id',getCategory,(req,res)=>{
    res.status(200).json(res.category)
})

//router.get('/image/:id', getCategory, (req,res) =>{
//    try{
//        res.status(200).sendFile(path.join(__dirname + "/../")+ res.category.image)
//    }catch (err){
//        res.status(500).json({message:err.message})
//    }
//})

router.delete('/:id',auth, getCategory,async (req,res) => {
    try {
        await res.category.remove()
        res.status(200).json({message:"Deleted"})
    }catch (err){
        res.status(500).json({message:err.message})
    }
})


router.patch('/:id',auth, multerConfig.saveToUploads, getCategory, async (req,res)=> {
    if(req.body.name != null){
        res.category.name = req.body.name
    }
    if(req.file != null){
        res.category.image = req.file.path
    }
    try{
        const updatedCategory = await res.category.save()
        res.status(200).json(updatedCategory)
    }catch (err){
        res.status(500).json({message: err.message})
    }
})


async function getCategory(req,res,next){
    let category
    try{
        category = await Catgory.findById(req.params.id)
        if (category == null){
            return res.status(404).json({message:"Not Fund"})
        }
    }catch (err){
        res.status(500).json({message:err.message})
    }
    res.category = category
    next()
}


module.exports = router