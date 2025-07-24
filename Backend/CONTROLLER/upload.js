export const uploadController = [
  upload.single('chatFile'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Uploaded file:', req.file.originalname);
    res.json({
      message: 'Chat file uploaded successfully',
      filename: 'WhatsApp.txt',
      path: chatFilePath
    });
  }
];