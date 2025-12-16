// Backend/CONTROLLER/chat.js
import { generateGeminiReply } from '../chat_model.js';

export const chatController = async (req, res) => {
  const { message, email } = req.body;
  const apiKey = req.geminiApiKey; // Extract from middleware

  if (!message || !email) {
    return res.status(400).json({ error: 'Missing message or email' });
  }

  if (!apiKey) {
    return res.status(401).json({ error: 'Gemini API key is required' });
  }

  const reply = await generateGeminiReply(message, email, apiKey);
  res.json({ reply });
};
