import multer from 'multer';

const storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        cb(null, 'uploadDetail/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    }
});


const uploadMultiple = multer({ 
    storage: storage 
}).array('uploadDetail', 10); 

export default uploadMultiple;
