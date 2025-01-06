<!-- Filelist.vue -->

<template>
  <div class="file-list-wrapper">
    <div class="file-list-icon" @click="toggleFileList">
      <span v-if="!isExpanded">&#9776;</span>
      <span v-else>&times;</span>
    </div>
    <div class="file-list" v-if="isExpanded">
      <h3>檔案列表</h3>
      <ul class="files">
        <li v-for="file in files" :key="file.name">
          <a :href="file.url" target="_blank">{{ file.name }}</a>
          <input
            type="checkbox"
            v-if="deleteMode"
            v-model="selectedFiles"
            :value="file.name"
          />
        </li>
      </ul>
      <div class="upload-section">
        <input
          type="file"
          @change="handleFileUpload"
          ref="fileInput"
          style="display: none"
          multiple
        />
        <button @click="deleteMode ? confirmDelete() : triggerFileInput()">
          {{ deleteMode ? "確認" : "上傳檔案" }}
        </button>
        <button @click="toggleDeleteMode">刪除</button>
      </div>
    </div>
  </div>
</template>



<script>
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
</script>

<style scoped>
.file-list-wrapper {
  position: fixed;
  top: 18%; /* 调整为 header 底下 */
  right: 20px;
  z-index: 1000;
}

.file-list-icon {
  width: 40px;
  height: 40px;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  transition: background-color 0.3s ease;
}

.file-list-icon:hover {
  background-color: #555;
}

.file-list {
  width: 250px;
  max-height: 400px;
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  margin-top: 10px; /* 适当调整 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.files {
  flex-grow: 1;
  overflow-y: auto;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 10px;
}

a {
  text-decoration: none;
  color: #333;
}

a:hover {
  text-decoration: underline;
  color: #555;
}

.upload-section {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.upload-section button {
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.upload-section button:hover {
  background-color: #555;
}
</style>
