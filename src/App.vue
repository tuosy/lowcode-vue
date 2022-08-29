<template>
  <div class="home">
    <Editer v-model="state" :formData="formData"></Editer>
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
    const formData = ref({
      username: "tsy",
      password: 123,
    });
    provide("config", config);
    return {
      state,
      formData,
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
