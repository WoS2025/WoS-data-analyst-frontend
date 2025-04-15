<!-- app.vue -->
<template>
  <div id="app">
    <router-view />
    <HeaderBar class="header-bar" />
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
</template>

<script>
import HeaderBar from "./components/HeaderBar.vue";
import UploadComponent from "./components/Upload.vue";
import Projectlist from "./components/Projectlist.vue";
import AdvancedSearch from "./components/AdvancedSearch.vue";
import FileList from "./components/Filelist.vue";
import { backendURL } from "./scripts/config";

export default {
  name: "App",
  components: {
    HeaderBar,
    UploadComponent,
    Projectlist,
    AdvancedSearch,
    FileList,
  },
  data() {
    return {
      selectedProject: null,
      projects: [],
      files: [],
    };
  },
  computed: {
    selectedComponent() {
      if (this.selectedProject) {
        return this.selectedProject.files.length === 0
          ? "UploadComponent"
          : "AdvancedSearch";
      }
      return null;
    },
  },
  methods: {
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    async setSelectedProject(project) {
      this.selectedProject = project;
    },
    async fetchProjects() {
      const data = {
        email: localStorage.getItem("email"),
        password: localStorage.getItem("password"),
      };
    },
    // async fetchFiles(workspaceName) {
    //   const data = {
    //     token: this.getCookie("token"),
    //     workspace: workspaceName,
    //   };

    //   try {
    //     // 用以獲取指定工作區(workspaceName)裡面的文件列表
    //     const response = await fetch(
    //       `${backendURL}/user/workspaces/<workspace_id>/files`,
    //       {
    //         method: "PUT",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(data),
    //       }
    //     );

    //     console.log(response.status)

    //     if (response.ok) {
    //       const result = await response.json();
    //       this.files = result.files;
    //       if (this.selectedProject) {
    //         this.selectedProject.files = result.files.length; // 更新项目的文件数量
    //       }
    //     } else {
    //       console.error("獲取工作區檔案失敗", response.statusText);
    //     }
    //   } catch (error) {
    //     console.error("請求失敗", error);
    //   }
    // },
    async refreshFiles(files) {
      if (this.selectedProject) {
        this.files=files
      }
    },
    async refreshProjects() {
      await this.fetchProjects();
      if (this.selectedProject) {
        await this.fetchFiles(this.selectedProject.name);
      }
    },
  },
  async mounted() {
    await this.fetchProjects();
  },
};
</script>

<style>
#app {
  position: absolute;
  top: 8%;
  height: 92%;
  width: 99%;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.header-bar {
  flex-shrink: 0;
}

.panel {
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-grow: 1;
}

.file-list-container {
  margin-left: auto;
}
</style>
