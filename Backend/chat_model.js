import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateGeminiReply(userInput, email) {
  // 1. Create a safe filename
  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');

  // 2. Resolve paths safely using process.cwd() to avoid directory errors
  const baseDir = path.join(process.cwd(), 'Backend', 'data');
  const chatPath = path.join(baseDir, `${safeEmail}_chat.txt`);
  const infoPath = path.join(baseDir, `${safeEmail}_info.json`);

  // 3. Check files exist
  if (!fs.existsSync(chatPath)) {
    console.error(`❌ Chat file not found at: ${chatPath}`);
    return "Chat history not found.";
  }
  if (!fs.existsSync(infoPath)) {
    console.error(`❌ Info file not found at: ${infoPath}`);
    return "User profile not found.";
  }

  // 4. Read Data
  const chatContent = fs.readFileSync(chatPath, 'utf-8').split('\n').slice(-50).join('\n');
  const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));

  // 5. Define the System Persona (The "Who am I")
  // Using systemInstruction makes the AI stay in character much better than a standard prompt.
  const systemPrompt = `
    You are simulating ${info.lovedOneName}, who is the user's ${info.relationship}.
    Your personality is: ${info.personality}.
    Your interests include: ${info.interests}.
    
    Guidelines:
    - Keep replies natural, loving, and consistent with the relationship.
    - Do not act like an AI assistant.
    - Use the provided chat history for context.
  `;

  try {
    // 6. Initialize Model
    // Note: Removed 'models/' prefix. Use 'gemini-1.5-flash' or 'gemini-2.0-flash'
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash', 
      systemInstruction: systemPrompt 
    });

    // 7. Send the actual message + history
    const finalPrompt = `
    Recent Chat History:
    ${chatContent}

    User's new message: "${userInput}"
    `;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    return response.text();

  } catch (err) {
    console.error('❌ Gemini API Error:', err.message);
    
    // Fallback: Check if it's a model not found error and suggest a fix in the console
    if (err.message.includes('404') || err.message.includes('not found')) {
      console.error('👉 TIP: Check your model name. Try "gemini-1.5-flash" or "gemini-pro".');
    }
    
    return "I'm having a little trouble thinking right now. Ask me again in a moment?";
  }
}