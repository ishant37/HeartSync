import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateGeminiReply(userInput, email) {
  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  const chatPath = path.join('Backend', 'data', `${safeEmail}_chat.txt`);
  const infoPath = path.join('Backend', 'data', `${safeEmail}_info.json`);

  

  if (!fs.existsSync(chatPath)) {
    console.error("❌ Chat file not found.");
    return "Chat file not found.";
  }
  if (!fs.existsSync(infoPath)) {
    console.error("❌ Info file not found.");
    return "User info file not found.";
  }

  const chatContent = fs.readFileSync(chatPath, 'utf-8').split('\n').slice(-50).join('\n');
  const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));

  const prompt = `
You're simulating ${info.lovedOneName}, who is the user's ${info.relationship}.
Personality: ${info.personality}
Interests: ${info.interests}

Recent messages:
${chatContent}

User says: "${userInput}"
Reply as ${info.lovedOneName}, lovingly and naturally.
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('❌ Gemini API Error:', err.message);
    return "Something went wrong while generating the reply.";
  }
}

