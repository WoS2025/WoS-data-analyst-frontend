<!-- Projectlist.vue -->

<template>
  <div :class="{ collapsed: isCollapsed }">
    <div class="project-list">
      <ul v-if="!isCollapsed">
        <li v-for="(project, index) in projects" :key="index">
          <ProjectItem
            :class="{ active: selectedProject === project }"
            :project="project"
            @click="selectProject(project)"
            @delete-project="confirmDeleteProject"
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
        <button @click="deleteProject">確認</button>
        <button @click="hideDeleteModal">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectItem from "./ProjectItem.vue";

export default {
  components: {
    ProjectItem,
  },
  data() {
    return {
      projects: [],
      isCollapsed: false,
      selectedProject: null,
      showModal: false,
      newProjectName: "",
      isDeleteModalVisible: false,
      projectToDelete: "",
    };
  },
  async mounted() {
    await this.fetchWorkspaces();
  },
  methods: {
    getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
    async fetchWorkspaces() {
      const token = { token: this.getCookie("token") };

      try {
        const response = await fetch(
          "https://wos-data-analysis-backend.onrender.com/api/file/getWorkspace",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(token),
          }
        );

        if (response.ok) {
          const result = await response.json();
          this.projects = result.workspace.map((workspace) => ({
            name: workspace.name,
            files: workspace.count,
          }));
          console.log(this.projects);
        } else {
          console.error("獲取工作區失敗", response.statusText);
        }
      } catch (error) {
        console.error("請求失敗", error);
      }
    },
    showAddProjectModal() {
      this.showModal = true;
    },
    closeAddProjectModal() {
      this.showModal = false;
      this.newProjectName = "";
    },
    async addProject() {
      if (this.newProjectName) {
        const data = {
          token: this.getCookie("token"),
          name: this.newProjectName,
        };

        try {
          const response = await fetch(
            "https://wos-data-analysis-backend.onrender.com/api/file/newWorkspace",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (response.ok) {
            const result = await response.json();
            alert("工作區新增成功");
            this.closeAddProjectModal();
            await this.fetchWorkspaces(); // 调用fetchWorkspaces以刷新工作区列表
          } else {
            console.error("新增工作區失敗", response.statusText);
            alert("新增工作區失敗");
          }
        } catch (error) {
          console.error("請求失敗", error);
          alert("請求失敗");
        }
      }
    },
    async selectProject(project) {
      this.$emit("select-project", project);
      this.selectedProject = project;

      const data = {
        workspace: project.name,
        token: this.getCookie("token"),
      };

      try {
        const response = await fetch(
          "https://wos-data-analysis-backend.onrender.com/api/file/getFolder",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          const result = await response.json();
          project.files = result.files.length; // 更新项目的文件数量
          this.$emit("update-files", result.files);
          console.log("工作區底下的檔案:", result.files);
        } else {
          console.error("獲取工作區檔案失敗", response.statusText);
        }
      } catch (error) {
        console.error("請求失敗", error);
      }
    },
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    confirmDeleteProject(projectName) {
      this.projectToDelete = projectName;
      this.isDeleteModalVisible = true;
    },
    hideDeleteModal() {
      this.isDeleteModalVisible = false;
    },
    async deleteProject() {
      const data = {
        workspace: this.projectToDelete,
        token: this.getCookie("token"),
      };

      try {
        const response = await fetch(
          "https://wos-data-analysis-backend.onrender.com/api/file/deleteWorkspace",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();

        if (response.ok) {
          alert(`工作區刪除成功: ${result.message}`);
          this.projects = this.projects.filter(
            (project) => project.name !== this.projectToDelete
          );
          this.$emit("delete-success");
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        alert(`刪除失敗: ${error.message}`);
      } finally {
        this.hideDeleteModal();
      }
    },
  },
};
</script>

<style scoped>
.project-list {
  width: 250px;

  height: 100%;
  border-right: 1px solid #ddd;
  padding: 10px;
  box-sizing: border-box;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #f7f7f7;
  border-radius: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  position: relative;
}

li:hover {
  background-color: #e0e0e0;
  cursor: pointer;
}

button {
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #555;
}

.delete-button {
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
}

.toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 40px;
  background-color: #333;
  color: white;
  cursor: pointer;
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  transition: right 0.3s;
  border: none;
  border-radius: 5px;
}

.toggle-button span {
  font-size: 14px;
}

.collapsed .project-list {
  width: 20px;
  overflow: hidden;
}

.collapsed ul,
.collapsed button {
  display: none;
}

.collapsed .toggle-button {
  right: 0;
  background-color: #555;
}

.active {
  background-color: #ccc;
  border-radius: 10px;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.large-input {
  width: 80%;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>
