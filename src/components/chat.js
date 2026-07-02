export function renderChat() {
  return `
    <div class="chat-widget" id="chatWidget">
      <button class="chat-toggle" id="chatToggle"><i class="fas fa-comment-dots"></i></button>
      <div class="chat-box" id="chatBox">
        <div class="chat-header">
          <span><i class="fas fa-robot"></i> <span data-i18n="ai_assistant">AI Assistant</span></span>
          <button class="chat-close" id="chatClose"><i class="fas fa-times"></i></button>
        </div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
          <input type="text" id="chatInput" data-i18n-placeholder="chat_placeholder" placeholder="Nhập tin nhắn..." />
          <button id="chatSend"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
  `;
}