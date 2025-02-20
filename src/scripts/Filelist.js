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
      const data = {
        token: this.getCookie("token"),
        workspace: this.project.name,
        files: filesData,
      };

      try {
        const response = await fetch(
          "https://wos-data-analysis-backend.onrender.com/api/file/upload",
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
      const data = {
        token: this.getCookie("token"),
        workspace: this.project.name,
        files: this.selectedFiles,
      };

      try {
        const response = await fetch(
          "https://wos-data-analysis-backend.onrender.com/api/file/deleteFiles",
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
