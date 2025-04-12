import ProjectItem from "../components/ProjectItem.vue";
import { ref, watch } from "vue";
import { backendURL } from "./config";


let workspaceTempId = ref("fbce270d-7277-4660-8e00-9e9d7d26250c"); //自己放自己要測試的workspace_id
let userTempId = ref("e53a6f2b-d2c8-4bbb-bea3-7822bdca0a86"); //自己放自己要測試的user_id

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
      const token = localStorage.getItem("jwt");
      const currentWorkspace = workspaceTempId; // 之後要放workspace的id
     
      try {
        // 會送出token, 獲取這個user所持有的工作區
        const email = localStorage.getItem("userEmail");
        const emailResponse = await fetch(
          `${backendURL}/user/email/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            return data.user;
          })
          .catch(function (err) {
            console.log(err);
          });
        userTempId = ref(emailResponse.user_id);
        const currentUser = emailResponse.user_id;

        const response = await fetch(
          `${backendURL}/user/${currentUser}`, //建議包url都單引號 by 智涵 你說的單引號指的是``還是''
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          const workspaceIds = result.user.workspace_ids;
          // 要用個for loop 把這位user的工作區一一列出來
          // result 應該是一個 user 然後抓 user.workspace_ids
          const workspaceDetails = await Promise.all(
            workspaceIds.map(async (workspaceId) => {
              const workspaceResponse = await fetch(
                `${backendURL}/workspaces/${workspaceId}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
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
          console.log("this.project", this.projects);
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
    async findLastWorkspace() {
      console.log("addWorkspaceToUser");
      try {
        const response = await fetch(
          `${backendURL}/workspaces`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.getCookie("token")}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("所有工作區", result);

          // 確保 result 是一個陣列，並且有至少一個工作區
          if (Array.isArray(result) && result.length > 0) {
            const lastWorkspace = result[result.length - 1].workspace_id;

            console.log("最後一個工作區_id", lastWorkspace);
            // 將剛加入的工作區的 ID 添加到用戶的 workspace_ids 中
            const currentUser = userTempId.value;

            const userResponse = await fetch(
              `${backendURL}/user/${currentUser}/workspace/${lastWorkspace}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (userResponse.ok) {
              const userResult = await userResponse.json();
            } else {
              console.error("獲取用戶資料失敗", userResponse.statusText);
            }
          } else {
            console.error("沒有找到任何工作區");
          }
        } else {
          console.error("獲取工作區失敗", response.statusText);
        }
      } catch (error) {
        console.error("請求失敗", error);
      }
    }, // 這裡是新增工作區的函數，找到最後一個工作區，然後把它加到用戶的工作區列表裡
    async addProject() {
      if (this.newProjectName) {
        const data = {
          token: localStorage.getItem("jwt"),
          name: this.newProjectName,
        };

        try {
          const response = await fetch(
            `${backendURL}/workspaces`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          console.log("response", response);

          if (response.ok) {
            const result = await response.json();
            alert("工作區新增成功");
            this.closeAddProjectModal();
            await this.findLastWorkspace();
            await this.fetchWorkspaces();
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
          `${backendURL}/workspaces`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          project.files = result.files.length;
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
          `${backendURL}/workspaces/${currentWorkspace.value}`,
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
