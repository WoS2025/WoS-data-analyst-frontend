import ProjectItem from "../components/ProjectItem.vue";


const temp_id = ref('200270e4-2982-409f-8424-e3817969ca80');

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

      const currentWorkspace = temp_id; // 之後要放workspace的id

      try {
        // 會送出token, 獲取這個user所持有的工作區
        const response = await fetch(
          "https://backend-refactor-nqz1.onrender.com/workspaces",
          {
            method: "GET",
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

      const currentWorkspace = temp_id; // 之後要放workspace的id


      if (this.newProjectName) {
        const data = {
          token: this.getCookie("token"),
          name: this.newProjectName,
        };



        try {
          const response = await fetch(
            "https://backend-refactor-nqz1.onrender.com/workspaces",
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
        // 不確定要改成哪個API
        const response = await fetch(
          "https://backend-refactor-nqz1.onrender.com/workspaces",
          {
            method: "GET",
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

      const currentWorkspace = temp_id; // 之後要放workspace的id


      try {
        const response = await fetch(
          "https://backend-refactor-nqz1.onrender.com/workspaces/%{currentWorkspace.value}",
          {
            method: "DELETE",
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
