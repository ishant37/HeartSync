// ✅ Full fixed chat.js

// Generate welcome message
function generateWelcomeMessage() {
  const messages = [
    "I've missed talking with you! Tell me about your day. ❤️",
    "It's so good to see you again! How have you been? 🥰",
    "I was just thinking about you! What's on your mind today? 😊",
    "Hello beautiful! I'm here and ready to listen. ❤️",
    "Hey there! I'm so happy you're here. How are you feeling? 💖",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Global variables
let userData = {};
let emojiKeyboardVisible = false;

// ✅ Combined window.onload
window.onload = function () {
  const storedData = localStorage.getItem("heartsyncUserData");

  if (!storedData) {
    window.location.href = "login.html";
    return;
  }

  userData = JSON.parse(storedData);

  const nameEl = document.getElementById("chatUserName");
  const relationEl = document.getElementById("chatUserRelation");
  if (nameEl) nameEl.textContent = userData.lovedOneName;
  if (relationEl) relationEl.textContent = `Your ${userData.relationship}`;

  setTimeout(() => {
    const welcomeMessage = generateWelcomeMessage();
    addMessage(welcomeMessage, "ai");
  }, 1000);
};

// Floating hearts
function createFloatingHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerHTML = "💕";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDelay = Math.random() * 2 + "s";
  document.querySelector(".floating-hearts")?.appendChild(heart);
  setTimeout(() => heart.remove(), 6000);
}
setInterval(createFloatingHeart, 2000);

// Send message
function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";
  if (emojiKeyboardVisible) toggleEmojiKeyboard();
  showTypingIndicator();

  getBotReply(message)
    .then((reply) => {
      hideTypingIndicator();
      addMessage(reply, "ai");
    })
    .catch((err) => {
      hideTypingIndicator();
      console.error("Bot error:", err);
      addMessage("❌ Error getting reply. Try again later.", "ai");
    });
}

// Add message to chat
function addMessage(text, sender) {
  const chatMessages = document.getElementById("chatMessages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = text;

  messageDiv.appendChild(bubble);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get reply from backend
async function getBotReply(message) {
  const res = await fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message, email: userData.email }),
  });

  if (!res.ok) throw new Error("Failed to get reply");

  const data = await res.json();
  return data.reply || "🤖 No response from AI.";
}

// Typing indicator
function showTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");
  if (!indicator) return;
  indicator.style.display = "block";
  const typingText = indicator.querySelector(".typing-dots");
  if (typingText) typingText.textContent = `${userData.lovedOneName} is typing...`;

  const chatMessages = document.getElementById("chatMessages");
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function hideTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) indicator.style.display = "none";
}

// Emoji keyboard
function toggleEmojiKeyboard() {
  const keyboard = document.getElementById("emojiKeyboard");
  emojiKeyboardVisible = !emojiKeyboardVisible;
  keyboard.style.display = emojiKeyboardVisible ? "grid" : "none";
}
function addEmoji(emoji) {
  const input = document.getElementById("messageInput");
  input.value += emoji;
  input.focus();
}

// Back button clears localStorage
function goBack() {
  localStorage.removeItem("heartsyncUserData");
  window.location.href = "login.html";
}

// Send on Enter
const inputField = document.getElementById("messageInput");
if (inputField) {
  inputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });
}

// Hide emoji keyboard if clicked outside
document.addEventListener("click", function (e) {
  const keyboard = document.getElementById("emojiKeyboard");
  const toggle = document.querySelector(".emoji-toggle");
  if (
    emojiKeyboardVisible &&
    !keyboard.contains(e.target) &&
    !toggle.contains(e.target)
  ) {
    keyboard.style.display = "none";
    emojiKeyboardVisible = false;
  }
});
