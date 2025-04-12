<template>
  <div
    class="project-item"
    @mouseenter="showDeleteButton"
    @mouseleave="hideDeleteButton"
  >
    <h3>{{ project.name }}</h3>
    <p>檔案數量: {{ project.files.length }}</p>
    <button v-if="showDelete" @click="deleteProject" class="delete-button">
      X
    </button>
    
  </div>
</template>

<script>
import ProjectItem from "../scripts/ProjectItem";
export default ProjectItem;
</script>

<style scoped src="../styles/ProjectItem.css"></style>
