<template>
  <div class="page-welcome">
    <Horse />
  </div>
</template>

<script>
import Horse from "@/components/horse/Horse.vue"
export default {
  components: {
    Horse
  },
  data() {
    return {

    };
  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
};
</script>

<style scoped lang="scss">
.page-welcome {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
