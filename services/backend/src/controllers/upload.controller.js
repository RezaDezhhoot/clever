function uploadFile(req, res) {
  if (!req.file) {
    return res.status(422).json({ message: "File upload is required." });
  }

  return res.json({
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname,
    size: req.file.size
  });
}

export {
  uploadFile
};
