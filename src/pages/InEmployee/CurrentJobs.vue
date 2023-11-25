<script setup lang="ts">

import InEmployeeLayout from "@/Layout/InEmployeeLayout.vue";
import {NIcon, NTable, NInput, NButton, NModal, NCard, NDivider, NTag} from "naive-ui";
import {ref} from "vue";
import {CheckmarkCircle, Close, DocumentTextOutline, SearchOutline} from "@vicons/ionicons5";
import {useJobStore} from "@store/jobStore.ts";
import {useSheetStore} from "../../store/sheetStore.ts";
import moment from "moment";
import {Calendar, Download} from "@vicons/carbon";
import {CutSheet, Job, Task} from "@/types/Types.ts";

const search = ref("")
const FormatDate = (date:string) =>{
  return moment(date).format('DD MMM hh:mm A');
}

const viewJobModel = ref(false);

const drawRectaangle = (ctx, x, y, width, height,labelWidth,labelHeight, color,child=false) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // Draw the rectangle
  ctx.strokeRect(x, y, width, height);

  // Calculate the position for the width and height labels
  const widthLabelX = x + width / 2
  let widthLabelY = y + height - 5;
  if(child){
    widthLabelY = y -5;
  }
  const heightLabelX = x + width -20;
  const heightLabelY = y + height / 2;

  // Draw labels for width and height
  ctx.fillStyle = color;
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${parseFloat(labelWidth).toFixed(0)} mm`, widthLabelX, widthLabelY);
  ctx.fillText(`${parseFloat(labelHeight).toFixed(0)} mm`, heightLabelX, heightLabelY);
};
const canvasRef = ref();
const sheetStore = useSheetStore();
const draw = (cutSheet:CutSheet) =>{
  const canvas:HTMLCanvasElement = canvasRef.value as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  const canvasWidth = canvas.width-20;
  const canvasHeight = canvas.height-20;
  const parent= {
    width: cutSheet.parentWidth,
    height: cutSheet.parentLength,
  }
  const heightRatio = canvasHeight/parent.height;
  const widthRatio = canvasWidth/parent.width;
  const child = {
    width: cutSheet.width,
    height: cutSheet.length,
  }
  drawRectaangle(ctx, 20, 15, (parent.width-50) * widthRatio, (parent.height-50) * heightRatio,parent.width,parent.height, 'black');
  drawRectaangle(ctx, 20, 15, (child.width-50) * widthRatio, (child.height-50)  * heightRatio,child.width,child.height, 'red',true);
}
const selectedJob =ref<Job>(null);
const clearSelectedJob = () => {
  selectedJob.value = null
}

const ViewJob = (job:Job) => {
  selectedJob.value = job;
  viewJobModel.value = true;
}

const elapsedTime = (startTime: string, endTime: string) => {
  if (endTime.toString().trim() === "") {
    return moment.utc(moment().diff(moment(startTime, "HH:mm:ss"))).format("HH:mm:ss")
  }
  return moment.utc(moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss")));
}

const sortTask = (tasks:Record<string,Task>)=>{
  const taskOrder = ["PlateWriting", "PlateExposure", "PlateWashing", "PlateDrying", "PlateFinishing"];
  const sortedTasks:Task[] = [];
  Object.keys(tasks).forEach((taskType)=>{
    sortedTasks[taskOrder.indexOf(taskType)] = tasks[taskType];
  })
  return sortedTasks;
}
</script>

<template>
  <InEmployeeLayout>
    <n-modal
        v-model:show="viewJobModel"
        title="View Job"
        :mask-closable="false"
        :closable="false"
        :footer="false"
        :on-after-enter="()=>{draw(sheetStore.getCutSheet(selectedJob.jobID))}"
        :on-after-leave="clearSelectedJob"
    >
      <n-card
          :bordered="false"
          class="rounded-2xl"
          :body-style="{ padding: '0px' }"
          :style="{ width: '90%' }"
      >
        <template #header>
          <div class="flex items-center justify-center w-full gap-2">
            <div class="flex items-center justify-center gap-2">
              <n-icon :component="DocumentTextOutline" size="large" />
              <n-text class="text-xl text-black font-bold">Job Details</n-text>
            </div>
          </div>
        </template>
        <template #header-extra>
          <div class="flex items-center justify-center  w-full">
            <n-icon :component="Close" size="large" @click="viewJobModel=false"  class="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white hover:rounded-full p-1"/>
          </div>
        </template>
        <n-divider/>
        <div class="flex gap-4">
          <div class="flex w-2/3 full gap-2 flex-col">
            <div class="flex w-full gap-2  border-2 rounded-2xl">
              <div class="flex w-1/2 flex-col gap-2 p-2">
                <div class="text-xl font-bold text-center mb-3">
                  Job Details
                </div>
                <div class="flex w-full gap-2 flex-col">
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Job Name :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ selectedJob.jobName }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Deadline :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ FormatDate(selectedJob.deadLine.toString()) }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Job Status :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ selectedJob.currentStatus }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Created Time :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ FormatDate(selectedJob.createdTime.toString()) }}
                    </div>
                  </div>

                </div>
              </div>
              <div class="flex w-1/2 flex-col gap-2 p-2">
                <div class="text-xl font-bold text-center mb-3">
                  Sheet Details
                </div>
                <div class="flex gap-2 flex-col">
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Sheet ID :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ selectedJob.sheetID }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Thickness :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ sheetStore.getSheet(selectedJob.sheetID.toString()).thickness }}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Length :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ sheetStore.getCutSheet(selectedJob.jobID.toString()).parentLength }} mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Width :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ sheetStore.getCutSheet(selectedJob.jobID.toString()).parentWidth }} mm
                    </div>
                  </div>


                </div>
              </div>
            </div>
            <div class="flex w-full justify-center items-center border-2 rounded-2xl">
              <div class="flex w-1/2 flex-col gap-2 p-2">
                <div class="text-xl font-bold text-center mb-3">
                  Cut Details
                </div>
                <div class="flex w-full gap-2 flex-col">
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Width :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ selectedJob.width }}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Length :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ selectedJob.length }}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Remarks :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ selectedJob.remarks ?? "No Remarks" }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Priority :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ selectedJob.priority ?? "Normal" }}
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div class="flex flex-col gap-2 border-2 rounded-2xl p-4">
              <div class="text-xl font-bold text-center mb-3">
                Tasks
              </div>
              <div class="flex gap-2 flex-col">
                <n-table single-column :single-line="false">
                  <thead>
                  <tr class="text-center">
                    <th>No</th>
                    <th>Task Name</th>
                    <th>Status</th>
                    <th>Started Time</th>
                    <th>Completed Time</th>
                  </tr>
                  </thead>
                  <tbody class="text-center">
                  <tr v-for="(task,index) in sortTask(selectedJob.tasks)" :key="task.taskID"
                      v-if="Object.keys(selectedJob.tasks).length>0">
                    <td>{{ index + 1 }}</td>
                    <td>{{ task.taskType }}</td>
                    <td>
                      <n-tag :type="task.finishedTime.toString().trim()===''? 'info' :'success'">
                        {{ task.finishedTime.toString().trim() === "" ? "In Progress" : "Completed" }}
                      </n-tag>
                    </td>
                    <td>{{ FormatDate(task.startedTime.toString()) }}</td>
                    <td>
                      {{ task.finishedTime.toString().trim() === "" ? "-" : FormatDate(task.finishedTime.toString()) }}
                    </td>
                  </tr>
                  <tr v-else>
                    <td colspan="5" class="text-center">No Tasks Yet</td>
                  </tr>
                  </tbody>
                </n-table>
              </div>
            </div>
          </div>
          <div class="flex w-1/3 p-6">
            <canvas id="canvasElement" ref="canvasRef" class="border" width="400" height="600"></canvas>
          </div>

        </div>

        <template #footer>
          <div class="flex items-center justify-center gap-2">
            <button class="flex items-center px-6 justify-around gap-6 bg-red-500 text-white rounded-lg p-2 hover:bg-red-600" @click="viewJobModel = false">
              Close
            </button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <div class="flex flex-col p-4 items-center justify-center">
      <div class="flex w-2/5 gap-2 py-1 mb-4">
        <n-input type="text" class="w-full  border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
               placeholder="Search by Job ID" v-model="search"/>
        <n-button class="bg-blue-500 text-white px-2 rounded flex gap-1 items-center justify-center">
          <n-icon size="large" :component="SearchOutline" />
          Search
        </n-button>

      </div>
      <div class="w-full flex justify-center">
        <n-table size="small" border="outer" class="w-full">
          <thead>
          <tr class="text-center">
            <th>No</th>
            <th>Job Name</th>
            <th>Sheet Dimensions</th>
            <th>Sheet Thickness</th>
            <th>Created At</th>
            <th>Priority</th>
            <th>Current Status</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody class="text-center">
          <tr v-for="(job,index) in useJobStore().getOngoingJobs" :key="job.id" class="text-center" v-if="useJobStore().getOngoingJobs.length > 0">
            <td>{{index+1}}</td>
            <td>{{job.jobName}}</td>
            <td>{{job.width}} mm x {{job.length}} mm</td>
            <td>
              {{useSheetStore().getSheet(job.sheetID.toString()).thickness}} mm
            </td>
            <td>{{FormatDate(job.createdTime.toString())}}</td>
            <td>{{job.priority ?? "Normal"}}</td>
            <td>{{useJobStore().getCurrentTask(job.jobID.toString()).taskType ?? "Not Started"}}</td>
            <td class="flex items-center justify-center">
              <n-button class="bg-blue-100 text-black  border border-blue-700 px-2 py-1 rounded flex gap-1 items-center justify-center hover:bg-blue-700 hover:text-white" @click="ViewJob(job)">
                View Details
              </n-button>
            </td>
          </tr>
          <tr v-else>
            <td colspan="5" class="text-center">No Sheets Available</td>
          </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </InEmployeeLayout>

</template>
