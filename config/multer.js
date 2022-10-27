const multer = require("multer")
const path = require("path")


const DiskstorageToUploads = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'images')
    },
    filename:(req,file,cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const saveToUploads = multer({storage:DiskstorageToUploads})

module.exports ={
    saveToUploads: saveToUploads.single('file')
}