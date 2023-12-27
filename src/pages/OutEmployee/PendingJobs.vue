<script setup lang="ts">

import OutEmployeeLayout from "@/Layout/OutEmployeeLayout.vue";
import {useJobStore} from "@store/jobStore.ts";
import {ref, computed, onMounted} from "vue";
import {EyeOutline, SearchOutline, Checkmark, DocumentTextOutline, Close,CheckmarkCircle} from "@vicons/ionicons5";
import {
  NCard,
  NIcon,
  NModal,
  NTable,
  NTag,
  NText,
  NInputGroup,
  NSelect,
  NInput,
  useNotification,
  NotificationType
} from "naive-ui";
import {Delivery,Download,Calendar} from "@vicons/carbon";
import {BalanceSheet, CutSheet, Job, Sheet, Task} from "@/types/Types.ts";
import {useSheetStore} from "@store/sheetStore.ts";
import {useUserStore} from "@store/UserStore.ts";
import {useAdminStore} from "@store/adminStore.ts";
import {compareText} from "@/helper/Security.ts";
import moment from "moment/moment";

const jobStore = useJobStore();
const sheetStore = useSheetStore();

const notification = useNotification();
const notify =(type: NotificationType,title:string,message:string)=> {
  notification[type]({
    content: message,
    title,
    duration: 2500,
    keepAliveOnHover: true
  })
}


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

const selectedJob =ref<Job>(null);
const viewJobModel = ref(false);
const TakeJob = (job:Job) => {
  console.log(job)
  selectedJob.value = job;
  viewJobModel.value = true;
}

const CancelJob = () => {
  viewJobModel.value = false;
}

const clearSelectedJob = () => {
  selectedJob.value = null;
}
const canvasRef = ref();
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
    ctx.fillText(`${name}`, widthLabelX, heightLabelY + 10);
  }
  // fill color
};

const draw = (cutSheet: CutSheet,sheet:BalanceSheet[]) => {
  console.log(sheet);
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
      console.log(c)


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

const StartJob = () => {
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
  const jobID = selectedJob.value.jobID;
  const userStore = useUserStore();
  const task:Task ={
    finishedBy: "",
    finishedTime: "",
    remarks: confirmation.value.remarks,
    startedBy: confirmation.value.employeeID,
    startedTime: new Date().toUTCString(),
    taskID: "Task_" + Math.random().toString(36).substr(2, 9),
    taskType: "PlateWriting",
  }

  const tasks = jobStore.getTasks(jobID);

  if (!tasks){
    jobStore.updateJobStatus(jobID,"Processing");
    jobStore.addJobTask(jobID,task);
    userConfirmationModal.value = false;
    viewJobModel.value = false;

    notify("success","Success","Job Started Successfully")
    return;
  }else{
    userConfirmationModal.value = false;
    viewJobModel.value = false;
    notify("warning","Warning","You have already started this job")
  }
}

const userConfirmationModal = ref(false);

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

const confirmation = ref({
  employeeID: null,
  pin: "",
  remarks: "",
})

onMounted(()=>{
  useAdminStore().getAllUsers();
})

const sortJobs = (jobs:Job[]) => {
  return jobs.sort((a,b)=>{
    return parseInt(a.jobID.toString().split("_")[1]) - parseInt(b.jobID.toString().split("_")[1])
  })
}

const PriorityColor = (priority:string) => {
  switch (priority) {
    case "Normal":
      return { color: '#716d00', textColor: '#ffffff', borderColor: '#555' }
    case "Urgent":
      return { color: '#b00000', textColor: '#ffffff', borderColor: '#555' }
    case "High":
      return { color: '#008674', textColor: '#ffffff', borderColor: '#555' }
    default:
      return { color: '#0500a2', textColor: '#ffffff', borderColor: '#555' }
  }
};

const FormatDate = (date:string) =>{
  return moment(date).format('DD MMM hh:mm A');
}

const sJobs = ref<Job[]>(sortJobs(jobStore.getPendingJobs));
const Jobs = computed(()=>{
  const jobs = jobStore.getPendingJobs;
  return sortJobs(jobs);
})
</script>

<template>
<OutEmployeeLayout>
  <n-modal
      v-model:show="viewJobModel"
      title="View Job"
      :mask-closable="false"
      :closable="false"
      :footer="false"
      :on-after-enter="()=>{draw(sheetStore.getCutSheet(selectedJob.jobID),selectedJob.balanceSheets,selectedJob)}"
      :on-after-leave="clearSelectedJob"
  >
    <n-card
        :bordered="false"
        class="rounded-2xl"
        :body-style="{ padding: '0px' }"
        :style="{ width: '90%',height: '95vh' }"
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
                    <n-tag :bordered="false" :color="PriorityColor(selectedJob.priority ?? 'Normal')">
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
<!--                      {{sheetStore.getSheet(selectedJob.sheetID).balanceSheets ? "Balance Sheet" : "Normal Sheet"}}-->
                      {{selectedJob.sheetID}}
                      <template #icon>
                        <n-icon :component="CheckmarkCircle" />
                      </template>
                    </n-tag>

                  </div>
                </div>
                <div class="flex text-xl py-2 rounded bg-amber-500 text-white">
                  <div class="flex font-bold text-xl w-full items-center justify-start px-2">
                    Thickness : {{sheetStore.getSheet(selectedJob.sheetID).thickness}} mm
                  </div>
                </div>
                <div class="flex text-xl py-2 rounded bg-green-500 text-white">
                  <div class="flex font-bold text-xl w-full items-center justify-start px-2">
                    Type : {{sheetStore.getSheet(selectedJob.sheetID).stockType}}
                  </div>
                </div>
                <div class="flex py-2 rounded bg-blue-500 text-white">
                  <div class="flex font-bold text-lg w-full items-center justify-start px-2">
                    Sheet Size : {{selectedJob.parentSheetLength}}mm x {{selectedJob.parentSheetWidth}}mm
                  </div>
                </div>
                <div class="flex text-xl py-2 rounded bg-red-500 text-white">
                  <div class="flex font-bold text-xl w-full items-center justify-start px-2">
                    Cut Size :{{selectedJob.length}}mm x {{selectedJob.width}}mm
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="flex w-full gap-2 border-2 rounded-2xl p-4">
            <div class="flex w-1/2 flex-col">
              <div class="text-xl font-bold text-center mb-3">
                Balance Sheets
              </div>
              <div class="flex w-full gap-2 flex-col">
                <div class="flex w-full gap-3 items-center justify-center">
<!--  Balaance Sheets -->
                  <div class="flex flex-col items-center px-6 justify-around gap-2 rounded-lg p-2">
                      <div class="text-lg font-bold text-white py-2 px-3 rounded-2xl bg-blue-500" v-for="sheet in selectedJob.balanceSheets" :key="sheet.sheetID">
                        {{sheet.length}} mm x {{sheet.width}} mm
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center w-1/2 rounded-2xl bg-purple-500 text-white">
              <div class="w-full flex justify-center items-center text-xl font-bold text-center ">
                Deadline : {{FormatDate(selectedJob.deadline)}}
              </div>
            </div>
          </div>
        </div>
        <div class="flex w-1/3 p-2">
          <canvas ref="canvasRef" width="300" height="500">
          </canvas>
        </div>

      </div>

      <template #footer>
        <div class="flex items-center justify-center gap-2">
          <n-button class="flex items-center px-6 justify-around gap-6 bg-red-500 text-white rounded-lg p-2 hover:bg-red-600" @click="CancelJob">
            Cancel Job
          </n-button>
          <n-button class="flex items-center px-6 justify-around gap-6 bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
                  @click="userConfirmationModal = true">
              Start Job & Plate Writing
          </n-button>

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
            <n-text class="text-xl">Confirm Details</n-text>
          </div>
        </div>
      </template>
      <template #header-extra>
        <div class="flex items-center justify-center  w-full">
          <n-icon :component="Close" size="large" @click="userConfirmationModal=false"  class="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white hover:rounded-full p-1"/>
        </div>
      </template>

      <div class="flex w-full gap-4">
        <div class="flex w-2/3 gap-2 flex-col">
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
          <div class="flex">
            <div class="flex font-bold w-2/3 items-center justify-center px-3">
              Remarks :
            </div>
            <n-input
                v-model:value="confirmation.remarks"
                placeholder="Remarks"
                type="textarea"
                size="small"
                :autosize="{
                  minRows: 3,
                  maxRows: 5
                }"
            />
          </div>


        </div>

      </div>

      <template #footer>
        <div class="flex items-center justify-center gap-2">
          <n-button class="flex items-center px-6 justify-around gap-6 bg-red-500 text-white rounded-lg p-2 hover:bg-red-600" @click="userConfirmationModal=false">
            Cancel
          </n-button>
          <n-button class="flex items-center px-6 justify-around gap-6 bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
                  @click="StartJob">
              Confirm
          </n-button>

        </div>
      </template>
    </n-card>
  </n-modal>

  <div class="h-full w-full bg-white min-h-[95vh] flex items-start justify-center ">
    <div class="max-w-[80%] w-4/5 flex flex-col items-center justify-center">
      <div class="flex my-5 w-full gap-2 py-1 mb-4">
        <div class="flex text-2xl w-full text-center font-semibold items-center justify-center gap-2">
          Pending Jobs
        </div>

      </div>
      <n-table striped size="small" border="outer" class="w-full text-center">
        <thead>
        <tr>
          <th>Job ID</th>
          <th>Job Name</th>
          <th>Sheet ID</th>
          <th>Submitted Time</th>
          <th>Priority</th>
          <th>Deadline</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="job in Jobs" :key="job.jobID" v-if="jobStore.getPendingJobs.length > 0">
          <td>{{job.jobID}}</td>
          <td>{{job.jobName}}</td>
          <td>{{job.sheetID}}</td>
          <td>{{job.createdTime}}</td>
          <td>
            <n-tag
                :color="PriorityColor(job.priority)"
            >
            <span class="text-sm font-bold">
                {{job.priority ?? "N/A"}}
              </span>
            </n-tag>
          </td>
          <td>{{FormatDate(job.createdTime)}}</td>
          <td class="flex items-center justify-center gap-2">
            <n-button class="bg-green-200 hover:bg-white hover:text-black border hover:border hover:border-green-500 flex items-center justify-center gap-3 text-green-800 font-bold py-2 px-2 rounded"
                      @click="TakeJob(job)">
<!--              <n-icon :component="Checkmark" size="large" />-->
              Take Job
            </n-button>
<!--            <n-button class="bg-blue-200 text-blue-800 hover:bg-white border hover:text-black hover:border hover:border-green-500 flex items-center justify-center gap-3 font-bold py-2 px-2 rounded" disabled>-->
<!--                <n-icon :component="Download" size="large" />-->
<!--              Design-->
<!--            </n-button>-->
          </td>
        </tr>
        <tr v-else>
          <td colspan="6" class="text-center">No Pending Jobs Available</td>
        </tr>
        </tbody>
      </n-table>
    </div>
  </div>

</OutEmployeeLayout>
</template>

