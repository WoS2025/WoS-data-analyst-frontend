<template>
  <div
    class="project-item"
    @mouseenter="showDeleteButton"
    @mouseleave="hideDeleteButton"
  >
    <div class="project-name">{{ project.name }}</div>
    <div class="project-info">
      {{ project.files.length }} 個檔案
    </div>
    <button v-if="showDelete" @click="deleteProject" class="delete-button">
      ×
    </button>
  </div>
</template>

<script>
import ProjectItem from "../scripts/ProjectItem";
export default ProjectItem;
</script>

<style scoped src="../styles/ProjectItem.css"></style>
