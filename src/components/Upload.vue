<template>
  <div class="layout-container work-area-wrapper">
    <section>
      <label class="upload-area">
        <h2 class="main-subheader">上傳論文檔案</h2>
        <div class="dashes" @click="triggerFileInput">
          <div class="brand-btn-container brand-color">
            <a class="btn-wrapper upload-btn">
              <div class="upload-icon">📁</div>
              <span class="btn-label">點擊選擇檔案或拖拽到此處</span>
              <small style="color: #999; margin-top: 8px;">支援 PDF, TXT, DOC 等格式</small>
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
import Upload from "../scripts/Upload.js";
export default Upload;
</script>

<style scoped src="../styles/Upload.css"></style>
