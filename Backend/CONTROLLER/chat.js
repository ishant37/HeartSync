// Backend/CONTROLLER/chat.js
import { generateGeminiReply } from '../chat_model.js';

export const chatController = async (req, res) => {
  const { message, email } = req.body;

  if (!message || !email) {
    return res.status(400).json({ error: 'Missing message or email' });
  }

  const reply = await generateGeminiReply(message, email);
  res.json({ reply });
};
