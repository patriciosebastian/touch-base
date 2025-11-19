const AWS = require('aws-sdk');
const multer = require("multer");
const multerS3 = require('multer-s3');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3({
  httpOptions: {
    timeout: 600000
  }
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "touch-base-bucket",
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    }
  })
});

module.exports = {
  s3,
  upload
};
