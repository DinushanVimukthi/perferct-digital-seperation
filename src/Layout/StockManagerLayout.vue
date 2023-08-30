<script setup lang="ts">

import Sidebar from "@components/Sidebar.vue";
import Navbar from "@components/Navbar.vue";
import {onMounted, ref} from "vue";
import LucideLayoutDashboard from "@components/Icon/Dashboard.vue";
import MingcuteTask2Line from "@components/Icon/Task.vue";
import LucideList from "@components/Icon/ListIcon.vue";
import LucideClock from "@components/Icon/Clock.vue";
import EpFinished from "@components/Icon/Finish.vue";
import IcRoundReportGmailerrorred from "@components/Icon/ReportIcon.vue";
import LucideSettings from "@components/Icon/Setting.vue";
import {useLoaderStore} from "@store/loaderStore.ts";

onMounted(()=>{
  const loaderStore = useLoaderStore();
  loaderStore.setLoading(false);
})
interface SideBarLink {
  name: string;
  icon: any;
  path: string;
  toggle?: boolean;
  subLinks?: SideBarLink[];
}

const SideBarLinks:SideBarLink[] =
    [
      // {
      //   name: "Dashboard",
      //   icon: LucideLayoutDashboard,
      //   path: "/stockManager/dashboard"
      // },
      {
        name: "Stock",
        icon: MingcuteTask2Line,
        path: "/stockManager/stock",
      },
    ]
</script>

<template>
  <div class="flex flex-row h-screen overflow-hidden bg-gray-100">
    <Sidebar class=" left-0 top-0 min-h-screen" :Links="SideBarLinks" />
    <div class="main-content w-full h-full p-1">
      <Navbar title="Stock Manager Dashboard" />
      <div class="page-content h-full">
        <div class="container-fluid min-h-full">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>