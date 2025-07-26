import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) { // cb => callback
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage })

//check for memory storage