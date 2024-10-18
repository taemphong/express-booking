import multer from 'multer';


const storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        cb(null, 'uploadDetail/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    }
});


const uploaddetail = multer({ 
    storage: storage 
}).single('uploadDetail'); 
export default uploaddetail;