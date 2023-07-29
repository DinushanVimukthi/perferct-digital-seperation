<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <nav class="bg-white shadow-lg mb-1 max-h-16 h-16 p-4">
    <div class="container mx-auto flex items-center justify-center">
      <div class="text-black font-bold text-xl">
        {{ title }}
      </div>
    </div>
  </nav>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

nav{
  font-family: 'Poppins', sans-serif;
}
</style>
