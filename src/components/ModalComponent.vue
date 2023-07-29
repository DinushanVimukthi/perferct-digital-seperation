<script setup lang="ts">

import {ref } from "vue";

const props = defineProps({
  trigger: {
    type: Boolean,
    default: false,
    required: false
  }
})

const trigger = ref<boolean>(props.trigger);

</script>

<template>
<div class="h-screen flex items-center justify-center w-screen bg-black z-50 text-white absolute" v-if="trigger">
  <h1>
    Modal
  </h1>
  <button @click="trigger = !trigger">
    Close
  </button>
</div>
</template>

<style scoped>

</style>