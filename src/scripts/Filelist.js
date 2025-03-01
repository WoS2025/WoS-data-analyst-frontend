import { ref, watch } from "vue";


const temp_id = ref('200270e4-2982-409f-8424-e3817969ca80');



export default {
  name: "FileList",
  props: {
    files: {
      type: Array,
      required: true,
      default: () => [],
    },
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deleteMode: false,
      selectedFiles: [],
      isExpanded: false, // 新增的狀態變量，用來控制文件列表顯示
    };
  },
  methods: {
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    toggleFileList() {
      this.isExpanded = !this.isExpanded;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileUpload(event) {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      // 檢查是否有重複文件
      const existingFileNames = this.files.map((file) => file.name);
      const duplicateFiles = files.filter((file) =>
        existingFileNames.includes(file.name)
      );
      if (duplicateFiles.length > 0) {
        alert(
          `檔案重複: ${duplicateFiles.map((file) => file.name).join(", ")}`
        );
        return;
      }

      const filesData = [];
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          filesData.push({ name: file.name, content: e.target.result });
          if (filesData.length === files.length) {
            this.uploadFiles(filesData);
          }
        };
        reader.readAsText(file);
      }
    },
    async uploadFiles(filesData) {
      const currentWorkspace = temp_id; // 之後要放workspace的id
      const data = {
        // 之後filesData要加密為base64
        files: filesData,
      };

      try {
        // 會提交token 工作區 上傳的文件
        // 上傳文件後將其儲存至資料庫

        
        const response = await fetch(
          "https://backend-refactor-nqz1.onrender.com/workspaces/${currentWorkspace.value}/files",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("文件上傳成功：", result);
          alert("文件上傳成功");
          this.$emit("upload-success");
        } else {
          console.error("文件上傳失敗", response.statusText);
          alert("文件上傳失敗");
        }
      } catch (error) {
        console.error("請求失敗", error);
        alert("請求失敗");
      }
    },
    toggleDeleteMode() {
      this.deleteMode = !this.deleteMode;
      this.selectedFiles = [];
    },
    async confirmDelete() {
      const currentWorkspace = temp_id; // 之後要放workspace的id
      const fileData = "abc"; // 之後改為刪除指定的檔案

      const data = {
        files: this.selectedFiles,
      };

      try {
        // 會提交token 工作區 選擇刪除的文件
        // "刪除"：勾選好要刪除的文件以後，也通知後端將其移除於資料庫
        const response = await fetch(
          "https://backend-refactor-nqz1.onrender.com/workspaces/${currentWorkspace.value}/files/${fileData.name}",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("文件刪除成功：", result);
          alert("文件刪除成功");
          this.$emit("upload-success");
        } else {
          console.error("文件刪除失敗", response.statusText);
          alert("文件刪除失敗");
        }
      } catch (error) {
        console.error("請求失敗", error);
        alert("請求失敗");
      }

      this.toggleDeleteMode();
    },
  },
};
