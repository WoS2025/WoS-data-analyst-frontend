import { ref, watch } from "vue";
import { backendURL } from "./config";
import { encode, decode } from "js-base64";

const temp_id = ref("3878f95e-935a-48eb-81ad-ad81f99c9c3d");

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
      if (this.files && this.files.length > 0) {
        if (this.filesData && this.filesData.length === this.files.length) {
          const currentWorkspace = localStorage.getItem("workspaceID");
          console.log(this.filesData, "!!!!!");
          const data = {
            // 之後filesData要加密為base64
            file: this.filesData,
          };
          console.log(data, "!!!!!");

          try {
            // 會送出token 工作區 上傳的文件
            // 將上傳的文件保存，並指定使用者與其所屬的工作區
            const response = await fetch(
              `${backendURL}/workspaces/${currentWorkspace}/files`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );

            if (response.ok) {
              alert("文件上傳成功");
              this.$emit("upload-success");
              window.location.reload();
            } else {
              console.error("文件上傳失敗", response.statusText);
              alert("文件上傳失敗");
              window.location.reload();
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
