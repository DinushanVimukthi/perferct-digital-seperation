<script setup lang="ts">

import InEmployeeLayout from "@Layout/InEmployeeLayout.vue";
import {ClipboardTaskAdd20Regular,ContentViewGallery20Regular} from "@vicons/fluent";
import {CheckmarkDone, CheckmarkSharp, EyeOutline, NewspaperOutline,DocumentTextOutline, Send,Close,CloudUploadOutline as ArchiveIcon} from "@vicons/ionicons5";
import {Delivery} from "@vicons/carbon";
import {
  NCard,
  NIcon,
  NInputGroup,
  NInputNumber,
  NModal,
  NTable,
    NInput,
  NTag,
  NSelect,
  NUpload,
  NUploadDragger,
  NText,
  useNotification,
  NotificationType,
  DataTableColumns
} from "naive-ui"
import {CanvasHTMLAttributes, computed, ref, UnwrapRef} from "vue";
import {useJobStore} from "@store/jobStore.ts";
import {Job, Task} from "@/types/Types.ts";
import {JobType} from "@/types/JobType.ts";

const canvasRef = ref(null);
const TagColor = (status:string) => {
  // status : Approved, Completed, Delivered,Processing,Pending, Started
  switch (status) {
    case "Approved":
      return { color: '#a7f19b', textColor: '#000000', borderColor: '#42ff00' }
    case "Completed":
      return { color: '#b9fff9', textColor: '#000000', borderColor: '#00ffe9' }
    case "Delivered":
      return { color: '#98ccf6', textColor: '#000000', borderColor: '#002aff' }
    case "Processing":
      return { color: '#f6f198', textColor: '#000000', borderColor: '#f5ff00' }
    case "Pending":
      return { color: '#e298f6', textColor: '#000000', borderColor: '#c100ff' }
    case "Started":
      return { color: '#f69898', textColor: '#000000', borderColor: '#ff0000' }

  }
};


interface cutSheet {
  width: number,
  length: number,
  design: string | null,
  selectedSheet: string | null,
  sheetFill: string | null,
  thickness: number | null,
}
const job = ref<Job>({
  jobID: "",
  jobName: "",
  createdTime: "",
  createdBy: "",
  width: 0,
  length: 0,
  sheetID: "",
  design: null,
  currentStatus: "Pending",
  approvedBy: "",
  approvedTime: null,
  startedTime: null,
  tasks: [],
})

const cutSheet = ref<cutSheet>({
  width : 100,
  length : 300,
  design : null,
  selectedSheet : null,
  sheetFill : null,
  thickness : 120,
})

const sheetSelected = ref(true);

const jobStore = useJobStore();

const addJob = () => {
  const selectedSheet = sheets.value.find((sheet) => sheet.sheetID == job.value.sheetID);
  job.value.jobID = Math.floor(Math.random() * 1000000);
  job.value.cutSheetWidth = cutSheet.value.width;
  job.value.cutSheetHeight = cutSheet.value.length;
  job.value.fillPercentage = calculateFillPercentage(selectedSheet);
  job.value.design = cutSheet.value.design;
  jobStore.addJob(job.value);
  notify('success', 'Successful!', 'Job Added Successfully');
}

const cancelJob = () => {
  job.value.jobID = null;
  job.value.sheetID = null;
  job.value.cutSheetWidth = null;
  job.value.cutSheetHeight = null;
  job.value.fillPercentage = null;
  job.value.design = null;
  sheetSelected.value = false;
  addJobModel.value = false;

//   Clear the form
  cutSheet.value.width = 0;
  cutSheet.value.length = 0;
  cutSheet.value.design = null;
  cutSheet.value.selectedSheet = null;
  cutSheet.value.sheetFill = null;
  cutSheet.value.thickness = null;
}

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

const addJobModel = ref(false);
const viewJobModel = ref(false);

// const finishedJob = ref<Job[]>(Array.from({ length: 10 }).map(generateRandomJob));
const finishedJob = ref<Job[]>([]);

const availableSheets = ref([
  {
    sheetID : 'Sheet_01',
    sheetWidth: 200,
    sheetHeight: 400,
    selected: false
  },
{
    sheetID : 'Sheet_02',
    sheetWidth: 300,
    sheetHeight: 600,
    selected: false
  },
  {
    sheetID : 'Sheet_03',
    sheetWidth: 700,
    sheetHeight: 400,
    selected: false
  },
  {
    sheetID : 'Sheet_04',
    sheetWidth: 150,
    sheetHeight: 300,
    selected: false
  },
  {
    sheetID : 'Sheet_05',
    sheetWidth: 200,
    sheetHeight: 400,
    selected: false
  },
  {
    sheetID : 'Sheet_06',
    sheetWidth: 200,
    sheetHeight: 400,
    selected: false
  },
  {
    sheetID : 'Sheet_07',
    sheetWidth: 200,
    sheetHeight: 400,
    selected: false
  },
  {
    sheetID : 'Sheet_08',
    sheetWidth: 200,
    sheetHeight: 400,
    selected: false
  },
  {
    sheetID : 'Sheet_09',
    sheetWidth: 200,
    sheetHeight: 400,
    selected: false
  },
  {
    sheetID : 'Sheet_10',
    sheetWidth: 200,
    sheetHeight: 400,
    selected: false
  },

])

const sheets = computed(() => {
  // Sort the sheets by width
  availableSheets.value.sort((a, b) => {
    return calculateFillPercentage(b) - calculateFillPercentage(a);
  });
  availableSheets.value[0].selected = true;
  job.value.sheetID = availableSheets.value[0].sheetID;
  return availableSheets.value.slice(0, 5);
});

// Description Field

const notification = useNotification();
const notify =(type: NotificationType,title:string,message:string)=> {
  notification[type]({
    content: message,
    title,
    duration: 2500,
    keepAliveOnHover: true
  })
}

const SelectSheet = (sheet)=>{
  if (!sheetSelected.value){
    sheetSelected.value = true;
    job.value.sheetID = sheet.sheetID;
    sheets.value[sheets.value.findIndex((item)=>item.sheetID == sheet.sheetID)].selected = true;
  }else{
    notify('warning','Warning','You have already selected a sheet')
  }
}

const DeselectSheet = (sheet)=>{
  if (sheetSelected.value){
    sheetSelected.value = false;
    job.value.sheetID = null;
    sheets.value[sheets.value.findIndex((item)=>item.sheetID == sheet.sheetID)].selected = false;
  }else{
    notify('warning','Warning','You have not selected a sheet')
  }
}
const calculateFillPercentage = (sheet)=>{
  const sheetWidth = sheet.sheetWidth;
  const sheetLength = sheet.sheetHeight;
  const cutSheetWidth = cutSheet.value.width;
  const cutSheetLength = cutSheet.value.length;
  const cutSheetArea = cutSheetWidth * cutSheetLength;
  const sheetArea = sheetWidth * sheetLength;
  return parseFloat(((cutSheetArea/sheetArea)*100).toPrecision(2))
}

const balanceSheets = (sheet) =>{
  console.log(sheet)
  const remainingSheets = [];
  const remainingWidth = sheet.sheetWidth - cutSheet.value.width;
  const remainingLength = sheet.sheetHeight - cutSheet.value.length;
  if (remainingWidth <10 && remainingLength <10){
    console.log("Sheet is too small")
  }
  else if(remainingWidth <10){
    if (remainingLength > 10) {
      console.log("2")
      remainingSheets.push({
        sheetID: sheet.sheetID,
        sheetWidth: sheet.sheetWidth,
        sheetHeight: remainingLength,
        selected: false
      })
    }
  }else if (remainingLength <10) {
    console.log("3")
    if (remainingWidth > 10){
      remainingSheets.push({
        sheetID: sheet.sheetID,
        sheetWidth: remainingWidth,
        sheetHeight: sheet.sheetHeight,
        selected: false
      })

    }
  }else {
    remainingSheets.push({
      sheetID: sheet.sheetID,
      sheetWidth: cutSheet.value.width,
      sheetHeight: remainingLength,
      selected: false
    })
      remainingSheets.push({
        sheetID: sheet.sheetID,
        sheetWidth: remainingWidth,
        sheetHeight: sheet.sheetHeight,
        selected: false
      })
  }
    console.log(remainingSheets);
    return remainingSheets;

}

const thicknessOfSheets = ref([
  {
    label: '50mm',
    value: 50,
    disabled:false
  },
  {
    label:'60mm',
    value: 60,
    disabled:false
  },
  {
    label:'70mm',
    value: 70,
    disabled:false
  },
  {
    label:'80mm',
    value: 80,
    disabled:false
  },


])

const draw = () =>{
  const canvas:any = canvasRef.value;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const cutSheetWidth = cutSheet.value.width;
  const cutSheetLength = cutSheet.value.length;
  ctx.fillRect(10, 10, canvasWidth-20, canvasHeight-20);



  //Draw cut Sheet
  ctx.fillStyle = '#ffffff';
}

const viewSelectedJob = (job:Job) =>{
  currentJob.value = job;
  viewJobModel.value = true;
}



const currentJob =ref<JobType | null>(null)
// const uploadRef = ref<UploadInst | null>(null)
</script>

<template>
  <InEmployeeLayout>
    <n-modal
        v-model:show="addJobModel"
        title="Dialog"
        class="w-1/2 rounded-2xl"
    >
      <n-card
          class="w-4/5 rounded-2xl"
          title="Add New Job"
          header-style="background-color: #476ECA;text-align: center;font-size: 20px;font-weight: 600;border-radius: 10px 10px 0 0;text-color: #fff;"
          footer-style="background-color: #fff;padding: 10px 20px;text-align: center; border-radius: 0 0 10px 10px;"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
      >

        <div class="flex gap-5 w-full">
          <div class="w-1/2 gap-4 p-2 flex flex-col">
            <div class="flex justify-center items-center gap-2">
              <div class="flex w-1/2 gap-4 flex-col">
                <div class="flex gap-2">
                  <span class="text-sm font-semibold w-1/4"> Thickness</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-select v-model:value="cutSheet.thickness" :options="thicknessOfSheets" :style="{width:'80%'}" class="mr-8"/>
                  </n-input-group>
                </div>
                <div class="flex gap-2 items-center justify-center">
                  <span class="text-sm font-semibold w-1/4"> Length</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-input-number clearable :precision="2"  size="small" placeholder="Plate Width" :style="{width:'80%'}" v-model:value="cutSheet.length"/>
                    <n-input-group-label>mm</n-input-group-label>
                  </n-input-group>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-semibold w-1/4"> Width</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-input-number clearable :precision="2"  size="small" placeholder="Plate Length" :style="{width:'80%'}" v-model:value="cutSheet.width"/>
                    <n-input-group-label>mm</n-input-group-label>
                  </n-input-group>
                </div>
              </div>
              <div class="flex flex-col gap-4 mt-3 w-1/2 px-4 items-center justify-center">
                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-semibold w-2/4"> Job Name</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-input clearable size="small" placeholder="Enter Job Name"  v-model:value="job.jobName"/>
                  </n-input-group>
                </div>
                <n-upload
                    multiple
                    directory-dnd
                    action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                    :max="5"
                >
                  <n-upload-dragger>
                    <div class="mb-3">
                      <n-icon size="36" :depth="3">
                        <archive-icon />
                      </n-icon>
                    </div>
                    <n-text style="font-size: 16px">
                      Click or drag Design to Upload
                    </n-text>
                  </n-upload-dragger>
                </n-upload>
              </div>
            </div>
            <n-table size="small" border="outer" class="w-full">
              <thead>
              <tr class="text-center">
                <th >Sheet ID</th>
                <th>Fill Percentage</th>
                <th>Sheet Size</th>
                <th>Balance Sheet</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="sheet in sheets" :key="sheet.sheetID" v-if="sheets.length>0 && cutSheet.length>10 && cutSheet.width>10">
                <td>{{sheet.sheetID}}</td>
                <td
                    class="flex items-center justify-center">
                  <span class=" text-white text-center font-bold px-2 rounded-2xl py-1 w-3/5"
                        :style="calculateFillPercentage(sheet)>=80 ? 'background-color: #0A9029' : calculateFillPercentage(sheet)>=60 ? 'background-color: #DAA520' : 'background-color: #ff0000' "
                  >
                    {{calculateFillPercentage(sheet)}}%
                  </span>
                </td>
                <td>{{sheet.sheetHeight}} x {{sheet.sheetWidth}}</td>
                <td>
                  <div v-for="(balanceSheet,index) in balanceSheets(sheet)" :key="balanceSheet.sheetID">
                    {{index+1}}) {{balanceSheet.sheetHeight}} x {{balanceSheet.sheetWidth}}
                  </div>
                </td>

                <td class="flex gap-2">
                  <button class="bg-blue-500 hover:bg-blue-700 rounded-full flex items-center justify-center gap-3 text-white font-bold py-2 px-2 ">
                    <n-icon :component="EyeOutline" size="medium" />
                  </button>
                  <button class="bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center gap-3 text-white font-bold py-2 px-2 "
                          :class="{'btn-disabled':sheetSelected}"
                          @click="SelectSheet(sheet)"
                          v-if="!sheet.selected">
                    <n-icon :component="CheckmarkSharp" size="medium" />
                  </button>
                  <button class="bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center gap-3 text-white font-bold py-2 px-2 " v-else @click="DeselectSheet(sheet)" >
                    <n-icon :component="Close" size="medium"/>
                  </button>

                </td>
              </tr>
              <tr v-else>
                <td colspan="5" class="text-center">No Sheets Available</td>
              </tr>
              </tbody>
            </n-table>
          </div>
          <div class="w-1/2 flex p-8 items-center justify-center">
            <button @click="draw" class="bg-blue-500 hover:bg-blue-700 rounded-full flex items-center justify-center gap-3 text-white font-bold py-2 px-2 ">
              <n-icon :component="EyeOutline" size="medium" />
            </button>
            <canvas ref="canvasRef" class="border"></canvas>
          </div>
        </div>
        <template #footer>
          <div class="flex items-center justify-center w-full gap-2">
            <button class="bg-red-500 hover:bg-red-800 w-1/12 rounded-full flex items-center justify-center gap-3 text-lg text-white font-bold py-2 px-1" @click="cancelJob">
              Cancel
            </button>
            <button class="bg-green-600 hover:bg-green-700 w-1/12 rounded-full flex items-center justify-center gap-3 text-lg text-white font-bold py-2 px-1 " @click="addJob">
              Add Job
            </button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal
        v-model:show="viewJobModel"
        title="View Job"
        :width="1000"
        :mask-closable="false"
        :closable="false"
        :footer="false">
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

        <div class="flex gap-4">
          <div class="flex gap-2 flex-col">
            <div class="flex flex-col gap-2 border-2 rounded-2xl p-4">
              <div class="text-xl font-bold text-center mb-3">
                Basic Details
              </div>
              <div class="flex gap-2 flex-col">
                <div class="flex">
                  <div class="flex font-bold w-1/3 items-center justify-center px-3">
                    Job Name :
                  </div>
                  <div class="flex w-3/4 items-center justify-start px-2">
                    {{currentJob.jobName}}
                  </div>
                </div>
                <div class="flex">
                  <div class="flex font-bold w-1/3 items-center justify-center px-3">
                    Job ID :
                  </div>
                  <div class="flex w-3/4 items-center justify-start px-2">
                    {{currentJob.jobID}}
                  </div>
                </div>
                <div class="flex">
                  <div class="flex font-bold w-1/3 items-center justify-center px-3">
                    Job Status :
                  </div>
                  <div class="flex w-3/4 items-center justify-start px-2">
                    {{currentJob.currentStatus}}
                  </div>
                </div>
                <div class="flex">
                  <div class="flex font-bold w-1/3 items-center justify-center px-3">
                    Created Time :
                  </div>
                  <div class="flex w-3/4 items-center justify-start px-2">
                    {{currentJob.createdTime}}
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
                  <tr>
                    <th>No</th>
                    <th>Task Name</th>
                    <th>Task Status</th>
                    <th>Started Time</th>
                    <th>Completed Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(task,index) in currentJob.tasks" :key="task.taskID">
                    <td>#{{index+1}}</td>
                    <td>{{task.taskType}}</td>
                    <td>{{task.taskStatus}}</td>
                    <td>{{task.taskCreatedTime}}</td>
                    <td>{{task.taskCompletedTime}}</td>
                  </tr>
                </tbody>
              </n-table>
            </div>
            </div>
            </div>
          <div class="flex w-1/2 p-6">
            <canvas ref="canvasRef" class="border w-full">

            </canvas>
          </div>

          </div>
      </n-card>
    </n-modal>


    <div class="flex items-center gap-2 justify-center w-full h-full">
      <div class="flex gap-6 flex-col items-center gap-5 w-3/4 bg-white h-full">
        <div class="flex items-center  mx-2 justify-center p-3 gap-5 w-full">
          <div class="flex bg-white p-5 rounded-xl gap-2 shadow-sm shadow-blue-600 items-center justify-center flex-col">
          <span class="text-5xl text-blue-800 font-bold">
            14
          </span>
            <div class="text-sm text-blue-500">
              Pending Jobs
            </div>
          </div>
          <div class="flex bg-white p-5 rounded-xl gap-2 shadow-sm shadow-amber-600 items-center justify-center flex-col">
          <span class="text-5xl text-yellow-600 font-bold">
            20
          </span>
            <div class="text-sm text-yellow-500">
              Ongoig Jobs
            </div>
          </div>
          <div class="flex bg-white p-5 rounded-xl gap-2 shadow-sm shadow-green-600 items-center justify-center flex-col">
          <span class="text-5xl text-green-800 font-bold">
            14
          </span>
            <div class="text-sm text-green-500">
              Collectable Jobs
            </div>
          </div>
        </div>
        <div class="w-3/4 flex-col gap-4 flex ">
          <div class="flex items-center justify-between w-full">
            <div class="font-bold text-xl">
              Recent Jobs
            </div>
            <div class="flex items-center gap-2">
              <button class="flex items-center gap-2 bg-blue-500 text-white px-2 py-1 rounded-xl" @click="addJobModel = true">
                <n-icon :component="ClipboardTaskAdd20Regular" size="24px" />
                <span>
                  Add Job
                </span>
              </button>
              <button class="flex items-center gap-2 bg-blue-500 text-white px-2 py-1 rounded-xl">
                <n-icon :component="ContentViewGallery20Regular" size="24px" />
                <span>
<!--                  TODO : View All-->
                  View All
                </span>
              </button>
            </div>
          </div>
          <n-scrollbar style="max-height: 120px">
            <n-table
                striped size="small"
                border="outer"
                class="w-full"
            >
              <thead>
              <tr class="text-center">
                <th>Job ID</th>
                <th>Sheet ID</th>
                <th>Added Time</th>
                <th>Started Time</th>
                <th>Priority Level</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody class="text-center">
              <tr v-for="job in finishedJob" :key="job.jobID" v-if="finishedJob.length > 0">
                <td>{{job.jobID}}</td>
                <td>{{job.sheetID}}</td>
                <td>{{job.startedTime}}</td>
                <td>{{job.startedTime}}</td>
                <td>High</td>
                <td>
                  <n-tag
                      :color="TagColor(job.currentStatus)"
                      class="px-2 min-w-[110px]" round>
                    <template #icon>
                      <n-icon :component="TagIcon(job.currentStatus)" size="medium" class="ml-2" />
                    </template>
                    <span class="text-sm">
                {{job.currentStatus}}
              </span>
                  </n-tag>
                </td>
                <td class="flex">
                  <button class="bg-blue-500 hover:bg-blue-700 flex text-sm items-center justify-center gap-3 text-white py-2 px-2 w-full rounded" @click="viewSelectedJob(job)">
                    <n-icon :component="NewspaperOutline" size="medium" />
                    <span class="text-sm">
                    View
                  </span>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="7" class="text-center">
                  No Jobs
                </td>
              </tr>
              </tbody>
            </n-table>
          </n-scrollbar>
        </div>

      </div>
      <div class="w-1/4 flex flex-col gap-2 items-center h-full justify-start">
        <div class="font-bold text-xl pt-4">
          Notifications
        </div>
        <div class="flex flex-col gap-2 w-full px-2 h-full items-center ">
          <div class="w-full flex py-2 justify-between mx-3 px-3 bg-blue-200 rounded-2xl">
            <div class="flex-col flex">
              <div class=" font-bold" >
                1. New Job Added - 10.15 AM
              </div>
              <div class="text-sm">
                Lorem ipsum dolor sit amet.
              </div>
            </div>
            <div class="flex-col items-center justify-center flex">
              <n-icon :component="CheckmarkDone" size="24px" />
            </div>
          </div>
        </div>


      </div>
    </div>
  </InEmployeeLayout>

</template>

<style>
canvas {
  border: 1px solid #000;
  display: block;
  margin: 0 auto;
  width: 80%;
  height: 100%;
}

</style>