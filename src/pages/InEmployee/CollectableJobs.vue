<script setup lang="ts">
import {
  NIcon,
  NTable,
  useDialog,
  NInput,
  useNotification,
  NotificationType,
  NCard,
  NTag,
  NModal,
  NText
} from "naive-ui";
import InEmployeeLayout from "@/Layout/InEmployeeLayout.vue";
import {Close, DocumentTextOutline, SearchOutline} from "@vicons/ionicons5";
import {ref} from "vue";
import {useJobStore} from "/src/store/jobStore.ts";
import {useSheetStore} from "/src/store/sheetStore.ts";
import moment from "moment/moment";
import {useUserStore} from "/src/store/UserStore.ts";
import {CutSheet, Job, Sheet, Task} from "/src/types/Types.ts";

const jobStore = useJobStore()
const search = ref()

const FormatDate = (date:string) =>{
  return moment(date).format('DD MMM hh:mm A');
}

const notification = useNotification();
const notify =(type: NotificationType,title:string,message:string)=> {
  notification[type]({
    content: message,
    title,
    duration: 2500,
    keepAliveOnHover: true
  })
}

const viewJobModel = ref(false)
const currentJob = ref<Job>({})

const viewJob = (job:any) => {
  currentJob.value = job
  viewJobModel.value = true
}
const canvasRef = ref<HTMLCanvasElement>();
const drawRectangle = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, labelWidth: number, labelHeight: number, color: string,fillColor="white",name="", child = false) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  // Draw the rectangle and fill it with the fill color
  ctx.fillStyle = fillColor;
  // ctx.strokeRect(x, y, width, height);
  ctx.fillRect(x, y, width, height)
  // add border
  ctx.strokeRect(x, y, width, height);

  // Calculate the position for the width and height labels
  const widthLabelX = x + width / 2
  let widthLabelY = y + height - 5;
  if (child) {
    widthLabelY = y - 5;
  }
  const heightLabelX = x + width - 20;
  const heightLabelY = y + height / 2;

  // Draw labels for width and height
  ctx.fillStyle = color;



  ctx.font = 'bold 10px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${parseFloat(labelWidth.toString()).toFixed(0)} mm`, widthLabelX, widthLabelY);
  ctx.fillText(`${parseFloat(labelHeight.toString()).toFixed(0)} mm`, heightLabelX, heightLabelY);
  // add name to center
  if(name!=""){
    ctx.fillText(`${name}`, widthLabelX, heightLabelY + 50);
  }
  // fill color
};

const draw = (cutSheet: CutSheet,sheet:Sheet) => {
  const canvas: HTMLCanvasElement = canvasRef.value as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const canvasWidth = canvas.width - 20;
  const canvasHeight = canvas.height - 20;
  const parent = {
    width: cutSheet.parentWidth,
    height: cutSheet.parentLength,
  }
  const heightRatio = canvasHeight / parent.height;
  const widthRatio = canvasWidth / parent.width;
  const child = {
    width: cutSheet.width,
    height: cutSheet.length,
  }
  // get balance sheets
  const label = "(" + child.height + " x " + child.width + ")";
  drawRectangle(ctx, 20, 10, (parent.width - 50) * widthRatio, (parent.height - 50) * heightRatio, parent.width, parent.height, 'black');
  drawRectangle(ctx, 20, 10, (child.width - 50) * widthRatio, (child.height - 50) * heightRatio, child.width, child.height, 'red','yellow',label, true);
  const s = sheet;
  for (let i = 0; i < s.length; i++) {
    const balanceSheet = s[i];
    const child = {
      width: balanceSheet.width,
      height: balanceSheet.length,
    }
    if(child.width == parent.width-cutSheet.width){
      // draw in top right corner
      const label = "(" + child.height + " x " + child.width + ")";
      drawRectangle(ctx, 20 + (cutSheet.width - 50) * widthRatio, 10, (child.width) * widthRatio, (child.height - 50) * heightRatio, child.width, child.height, 'blue', "#E8E8E8",label,true);
    }else {
      // draw in bottom left corner
      const label = "(" + child.height + " x " + child.width + ")";
      drawRectangle(ctx, 20, 10 + (cutSheet.length - 50) * heightRatio, (child.width - 50) * widthRatio, (child.height) * heightRatio, child.width, child.height, 'blue', "#E8E8E8",label,true);
    }
  }


}
const sheetStore = useSheetStore()

const dialog = useDialog()
const timeDifference = (startTime:string,endTime:string)=>{
  const endTimes =  new Date(endTime);
  const startTimes =  new Date(startTime);
  return moment.utc(moment(endTimes).diff(moment(startTimes))).format("HH:mm:ss")
}
const elapsedTime = (startTime: string, endTime: string) => {
  if (endTime.toString().trim() === "") {
    return moment.utc(moment().diff(moment(startTime, "HH:mm:ss"))).format("HH:mm:ss")
  }
  return moment.utc(moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss"))).format("HH:mm:ss")
}

const collectJob = (job:any) => {
  dialog.success({
    title: 'Confirmation',
    content: 'Are you sure you want to collect this job?',
    positiveText: 'Yes',
    negativeText: 'No',
    onPositiveClick: () => {
      jobStore.collectJob(job,useUserStore().getUser.userID)
      notify('success','Success','Job collected successfully')
    },
    onNegativeClick: () => {
      notify('info','Info','Job collection cancelled')
    }
  })
}

// const sortTask = (tasks:Record<string,Task>)=>{
//   const taskOrder = ["PlateWriting", "PlateExposure", "PlateWashing", "PlateDrying", "PlateFinishing"];
//   const sortedTasks:Task[] = [];
//   Object.keys(tasks).forEach((taskType)=>{
//     sortedTasks[taskOrder.indexOf(taskType)] = tasks[taskType];
//   })
//   return sortedTasks;
// }

</script>

<template>
  <InEmployeeLayout>
    <n-modal
        v-model:show="viewJobModel"
        :on-after-enter="()=>{draw(sheetStore.getCutSheet(currentJob.jobID),currentJob.balanceSheets)}"
        title="View Job"
        :width="1000"
        :mask-closable="false"
        :closable="false"
        :footer="false">
      <n-card
          :bordered="false"
          class="rounded-2xl"
          :body-style="{ padding: '0px' }"
          :style="{ width: '90%' }"
      >
        <template #header>
          <div class="flex items-center  justify-center w-full gap-2">
            <div class="flex items-center justify-center gap-2">
              <n-icon :component="DocumentTextOutline" size="large"/>
              <n-text class="text-2xl font-bold">Job Details</n-text>
            </div>
          </div>
        </template>
        <template #header-extra>
          <div class="flex items-center justify-center  w-full">
            <n-icon :component="Close" size="large" @click="viewJobModel=false"
                    class="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white hover:rounded-full p-1"/>
          </div>
        </template>

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
                      {{ currentJob.jobName }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Deadline :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ FormatDate(currentJob.deadLine.toString()) }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Job Status :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ currentJob.currentStatus }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Created Time :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ FormatDate(currentJob.createdTime.toString()) }}
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
                      {{ currentJob.sheetID }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Thickness :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ sheetStore.getSheet(currentJob.sheetID.toString()).thickness }}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Length :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ sheetStore.getCutSheet(currentJob.jobID.toString()).parentLength }} mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Width :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ sheetStore.getCutSheet(currentJob.jobID.toString()).parentWidth }} mm
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
                      {{ currentJob.width }}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Length :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ currentJob.length }}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Remarks :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ currentJob.remarks ?? "No Remarks" }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Priority :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ currentJob.priority ?? "Normal" }}
                    </div>
                  </div>

                </div>
              </div>
              <div class="flex w-1/2 flex-col gap-2 p-2">
                <div class="text-xl font-bold text-center mb-3">
                  Floor Values
                </div>
                <div class="flex w-full gap-2 flex-col">
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Floor X1 :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{currentJob.floorValues ? currentJob.floorValues.floorX1 : "No Values"}}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">

                      Floor Y1 :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{currentJob.floorValues ? currentJob.floorValues.floorY1 : "No Values"}}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">

                      Floor X2 :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{currentJob.floorValues ? currentJob.floorValues.floorX2 : "No Values"}}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">

                      Floor Y2 :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{currentJob.floorValues ? currentJob.floorValues.floorY2 : "No Values"}}mm
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
                    <th>Elapsed Time</th>
                    <th>Started Time</th>
                    <th>Completed Time</th>
                  </tr>
                  </thead>
                  <tbody class="text-center">
                  <tr v-for="(task) in currentJob.tasks" :key="task.taskID"
                      v-if="Object.keys(currentJob.tasks).length>0">
                    <td>{{ Object.keys(currentJob.tasks).indexOf(task.taskType) + 1 }}</td>
                    <td>{{ task.taskType }}</td>
                    <td>
                      <n-tag :type="task.finishedTime.toString().trim()===''? 'info' :'success'">
                        {{ timeDifference(FormatDate(task.startedTime.toString()), FormatDate(task.finishedTime.toString()))}}
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
            <th>Job ID</th>
            <th>Job Name</th>
            <th>Sheet Dimensions</th>
            <th>Sheet Thickness</th>
            <th>Started Time</th>
            <th>Finished Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody class="text-center">
          <tr v-for="job in jobStore.getCompletedTasks" :key="job.id" v-if="jobStore.getCompletedTasks.length>0">
            <td>{{job.jobID}}</td>
            <td>{{job.jobName}}</td>
            <td>{{job.width}} x {{job.length}}</td>
            <td>{{useSheetStore().getSheet(job.sheetID).thickness}} mm</td>
            <td>{{FormatDate(job.createdTime)}}</td>
            <td>{{FormatDate(job.tasks.PlateDrying.finishedTime)}}</td>
            <td>{{job.currentStatus}}</td>
            <td class="flex items-center justify-center gap-2">
              <n-button class="bg-green-50  border border-green-700 px-2 py-1 rounded flex gap-1 items-center justify-center hover:bg-green-700 hover:text-white"
                      @click="collectJob(job)">
                Collect
              </n-button>
              <n-button class="bg-blue-50  border border-blue-700 px-2 py-1 rounded flex gap-1 items-center justify-center hover:bg-blue-700 hover:text-white"
                      @click="viewJob(job)">
                View
              </n-button>
            </td>
          </tr>
          <tr v-else>
            <td colspan="8" class="text-center">No Sheets Available</td>
          </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </InEmployeeLayout>
</template>

<style scoped>

</style>