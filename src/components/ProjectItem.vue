<!-- ProjactItem.vue -->

<template>
  <div
    class="project-item"
    @mouseenter="showDeleteButton"
    @mouseleave="hideDeleteButton"
  >
    <h3>{{ project.name }}</h3>
    <p>檔案數量: {{ project.files }}</p>
    <button v-if="showDelete" @click="deleteProject" class="delete-button">
      X
    </button>
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
      showDelete: false,
    };
  },
  methods: {
    showDeleteButton() {
      this.showDelete = true;
    },
    hideDeleteButton() {
      this.showDelete = false;
    },
    deleteProject() {
      this.$emit("delete-project", this.project.name);
    },
  },
};
</script>

<style scoped>
.project-item {
  position: relative;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
