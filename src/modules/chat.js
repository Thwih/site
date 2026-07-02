import { showToast } from './toast';
import { API_GATEWAY } from '../config/api';

export function initChat() {
  const toggleBtn = document.getElementById('chatToggle');
  const chatBox = document.getElementById('chatBox');
  const closeBtn = document.getElementById('chatClose');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const messages = document.getElementById('chatMessages');

  if (!toggleBtn || !chatBox || !messages) return;

  let isFirstOpen = true;

  window.appendMessage = function(type, text) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    const avatar = document.createElement('span');
    avatar.className = 'avatar';
    avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      const lineNode = document.createTextNode(line);
      bubble.appendChild(lineNode);
      if (index < lines.length - 1) {
        const br = document.createElement('br');
        bubble.appendChild(br);
      }
    });
    div.appendChild(avatar);
    div.appendChild(bubble);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  };

  toggleBtn.addEventListener('click', () => {
    chatBox.classList.toggle('active');
    if (chatBox.classList.contains('active')) {
      input.focus();
      if (isFirstOpen) {
        const lang = localStorage.getItem('lang') || 'vi';
        const t = translations[lang] || translations.vi;
        window.appendMessage('bot', t.ai_welcome);
        isFirstOpen = false;
      }
    }
  });

  closeBtn.addEventListener('click', () => chatBox.classList.remove('active'));

  async function getSmartReply(message) {
    try {
      const response = await fetch(`${API_GATEWAY}?action=deepseek`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Bạn là trợ lý AI thân thiện, hữu ích của Thwih Music. Trả lời bằng ngôn ngữ của người dùng.' },
            { role: 'user', content: message }
          ],
          max_tokens: 600,
          temperature: 0.7
        })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (!json.success || !json.data?.choices?.length) throw new Error('Invalid response');
      return json.data.choices[0].message.content;
    } catch (error) {
      console.error('Chat error:', error);
      return getFallbackReply(message);
    }
  }

  function getFallbackReply(msg) {
    const lower = msg.toLowerCase();
    if (lower.includes('xin chào') || lower.includes('chào') || lower.includes('hello') || lower.includes('hi')) {
      return 'Xin chào bạn! Rất vui được gặp bạn. Tôi là trợ lý AI của Thwih Music. 🎵';
    }
    if (lower.includes('cảm ơn') || lower.includes('thanks')) return '😊 Không có gì! Tôi luôn sẵn sàng giúp đỡ bạn.';
    if (lower.includes('giới thiệu') || lower.includes('about')) {
      return '🌟 Thwih Music là trang web chia sẻ nhạc miễn phí và công cụ hỗ trợ âm nhạc.';
    }
    return '🤔 Tôi chưa hiểu rõ, bạn có thể hỏi về âm nhạc, lập trình hoặc kết nối cộng đồng nhé!';
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    window.appendMessage('user', text);
    input.value = '';
    // Show typing
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.innerHTML = `<span class="avatar"><i class="fas fa-robot"></i></span><div class="bubble" style="min-width:60px;"><span class="typing-dots">.</span></div>`;
    messages.appendChild(typingDiv);
    let dots = 0;
    const typingInterval = setInterval(() => {
      const dotSpan = typingDiv.querySelector('.typing-dots');
      if (dotSpan) { dots = (dots % 3) + 1; dotSpan.textContent = '.'.repeat(dots); }
    }, 400);

    try {
      const reply = await getSmartReply(text);
      clearInterval(typingInterval);
      typingDiv.remove();
      window.appendMessage('bot', reply);
    } catch (err) {
      clearInterval(typingInterval);
      typingDiv.remove();
      window.appendMessage('bot', '❌ Có lỗi, vui lòng thử lại!');
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
}

// Import translations cho chat (cần dùng biến toàn cục)
const translations = {
  vi: { ai_welcome: 'Xin chào! Tôi là trợ lý AI của Thwih Music. Tôi có thể giúp gì cho bạn? 🎵' },
  en: { ai_welcome: 'Hello! I am the AI assistant of Thwih Music. How can I help you? 🎵' }
};