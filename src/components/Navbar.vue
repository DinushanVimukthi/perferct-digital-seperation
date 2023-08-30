<script setup lang="ts">
import {Power} from "@vicons/ionicons5"
import {User as UserIcon} from "@vicons/tabler"
import {NIcon, NotificationType, useNotification} from "naive-ui"
import {useUserStore} from "@store/UserStore.ts";
import router from "@/router";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const notification = useNotification();
const notify = (type: NotificationType, title: string, message: string) => {
  notification[type]({
    content: message,
    title,
    duration: 2500,
    keepAliveOnHover: true
  })
}

const logout = () => {
  const userStore = useUserStore()
  userStore.logOutUser()
  router.push('/')
  notify('success', 'Success', 'Logged out successfully');
}
</script>

<template>
  <nav class="bg-white flex shadow-lg mb-1 max-h-16 h-16 p-4">
    <div class="flex  gap-2">
      <div class="flex items-center gap-2">
        <n-icon size="large" :component="UserIcon"/>
        <div class="font-bold">
          {{ useUserStore().user?.userName }}
        </div>
      </div>
    </div>
    <div class="container mx-auto flex items-center justify-center">
      <div class="text-black font-bold text-xl">
        {{ title }}
      </div>
    </div>

      <n-button
          class="absolute right-4 top-4 flex items-center justify-center bg-blue-100 py-2 px-4 border border-blue-700 gap-4 rounded-2xl hover:bg-white hover:text-blue-800 transition-all hover:cursor-pointer hover:shadow-md hover:shadow-blue-500"
          @click="logout">
        <n-icon size="large" :component="Power"/>
        Logout
      </n-button>
  </nav>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

nav {
  font-family: 'Poppins', sans-serif;
}
</style>
