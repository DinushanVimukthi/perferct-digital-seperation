<script setup lang="ts">

import Sidebar from "@components/Sidebar.vue";
import Navbar from "@components/Navbar.vue";
import LucideLayoutDashboard from "@components/Icon/Dashboard.vue";
import MingcuteTask2Line from "@components/Icon/Task.vue";
import LucideSettings from "@components/Icon/Setting.vue";
import {SideBarLink} from "@/types/SideBar.ts";
import {Users,Dashboard,Settings,ReportAnalytics,ClipboardList,Activity,BrandStackoverflow,Clock} from "@vicons/tabler";
import {onMounted} from "vue";
import {useLoaderStore} from "@store/loaderStore.ts";
import LucideClock from "@components/Icon/Clock.vue";
import FluentCollections24Regular from "@components/Icon/Collectable.vue";
onMounted(()=>{
  setTimeout(()=>{
    const loaderStore = useLoaderStore();
    loaderStore.setLoading(false);
  },2000 )
})

const SideBarLinks:SideBarLink[] =
    [
      {
        name: "Dashboard",
        icon: Dashboard,
        path: "/owner/dashboard"
      },
      {
        name: "Manage User",
        icon: Users,
        path: "/owner/manageUser",
      },
      {
        name: "Jobs",
        icon: ClipboardList,
        path: "/owner/ongoing",
        toggle: true,
        subLinks: [
          {
            name: "Current Jobs",
            icon: Activity,
            path: "/owner/currentJob"
          },
          {
            name: "Collectable",
            icon: BrandStackoverflow,
            path: "/owner/collectable"
          },
            {
            name: "Past",
            icon: Clock,
            path: "/owner/history"
          },

        ]
      },
        {
        name: "Sheets",
        icon: ReportAnalytics,
        path: "/owner/report",
      },

    ]
</script>

<template>
  <div class="flex flex-row h-screen overflow-hidden bg-gray-100">
    <Sidebar class=" left-0 top-0 min-h-screen" :Links="SideBarLinks" />
    <div class="main-content w-full h-full p-1">
      <Navbar title="Admin Dashboard" />
      <div class="page-content h-full">
        <div class="container-fluid h-[93%]">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>