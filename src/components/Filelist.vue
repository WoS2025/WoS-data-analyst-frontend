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
import Filelist from "../scripts/Filelist.js";
export default Filelist;
</script>

<style scoped src="../styles/Filelist.css"></style>
