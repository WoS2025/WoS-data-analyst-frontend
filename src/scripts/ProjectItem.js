

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
