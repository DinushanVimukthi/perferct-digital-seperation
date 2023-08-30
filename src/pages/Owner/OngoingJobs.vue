<script setup lang="ts">
import {SunnySharp, Search, DocumentTextOutline, Close, CheckmarkCircle} from '@vicons/ionicons5'
import OutEmployeeLayout from "@Layout/OutEmployeeLayout.vue";
import {
  NTag,
  NIcon,
  NButton,
  NPagination,
  NCard,
  NSelect,
  NText,
  NModal,
  NInput,
    NResult,
  useNotification,
  NotificationType
} from "naive-ui";
import {computed, ref} from "vue";
import {useJobStore} from "@store/jobStore.ts";
import moment from "moment";
import {useAdminStore} from "../../store/adminStore.ts";
import {compareText} from "@/helper/Security.ts";
import {CutSheet, Job, Task} from "@/types/Types.ts";
import {Calendar, Download} from "@vicons/carbon";
import {useSheetStore} from "@store/sheetStore.ts";
import OwnerLayout from "@/Layout/OwnerLayout.vue";


const notification = useNotification();
const notify =(type: NotificationType,title:string,message:string)=> {
  notification[type]({
    content: message,
    title,
    duration: 2500,
    keepAliveOnHover: true
  })
}

const searchTerm = ref("");

const TaskColor = (task) => {
  // return { color: '#d59d56', textColor: '#ffffff', borderColor: '#555' }
  switch (task) {
    case "PlateWriting":
      return {color: '#d59d56', textColor: '#ffffff', borderColor: '#555'}
    case "PlateExposure":
      return {color: '#1cc7b2', textColor: '#ffffff', borderColor: '#555'}
    case "PlateWashing":
      return {color: '#d59d56', textColor: '#ffffff', borderColor: '#555'}
    case "PlateDrying":
      return {color: '#d59d56', textColor: '#ffffff', borderColor: '#555'}
    case "PlateFinishing":
      return {color: '#d59d56', textColor: '#ffffff', borderColor: '#555'}
  }
};

const TaskIcon = (task) => {
  switch (task) {
    case "PlateWriting":
      return DocumentTextOutline
    case "PlateExposure":
      return SunnySharp
    case "PlateWashing":
      return SunnySharp
    case "PlateDrying":
      return SunnySharp
    case "PlateFinishing":
      return SunnySharp
  }
};

const getTaskName = (task) => {
  switch (task) {
    case "PlateWriting":
      return "Writing"
    case "PlateExposure":
      return "Exposure"
    case "PlateWashing":
      return "Washing"
    case "PlateDrying":
      return "Drying"
    case "PlateFinishing":
      return "Finishing"
  }
};

const getNextTask= (currentTask:string)=>{
  const taskOrder = ["PlateWriting", "PlateExposure", "PlateWashing", "PlateDrying", "PlateFinishing"];
  const currentTaskIndex = taskOrder.indexOf(currentTask);
  if (currentTaskIndex == taskOrder.length - 1) {
    return "PlateFinishing"
  } else {
    return taskOrder[currentTaskIndex + 1]
  }

}


const page = ref(1);

const formatTime = (time:string) => {
  return moment(time, "HH:mm:ss").format("hh:mm A");
};

const Employees =computed(()=>{
  const outEmployee = useAdminStore().getOutEmployees;
  console.log(outEmployee)
  const employees = [];
  for (const employee of outEmployee) {
    employees.push({
      label: employee.userName,
      value: employee.userID,
    })
  }
  return employees;
})

const userConfirmationModal = ref(false);

const selectedJobID = ref<string>()
const confirmation = ref({
  employeeID: null,
  pin: "",
  remarks: "",
  currentTask:{} as Task
})

const openUserConfirmationModal = (jobID:string)=>{
  selectedJobID.value = jobID
  userConfirmationModal.value = true
  confirmation.value.currentTask = useJobStore().getCurrentTask(jobID)
}
const NextTask = ()=>{
  if (confirmation.value.employeeID === null || confirmation.value.employeeID === ""){
    notify("warning","Warning","Please Select your user Name")
    return;
  }
  if (confirmation.value.pin.length < 4){
    notify("warning","Warning","Please Enter Valid PIN")
    return;
  }

  if (!compareText(confirmation.value.pin,useAdminStore().getUser(confirmation.value.employeeID).userPIN)){
    notify("warning","Warning","Please Enter Valid PIN")
    return;
  }
  console.log(confirmation.value.currentTask)
  const nextTask = getNextTask(confirmation.value.currentTask.taskType)
  useJobStore().finishTask(selectedJobID.value,confirmation.value.currentTask.taskType,confirmation.value.employeeID)
  const task:Task ={
    finishedBy: "",
    finishedTime: "",
    remarks: confirmation.value.remarks,
    startedBy: confirmation.value.employeeID,
    startedTime: new Date().toUTCString(),
    taskID: "Task_" + Math.random().toString(36).substr(2, 9),
    taskType: nextTask,
  }
  if (confirmation.value.currentTask.taskType === "PlateFinishing"){
    useJobStore().finishJob(selectedJobID.value)
    userConfirmationModal.value = false
    return;
  }
  useJobStore().addJobTask(selectedJobID.value,task);
  userConfirmationModal.value = false
}

const clearConfirmation = ()=>{
  confirmation.value.employeeID = null
  confirmation.value.pin = ""
  confirmation.value.remarks = ""
  confirmation.value.currentTask = ""
}


const viewJobModel = ref(false);

const ViewJob = (job:Job) => {
  selectedJob.value = job;
  viewJobModel.value = true;
}
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

const sheetStore = useSheetStore();

const RefreshPage = () => {
  window.location.reload();
}
</script>

<template>
  <OwnerLayout>
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
          :style="{ width: '60%' }"
      >
        <template #header>
          <div class="flex items-center justify-center w-full gap-2">
            <div class="flex items-center justify-center gap-2">
              <n-icon :component="DocumentTextOutline" size="large" />
              <n-text class="text-xl">Job Details</n-text>
            </div>
          </div>
        </template>
        <template #header-extra>
          <div class="flex items-center justify-center  w-full">
            <n-icon :component="Close" size="large" @click="viewJobModel=false"  class="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white hover:rounded-full p-1"/>
          </div>
        </template>

        <div class="flex w-full gap-4">
          <div class="flex w-2/3 gap-2 flex-col">
            <div class="flex w-full gap-2 border-2 rounded-2xl p-4">
              <div class="flex w-1/2 flex-col gap-2 ">
                <div class="text-xl font-bold text-center mb-3">
                  Basic Details
                </div>
                <div class="flex gap-2 flex-col">
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Priority
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      <n-tag :bordered="false" type="success">
                        {{selectedJob.priority ?? "Normal"}}
                      </n-tag>
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Job Name :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{selectedJob.jobName}}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Job ID :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{selectedJob.jobID}}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Job Status :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{selectedJob.currentStatus}}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Created Time :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{selectedJob.createdTime}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex w-1/2 flex-col gap-2 ">
                <div class="text-xl font-bold text-center mb-3">
                  Sheet Details
                </div>
                <div class="flex gap-2 flex-col">
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Sheet :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      <n-tag round :bordered="false" :type="sheetStore.getSheet(selectedJob.sheetID).balanceSheets ? 'info' : 'success'">
                        {{sheetStore.getSheet(selectedJob.sheetID.toString()).balanceSheets ? "Balance Sheet" : "Normal Sheet"}}
                        <template #icon>
                          <n-icon :component="CheckmarkCircle" />
                        </template>
                      </n-tag>

                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Thickness :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{sheetStore.getSheet(selectedJob.sheetID.toString()).thickness}} mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Dimension :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{sheetStore.getSheet(selectedJob.sheetID.toString()).width}}mm x {{sheetStore.getSheet(selectedJob.sheetID.toString()).length}}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Cut Length :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{selectedJob.length}}mm
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Cut Width :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{selectedJob.width}}mm
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div class="flex w-full gap-2 border-2 rounded-2xl p-4">
              <div class="flex w-1/2 flex-col">
                <div class="text-xl font-bold text-center mb-3">
                  Download Design Files
                </div>
                <div class="flex w-full gap-2 flex-col">
                  <!-- Download -->
                  <div class="flex w-full gap-3 items-center justify-center">
                    <button class="flex items-center px-6 justify-around gap-6 bg-blue-500 text-white rounded-lg p-2">
                      <n-icon size="large" :component="Download" />
                      <div class="flex flex-col gap-1">
                        <div class="text-sm font-bold">
                          Download
                        </div>
                        <div class="text-xs">
                          Download the Design Files
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex w-1/2 flex-col">
                <div class="text-xl font-bold text-center mb-3">
                  Deadline
                </div>
                <div class="flex w-full gap-2 flex-col">
                  <div class="flex w-full gap-3 items-center justify-center">
                    <div class="flex items-center px-6 justify-around gap-6 rounded-lg p-2">
                      <n-icon size="large" :component="Calendar" />
                      <div class="flex flex-col gap-1">
                        <div class="text-xs">
                          {{selectedJob.deadline}}
                          {{selectedJob.createdTime}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="flex w-1/3 flex-col p-6">
            <div class=" w-full flex gap-2 text-xs font-bold text-center mb-3">
                <div class="flex gap-3 items-center justify-start">
                  <div class="h-4 w-4 bg-black rounded-full"></div>
                  <div class="text-xs">
                    Current Sheet
                  </div>
                </div>
                <div class="flex gap-3 items-center justify-start">
                  <div class="h-4 w-4 bg-red-600 rounded-full"></div>
                  <div class="text-xs">
                    Cut Sheet
                  </div>
                </div>
            </div>
            <canvas ref="canvasRef" class=" w-full" height="350">

            </canvas>
          </div>

        </div>

        <template #footer>
          <div class="flex items-center justify-center gap-2">
            <button class="flex items-center px-6 justify-around gap-6 bg-red-500 text-white rounded-lg p-2 hover:bg-red-600" @click="CancelJob">
              Cancel Job
            </button>
            <button class="flex items-center px-6 justify-around gap-6 bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
                    @click="userConfirmationModal = true">
              Start Job & Plate Writing
            </button>

          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal
        v-model:show="userConfirmationModal"
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
              <n-icon :component="DocumentTextOutline" size="large" />
              <n-text class="text-xl">Confirm Details</n-text>
            </div>
          </div>
        </template>
        <template #header-extra>
          <div class="flex items-center justify-center  w-full">
            <n-icon :component="Close" size="large" @click="userConfirmationModal=false"  class="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white hover:rounded-full p-1"/>
          </div>
        </template>

        <div class="flex w-full min-w-[400px] gap-4">
          <div class="flex w-full gap-2 flex-col">
            <div class="flex">
              <div class="flex font-bold w-2/3 items-center justify-center px-3">
                User Name :
              </div>
              <n-select v-model:value="confirmation.employeeID" :options="Employees" placeholder="Select Employee" />
            </div>
            <div class="flex">
              <div class="flex font-bold w-2/3 items-center justify-center px-3">
                User PIN :
              </div>
              <n-input v-model:value="confirmation.pin" placeholder="Enter User PIN" />
            </div>
          </div>

        </div>

        <template #footer>
          <div class="flex items-center justify-center gap-2">
            <button class="flex items-center px-6 justify-around gap-6 bg-red-500 text-white rounded-lg p-2 hover:bg-red-600" @click="userConfirmationModal=false">
              Cancel
            </button>
            <button class="flex items-center px-6 justify-around gap-6 bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
                    @click="NextTask">
              Confirm
            </button>

          </div>
        </template>
      </n-card>
    </n-modal>
    <div class="max-w-8xl bg-white min-h-[95vh] h-full mx-auto px-4 py-4">
      <div class="text-center pt-2 pb-8 w-full">
        <span class="text-3xl font-bold">Ongoing Jobs</span>
      </div>
      <div class="grid gap-3 p-6  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"  v-if="useJobStore().getOngoingJobs.length > 0">
        <div v-for="(job, index) in useJobStore().getOngoingJobs" :key="index" class="bg-card shadow-md relative rounded-2xl p-4">
          <!-- Your card content here -->
          <!-- Priority Tag -->
          <div class="absolute mt-1 mr-1 top-0 right-0">
            <n-tag round :bordered="false" type="success">
              {{ job.Priority }}N/A
            </n-tag>
          </div>
          <div class="flex flex-col items-center">
            <div class="flex flex-col gap-2 justify-between">
              <div class="flex flex-col justify-center items-center">
                <div class="text-xl font-bold">{{ job.jobName }}</div>
              </div>
              <div class="flex flex-col justify-center gap-2 items-center">
                <n-tag round :bordered="false"  :color="TaskColor(useJobStore().getCurrentTask(job.jobID).taskType)">
                {{ getTaskName(useJobStore().getCurrentTask(job.jobID).taskType)}}
                <template #icon>
                  <n-icon :component="TaskIcon(useJobStore().getCurrentTask(job.jobID).taskType)" class="mx-1"/>
                </template>
                </n-tag>
                <div class="text-sm text-gray-500">
                  Started :
                  {{ formatTime(useJobStore().getCurrentTask(job.jobID).startedTime)}}
                </div>
                <div class="text-sm gap-2 text-gray-500">
                  Started By :
                  {{ useAdminStore().getUser(useJobStore().getCurrentTask(job.jobID).startedBy).userName}}
                </div>

              </div>
              <!-- Button -->
              <div class="flex flex-col mt-1">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded" @click="openUserConfirmationModal(job.jobID)">
                  Finish {{ getTaskName(useJobStore().getCurrentTask(job.jobID).taskType)}}
                </button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded mt-2" @click="ViewJob(job)">
                  View Job
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div v-else class="flex flex-col items-center justify-center gap-2">
        <n-result
            status="info"
            title="No Pending Jobs"
            class="border-2 border-blue-400 p-4 rounded-2xl"

        >
          <div class="text-center">
            There are no pending jobs at the moment.Refresh the page to check again,<br>
            if you think this is a mistake please contact the administrator.
          </div>
          <template #footer>
            <div class="flex items-center justify-center gap-2">
              <button class="flex items-center px-6 justify-around gap-6 bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
                      @click="RefreshPage">
                Refresh
              </button>
            </div>
          </template>
        </n-result>
      </div>
    </div>
  </OwnerLayout>
</template>

<style scoped>
.bg-card{
  background: #DEE6F8;
}
</style>