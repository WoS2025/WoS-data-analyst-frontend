<template>
  <div class="chat-area">
    <!-- Chat Header -->
    <div class="chat-header">
      <div class="chat-title">
        <span class="ai-icon">🤖</span>
        <h3>AI 智能對話</h3>
      </div>
      <div class="chat-status">
        <span class="status-indicator"></span>
        <span>線上</span>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="
          message.type === 'user'
            ? 'message user-message'
            : 'message ai-message'
        "
      >
        <div class="message-avatar" v-if="message.type === 'ai'">
          <span>🤖</span>
        </div>
        <div class="message-content">
          <div class="message-text">{{ message.text }}</div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
        <div class="message-avatar" v-if="message.type === 'user'">
          <span>👤</span>
        </div>
      </div>
      
      <!-- Typing Indicator -->
      <div v-if="isTyping" class="message ai-message typing-message">
        <div class="message-avatar">
          <span>🤖</span>
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="chat-input-container">
      <div class="chat-input">
        <input 
          v-model="newMessage" 
          type="text" 
          placeholder="請輸入您的問題..." 
          @keypress.enter="sendMessage"
          :disabled="isTyping"
        />
        <button 
          class="send-button" 
          @click="sendMessage"
          :disabled="isTyping || !newMessage.trim()"
        >
          <span v-if="!isTyping">📤</span>
          <span v-else>⏳</span>
        </button>
      </div>
      <div class="input-suggestions">
        <button 
          v-for="suggestion in suggestions" 
          :key="suggestion"
          @click="selectSuggestion(suggestion)"
          class="suggestion-chip"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { backendURL } from "../scripts/config.js";
import AuthService from "../scripts/AuthService.js";

export default {
  name: "ChatArea",
  props: {
    selectedDocument: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      messages: [
        {
          type: "ai",
          text: "您好！我是 WoS 智能分析助手。我可以幫助您分析學術論文、回答研究問題。請告訴我您想了解什麼？",
          timestamp: new Date()
        },
      ],
      newMessage: "",
      isTyping: false,
      suggestions: [
        "分析聯邦學習的趨勢",
        "搜尋機器學習相關論文",
        "解釋深度學習概念",
        "比較不同算法的效能"
      ]
    };
  },
  watch: {
    selectedDocument(newDoc) {
      if (newDoc) {
        this.addSystemMessage(`已選擇文檔：${newDoc.name}。您可以針對此文檔提問。`);
      }
    }
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim() !== "" && !this.isTyping) {
        // Add user message
        const userMessage = {
          type: "user",
          text: this.newMessage,
          timestamp: new Date()
        };
        this.messages.push(userMessage);
        
        const query = this.newMessage;
        this.newMessage = "";
        this.isTyping = true;
        
        // Scroll to bottom
        this.$nextTick(() => {
          this.scrollToBottom();
        });

        try {
          // Get auth headers
          const headers = AuthService.getAuthHeaders();
          headers['Content-Type'] = 'application/json';

          const response = await fetch(`http://127.0.0.1:5001/api/rag/ask`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ 
              query: query,
              use_ai: true,
              n_results: 3
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          setTimeout(() => {
            const aiMessage = {
              type: "ai",
              text: data.success ? data.response : data.message || "抱歉，我無法處理您的請求。",
              timestamp: new Date()
            };
            this.messages.push(aiMessage);
            this.isTyping = false;
            
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          }, 1000);

        } catch (error) {
          console.error('Chat error:', error);
          setTimeout(() => {
            this.messages.push({
              type: "ai",
              text: "抱歉，發生了一些錯誤。請稍後再試。",
              timestamp: new Date()
            });
            this.isTyping = false;
          }, 1000);
        }
      }
    },
    
    selectSuggestion(suggestion) {
      this.newMessage = suggestion;
      this.sendMessage();
    },
    
    formatTime(timestamp) {
      if (!timestamp) return '';
      return timestamp.toLocaleTimeString('zh-TW', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },
    
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    
    // 新增方法：從側邊欄調用
    loadChatHistory(chat) {
      // 載入選中的聊天歷史
      this.messages = [
        {
          type: "ai",
          text: `已載入對話：${chat.preview}`,
          timestamp: new Date()
        }
      ];
      this.scrollToBottom();
    },
    
    startNewChat() {
      // 開始新的對話
      this.messages = [
        {
          type: "ai",
          text: "已開始新對話！我可以幫助您分析學術論文、回答研究問題。請告訴我您想了解什麼？",
          timestamp: new Date()
        }
      ];
      this.scrollToBottom();
    },
    
    setSelectedDocument(document) {
      // 設定選中的文檔
      this.addSystemMessage(`已選擇文檔：${document.name}。您可以針對此文檔提問。`);
    },
    
    addSystemMessage(text) {
      this.messages.push({
        type: "ai",
        text: text,
        timestamp: new Date()
      });
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    }
  },
  
  mounted() {
    // Check authentication
    if (!AuthService.isAuthenticated()) {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.chat-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.ai-icon {
  font-size: 24px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  max-width: 80%;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-message {
  align-self: flex-start;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ai-message .message-avatar {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-text {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.user-message .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 6px;
}

.ai-message .message-text {
  background: white;
  color: #333;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
  text-align: right;
}

.user-message .message-time {
  text-align: left;
}

.typing-message .message-content {
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  border-bottom-left-radius: 6px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #4ecdc4;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: 0.0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
}

.chat-input-container {
  padding: 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.chat-input {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.chat-input input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.chat-input input:focus {
  border-color: #4ecdc4;
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
}

.chat-input input:disabled {
  background: #f9fafb;
  cursor: not-allowed;
}

.send-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #44a08d 0%, #4ecdc4 100%);
  transform: scale(1.05);
}

.send-button:disabled {
  background: #e5e7eb;
  cursor: not-allowed;
  transform: none;
}

.input-suggestions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.suggestion-chip {
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-chip:hover {
  background: #4ecdc4;
  color: white;
  border-color: #4ecdc4;
  transform: translateY(-1px);
}
</style>
