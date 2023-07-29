<script setup lang="ts">

import Sidebar from "@components/Sidebar.vue";
import Navbar from "@components/Navbar.vue";
import LucideLayoutDashboard from "@components/Icon/Dashboard.vue";
import MingcuteTask2Line from "@components/Icon/Task.vue";
import LucideList from "@components/Icon/ListIcon.vue";
import LucideClock from "@components/Icon/Clock.vue";
import EpFinished from "@components/Icon/Finish.vue";
import IcRoundReportGmailerrorred from "@components/Icon/ReportIcon.vue";
import FluentCollections24Regular from "@components/Icon/Collectable.vue";
import LucideSettings from "@components/Icon/Setting.vue";
import {SideBarLink} from "@types/SideBar.ts";


const SideBarLinks:SideBarLink[] =
    [
      {
        name: "Dashboard",
        icon: LucideLayoutDashboard,
        path: "/inEmp/dashboard"
      },
      {
        name: "Jobs",
        icon: MingcuteTask2Line,
        path: "/inEmp/ongoing",
        toggle: true,
        subLinks: [
          {
            name: "Current Jobs",
            icon: LucideClock,
            path: "/inEmp/current"
          },
          {
            name: "Collectable",
            icon: FluentCollections24Regular,
            path: "/inEmp/collectable"
          },
        ]
      },
      {
        name: "Settings",
        icon: LucideSettings,
        path: "/inEmp/settings"
      },


    ]
</script>

<template>
  <div class="flex flex-row h-screen overflow-hidden bg-gray-100">
    <Sidebar class=" left-0 top-0 min-h-screen" :Links="SideBarLinks" />
    <div class="main-content w-full h-full p-1">
      <Navbar title="Employee Dashboard" />
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