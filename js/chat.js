import { API_GATEWAY } from './config.js';

let isFirstOpen = true;

export function appendMessage(type, text) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = `message ${type}`;
    const avatar = document.createElement('span');
    avatar.className = 'avatar';
    avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const lines = text.split('\n');
    lines.forEach((line, index) => {
        bubble.appendChild(document.createTextNode(line));
        if (index < lines.length - 1) bubble.appendChild(document.createElement('br'));
    });
    div.appendChild(avatar);
    div.appendChild(bubble);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
    const chatMessages = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'message bot typing';
    div.innerHTML = `<span class="avatar"><i class="fas fa-robot"></i></span><div class="bubble" style="min-width:60px;"><span class="typing-dots">.</span></div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    let dots = 0;
    const interval = setInterval(() => {
        const dotSpan = div.querySelector('.typing-dots');
        if (dotSpan) { dots = (dots % 3) + 1;
            dotSpan.textContent = '.'.repeat(dots); } else clearInterval(interval);
    }, 400);
    return { div, interval };
}

function removeTyping(typingId) {
    if (typingId && typingId.div) { typingId.div.remove();
        clearInterval(typingId.interval); }
}

function getFallbackReply(message) {
    const msg = message.toLowerCase().trim();
    if (msg.includes('xin chào') || msg.includes('chào') || msg.includes('hello') || msg.includes('hi')) {
        return `Xin chào bạn! Rất vui được gặp bạn. Tôi là trợ lý AI của Thwih Music. Bạn cần hỗ trợ gì hôm nay? 🎵`;
    }
    const fallbackKnowledge = {
        'music|nhạc|âm nhạc|bài hát|playlist': `🎵 Thwih Music là nơi bạn có thể lấy nhạc miễn phí qua Google Docs. Chúng tôi thường xuyên cập nhật các bản nhạc mới, đa dạng thể loại. Bạn cũng có thể nghe thử qua trình phát mini.`,
        'tiktok|telegram|zalo|mạng xã hội|kết nối|group': `📱 Kết nối với cộng đồng Thwih Music qua:\n- TikTok: @thwih1\n- Telegram: @thwihmusic\n- Zalo Group: https://zalo.me/g/otroe2pxpnitzfr6hppg\n- Liên hệ Zalo: https://zalo.me/84338578255`,
        'cảm ơn|thanks|thank you|cám ơn': `😊 Không có gì! Tôi luôn sẵn sàng giúp đỡ bạn.`,
        'giờ|thời gian|ngày|hôm nay|date': `🕒 Hôm nay là ${new Date().toLocaleString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}. Hiện tại là ${new Date().toLocaleTimeString('vi-VN')}.`,
        'bạn là ai|ai đấy|tên gì|tôi là ai': `🤖 Tôi là trợ lý ảo của Thwih Music - nền tảng chia sẻ nhạc miễn phí và công cụ hỗ trợ âm nhạc.`,
        'lập trình|code|programming|developer|web|html|css|js|javascript': `💻 Lập trình là một hành trình thú vị! Tôi có thể giúp bạn về HTML, CSS, JavaScript và nhiều ngôn ngữ khác.`,
        'giới thiệu|about|thwih|trang web': `🌟 Thwih Music là trang web chia sẻ nhạc miễn phí và công cụ hỗ trợ âm nhạc. Bạn có thể lấy nhạc qua Google Docs, kết nối cộng đồng qua TikTok, Telegram, Zalo.`,
    };
    for (const [patterns, reply] of Object.entries(fallbackKnowledge)) {
        const regex = new RegExp(patterns.split('|').join('|'), 'i');
        if (regex.test(msg)) return reply;
    }
    return `🤔 Tôi chưa hiểu rõ câu hỏi. Bạn có thể hỏi về:\n- 🎵 Âm nhạc và tải nhạc\n- 📱 Kết nối TikTok, Telegram, Zalo\n- 💻 Lập trình`;
}

async function callDeepSeekAPI(userMessage) {
    try {
        const response = await fetch(`${API_GATEWAY}?action=deepseek`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'Bạn là trợ lý AI thân thiện, hữu ích của Thwih Music. Trả lời mọi câu hỏi về âm nhạc, lập trình, công nghệ. Trả lời bằng ngôn ngữ của người dùng (Việt hoặc Anh).' },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 600,
                temperature: 0.7
            })
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || `HTTP ${response.status}`);
        }
        const json = await response.json();
        if (!json.success) throw new Error(json.error || 'DeepSeek error');
        if (!json.data || !json.data.choices || !json.data.choices.length) {
            throw new Error('Invalid response structure');
        }
        return json.data.choices[0].message.content;
    } catch (error) {
        console.error('Lỗi DeepSeek proxy:', error);
        return null;
    }
}

async function getSmartReply(message) {
    const reply = await callDeepSeekAPI(message);
    return reply || getFallbackReply(message);
}

export function initChat() {
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatToggle || !chatBox || !chatClose || !chatInput || !chatSend || !chatMessages) return;

    chatToggle.addEventListener('click', () => {
        chatBox.classList.toggle('active');
        if (chatBox.classList.contains('active')) {
            chatInput.focus();
            if (isFirstOpen) {
                const lang = localStorage.getItem('lang') || 'vi';
                const t = translations[lang];
                setTimeout(() => { appendMessage('bot', t.ai_welcome); }, 400);
                isFirstOpen = false;
            }
        }
    });
    chatClose.addEventListener('click', () => chatBox.classList.remove('active'));

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        appendMessage('user', text);
        chatInput.value = '';
        const typingId = showTyping();
        try {
            const reply = await getSmartReply(text);
            removeTyping(typingId);
            appendMessage('bot', reply);
        } catch (error) {
            removeTyping(typingId);
            appendMessage('bot', ' Có lỗi, vui lòng thử lại!');
        }
    }
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

    // Thêm biến translations vào global để dùng trong chat
    import('./translations.js').then(module => {
        window.translations = module.translations;
    });
}