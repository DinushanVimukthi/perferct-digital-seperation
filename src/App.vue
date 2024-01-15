<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides,NNotificationProvider,NMessageProvider,NDialogProvider,NSpin,NIcon } from 'naive-ui'
import {onBeforeMount, onMounted, ref, watch} from "vue";
import {useSheetStore} from "@/store/sheetStore.ts"
import {addSheetHooks} from "@/services/sheetServices.ts";
import {addJobHooks} from "@/services/jobServices.ts";

import {useJobStore} from "@store/jobStore.ts";
import {getCurrentUser} from "@/services/userService.ts";
import {useLoaderStore} from "@store/loaderStore.ts";
import { Loader } from '@vicons/tabler'
import {useAdminStore} from "@store/adminStore.ts";

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#6C3CFE',
    textColor1: '#6C3CFE',
  },
  Table: {
    headerColor: '#000000',
  },
  Button:{
    color: '#6C3CFE',
    textColor: '#ffffff',
  },
  Card:{
    titleTextColor: '#ffffff',
    titleFontSizeLarge: '2rem',
  },
}
onBeforeMount(async () => {
  const loaderStore = useLoaderStore();
  loaderStore.setLoading(true)
  const sheetStore = useSheetStore()
  const jobStore = useJobStore()
  const adminStore = useAdminStore()
  await adminStore.getAllUsers()
  await sheetStore.InitializeSheets()
  await jobStore.InitializeJobs()
  addSheetHooks()
  addJobHooks()
  await getCurrentUser()
})

onMounted(() => {
  setTimeout(() => {
    const loaderStore = useLoaderStore();
    loaderStore.setLoading(false)
  }, 4000)
})

</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="absolute flex items-center justify-center top-0 h-screen w-screen z-40" :style="{background: 'rgba(0,0,0,0.5)'} " v-if="useLoaderStore().getLoading">
      <n-spin
          size="large"
          class="text-white ">
        <img src="@/assets/Images/loading.png" class="mb-5 z-50" alt="">
        <template #icon>
          <n-icon color="#ffffff" size="40" >
            <Loader />
          </n-icon>
        </template>
      </n-spin>
    </div>
    <n-dialog-provider>
      <n-message-provider>
        <n-notification-provider>
          <router-view />
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style>


</style>
