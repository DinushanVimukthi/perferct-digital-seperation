<script setup lang="ts">

import OutEmployeeLayout from "@/Layout/OutEmployeeLayout.vue";
import {NTable,NTag,NIcon} from "naive-ui";
import {Send,EyeOutline } from "@vicons/ionicons5";
import {Delivery } from "@vicons/carbon";
import {ref} from "vue";


const TagColor = (task:string) => {
  if (task == "Delivered") {
    return { color: '#9bf69c', textColor: '#313131', borderColor: '#ffffff' }
  }
  if (task == "Deliverable") {
    return { color: '#cbd0f1', textColor: '#000000', borderColor: '#ffffff' }
  }
  return { color: '#b20000', textColor: '#ffffff', borderColor: '#ffffff' }
};

const TagIcon = (task:string) => {
  if (task == "Delivered") {
    return Delivery
  }
  if (task == "Deliverable") {
    return Send
  } else{
    return EyeOutline
  }
};

const finishedJob = ref([
  {
    jobID: "Job_001",
    sheetID: "Sheet_001",
    startedTime: "2023-07-14 08.45 AM",
    finishedTime: "2023-07-14 04.15 PM",
    status: "Delivered",
  },
  {
    jobID: "Job_002",
    sheetID: "Sheet_002",
    startedTime: "2023-07-14 08.45 AM",
    finishedTime: "2023-07-14 04.15 PM",
    status: "Deliverable",
  },
  {
    jobID: "Job_003",
    sheetID: "Sheet_003",
    startedTime: "2023-07-14 08.45 AM",
    finishedTime: "2023-07-14 04.15 PM",
    status: "Deliverable",
  },
  {
    jobID: "Job_004",
    sheetID: "Sheet_004",
    startedTime: "2023-07-14 08.45 AM",
    finishedTime: "2023-07-14 04.15 PM",
    status: "Delivered",
  },
  {
    jobID: "Job_005",
    sheetID: "Sheet_005",
    startedTime: "2023-07-14 08.45 AM",
    finishedTime: "2023-07-14 04.15 PM",
    status: "Delivered",
  },
  {
    jobID: "Job_006",
    sheetID: "Sheet_006",
    startedTime: "2023-07-14 08.45 AM",
    finishedTime: "2023-07-14 04.15 PM",
    status: "Deliverable",
  },
  {
    jobID: "Job_007",
    sheetID: "Sheet_007",
    startedTime: "2023-07-14 08.45 AM",
    finishedTime: "2023-07-14 04.15 PM",
    status: "Deliverable",
  },
  {
    jobID: "Job_008",
    sheetID: "Sheet_008",
    startedTime: "2023-07-14 08.45 AM",
    finishedTime: "2023-07-14 04.15 PM",
    status: "Delivered",
  },
]);


</script>

<template>
  <OutEmployeeLayout>
    <div class="m-1 p-8 max-w-7xl">
      <n-table striped size="small" border="outer" class="w-full">
        <thead>
        <tr>
          <th>Job ID</th>
          <th>Sheet ID</th>
          <th>Started Time</th>
          <th>FinishedTime</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="job in finishedJob" :key="job.jobID">
          <td>{{job.jobID}}</td>
          <td>{{job.sheetID}}</td>
          <td>{{job.startedTime}}</td>
          <td>{{job.finishedTime}}</td>
          <td>
            <n-tag
                :color="TagColor(job.status)"
                class="px-2 min-w-[110px]" round>
              <template #icon>
                <n-icon :component="TagIcon(job.status)" size="medium" class="ml-2" />
              </template>
              <span class="text-sm">
                {{job.status}}
              </span>
            </n-tag>
          </td>
          <td class="flex gap-2">
            <button class="bg-blue-500 hover:bg-blue-700 flex items-center justify-center gap-3 text-white font-bold py-2 px-2 rounded">
              <n-icon :component="EyeOutline" size="small" />
              View Sheet
            </button>
          </td>
        </tr>
        </tbody>
      </n-table>
    </div>
  </OutEmployeeLayout>
</template>

<style scoped>

</style>