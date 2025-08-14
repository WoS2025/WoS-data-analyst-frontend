<template>
  <div class="chat-sidebar">
    <!-- 側邊欄標題 -->
    <div class="sidebar-header">
      <h3>📚 知識庫</h3>
      <button class="collapse-btn" @click="toggleCollapse">
        <span v-if="!isCollapsed">◀</span>
        <span v-else>▶</span>
      </button>
    </div>

    <!-- 摺疊狀態 -->
    <div v-if="!isCollapsed" class="sidebar-content">
      <!-- 統計資訊 -->
      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-icon">📄</span>
          <div class="stat-info">
            <div class="stat-number">{{ documentCount }}</div>
            <div class="stat-label">文件</div>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">💬</span>
          <div class="stat-info">
            <div class="stat-number">{{ chatCount }}</div>
            <div class="stat-label">對話</div>
          </div>
        </div>
      </div>

      <!-- 最近對話 -->
      <div class="section">
        <h4 class="section-title">
          <span class="section-icon">💬</span>
          最近對話
        </h4>
        <div class="chat-history">
          <div 
            v-for="chat in recentChats" 
            :key="chat.id"
            class="chat-item"
            @click="loadChat(chat)"
          >
            <div class="chat-preview">{{ chat.preview }}</div>
            <div class="chat-time">{{ formatTime(chat.timestamp) }}</div>
          </div>
          <div v-if="recentChats.length === 0" class="empty-state">
            <span class="empty-icon">💭</span>
            <p>尚無對話記錄</p>
          </div>
        </div>
      </div>

      <!-- 文件列表 -->
      <div class="section">
        <h4 class="section-title">
          <span class="section-icon">📁</span>
          文件庫
        </h4>
        <div class="document-list">
          <div 
            v-for="doc in documents" 
            :key="doc.id"
            class="document-item"
            @click="selectDocument(doc)"
          >
            <div class="doc-icon">{{ getDocIcon(doc.type) }}</div>
            <div class="doc-info">
              <div class="doc-name">{{ doc.name }}</div>
              <div class="doc-size">{{ formatSize(doc.size) }}</div>
            </div>
          </div>
          <div v-if="documents.length === 0" class="empty-state">
            <span class="empty-icon">📂</span>
            <p>尚無文件</p>
          </div>
        </div>
      </div>

      <!-- 快速動作 -->
      <div class="section">
        <h4 class="section-title">
          <span class="section-icon">⚡</span>
          快速動作
        </h4>
        <div class="action-buttons">
          <button class="action-btn" @click="newChat">
            <span class="btn-icon">➕</span>
            新對話
          </button>
          <button class="action-btn" @click="clearHistory">
            <span class="btn-icon">🗑️</span>
            清除歷史
          </button>
        </div>
      </div>
    </div>

    <!-- 摺疊狀態的簡化內容 -->
    <div v-else class="sidebar-collapsed">
      <div class="collapsed-item" title="新對話" @click="newChat">➕</div>
      <div class="collapsed-item" title="對話歷史">💬</div>
      <div class="collapsed-item" title="文件庫">📁</div>
      <div class="collapsed-item" title="設定">⚙️</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatSidebar",
  emits: ['load-chat', 'new-chat', 'select-document'],
  data() {
    return {
      isCollapsed: false,
      documentCount: 0,
      chatCount: 0,
      recentChats: [],
      documents: []
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    
    async loadData() {
      // 載入統計資訊
      try {
        // 這裡可以呼叫 API 取得實際數據
        this.documentCount = 24; // 從之前的資料庫查詢
        this.chatCount = this.recentChats.length;
        
        // 模擬一些聊天歷史
        this.recentChats = [
          {
            id: 1,
            preview: "聯邦學習的最新發展趨勢",
            timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30分鐘前
          },
          {
            id: 2,
            preview: "機器學習算法比較分析",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2小時前
          }
        ];
        
        // 模擬一些文件
        this.documents = [
          {
            id: 1,
            name: "federated_learning.pdf",
            type: "pdf",
            size: 2048000
          },
          {
            id: 2,
            name: "research_paper.txt",
            type: "txt",
            size: 512000
          }
        ];
        
        this.chatCount = this.recentChats.length;
      } catch (error) {
        console.error('Failed to load sidebar data:', error);
      }
    },
    
    loadChat(chat) {
      this.$emit('load-chat', chat);
    },
    
    newChat() {
      this.$emit('new-chat');
    },
    
    selectDocument(doc) {
      this.$emit('select-document', doc);
    },
    
    clearHistory() {
      if (confirm('確定要清除所有對話歷史嗎？')) {
        this.recentChats = [];
        this.chatCount = 0;
      }
    },
    
    formatTime(timestamp) {
      const now = new Date();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (minutes < 60) {
        return `${minutes}分鐘前`;
      } else if (hours < 24) {
        return `${hours}小時前`;
      } else {
        return `${days}天前`;
      }
    },
    
    formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
      return Math.round(bytes / (1024 * 1024)) + ' MB';
    },
    
    getDocIcon(type) {
      const icons = {
        pdf: '📄',
        txt: '📝',
        doc: '📃',
        docx: '📃',
        default: '📄'
      };
      return icons[type] || icons.default;
    }
  }
};
</script>

<style scoped>
.chat-sidebar {
  width: 280px;
  height: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: width 0.3s ease;
}

.chat-sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.collapse-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: white;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.sidebar-content {
  padding: 20px;
  height: calc(100% - 80px);
  overflow-y: auto;
}

.stats-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 12px;
  border: 1px solid rgba(78, 205, 196, 0.1);
}

.stat-icon {
  font-size: 20px;
}

.stat-info {
  text-align: center;
}

.stat-number {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 11px;
  color: #666;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.section-icon {
  font-size: 16px;
}

.chat-history, .document-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-item, .document-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.chat-item:hover, .document-item:hover {
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f2ff 100%);
  border-color: rgba(78, 205, 196, 0.2);
  transform: translateY(-1px);
}

.chat-preview {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time {
  font-size: 11px;
  color: #666;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doc-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.doc-info {
  flex: 1;
  min-width: 0;
}

.doc-name {
  font-size: 13px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-size {
  font-size: 11px;
  color: #666;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: linear-gradient(135deg, #44a08d 0%, #4ecdc4 100%);
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #666;
}

.empty-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}

.empty-state p {
  margin: 0;
  font-size: 12px;
}

.sidebar-collapsed {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.collapsed-item {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.collapsed-item:hover {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  transform: scale(1.1);
}
</style>
