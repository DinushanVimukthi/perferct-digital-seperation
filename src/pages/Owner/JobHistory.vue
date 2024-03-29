<script setup lang="ts">

import OutEmployeeLayout from "@/Layout/OutEmployeeLayout.vue";
import {
  NTable,
  NTag,
  NIcon,
  NModal,
  NText,
  NCard,
  NSelect,
  NDivider,
  NDatePicker,
  NInput,
  NInputNumber,
  useNotification, NotificationType
} from "naive-ui";
import {Send, EyeOutline, DocumentTextOutline, Close} from "@vicons/ionicons5";
import {Delivery} from "@vicons/carbon";
import {Collections20Regular} from "@vicons/fluent";
import {useJobStore} from "@store/jobStore.ts";
import moment from "moment";
import {ref, computed} from "vue";
import {BalanceSheet, CutSheet, Job, Task} from "@/types/Types.ts";
import {useSheetStore} from "@store/sheetStore.ts";
import {JobType} from "@/types/JobType.ts";
import {useAdminStore} from "@store/adminStore.ts";
import {compareText} from "@/helper/Security.ts";
import OwnerLayout from "@/Layout/OwnerLayout.vue";

const TagColor = (task: string) => {
  if (task == "Delivered") {
    return {color: '#9bf69c', textColor: '#313131', borderColor: '#ffffff'}
  }
  if (task == "Deliverable") {
    return {color: '#cbd0f1', textColor: '#000000', borderColor: '#ffffff'}
  }
  return {color: '#b20000', textColor: '#ffffff', borderColor: '#ffffff'}
};
const notification = useNotification();
const notify = (type: NotificationType, title: string, message: string) => {
  notification[type]({
    content: message,
    title,
    duration: 2500,
    keepAliveOnHover: true
  })
}

const TagIcon = (task: string) => {
  if (task == "Delivered") {
    return Delivery
  }
  if (task == "Deliverable") {
    return Send
  } else {
    return EyeOutline
  }
};

const FormatDate = (date: string) => {
  return moment(date).format('DD MMM YY hh:mm A');
}

const formatTime = (time: string) => {
  return moment(time, "HH:mm:ss").format("MMMM Do YYYY, h:mm:ss a")
};
const viewJobModel = ref(false);
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

const sortTask = (tasks:Record<string,Task>)=>{
  const taskOrder = ["PlateWriting", "PlateExposure", "PlateWashing", "PlateDrying", "PlateFinishing"];
  const sortedTasks:Task[] = [];
  Object.keys(tasks).forEach((taskType)=>{
    sortedTasks[taskOrder.indexOf(taskType)] = tasks[taskType];
  })
  return sortedTasks;
}
const draw = (cutSheet: CutSheet,sheet:BalanceSheet[]) => {
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
    let c = {
      width: balanceSheet.width,
      height: balanceSheet.length,
    }
    let rightCorner = false;

    if(c.width == parent.width-cutSheet.width && !rightCorner){
      // draw in top right corner
      if(c.height + cutSheet.length > parent.height && c.height != parent.height){
        if(c.width<parent.width){

        }else{
          let tmp = c.width;
          c.width = c.height;
          c.height = tmp;
        }
      }


      rightCorner = true;
      const label = "(" + c.height + " x " + c.width + ")";
      drawRectangle(ctx, 20 + (cutSheet.width - 50) * widthRatio, 10, (c.width) * widthRatio, (c.height - 50) * heightRatio, c.width, c.height, 'blue', "#E8E8E8",label,true);
    }else {
      // draw in bottom left corner
      if(c.height + cutSheet.length > parent.height){
        let tmp = c.width;
        c.width = c.height;
        c.height = tmp;
      }

      const label = "(" + c.height + " x " + c.width + ")";
      drawRectangle(ctx, 20, 10 + (cutSheet.length - 50) * heightRatio, (c.width - 50) * widthRatio, (c.height) * heightRatio, c.width, c.height, 'blue', "#E8E8E8",label,true);
    }
  }


}
const sheetStore = useSheetStore();
const currentJob = ref<Job>();
const viewSelectedJob = (job: Job) => {
  currentJob.value = job;
  viewJobModel.value = true;
}
const markAsCollectableModal = ref(false);

const pastJob = computed(() => {
  const jobs = useJobStore().getDeliveredJobs;
  if (monthToSort.value) {
    const filteredJobs = [];
    for (const job of jobs) {
      const jobDate = moment(job.createdTime).format("YYYY-MM")
      const filterDate = moment(monthToSort.value).format("YYYY-MM")
      if (jobDate === filterDate) {
        filteredJobs.push(job)
      }
    }
    return filteredJobs;
  }
  return [];
})

const markAsCollectable = (job: Job) => {
  markAsCollectableModal.value = true;
  currentJob.value = job;
}
const confirmation = ref({
  employeeID: null,
  pin: "",
  remarks: "",
  currentTask: {} as Task
})

const timeDifference = (startTime: string, endTime: string) => {
  const endTimes = new Date(endTime);
  const startTimes = new Date(startTime);
  return moment.utc(moment(endTimes).diff(moment(startTimes))).format("HH:mm:ss")
}

const clearConfirmation = () => {
  confirmation.value.employeeID = null
  confirmation.value.pin = ""
  confirmation.value.remarks = ""
  confirmation.value.currentTask = ""
  floorDetails.value.floorX1 = 0
  floorDetails.value.floorY1 = 0
  floorDetails.value.floorX2 = 0
  floorDetails.value.floorY2 = 0
}

const Employees = computed(() => {
  const outEmployee = useAdminStore().getOutEmployees;
  const employees = [];
  for (const employee of outEmployee) {
    employees.push({
      label: employee.userName,
      value: employee.userID,
    })
  }
  return employees;
})

const floorDetails = ref({
  floorX1: 0,
  floorY1: 0,
  floorX2: 0,
  floorY2: 0,
})

const MarkAsDeliverable = () => {
  if (floorDetails.value.floorX1 == 0 || floorDetails.value.floorY1 == 0 || floorDetails.value.floorX2 == 0 || floorDetails.value.floorY2 == 0) {
    notify("error", "Error", "Please select the floor area")
  }
  if (confirmation.value.employeeID === null || confirmation.value.employeeID === "") {
    notify("warning", "Warning", "Please Select your user Name")
    return;
  }
  if (confirmation.value.pin.length < 4) {
    notify("warning", "Warning", "Please Enter Valid PIN")
    return;
  }

  if (!compareText(confirmation.value.pin, useAdminStore().getUser(confirmation.value.employeeID).userPIN)) {
    notify("warning", "Warning", "Please Enter Valid PIN")
    return;
  }

  const floorArea = {
    floorX1: floorDetails.value.floorX1,
    floorY1: floorDetails.value.floorY1,
    floorX2: floorDetails.value.floorX2,
    floorY2: floorDetails.value.floorY2,
  }

  useJobStore().completeJob(currentJob.value.jobID, floorArea)
  markAsCollectableModal.value = false;

}

const filterJob = () => {

}

const elapsedTime = (startTime: string, endTime: string) => {
  if (endTime.toString().trim() === "") {
    return moment.utc(moment().diff(moment(startTime, "HH:mm:ss"))).format("HH:mm:ss")
  }
  return moment.utc(moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss"))).format("HH:mm:ss")
}
const monthToSort = ref(Date.now());
</script>

<template>
  <OwnerLayout>
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
          <div class="flex flex-col items-center justify-center w-full gap-2">
            <div class="flex items-center justify-center gap-2">
              <n-icon :component="DocumentTextOutline" size="large"/>
              <n-text class="text-xl">Job Details</n-text>
            </div>
          </div>
        </template>
        <template #header-extra>
          <div class="flex items-center justify-center  w-full">
            <n-icon :component="Close" size="large" @click="viewJobModel=false"
                    class="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white hover:rounded-full p-1"/>
          </div>
        </template>
        <n-divider/>
        <div class="flex gap-4">
          <div class="flex w-2/3 full gap-2 flex-col">
            <div class="flex border-solid w-full gap-2 border-blue-700 border rounded-2xl">
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
                      Job ID :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ currentJob.jobID }}
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
                      {{ FormatDate(currentJob.createdTime) }}
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
                      {{ sheetStore.getSheet(currentJob.sheetID).thickness }}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Length :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ sheetStore.getCutSheet(currentJob.jobID).parentLength }} mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Width :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ sheetStore.getCutSheet(currentJob.jobID).parentWidth }} mm
                    </div>
                  </div>


                </div>
              </div>
            </div>
            <div class="flex border-solid border-blue-700 w-full justify-center items-center border rounded-2xl">
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
              <!-- Floor Values -->
              <div class="flex w-1/2 flex-col gap-2 p-2">
                <div class="text-xl font-bold text-center mb-3">
                  Floor Details
                </div>
                <div class="flex w-full gap-2 flex-col">
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Floor X1 :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ currentJob.floorValues.floorX1 }}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Floor Y1 :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ currentJob.floorValues.floorY1 }}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Floor X2 :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ currentJob.floorValues.floorX2 }}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Floor Y2 :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ currentJob.floorValues.floorY2 }}mm
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
                  <tr v-for="(task,index) in sortTask(currentJob.tasks)" :key="task.taskID" v-if="currentJob.tasks">
                    <td>#{{ index + 1 }}</td>
                    <td>{{ task.taskType }}</td>
                    <td>
                      <n-tag :type="task.finishedTime.toString().trim()===''? 'info' :'success'">
                        {{
                          timeDifference(FormatDate(task.startedTime), FormatDate(task.finishedTime))
                        }}
                      </n-tag>
                    </td>
                    <td>{{ FormatDate(task.startedTime) }}</td>
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
          <div class="flex justify-center items-start w-1/3 p-6">
            <canvas id="canvasElement" ref="canvasRef" class="border w-full max-h-[500px]" width="300" height="400">
            </canvas>
          </div>

        </div>
      </n-card>
    </n-modal>
    <n-modal
        v-model:show="markAsCollectableModal"
        title="View Job"
        :mask-closable="false"
        :closable="false"
        :footer="false"
        :on-after-leave="clearConfirmation"
    >
      <n-card
          :bordered="false"
          class="rounded-2xl w-fit"
          :body-style="{ padding: '0px' }"

      >
        <template #header>
          <div class="flex items-center justify-center w-full gap-2">
            <div class="flex items-center justify-center gap-2">
              <n-icon :component="DocumentTextOutline" size="large"/>
              <n-text class="text-xl">Confirm Details</n-text>
            </div>
          </div>
        </template>
        <template #header-extra>
          <div class="flex items-center justify-center  w-full">
            <n-icon :component="Close" size="large" @click="markAsCollectableModal=false"
                    class="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white hover:rounded-full p-1"/>
          </div>
        </template>

        <div class="flex w-full min-w-[400px] gap-4">
          <div class="flex w-full gap-2 flex-col">
            <div class="flex items-center justify-center">
              <div class="flex font-bold w-2/3 items-center justify-center px-3">
                User Name :
              </div>
              <n-select v-model:value="confirmation.employeeID" :options="Employees" placeholder="Select Employee"/>
            </div>
            <div class="flex items-center justify-center">
              <div class="flex font-bold w-2/3 items-center justify-center px-3">
                User PIN :
              </div>
              <n-input v-model:value="confirmation.pin" placeholder="Enter User PIN"/>
            </div>

            <div class="text-lg text-center font-bold mt-2">
              <n-divider/>
              Sheet Floor Details
              <n-divider/>
            </div>

            <div class="flex items-center justify-center">
              <div class="flex font-bold w-2/3 items-center justify-center px-3">
                Floor X1 (mm) :
              </div>
              <n-input-number class="w-full" v-model:value="floorDetails.floorX1" placeholder="Enter Floor X1"/>
            </div>
            <div class="flex items-center justify-center">
              <div class="flex font-bold w-2/3 items-center justify-center px-3">
                Floor Y1 (mm) :
              </div>
              <n-input-number class="w-full" v-model:value="floorDetails.floorY1" placeholder="Enter Floor Y1"/>
            </div>
            <div class="flex items-center justify-center">
              <div class="flex font-bold w-2/3 items-center justify-center px-3">
                Floor X2 (mm) :
              </div>
              <n-input-number class="w-full" v-model:value="floorDetails.floorX2" placeholder="Enter Floor X2"/>
            </div>
            <div class="flex items-center justify-center">
              <div class="flex font-bold w-2/3 items-center justify-center px-3">
                Floor Y2 (mm) :
              </div>
              <n-input-number class="w-full" v-model:value="floorDetails.floorY2" placeholder="Enter Floor Y2"/>
            </div>
          </div>

        </div>

        <template #footer>
          <div class="flex items-center justify-center gap-2">
            <n-button
                class="flex items-center px-6 justify-around gap-6 bg-red-500 text-white rounded-lg p-2 hover:bg-red-600"
                @click="markAsCollectableModal=false">
              Cancel
            </n-button>
            <n-button
                class="flex items-center px-6 justify-around gap-6 bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
                @click="MarkAsDeliverable">
              Confirm
            </n-button>

          </div>
        </template>
      </n-card>
    </n-modal>
    <div class="m-1 py-8 px-2 bg-white  min-h-[95vh] ">
      <div class="text-center pt-2 pb-2 w-full">
        <span class="text-3xl font-bold">
          Job History
        </span>
      </div>
      <div class="flex items-center justify-center my-6">
        <div class="flex w-full items-center justify-center gap-4">
          <div class="flex items-center justify-center gap-2">
            <n-text class="text-xl font-bold">Filter By</n-text>
          </div>
          <n-date-picker v-model:value="monthToSort" type="month" clearable/>
          <n-button
              class="flex items-center px-6 justify-around gap-6 bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
              @click="filterJob">
            Filter
          </n-button>
        </div>
      </div>
      <div style="height: 80vh;max-width: 80vw" class="overflow-y-scroll flex items-start justify-center relative border-2">
        <n-table striped size="small" border="outer" class="w-full">
          <thead>
          <tr class="text-center">
            <th>Job ID</th>
            <th>Job Name</th>
            <th>Started Time</th>
            <th>FinishedTime</th>
            <th>Time Elapsed</th>
            <th> Sheet ID</th>
            <th> Sheet Thickness</th>
            <th> Sheet Width</th>
            <th> Sheet Length</th>
            <th> Cut Width</th>
            <th> Cut Length</th>
            <th> Balanced Sheets</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody class="text-center">
          <tr v-for="job in pastJob" :key="job.jobID"
              v-if="pastJob.length > 0">
            <td>{{ job.jobID }}</td>
            <td>{{ job.jobName }}</td>
            <td>{{ FormatDate(job.createdTime) }}</td>
            <td>{{ FormatDate(job.tasks.PlateDrying.finishedTime) }}</td>
            <td>
              {{
                timeDifference(job.createdTime, job.tasks.PlateDrying.finishedTime)
              }}
            </td>
            <td>{{ sheetStore.getSheet(job.sheetID).sheetID }}</td>
            <td>{{ sheetStore.getSheet(job.sheetID).thickness }}mm</td>
            <td>{{ sheetStore.getSheet(job.sheetID).width }}mm</td>
            <td>{{ sheetStore.getSheet(job.sheetID).length }}mm</td>
            <td>{{ job.width }}mm</td>
            <td>{{ job.length }}mm</td>
            <td>
              <span v-for="bsheet in sheetStore.getSheet(job.sheetID).balanceSheets" :key="bsheet.sheetID">
                {{ bsheet.width }}mm x {{ bsheet.length }}mm <br>
              </span>
            </td>

            <td class="flex gap-2 items-center justify-center">
              <n-button
                  @click="viewSelectedJob(job)"
                  class="bg-green-100 hover:bg-green-500 flex items-center justify-center gap-3 border border-green-700 rounded-2xl hover:text-white font-bold py-2 px-2">
                <n-icon :component="EyeOutline" size="small"/>
                View JOB
              </n-button>

            </td>
          </tr>

          <tr v-else>
            <td colspan="13" class="text-center text-red-500">
              No Finished Jobs
            </td>
          </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </OwnerLayout>
</template>

<style scoped>

</style>