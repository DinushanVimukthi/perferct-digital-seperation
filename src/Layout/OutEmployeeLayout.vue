<script setup lang="ts">

import Sidebar from "@components/Sidebar.vue";
import Navbar from "@components/Navbar.vue";
import {ref} from "vue";
import LucideLayoutDashboard from "@components/Icon/Dashboard.vue";
import MingcuteTask2Line from "@components/Icon/Task.vue";
import LucideList from "@components/Icon/ListIcon.vue";
import LucideClock from "@components/Icon/Clock.vue";
import EpFinished from "@components/Icon/Finish.vue";
import IcRoundReportGmailerrorred from "@components/Icon/ReportIcon.vue";
import LucideSettings from "@components/Icon/Setting.vue";

interface SideBarLink {
  name: string;
  icon: any;
  path: string;
  toggle?: boolean;
  subLinks?: SideBarLink[];
}

const SideBarLinks:SideBarLink[] =
    [
      {
        name: "Dashboard",
        icon: LucideLayoutDashboard,
        path: "/outEmp/dashboard"
      },
      {
        name: "Jobs",
        icon: MingcuteTask2Line,
        path: "/outEmp/ongoing",
        toggle: true,
        subLinks: [
          {
            name: "Pending Jobs",
            icon: LucideList,
            path: "/outEmp/pending"
          },
          {
            name: "Ongoing Jobs",
            icon: LucideClock,
            path: "/outEmp/ongoing"
          },

          {
            name: "Finished Jobs",
            icon: EpFinished,
            path: "/outEmp/finished"
          }
        ]
      },
      {
        name: "Report Issue",
        icon: IcRoundReportGmailerrorred,
        path: "/outEmp/reportIssue"
      },
      {
        name: "Settings",
        icon: LucideSettings,
        path: "/outEmp/settings"
      },


    ]
</script>

<template>
  <div class="flex flex-row h-screen overflow-hidden bg-gray-100">
    <Sidebar class=" left-0 top-0 min-h-screen" :Links="SideBarLinks" />
    <div class="main-content w-full h-full p-1">
      <Navbar title="Employee Dashboard" />
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