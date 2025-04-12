import { ref, watch } from "vue";
import { backendURL } from "./config";


const temp_id = ref('200270e4-2982-409f-8424-e3817969ca80');

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
          
          const currentWorkspace = temp_id; // 之後要放workspace的id
          const data = {
            // 之後filesData要加密為base64
            files: filesData,
          };
    

          try {
            // 會送出token 工作區 上傳的文件
            // 將上傳的文件保存，並指定使用者與其所屬的工作區
            const response = await fetch(
              `${backendURL}/workspaces/${currentWorkspace.value}/files/${fileData.name}`,
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
        } else {
          alert("文件尚未全部讀取完成，請稍後再試");
        }
      } else {
        alert("請先上傳文件");
      }
    },
  },
};
