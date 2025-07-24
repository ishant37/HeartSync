// CONTROLLER/uploadcontroller.js
import fs from 'fs';
import path from 'path';

export const handleUpload = (req, res) => {
  const { email, lovedOneName, relationship, personality, interests } = req.body;

  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  const uploadDir = path.join('Backend', 'data');

  // Save info
  const userInfo = { email, lovedOneName, relationship, personality, interests };
  const infoPath = path.join(uploadDir, `${safeEmail}_info.json`);
  fs.writeFileSync(infoPath, JSON.stringify(userInfo, null, 2));

  // Rename chat file
  if (req.file) {
    const newChatPath = path.join(uploadDir, `${safeEmail}_chat.txt`);
    fs.renameSync(req.file.path, newChatPath);
  }

  // ✅ THIS LINE FIXES YOUR ISSUE
  res.json({ success: true, message: "Data uploaded and saved successfully." });
};
