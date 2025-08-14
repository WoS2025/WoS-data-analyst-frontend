<template>
  <div id="main-app">
    <div v-if="showMainPanel" class="panel">
      <HeaderBar class="header-bar" @toggle-panel="togglePanel" />
      <div class="panel">
        <Projectlist
          @select-project="setSelectedProject"
          @delete-success="refreshProjects"
          @update-files="refreshFiles"
        />
        <component
          :is="selectedComponent"
          :project="selectedProject"
          :files="files"
          :selectedWorkspace="selectedProject ? selectedProject.name : ''"
          @upload-success="refreshFiles"
        />
        <FileList
          :files="files"
          :project="selectedProject"
          @upload-success="refreshFiles"
          v-if="selectedProject && files.length > 0"
          class="file-list-container"
        />
      </div>
    </div>
    <div v-if="!showMainPanel" class="panel">
      <Ai class="header-bar" @toggle-panel="togglePanel" />
      <div class="content">
        <ChatSidebar 
          class="chat-sidebar" 
          @load-chat="loadChatHistory"
          @new-chat="startNewChat"
          @select-document="selectDocument"
        />
        <div class="separator"></div>
        <ChatArea 
          class="chat-area" 
          ref="chatArea"
          :selectedDocument="selectedDocument"
        />
        <div class="separator"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Ai from "./Ai.vue";
import ChatArea from "./ChatArea.vue";
import ChatSidebar from "./ChatSidebar.vue";
import HeaderBar from "./HeaderBar.vue";
import UploadComponent from "./Upload.vue";
import Projectlist from "./Projectlist.vue";
import AdvancedSearch from "./AdvancedSearch.vue";
import FileList from "./Filelist.vue";
import AuthService from "../scripts/AuthService";

export default {
  name: "MainApp",
  components: {
    Ai,
    ChatArea,
    ChatSidebar,
    HeaderBar,
    UploadComponent,
    Projectlist,
    AdvancedSearch,
    FileList,
  },
  data() {
    return {
      showMainPanel: true,
      selectedProject: null,
      projects: [],
      files: [],
      selectedDocument: null,
    };
  },
  computed: {
    selectedComponent() {
      if (this.selectedProject) {
        return this.selectedProject.files && this.selectedProject.files.length === 0
          ? "UploadComponent"
          : "AdvancedSearch";
      }
      return null;
    },
  },
  methods: {
    togglePanel() {
      this.showMainPanel = !this.showMainPanel;
    },
    async setSelectedProject(project) {
      this.selectedProject = project;
    },
    async fetchProjects() {
      // 這個方法可能不再需要，因為 Projectlist 組件會處理
    },
    async refreshFiles(files) {
      if (this.selectedProject) {
        this.files = files;
      }
    },
    async refreshProjects() {
      // 重新獲取項目列表
      this.$refs.projectlist?.fetchWorkspaces();
    },
    
    // AI Chat 相關方法
    loadChatHistory(chat) {
      // 載入聊天歷史到 ChatArea
      if (this.$refs.chatArea) {
        this.$refs.chatArea.loadChatHistory(chat);
      }
    },
    
    startNewChat() {
      // 開始新的聊天對話
      if (this.$refs.chatArea) {
        this.$refs.chatArea.startNewChat();
      }
    },
    
    selectDocument(document) {
      // 選擇文檔進行 AI 分析
      this.selectedDocument = document;
      if (this.$refs.chatArea) {
        this.$refs.chatArea.setSelectedDocument(document);
      }
    },
  },
  async mounted() {
    // 檢查認證狀態
    if (!AuthService.isAuthenticated()) {
      this.$router.push('/login');
    }
  },
};
</script>

<style>
#main-app {
  position: absolute;
  top: 70px; /* 調整為 HeaderBar 的高度 */
  height: calc(100vh - 70px);
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 70px);
}

.header-bar {
  flex-shrink: 0;
}

.panel {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  gap: 20px;
  padding: 20px;
}

.file-list-container {
  margin-left: auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.content {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  margin-top: 0;
  padding: 20px;
  gap: 20px;
}

.chat-list,
.chat-area,
.chat-file {
  flex: 1;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.separator {
  width: 2px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  margin: 0px;
  border-radius: 1px;
}
</style>
