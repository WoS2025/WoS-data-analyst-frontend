import { ref, watch } from "vue";
import { backendURL } from "./config";
import { encode, decode } from "js-base64";
import AuthService from "./AuthService";

// 移除硬編碼的臨時 ID

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      files: [],
      filesData: [],
    };
  },
  methods: {
    // 觸發檔案選擇器
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // 檢查認證狀態
    checkAuthStatus() {
      return AuthService.checkAuthAndRedirect();
    },

    // 創建帶認證的請求 headers
    getAuthHeaders() {
      return AuthService.getAuthHeaders();
    },

    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    handleFiles(event) {
      console.log("handleFiles");
      this.files = Array.from(event.target.files);
      let filesData = [];
      this.files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          filesData.push({ name: file.name, content: encode(e.target.result) });
          if (filesData.length === this.files.length) {
            this.filesData = filesData;
          }
        };
        reader.readAsText(file);
      });
    },
    async convertFiles() {
      // 檢查認證狀態
      if (!this.checkAuthStatus()) {
        return;
      }

      if (this.files && this.files.length > 0) {
        if (this.filesData && this.filesData.length === this.files.length) {
          const currentWorkspace = localStorage.getItem("workspaceID");
          
          if (!currentWorkspace) {
            alert("請先選擇一個工作區");
            return;
          }

          console.log("上傳文件資料:", this.filesData);
          const data = {
            // 文件資料已經加密為base64
            file: this.filesData,
          };
          console.log("準備上傳的資料:", data);

          try {
            // 會送出token 工作區 上傳的文件
            // 將上傳的文件保存，並指定使用者與其所屬的工作區
            const response = await fetch(
              `${backendURL}/workspaces/${currentWorkspace}/files`,
              {
                method: "PUT",
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data),
              }
            );

            if (response.ok) {
              alert("文件上傳成功");
              this.$emit("upload-success");
              // 清理上傳的文件資料
              this.files = [];
              this.filesData = [];
              // 清理 input 元素
              const fileInput = document.querySelector('input[type="file"]');
              if (fileInput) {
                fileInput.value = '';
              }
            } else {
              console.error("文件上傳失敗", response.statusText);
              AuthService.handleApiError(response);
              alert("文件上傳失敗");
            }
          } catch (error) {
            console.error("請求失敗", error);
            alert("請求失敗");
          }
        } else {
          alert("文件尚未全部讀取完成，請稍後再試");
        }
      } else {
        alert("請先上傳文件");
      }
    },
  },
};
