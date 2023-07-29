<script setup lang="ts">

import OutEmployeeLayout from "@/Layout/OutEmployeeLayout.vue";
import {useJobStore} from "@store/jobStore.ts";
import { ref, computed } from "vue";
import {EyeOutline, SearchOutline,Checkmark} from "@vicons/ionicons5";
import {NIcon, NTable, NTag} from "naive-ui";
import {Delivery} from "@vicons/carbon";



const TagColor = (priority:string) => {
  switch (priority) {
    case "High":
      return "error"
    case "Medium":
      return "warning"
    case "Low":
      return "success"
  }
};

const search = ref("");

const JobStore = useJobStore();

const finishedJob = ref([
  {
    "jobID": "Job_001",
    "sheetID": "Sheet_001",
    "submittedTime": "2023-07-14 08.45 AM",
    "Priority": "High",
    "Deadline": "2023-07-14 04.15 PM",
  }
])


</script>

<template>
<OutEmployeeLayout>
  <div class="h-full w-full flex items-center justify-center ">
    <div class="max-w-[80%] w-4/5 flex flex-col items-center justify-center">
      <div class="flex w-2/5 gap-2 py-1 mb-4">
        <input type="text" class="w-full  border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
               placeholder="Search by Job ID" v-model="search"/>
        <button class="bg-blue-500 text-white px-2 rounded flex gap-1 items-center justify-center">
          <n-icon size="large" :component="SearchOutline" />
          Search
        </button>

      </div>
      <n-table striped size="small" border="outer" class="w-full">
        <thead>
        <tr>
          <th>Job ID</th>
          <th>Sheet ID</th>
          <th>Submitted Time</th>
          <th>Priority</th>
          <th>Deadline</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="job in finishedJob" :key="job.jobID">
          <td>{{job.jobID}}</td>
          <td>{{job.sheetID}}</td>
          <td>{{job.submittedTime}}</td>
          <td>
            <n-tag
                :type="TagColor(job.Priority)"
            >
            <span class="text-sm font-bold">
                {{job.Priority}}
              </span>
            </n-tag>
          </td>
          <td>{{job.Deadline}}</td>
          <td class="flex gap-2">
            <button class="bg-green-500 hover:bg-white hover:text-black hover:border hover:border-green-500 flex items-center justify-center gap-3 text-white font-bold py-2 px-2 rounded">
              <n-icon :component="Checkmark" size="large" />
              Take Job
            </button>
          </td>
        </tr>
        </tbody>
      </n-table>
    </div>
  </div>

</OutEmployeeLayout>
</template>

<style scoped>

</style>