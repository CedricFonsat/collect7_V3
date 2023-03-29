import multer, { diskStorage } from 'multer';

const storage = diskStorage({
  destination: function(req, file, cb) {
    cb(null, './assets/uploads/avatar');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const uploadAvatar = multer({ storage: storage });

export default uploadAvatar
