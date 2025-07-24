import fs from 'fs';

export function extract_messages(filepath) {
  try {
    const rawText = fs.readFileSync(filepath, 'utf-8');
    // You can improve this parsing logic as needed
    return rawText.split('\n').filter(line => line.trim() !== '');
  } catch (err) {
    console.error("Error reading chat file:", err);
    return [];
  }
}
