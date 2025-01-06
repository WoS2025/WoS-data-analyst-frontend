<!-- Upload.vue -->

<template>
  <div class="layout-container work-area-wrapper">
    <section>
      <label class="upload-area">
        <h2 class="main-subheader">上傳你需要解析的論文</h2>
        <div class="dashes">
          <div class="brand-btn-container brand-color">
            <a class="btn-wrapper upload-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                fill="none"
              >
                <path
                  fill="#fff"
                  fill-rule="evenodd"
                  d="M5.6.6c-.7 0-1.3.5-1.3 1.2v2.5H1.8a1.3 1.3 0 000 2.5h2.5v2.5a1.3 1.3 0 102.5 0V6.8h2.5a1.2 1.2 0 100-2.5H6.8V1.8c0-.7-.5-1.2-1.2-1.2z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="btn-label">選擇檔案</span>
            </a>
          </div>
          <input
            class="file-upload-input"
            type="file"
            multiple
            @change="handleFiles"
            ref="fileInput"
            accept=".txt"
          />
        </div>
      </label>
      <div class="file-list">
        <div v-for="file in files" :key="file.name" class="file-item">
          <span>{{ file.name }}</span>
          <span>{{ (file.size / 1024).toFixed(2) }} KB</span>
        </div>
      </div>
      <div class="action-buttons">
        <button @click="convertFiles">開始上傳</button>
      </div>
    </section>
  </div>
</template>

<script>
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
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    handleFiles(event) {
      this.files = Array.from(event.target.files);
      let filesData = [];
      this.files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          filesData.push({ name: file.name, content: e.target.result });
          if (filesData.length === this.files.length) {
            this.filesData = filesData;
          }
        };
        reader.readAsText(file);
      });
    },
    async convertFiles() {
      if (this.files && this.files.length > 0) {
        if (this.filesData && this.filesData.length === this.files.length) {
          const data = {
            token: this.getCookie("token"),
            workspace: this.project.name,
            files: this.filesData,
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
              this.$emit("upload-success"); // 通知父组件上传成功
            } else {
              console.error("文件上傳失敗", response.statusText);
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
</script>



<style scoped>
.layout-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.work-area-wrapper {
  width: 100%;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dashes {
  width: 300px;
  border: 2px solid #ccc;
  background: rgb(156, 153, 153);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.btn-label {
  color: aliceblue;
}

.main-subheader {
  margin-bottom: 20px;
}

.btn-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.file-upload-input {
  display: none;
}

.file-list {
  margin-top: 20px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.action-buttons {
  margin-top: 20px;
}

.action-buttons button {
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 15px;
}

.action-buttons button:hover {
  background-color: #ddd;
}
</style>
