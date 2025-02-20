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
              this.$emit("upload-success");
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
