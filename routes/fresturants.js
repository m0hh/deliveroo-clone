const express = require("express")

const router = express.Router()
const Fresturant = require('../models/featuredResturants')
const multerConfig = require('../config/multer')
const path = require('path')
const auth = require('../middleware/auth')



router.get('/', async (req,res) => {
    try{
        const fresturant =await  Fresturant.find()
        res.status(200).json(fresturant)
    }catch (err){
        res.status(500).json(err.message)
    }
})

router.post('/',auth, async (req,res) => {
    const fresturant = new Fresturant({
        name : req.body.name,
        short_description: req.body.short_description,
        resturants: req.body.resturants
    })
    try{
        const newFresturant = await fresturant.save()
        res.status(201).json(newFresturant)
    }catch(err){
        res.status(500).json({message:err.message})
    }

})

router.get('/:id',getFresturant,(req,res)=>{
    res.status(200).json(res.fresturant)
})


router.delete('/:id',auth, getFresturant,async (req,res) => {
    try {
        await res.fresturant.remove()
        res.status(200).json({message:"Deleted"})
    }catch (err){
        res.status(500).json({message:err.message})
    }
})


router.patch('/:id',auth, getFresturant, async (req,res)=> {
    if(req.body.name != null){
        res.fresturant.name = req.body.name
    }
    if(req.body.short_description != null){
        res.fresturant.short_description = req.body.short_description
    }
    try{
        const updatedFresturant = await res.fresturant.save()
        res.status(200).json(updatedFresturant)
    }catch (err){
        res.status(500).json({message: err.message})
    }
})

router.patch("/resturant/:id",auth, getFresturant,async (req,res)=>{
    try{
        if (res.fresturant.resturants.includes(req.body.resturant)){
            res.status(400).json({message:"resturant already exists"})
        }else{
            res.fresturant.resturants.push(req.body.resturant)
            const newFResturant = await res.fresturant.save()
            res.status(200).json(newFResturant)
        }
    }catch (err){
        res.status(500).json({message:err.message})
    }
})

//delete dish from resturant

router.patch("/deleteresturant/:id",auth,getFresturant,async (req,res)=>{
    try{
        if (!res.fresturant.resturants.includes(req.body.resturant)){
            res.status(400).json({message:"resturant is not featured"})
        }else{
            const index = res.fresturant.resturants.indexOf(req.body.resturant)
            res.fresturant.resturants.splice(index,1)
            const newFResturant = await res.fresturant.save()
            res.status(200).json(newFResturant)
        }
    }catch (err){
        res.status(500).json({message:err.message})
    }
})


async function getFresturant(req,res,next){
    let fresturant
    try{
        fresturant = await Fresturant.findById(req.params.id)
        if (fresturant == null){
            return res.status(404).json({message:"Not Fund"})
        }
    }catch (err){
        res.status(500).json({message:err.message})
    }
    res.fresturant = fresturant
    next()
}


module.exports = router