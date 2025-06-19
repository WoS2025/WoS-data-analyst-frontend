<template>
  <div class="file-upload-area">
    <button class="file-item">檔案1</button>
    <button class="file-item">檔案2</button>
    <button class="file-item">檔案3</button>
    <button class="file-item new-file">新增檔案</button>
  </div>
</template>

<script>
export default {
  name: "FileUploadArea",
};
</script>

<style scoped>
.file-upload-area {
  width: 20%;
  background-color: #ffffff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 3em;
}

.file-item {
  margin: 5px 0;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  cursor: pointer;
  border-radius: 3em;
}

.new-file {
  background-color: #e0e0e0;
}
</style>
