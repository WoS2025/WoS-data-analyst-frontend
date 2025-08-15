<template>
  <div :class="{ collapsed: isCollapsed }">
    <div class="project-list">
      <ul v-if="!isCollapsed">
        <li v-for="(project, index) in projects" :key="index">
          <ProjectItem
            :class="{ active: selectedProject === project }"
            :project="project"
            @click="selectProject(project, index)"
            @delete-project="confirmDeleteProject(project.name, index)"
          />
        </li>
      </ul>
      <button v-if="!isCollapsed" @click="showAddProjectModal">
        增加新的Project
      </button>
      <div class="toggle-button" @click="toggleSidebar">
        <span v-if="isCollapsed">&gt;</span>
        <span v-else>&lt;</span>
      </div>
    </div>

    <!-- 新增工作區的懸浮框 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddProjectModal">&times;</span>
        <h2>新增工作區</h2>
        <input
          class="large-input"
          type="text"
          v-model="newProjectName"
          placeholder="輸入新的Project名稱"
        />
        <button @click="addProject">增加</button>
      </div>
    </div>

    <!-- 刪除確認提示框 -->
    <div v-if="isDeleteModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="hideDeleteModal">&times;</span>
        <h2>確定刪除工作區 "{{ projectToDelete }}" 嗎？</h2>
        <button @click="deleteProject(isDeleteModalVisible - 1)">確認</button>
        <button @click="hideDeleteModal">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import Projectlist from "../scripts/Projectlist.js";
export default Projectlist;
</script>

<style scoped src="../styles/Projectlist.css"></style>
