<script setup lang="ts">

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  icon: {
    type: Object,
    required: false
  },
  color: {
    type: String,
    required: false
  },
  shadowColor: {
    type: String,
    required: false
  },
  textColor: {
    type: String,
    required: false
  },
  borderColor: {
    type: String,
    required: true
  },
  titleColor: {
    type: String,
    required: false
  }
})

</script>

<template>
  <div
      :class="`border-${borderColor} border-2 shadow-${shadowColor} text-${textColor} shadow-lg hover:shadow-none hover:border-none`"
      class="flex bg-white p-5 rounded-xl gap-2 items-center justify-center flex-col"
  >
    <span
        :class="`text-${titleColor}`"
        class="text-5xl font-bold"

    >
      {{number}}
    </span>
    <div :class="`text-sm text-${textColor}`">
      {{title}}
    </div>
  </div>
</template>

<style scoped>

</style>