<template>
  <div class="home">
    <Editer v-model="state"></Editer>
  </div>
</template>

<script>
import { ref, provide } from "vue";
import data from "./data.json";
import Editer from "../packages/Editer.jsx";
import { config } from "../utils/editer-register.jsx";
export default {
  components: {
    Editer,
  },
  setup() {
    const state = ref(data);
    provide("config", config);
    return {
      state,
    };
  },
};
</script>

<style lang="scss">
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  .home {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    min-width: 1000px;
    min-height: 500px;
    background-color: #ccc;
  }
}
</style>
