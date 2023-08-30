<script setup lang="ts">


import MdiChevronDown from "@components/Icon/chevronDown.vue";
import {ref, shallowRef} from "vue";
import LucideChevronUp from "@components/Icon/chevronUp.vue";

import {useRouter} from "vue-router";
import {SideBarLink} from "@type/SideBar.ts";

const router = useRouter();

const props=defineProps({
  Links: {
    type: Array as () => SideBarLink[],
    required: true
  }
})

const SidebarLinks = shallowRef<SideBarLink[]>(props.Links);


const Redirect = (path: string) => {
  router.push(path);
}



const currentRoute = ref<string>(router.currentRoute.value.path);





</script>

<template>
  <div class="bg-white text-black shadow-lg w-64 h-screen p-4">
    <img src="@assets/Images/logo.png" alt="logo" class="w-32 mb-8" />
    <div class="flex flex-col gap-4">
      <div
           class="w-full flex flex-col gap-1 justify-around items-center rounded-2xl"
          v-for="Link in SidebarLinks"
           :key="Link.name"
           @click=" Link.subLinks ? Link.toggle = !Link.toggle : Redirect(Link.path)">
        <div
            :class="(currentRoute === Link.path || Link.subLinks?.find(subLink => subLink.path === currentRoute)) ? 'bg-blue-200' : ''"
            class=" w-full flex gap-2 justify-between items-center px-4 py-2  rounded-2xl font-bold hover:cursor-pointer hover:bg-blue-200 ">
          <div class="flex gap-4 items-center">
            <component :is="Link.icon" class="w-8 h-8" />
            <span class="text-md">{{Link.name}}</span>
          </div>
          <div class="w-1/5 flex justify-center" v-if="Link.subLinks" @click="Link.toggle = !Link.toggle">
            <MdiChevronDown class="w-4/5 h-4/5 rounded-full p-1 hover:bg-blue-200"  v-if="!Link.toggle" @click="Link.toggle = !Link.toggle"/>
            <LucideChevronUp class="w-4/5 h-4/5 rounded-full p-1 hover:bg-blue-200"  @click="Link.toggle = !Link.toggle" v-else/>
          </div>
          <div v-else></div>
        </div>
        <div class="flex flex-col gap-2 items-center px-1 rounded-md mt-1 py-1 font-bold ml-2"
             v-if="Link.subLinks && Link.toggle">
            <div class="flex gap-4 w-full items-center ml-4 hover:cursor-pointer hover:bg-blue-200 rounded-md px-2 py-2"
                 :class="currentRoute === subLink.path ? 'bg-blue-200' : ''"
                 v-for="subLink in Link.subLinks"
                 :key="subLink.name"
                 @click="Redirect(subLink.path)">
              <component :is="subLink.icon" class="w-6 h-6" />
              <span class="text-sm">
                {{subLink.name}}
              </span>
            </div>
        </div>
<!--        <div class="flex gap-2 items-center bg-blue-200 px-4 py-2 rounded-2xl font-bold hover:cursor-pointer hover:bg-blue-200" @click="Redirect('/outEmp/dashboard')">-->
<!--          <LucideLayoutDashboard class="w-8 h-8" />-->
<!--          <span class="text-md">Dashboard</span>-->
<!--        </div>-->
<!--        <div class="flex flex-col justify-center px-4 py-2 rounded-2xl font-bold hover:cursor-pointer hover:bg-blue-200" @click="toggleJob = !toggleJob">-->
<!--          <div class="flex gap-2 justify-center items-center rounded-full font-bold">-->
<!--            <div class="w-4/5 flex items-center gap-2">-->
<!--              <MingcuteTask2Line class="w-8 h-8" />-->
<!--              <span class="text-md font-semibold">Jobs</span>-->
<!--            </div>-->
<!--            <div class="w-1/5 flex justify-center">-->
<!--              <MdiChevronDown class="w-4/5 h-4/5 rounded-full p-1 hover:bg-blue-200"  @click="toggleJob = !toggleJob" v-if="!toggleJob"/>-->
<!--              <LucideChevronUp class="w-4/5 h-4/5 rounded-full p-1 hover:bg-blue-200"  @click="toggleJob = !toggleJob" v-else/>-->
<!--            </div>-->
<!--          </div>-->
<!--        <div class="flex gap-2 items-center px-4 rounded-md mt-2 py-2 font-bold" v-if="toggleJob">-->
<!--          <div class="flex flex-col gap-4 ml-4">-->
<!--            <div class="flex gap-4 items-center" @click="Redirect('/outEmp/ongoing')">-->
<!--              <LucideClock class="w-6 h-6" />-->
<!--              <span class="text-md font-semibold">-->
<!--                Ongoing Jobs-->
<!--              </span>-->
<!--            </div>-->
<!--            <div class="flex gap-4 items-center" @click="Redirect('/outEmp/finished')">-->
<!--              <EpFinished class="w-6 h-6" />-->
<!--              <span class="text-md font-semibold">-->
<!--                Finished Jobs-->
<!--              </span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        </div>-->
<!--        <div class="flex gap-2 items-center px-4 py-2 rounded-full font-bold hover:cursor-pointer hover:bg-blue-200" @click="Redirect('/outEmp/')">-->
<!--          <LucideSettings class="w-8 h-8" />-->
<!--          <span class="text-sm font-semibold">-->
<!--            Settings-->
<!--          </span>-->
<!--      </div>-->
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>