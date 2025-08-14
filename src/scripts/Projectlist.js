import ProjectItem from "../components/ProjectItem.vue";
import { ref, watch } from "vue";
import { backendURL } from "./config";
import AuthService from "./AuthService";

// 移除硬編碼的臨時 ID，改用動態獲取

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

    // 檢查用戶認證狀態
    checkAuthStatus() {
      return AuthService.checkAuthAndRedirect();
    },

    // 獲取當前用戶 ID 的方法（優化版）
    getCurrentUserId() {
      return AuthService.getCurrentUserId();
    },

    // 創建帶認證的請求 headers
    getAuthHeaders() {
      return AuthService.getAuthHeaders();
    },

    async fetchWorkspaces() {
      // 檢查認證狀態
      if (!this.checkAuthStatus()) {
        return;
      }

      try {
        // 獲取當前用戶 ID
        const currentUser = this.getCurrentUserId();
        if (!currentUser) {
          console.error("無法獲取用戶ID");
          return;
        }

        const response = await fetch(
          `${backendURL}/user/${currentUser}`,
          {
            method: "GET",
            headers: this.getAuthHeaders(),
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success') {
            const workspaceIds = result.user.workspace_ids;
            // 要用個for loop 把這位user的工作區一一列出來
            const workspaceDetails = await Promise.all(
              workspaceIds.map(async (workspaceId) => {
                const workspaceResponse = await fetch(
                  `${backendURL}/workspaces/${workspaceId}`,
                  {
                    method: "GET",
                    headers: this.getAuthHeaders(),
                  }
                );

                if (workspaceResponse.ok) {
                  return await workspaceResponse.json();
                } else {
                  console.error(
                    `獲取工作區 ${workspaceId} 詳細資料失敗`,
                    workspaceResponse.statusText
                  );
                  return null;
                }
              })
            );

            this.projects = workspaceDetails.filter(
              (workspace) => workspace !== null
            );
            console.log("this.projects", this.projects);
          } else {
            console.error("獲取用戶工作區失敗:", result.message);
          }
        } else {
          console.error("獲取工作區失敗", response.statusText);
          // 使用統一的錯誤處理
          AuthService.handleApiError(response);
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
    async findLastWorkspace() {
      console.log("addWorkspaceToUser");
      try {
        const response = await fetch(`${backendURL}/workspaces`, {
          method: "GET",
          headers: this.getAuthHeaders(),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("所有工作區", result);

          // 確保 result 是一個陣列，並且有至少一個工作區
          if (Array.isArray(result) && result.length > 0) {
            const lastWorkspace = result[result.length - 1].workspace_id;

            console.log("最後一個工作區_id", lastWorkspace);
            // 將剛加入的工作區的 ID 添加到用戶的 workspace_ids 中
            const currentUser = this.getCurrentUserId();
            if (!currentUser) {
              console.error("無法獲取用戶ID");
              return;
            }

            const userResponse = await fetch(
              `${backendURL}/user/${currentUser}/workspace/${lastWorkspace}`,
              {
                method: "GET",
                headers: this.getAuthHeaders(),
              }
            );

            if (userResponse.ok) {
              const userResult = await userResponse.json();
              console.log("添加工作區到用戶成功:", userResult);
            } else {
              console.error("獲取用戶資料失敗", userResponse.statusText);
              AuthService.handleApiError(userResponse);
            }
          } else {
            console.error("沒有找到任何工作區");
          }
        } else {
          console.error("獲取工作區失敗", response.statusText);
          AuthService.handleApiError(response);
        }
      } catch (error) {
        console.error("請求失敗", error);
      }
    }, // 這裡是新增工作區的函數，找到最後一個工作區，然後把它加到用戶的工作區列表裡
    async addProject() {
      if (!this.checkAuthStatus()) {
        return;
      }

      if (this.newProjectName) {
        const data = {
          name: this.newProjectName,
        };

        try {
          const response = await fetch(`${backendURL}/workspaces/`, {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data),
          });
          console.log("新增工作區 response", response);

          if (response.ok) {
            const result = await response.json();
            console.log("新增工作區結果:", result);
            alert("工作區新增成功");
            this.closeAddProjectModal();
            await this.findLastWorkspace();
            await this.fetchWorkspaces();
          } else {
            console.error("新增工作區失敗", response.statusText);
            AuthService.handleApiError(response);
            alert("新增工作區失敗");
          }
        } catch (error) {
          console.error("請求失敗", error);
          alert("請求失敗");
        }
      }
    },
    async selectProject(project, ind) {
      this.$emit("select-project", project);
      this.selectedProject = project;
      console.log("選中的項目:", project, "索引:", ind);
      console.log("工作區ID:", project.workspace_id);
      localStorage.setItem("workspaceID", project.workspace_id);

      try {
        // 獲取工作區的詳細資訊，包括文件列表
        const response = await fetch(`${backendURL}/workspaces/${project.workspace_id}`, {
          method: "GET",
          headers: this.getAuthHeaders(),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("工作區詳細資料:", result);
          // 從工作區詳細資料中獲取文件列表
          const files = result.files || [];
          this.$emit("update-files", files);
          console.log("工作區底下的檔案:", files);
        } else {
          console.error("獲取工作區詳細資料失敗", response.statusText);
          AuthService.handleApiError(response);
        }
      } catch (error) {
        console.error("請求失敗", error);
      }
    },
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    confirmDeleteProject(projectName, ind) {
      this.projectToDelete = projectName;
      this.isDeleteModalVisible = ind + 1;
    },
    hideDeleteModal() {
      this.isDeleteModalVisible = 0;
    },
    async confirmDeleteProject(ind) {
      if (!this.checkAuthStatus()) {
        return;
      }

      try {
        // 獲取當前用戶 ID
        const currentUser = this.getCurrentUserId();
        if (!currentUser) {
          console.error("無法獲取用戶ID");
          return;
        }

        const response = await fetch(
          `${backendURL}/user/${currentUser}`,
          {
            method: "GET",
            headers: this.getAuthHeaders(),
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success') {
            const workspaceIds = result.user.workspace_ids;
            const deleteWorkspaceId = workspaceIds[ind - 1];
            const deleteResponse = await fetch(
              `${backendURL}/user/${currentUser}/workspace/${deleteWorkspaceId}`,
              {
                method: "DELETE",
                headers: this.getAuthHeaders(),
              }
            );
            if (deleteResponse.ok) {
              this.hideDeleteModal();
              this.fetchWorkspaces();
              window.location.reload();
            } else {
              console.error("刪除失敗", deleteResponse.statusText);
            }
          } else {
            console.error("獲取用戶資料失敗:", result.message);
          }
        } else {
          console.error("刪除失敗", response.statusText);
        }
      } catch (error) {
        alert(`刪除失敗: ${error.message}`);
      }
    },
  },
};
