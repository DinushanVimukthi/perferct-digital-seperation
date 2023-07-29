<script setup lang="ts">
import {SunnySharp,Search} from '@vicons/ionicons5'
import OutEmployeeLayout from "@Layout/OutEmployeeLayout.vue";
import {NTag, NIcon,NButton,NPagination } from "naive-ui";
import { ref } from "vue";





const searchTerm = ref("");

const TaskColor = (task) => {
  if (task == "Plate Expose") {
    return { color: '#d59d56', textColor: '#ffffff', borderColor: '#555' }
  }
};
const ongoingJobs = ref([
  {
    id: 1,
    name: "Job_001",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Ongoing",
    StartedTime: "10:12 AM",
    StartedDate: "2021-10-01",
    FinishTime: "12:12 PM",
  },
  {
    id: 2,
    name: "Job_002",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Ongoing",
    StartedTime: "10:12 AM",
    StartedDate: "2021-10-01",
    FinishTime: "12:12 PM",
    Priority: "High",
  },
  {
    id: 3,
    name: "Job_003",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Ongoing",
    StartedTime: "10:12 AM",
    StartedDate: "2021-10-01",
    FinishTime: "12:12 PM",
    Priority: "High",
  },
  {
    id: 4,
    name: "Job_004",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Ongoing",
    StartedTime: "10:12 AM",
    StartedDate: "2021-10-01",
    FinishTime: "12:12 PM",
    Priority: "High",
  },
  {
    id: 5,
    name: "Job_005",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Ongoing",
    StartedTime: "10:12 AM",
    StartedDate: "2021-10-01",
    FinishTime: "12:12 PM",
  },
  {
    id: 6,
    name: "Job_006",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Ongoing",
    StartedTime: "10:12 AM",
    StartedDate: "2021-10-01",
    FinishTime: "12:12 PM",
  },
  {
    id: 7,
    name: "Job_007",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Ongoing",
    StartedTime: "10:12 AM",
    StartedDate: "2021-10-01",
    FinishTime: "12:12 PM",
  },
  {
    id: 8,
    name: "Job_008",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Ongoing",
    StartedTime: "10:12 AM",
    StartedDate: "2021-10-01",
    FinishTime: "12:12 PM"
},
  {
    id: 9,
    name: "Job_009",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Ongoing",
    StartedTime: "10:12 AM",
    StartedDate: "2021-10-01",
    FinishTime: "12:12 PM"
  },
  {
    id: 10,
    name: "Job_010",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Ongoing",
    StartedTime: "10:12 AM",
    StartedDate: "2021-10-01",
    FinishTime: "12:12 PM"
  },
  {
    id: 11,
    name: "Job_011",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Ongoing",
  },
  {
    id: 12,
    name: "Job_012",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Finished",
  },
  {
    id: 13,
    name: "Job_013",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Finished",
  },
  {
    id: 14,
    name: "Job_014",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Finished",
  },
  {
    id: 15,
    name: "Job_015",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Finished",
  },
  {
    id: 16,
    name: "Job_016",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Finished",
  },
  {
    id: 17,
    name: "Job_017",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Finished",
  },
  {
    id: 18,
    name: "Job_018",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Finished",
  },
  {
    id: 19,
    name: "Job_019",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Finished",
  },
  {
    id: 20,
    name: "Job_020",
    currentTask: "Plate Expose",
    currentTaskIcon : SunnySharp,
    currentTaskColor: "text-green-700",
    Status: "Finished",
  },
]);
const page = ref(1);


</script>

<template>
  <OutEmployeeLayout>
    <div class="max-w-8xl bg-white h-full mx-auto px-4 py-4">
      <div class="mb-4 w-full flex justify-center items-center">
        <input
            v-model="searchTerm"
            type="text"
            class="w-64 px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Search..."

        />
        <!-- Search Icon with animation button -->
        <n-button class="ml-4 text-black " round type="info" >
          <template #icon>
            <n-icon :component="Search" />
          </template>
          <span class="font-bold">Search</span>
        </n-button>
      </div>
      <div class="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <div v-for="(job, index) in ongoingJobs" :key="index" class="bg-card p-3 shadow-md relative">
          <!-- Your card content here -->
          <!-- Priority Tag -->
          <div class="absolute mt-1 mr-1 top-0 right-0" v-if="job.Priority">
            <n-tag round :bordered="false" type="success">
              {{ job.Priority }}
            </n-tag>
          </div>
          <div class="flex flex-col items-center">
            <div class="flex flex-col gap-2 justify-between">
              <div class="flex flex-col justify-center items-center">
                <div class="text-xl font-bold">{{ job.name }}</div>
              </div>
              <div class="flex flex-col justify-center items-center">
                <n-tag round :bordered="false"  :color="TaskColor(job.currentTask)">
                {{ job.currentTask}}
                <template #icon>
                  <n-icon :component="job.currentTaskIcon"/>
                </template>
                </n-tag>
                <div class="text-sm text-gray-500">
                  Started at
                  {{ job.StartedTime }}
                </div>
                <div class="text-sm text-gray-500">
                  Finished at
                  {{ job.FinishTime }}
                </div>
              </div>
              <!-- Button -->
              <div class="flex flex-col mt-1">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Finish {{ job.currentTask}}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center my-4">
        <n-pagination v-model:page="page" :page-count="100" :page-slot="7" :theme-overrides="paginationOverrides" />
      </div>
    </div>
  </OutEmployeeLayout>
</template>

<style scoped>
.bg-card{
  background: #DEE6F8;
}
</style>