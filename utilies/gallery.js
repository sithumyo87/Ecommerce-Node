const fs = require("fs");

const imageUpload = async (req, res, next) => {
  if (req.files) {
    if (req.files.file) {
      file = req.files.file;
      console.log(file);
      filename = new Date().valueOf() + "_" + req.files.file.name;
      file.mv(`./uploads/${filename}`);
      req.body["image"] = filename;
      next();
    }else{
        next(new Error("Single Image Upload Error"));
    }
  }else{
    next(new Error("Single Image Upload Error"));
  }
};

const imageUploads = async (req, res, next) => {
  filenames = [];
  files = req.files.files;
  // console.log(files);
  files.forEach((file) => {
    filename = new Date().valueOf() + "_" + file.name;
    file.mv(`./uploads/${filename}`);
    filenames.push(filename);
  });
  req.body["images"] = filenames.join(",");
  next();
};

const deleteFile = async (filename) => {
  await fs.unlinkSync(`./uploads/${filename}`);
};

module.exports = {
  imageUpload,
  imageUploads,
  deleteFile,
};
