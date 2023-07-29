<script setup lang="ts">
import {NIcon, NTable} from "naive-ui";
import InEmployeeLayout from "@/Layout/InEmployeeLayout.vue";
import {SearchOutline} from "@vicons/ionicons5";
import {ref} from "vue";
import {JobType} from "@/types/JobType.ts";

const collectableJobs = ref<JobType[]>([
  {
    id: 1, // job id
    sheetId: '1', // sheet id
    width: 100, // width
    length: 200, // length
    name: 'Job_001', // job name
    description: 'Job_001', // job description
    status: 'Ongoing', // job status
    approved: true, // job approved
    approvedBy: 'Admin', // job approved by
    approvedTime: '10:12 AM', // job approved time
    currentStatus: 'Plate Expose', // job current status
    tasks: []
  },
  {
    "id": 2,
    "sheetId": "3",
    "width": 120,
    "length": 150,
    "name": "Job_002",
    "description": "Job_002 description",
    "status": "Completed",
    "approved": false,
    "approvedBy": "",
    "approvedTime": "",
    "currentStatus": "Quality Check",
    "tasks": []
  },
  {
    "id": 3,
    "sheetId": "2",
    "width": 80,
    "length": 100,
    "name": "Job_003",
    "description": "Job_003 description",
    "status": "Pending",
    "approved": false,
    "approvedBy": "",
    "approvedTime": "",
    "currentStatus": "Design Approval",
    "tasks": []
  },
  {
    "id": 4,
    "sheetId": "1",
    "width": 50,
    "length": 80,
    "name": "Job_004",
    "description": "Job_004 description",
    "status": "Ongoing",
    "approved": true,
    "approvedBy": "User123",
    "approvedTime": "03:45 PM",
    "currentStatus": "Printing",
    "tasks": []
  },
  {
    "id": 5,
    "sheetId": "4",
    "width": 200,
    "length": 250,
    "name": "Job_005",
    "description": "Job_005 description",
    "status": "Rejected",
    "approved": false,
    "approvedBy": "",
    "approvedTime": "",
    "currentStatus": "Preparation",
    "tasks": []
  }

])
const search = ref("")
</script>

<template>
  <InEmployeeLayout>
    <div class="flex flex-col p-4 items-center justify-center">
      <div class="flex w-2/5 gap-2 py-1 mb-4">
        <input type="text" class="w-full  border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
               placeholder="Search by Job ID" v-model="search"/>
        <button class="bg-blue-500 text-white px-2 rounded flex gap-1 items-center justify-center">
          <n-icon size="large" :component="SearchOutline" />
          Search
        </button>

      </div>
      <div class="w-full flex justify-center">
        <n-table size="small" border="outer" class="w-full">
          <thead>
          <tr class="text-center">
            <th>Job ID</th>
            <th>Job Name</th>
            <th>Sheet Dimensions</th>
            <th>Sheet Thickness</th>
            <th>Approval Status</th>
            <th>Approved Time</th>
            <th>Current Status</th>
            <th>Description</th>
          </tr>
          </thead>
          <tbody class="text-center">
          <tr v-for="job in collectableJobs" :key="job.id">
            <td>{{job.id}}</td>
            <td>{{job.name}}</td>
            <td>{{job.width}} x {{job.length}}</td>
            <td>0.5 mm</td>
            <td>{{job.approved ? 'Approved' : 'Not Approved'}}</td>
            <td>{{job.approvedTime}}</td>
            <td>{{job.currentStatus}}</td>
            <td>{{job.description}}</td>
          </tr>
          <tr>
            <td colspan="5" class="text-center">No Sheets Available</td>
          </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </InEmployeeLayout>
</template>

<style scoped>

</style>