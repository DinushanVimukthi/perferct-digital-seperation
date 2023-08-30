<script setup lang="ts">

import InEmployeeLayout from "@Layout/InEmployeeLayout.vue";
import {ClipboardTaskAdd20Regular} from "@vicons/fluent";
import {
  CheckmarkSharp,
  Close,
  CloudUploadOutline as ArchiveIcon,
  DocumentTextOutline,
  EyeOutline,
  TrashBinOutline,
  NewspaperOutline,
  Send
} from "@vicons/ionicons5";
import {Delivery} from "@vicons/carbon";
import moment from "moment";
import {
  NCard,
  NDatePicker,
  NIcon,
  NInput,
  NInputGroup,
  NInputNumber,
  NModal,
  NotificationType,
  NSelect,
  NTable,
  NTag,
  NText,
  NUpload,
  NUploadDragger,
  useNotification,
} from "naive-ui"
import {computed, onMounted, ref} from "vue";
import {useJobStore} from "/src/store/jobStore.ts";
import {BalanceSheet, CutSheet, Job, Sheet, Task} from "/src/types/Types.ts";
import {useSheetStore} from "/src/store/sheetStore.ts";
import {useUserStore} from "/src/store/UserStore.ts";

// Pinia Store
const jobStore = useJobStore();
const sheetStore = useSheetStore();
const userStore = useUserStore();


const notification = useNotification();
const notify = (type: NotificationType, title: string, message: string) => {
  notification[type]({
    content: message,
    title,
    duration: 2500,
    keepAliveOnHover: true
  })
}

const priorities = [
  {label: "Urgent", value: "Urgent"},
  {label: "High", value: "High"},
  {label: "Normal", value: "Normal"},
]
const addJobModel = ref(false);
const viewJobModel = ref(false);


const TagColor = (status: string) => {
  // status : Approved, Completed, Delivered,Processing,Pending, Started
  switch (status) {
    case "Approved":
      return {color: '#a7f19b', textColor: '#000000', borderColor: '#42ff00'}
    case "Completed":
      return {color: '#b9fff9', textColor: '#000000', borderColor: '#00ffe9'}
    case "Delivered":
      return {color: '#98ccf6', textColor: '#000000', borderColor: '#002aff'}
    case "Processing":
      return {color: '#f6f198', textColor: '#000000', borderColor: '#f5ff00'}
    case "Pending":
      return {color: '#e298f6', textColor: '#000000', borderColor: '#c100ff'}
    case "Started":
      return {color: '#f69898', textColor: '#000000', borderColor: '#ff0000'}

  }
};

const thickness = ref(0);


const job = ref<Job>({
  jobID: jobStore.getLastJobID,
  jobName: "Job First",
  createdTime: "",
  createdBy: userStore.getUser.userID,
  deadLine: null,
  width: 700,
  length: 1500,
  sheetID: "",
  bSheetID: "",
  cutSheetID: "",
  design: null,
  currentStatus: "Pending",
  approvedBy: null,
  approvedTime: null,
  priority: "Normal",
  startedTime: null,
  tasks: [],
})


const sheetSelected = ref(true);


const calculateFillPercentage = (sheet: Sheet) => {
  const width = sheet.width;
  const sheetLength = sheet.length;
  const jobWidth = job.value.width;
  const jobLength = job.value.length;
  const jobArea = jobWidth * jobLength;
  const sheetArea = width * sheetLength;
  return parseFloat(((jobArea / sheetArea) * 100).toPrecision(2))
}

const balanceSheets = (sheet: Sheet) => {
  const remainingSheets = [];
  // if (job.value.width > job.value.length) {
  //   let temp = job.value.width;
  //   job.value.width = job.value.length;
  //   job.value.length = temp;
  // }
  const remainingWidth = sheet.width - job.value.width;
  const remainingLength = sheet.length - job.value.length;

  if (remainingWidth < 10 && remainingLength < 10) {
  } else if (remainingWidth < 10) {
    if (remainingLength > 10) {
      remainingSheets.push({
        sheetID: sheet.sheetID,
        width: sheet.width,
        length: remainingLength,
        selected: false
      })
    }
  } else if (remainingLength < 10) {
    if (remainingWidth > 10) {
      remainingSheets.push({
        sheetID: sheet.sheetID,
        width: remainingWidth,
        length: sheet.length,
        selected: false
      })

    }
  } else {
    remainingSheets.push({
      sheetID: sheet.sheetID,
      width: job.value.width,
      length: remainingLength,
      selected: false
    })
    remainingSheets.push({
      sheetID: sheet.sheetID,
      width: remainingWidth,
      length: sheet.length,
      selected: false
    })
  }
  return remainingSheets;
}
const handleChange = (value: any) => {
  job.value.design = value;
};

const addJob = () => {
  if (job.value.sheetID === "" && job.value.sheetID === "") {
    notify("error", "Error", "Please select a sheet")
    return
  } else if (job.value.jobName.trim() === "") {
    notify("error", "Error", "Please enter a job name")
    return
  } else if (job.value.deadLine == null) {
    notify("error", "Error", "Please select a deadline")
    return
  } else {
    job.value.jobID = jobStore.getLastJobID;
    job.value.createdTime = new Date().toLocaleString();
    job.value.currentStatus = "Pending";
    job.value.createdBy = userStore.getUser.userID;
    jobStore.addJob(job.value);
    notify("success", "Success", "Job Added Successfully")
    addJobModel.value = false;
    job.value.createdTime = new Date().toLocaleString();

    const balanceSheet = sheetStore.getBalanceSheet;
    let sheet = balanceSheet.find((s) => s.bSheetID === job.value.bSheetID);
    if (!sheet) {
      sheet = sheetStore.getSheet(job.value.sheetID);
    }

    const bSheets: BalanceSheet[] = [];
    console.log(balanceSheets(sheet))
    for (let i = 0; i < balanceSheets(sheet).length; i++) {
      const balanceSheet = balanceSheets(sheet)[i];
      bSheets.push({
        bSheetID: job.value.sheetID + "_" + Math.random().toString(36).substr(2, 4),
        width: balanceSheet.width < balanceSheet.length ? balanceSheet.width : balanceSheet.length,
        length: balanceSheet.length >= balanceSheet.width ? balanceSheet.length : balanceSheet.width,
      })
    }
    let preBalanceSheets: Sheet[] = sheetStore.getBalanceSheet
    let preBalanceSheet = null;
    if (balanceSheetID.value.toString().trim() !== "") {
      preBalanceSheet = preBalanceSheets.find((sheet) => sheet.bSheetID === balanceSheetID.value);
    }
    // console.log(balanceSheetID)
    // return;
    console.log(sheet)
    console.log(bSheets)
    console.log(balanceSheetID.value)
    if (bSheets.length > 0) {
      sheetStore.addBalanceSheet(job.value.sheetID, bSheets);
    } else {
      sheetStore.deleteBalanceSheet(sheet.sheetID, balanceSheetID.value);
    }


    const cutSheet: CutSheet = {
      cutSheetID: "CS_" + job.value.sheetID + "_" + Math.random().toString(36).substr(2, 4),
      design: job.value.design,
      parentWidth: preBalanceSheet !== null ? preBalanceSheet.width : sheet.width,
      parentLength: preBalanceSheet !== null ? preBalanceSheet.length : sheet.length,
      jobID: job.value.jobID,
      length: job.value.length,
      width: job.value.width,
    }
    job.value.cutSheetID = cutSheet.cutSheetID;
    if (balanceSheetID.value.toString().trim() !== "") {
      sheetStore.deleteBalanceSheet(sheet.sheetID, balanceSheetID.value);
    }

    sheetStore.addCutSheet(sheet.sheetID, cutSheet);
    try {
      jobStore.addJob(job.value);
      addJobModel.value = false;
      notify('success', 'Successful!', 'Job Added Successfully');
      cancelJob();
    } catch (e: any) {
      notify('error', 'Error!', e.message);
    }
  }
}

const sortJob = (jobs: Job[]) => {
  jobs.sort(function (a, b) {
    return parseInt(b.jobID.split('_')[1]) - parseInt(a.jobID.split('_')[1]);
  });
  return jobs;
}
const cancelJob = () => {
  sheetSelected.value = false;
  addJobModel.value = false;
  const {value} = thicknessOfSheets.value[0];
  thickness.value = value;

//   Clear the form
  job.value.width = 0;
  job.value.length = 0;
  thickness.value = 0;
  balanceSheetID.value = "";
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


// const finishedJob = ref<Job[]>(Array.from({ length: 10 }).map(generateRandomJob));
const finishedJob = ref<Job[]>(jobStore.jobs);

onMounted(async () => {
  const jobStore = useJobStore();
  await jobStore.InitializeJobs();
  finishedJob.value = jobStore.getAllJobs;

})

const balanceSheetID = ref<string>("")


const availableSheets = ref(sheetStore.getBalanceSheet);
const sheets = computed(() => {
  let SelectedSheets = availableSheets.value.filter((sheet: Sheet) => {
    return sheet.thickness == Number(thickness.value);
  });
  // Remove If Sheets has Same sheetID
  // const sheetIDs: string[] = [];
  // SelectedSheets = SelectedSheets.filter((sheet: Sheet) => {
  //   if (sheetIDs.includes(sheet.sheetID)) {
  //     return false;
  //   } else {
  //     sheetIDs.push(sheet.sheetID);
  //     return true;
  //   }
  // });
  SelectedSheets = SelectedSheets.filter((sheet: Sheet) => {
    return sheet.length >= job.value.length && sheet.width >= job.value.width;
  })
  SelectedSheets.sort((a: Sheet, b: Sheet) => {
    return calculateFillPercentage(b) - calculateFillPercentage(a);
  });
  SelectedSheets = SelectedSheets.filter((sheet: Sheet) => {
    return calculateFillPercentage(sheet) <= 100;
  });

  // Remove if sheet has same length and width
  const sheetLengths: number[] = [];
  const sheetWidths: number[] = [];
  SelectedSheets = SelectedSheets.filter((sheet: Sheet) => {
    if (sheetLengths.includes(sheet.length) && sheetWidths.includes(sheet.width)) {
      return false;
    } else {
      sheetLengths.push(sheet.length);
      sheetWidths.push(sheet.width);
      return true;
    }
  });

  for (let i = 0; i < SelectedSheets.length; i++) {
    SelectedSheets[i].selected = false;
  }

  if (SelectedSheets[0]) {
    SelectedSheets[0].selected = true;
    sheetSelected.value = true;
    job.value.sheetID = SelectedSheets[0].sheetID;
    job.value.bSheetID = SelectedSheets[0].bSheetID ?? null;
    console.log(SelectedSheets[0])
    balanceSheetID.value = SelectedSheets[0].bSheetID ?? null;
    setTimeout(() => {
      if (job.value.length > 0 && job.value.width > 0) {
        viewSheet(SelectedSheets[0]);
      }
    }, 100);
  }
  return SelectedSheets;
});


const SelectSheet = (sheet: Sheet) => {
  if (!sheetSelected.value) {
    sheetSelected.value = true;
    job.value.sheetID = sheet.sheetID;
    sheets.value[sheets.value.findIndex((item: Sheet) => item.sheetID == sheet.sheetID)].selected = true;
    viewSheet(sheet);

  } else {
    notify('warning', 'Warning', 'You have already selected a sheet')
  }
}

const DeselectSheet = (sheet: Sheet) => {
  if (sheetSelected.value) {
    sheetSelected.value = false;
    job.value.sheetID = null;
    sheets.value[sheets.value.findIndex((item: Sheet) => item.sheetID == sheet.sheetID)].selected = false;
  } else {
    notify('warning', 'Warning', 'You have not selected a sheet')
  }
}


const thicknessOfSheets = ref([])


const viewSelectedJob = (job: Job) => {
  const taskOrder = ["PlateWriting", "PlateExposure", "PlateWashing", "PlateDrying", "PlateFinishing"];
  console.log(job)

  currentJob.value = job;
  currentJob.value.tasks = Object.fromEntries(
      job.tasks ? Object.entries(job.tasks).sort((a, b) => taskOrder.indexOf(a[0]) - taskOrder.indexOf(b[0])) : []
  )


  viewJobModel.value = true;
}
const OpenAddJobModal = () => {
  addJobModel.value = true;
  job.value.jobID = jobStore.getLastJobID;
  availableSheets.value = sheetStore.getBalanceSheet;
  thicknessOfSheets.value = sheetStore.getThicknessOfSheets;
  const {value} = thicknessOfSheets.value[0];
  thickness.value = parseFloat(value);
}

const currentJob = ref<Job>({});

const FormatDate = (date: string) => {
  return moment(date).utc(true).format('DD MMM YYYY hh:mm A');
}

const drawRectangle = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, labelWidth: number, labelHeight: number, color: string, child = false) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // Draw the rectangle
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
};
const canvasRef = ref<HTMLCanvasElement>();
const draw = (cutSheet: CutSheet) => {
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
  drawRectangle(ctx, 20, 10, (parent.width - 50) * widthRatio, (parent.height - 50) * heightRatio, parent.width, parent.height, 'black');
  drawRectangle(ctx, 20, 10, (child.width - 50) * widthRatio, (child.height - 50) * heightRatio, child.width, child.height, 'red', true);
}

const viewSheet = (selectedSheet: Sheet) => {
  const cutsheet: CutSheet = {
    cutSheetID: 0,
    design: "",
    jobID: 0,
    length: job.value.length,
    parentLength: selectedSheet.length,
    parentWidth: selectedSheet.width,
    width: job.value.width,
  }

  draw(cutsheet);

}

const formatDate = (date: string) => {
  return moment(date).format('DD MMM ');
}

const TimeElapsed = (time: string) => {
  return moment(time).fromNow();
}

const PriorityColor = (priority: string) => {
  switch (priority) {
    case "Urgent":
      return {color: '#ff9b9b', textColor: '#000000', borderColor: '#ff0000'}
    case "High":
      return {color: '#ffd697', textColor: '#000000', borderColor: '#ff9900'}
    case "Normal":
      return {color: '#aff8af', textColor: '#000000', borderColor: '#00ff00'}
  }
}

const sortTask = (tasks:Record<string,Task>)=>{
  const taskOrder = ["PlateWriting", "PlateExposure", "PlateWashing", "PlateDrying", "PlateFinishing"];
  const sortedTasks:Task[] = [];
  Object.keys(tasks).forEach((taskType)=>{
    sortedTasks[taskOrder.indexOf(taskType)] = tasks[taskType];
  })
  return sortedTasks;
}


const deleteJob = (job: Job) => {

  const cutSheet = sheetStore.getCutSheet(job.jobID);
  const balanceSheet: BalanceSheet = {
    bSheetID: job.value.sheetID + "_" + Math.random().toString(36).substr(2, 4),
    width: cutSheet.parentWidth,
    length: cutSheet.parentLength,
  }
  sheetStore.addBalanceSheet(job.value.sheetID, [balanceSheet]);
  sheetStore.deleteCutSheet(job.value.sheetID, job.value.cutSheetID);

  jobStore.deleteJob(job.jobID);
  notify('success', 'Successful!', 'Job Deleted Successfully');
}
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
            <div class="flex justify-center items-start py-4 gap-2">
              <div class="flex w-1/2 gap-4 flex-col">
                <div class="flex gap-2">
                  <span class="text-sm font-semibold w-1/4"> Job ID</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-input readonly size="small" v-model:value="job.jobID" :style="{width:'80%'}" class="mr-8"/>
                  </n-input-group>
                </div>
                <div class="flex gap-2 items-center justify-center">
                  <span class="text-sm font-semibold w-1/4"> Thickness</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-select v-model:value="thickness" :options="thicknessOfSheets" :style="{width:'80%'}"
                              class="mr-8"/>
                  </n-input-group>
                </div>
                <div class="flex gap-2 items-center justify-center">
                  <span class="text-sm font-semibold w-1/4"> Length</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-input-number clearable :precision="2" size="small" placeholder="Plate Width"
                                    :style="{width:'80%'}" v-model:value="job.length"/>
                    <n-input-group-label>mm</n-input-group-label>
                  </n-input-group>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-semibold w-1/4"> Width</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-input-number clearable :precision="2" size="small" placeholder="Plate Length"
                                    :style="{width:'80%'}" v-model:value="job.width"/>
                    <n-input-group-label>mm</n-input-group-label>
                  </n-input-group>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-semibold w-1/4"> Deadline</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-date-picker
                        :style="{width:'80%'}"
                        class="mr-8"
                        v-model:formatted-value="job.deadLine"
                        value-format="yyyy-MM-dd HH:mm"
                        type="datetime"
                        clearable
                    />
                  </n-input-group>
                </div>


              </div>
              <div class="flex flex-col gap-4  w-2/4 px-4 items-center justify-center">
                <div class="flex items-center justify-center w-full gap-2">
                  <span class="text-sm text-center font-semibold w-2/4"> Job Name</span>
                  <n-input-group class="flex items-center justify-center w-full gap-2">
                    <n-input clearable size="small" placeholder="Enter Job Name" :style="{width:'100%'}" class=""
                             v-model:value="job.jobName"/>
                  </n-input-group>
                </div>
                <n-upload
                    hidden
                    ref="upload"
                    multiple
                    :max="5"
                    @change="handleChange"
                >
                  <n-upload-dragger>
                    <div class="mb-3">
                      <n-icon size="36" :depth="3">
                        <archive-icon/>
                      </n-icon>
                    </div>
                    <n-text style="font-size: 16px">
                      Click or drag Design to Upload
                    </n-text>
                  </n-upload-dragger>
                </n-upload>
                <div class="flex items-center justify-center w-full gap-2">
                  <span class="text-sm text-center font-semibold w-2/4"> Select Priority</span>
                  <n-input-group class="flex items-center justify-center w-full gap-2">
                    <n-select v-model:value="job.priority" :options="priorities"/>
                  </n-input-group>
                </div>

              </div>
            </div>
            <n-table size="small" border="outer" class="w-full">
              <thead>
              <tr class="text-center">
                <th>Sheet ID</th>
                <th>Fill Percentage</th>
                <th>Sheet Size</th>
                <th>Balance Sheet</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="sheet in sheets" :key="sheet.sheetID" v-if="sheets.length>0 && job.length>10 && job.width>10">
                <td>
                  {{ sheet.sheetID }}
                </td>
                <td
                    class="flex items-center justify-center">
                  <span class=" text-white text-center font-bold px-2 rounded-2xl py-1 w-3/5"
                        :style="calculateFillPercentage(sheet)>=80 ? 'background-color: #0A9029' : calculateFillPercentage(sheet)>=60 ? 'background-color: #DAA520' : 'background-color: #ff0000' "
                  >
                    {{ calculateFillPercentage(sheet) }}%
                  </span>
                </td>
                <td>{{ sheet.length }} x {{ sheet.width }}</td>
                <td>
                  <div v-for="(balanceSheet,index) in balanceSheets(sheet)" :key="balanceSheet.sheetID">
                    {{ index + 1 }}) {{ balanceSheet.length }} x {{ balanceSheet.width }}
                  </div>
                </td>

                <td class="flex gap-2">
                  <n-button
                      class="bg-blue-500 hover:bg-blue-700 rounded-full flex items-center justify-center gap-3 text-white font-bold py-2 px-2 "
                      @click="viewSheet(sheet)">
                    <n-icon :component="EyeOutline" size="medium"/>
                  </n-button>
                  <n-button
                      class="bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center gap-3 text-white font-bold py-2 px-2 "
                      :class="{'btn-disabled':sheetSelected}"
                      @click="SelectSheet(sheet)"
                      v-if="!sheet.selected">
                    <n-icon :component="CheckmarkSharp" size="medium"/>
                  </n-button>
                  <n-button
                      class="bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center gap-3 text-white font-bold py-2 px-2 "
                      v-else @click="DeselectSheet(sheet)">
                    <n-icon :component="Close" size="medium"/>
                  </n-button>

                </td>
              </tr>
              <tr v-else>
                <td colspan="5" class="text-center">No Sheets Available</td>
              </tr>
              </tbody>
            </n-table>
          </div>
          <div class="w-1/2 flex p-8 items-start justify-center">
            <canvas ref="canvasRef" class="border" width="400" height="600"></canvas>
          </div>
        </div>
        <template #footer>
          <div class="flex items-center justify-center w-full gap-2">
            <n-button
                class="bg-red-500 hover:bg-red-800 w-1/12 rounded-full flex items-center justify-center gap-3 text-lg text-white font-bold py-2 px-1"
                @click="cancelJob">
              Cancel
            </n-button>
            <n-button
                class="bg-green-600 hover:bg-green-700 w-1/12 rounded-full flex items-center justify-center gap-3 text-lg text-white font-bold py-2 px-1 "
                @click="addJob">
              Add Job
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal
        v-model:show="viewJobModel"
        :on-after-enter="()=>{draw(sheetStore.getCutSheet(currentJob.jobID))}"
        title="View Job"
        :width="1000"
        :mask-closable="false"
        :closable="false"
        :footer="false">
      <n-card
          :bordered="false"
          class="rounded-2xl"
          :body-style="{ padding: '0px' }"
          :style="{ width: '80%' }"
      >
        <template #header>
          <div class="flex items-center justify-center w-full gap-2">
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
                  Deadline Details
                </div>
                <div class="flex w-full gap-2 flex-col">
                  <div class="flex items-center justify-center">
                    <div class="flex font-bold w-2/3 items-center justify-center px-3">
                      Date :
                    </div>
                    <div class="flex w-3/4 items-center justify-start px-2">
                      {{ currentJob.deadLine.toString() }}
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
                  <tr>
                    <th>No</th>
                    <th>Task Name</th>
                    <th>Task Status</th>
                    <th>Started Time</th>
                    <th>Completed Time</th>
                  </tr>
                  </thead>
                  <tbody class="text-center">
                  <tr v-for="(task) in sortTask(currentJob.tasks)" :key="task.taskID"
                      v-if="Object.keys(currentJob.tasks).length>0">
                    <td>#{{ Object.keys(currentJob.tasks).indexOf(task.taskType) + 1 }}</td>
                    <td>{{ task.taskType }}</td>
                    <td>
                      <n-tag :type="task.finishedTime.toString().trim()===''? 'info' :'success'">
                        {{ task.finishedTime.toString().trim() === "" ? "In Progress" : task.finishedTime.toString() }}
                      </n-tag>
                    </td>
                    <td>{{ FormatDate(task.startedTime.toString()) }}</td>
                    <td>
                      {{ task.finishedTime.toString().trim() === "" ? "-" : task.finishedTime.toString() }}
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

    <div class="flex items-center gap-2 justify-center w-full h-full">
      <div class="flex flex-col items-center gap-5 w-full bg-white h-full">
        <div class="flex items-center  mx-2 justify-center p-3 gap-5 w-full">
          <div
              class="flex bg-white p-5 rounded-xl gap-2 shadow-sm shadow-blue-600 items-center justify-center flex-col">
          <span class="text-5xl text-blue-800 font-bold">
            {{ useJobStore().getPendingJobs.length }}
          </span>
            <div class="text-sm text-blue-500">
              Pending Jobs
            </div>
          </div>
          <div
              class="flex bg-white p-5 rounded-xl gap-2 shadow-sm shadow-amber-600 items-center justify-center flex-col">
          <span class="text-5xl text-yellow-600 font-bold">
            {{ useJobStore().getOngoingJobs.length }}
          </span>
            <div class="text-sm text-yellow-500">
              Ongoing Jobs
            </div>
          </div>
          <div
              class="flex bg-white p-5 rounded-xl gap-2 shadow-sm shadow-green-600 items-center justify-center flex-col">
          <span class="text-5xl text-green-800 font-bold">
            {{ useJobStore().getCompletedTasks.length }}
          </span>
            <div class="text-sm text-green-500">
              Collectable Jobs
            </div>
          </div>
        </div>
        <div class="mx-2 w-full px-12 flex-col gap-4 flex ">
          <div class="px-6 flex items-center justify-between w-full">
            <div class="font-bold text-xl">
              Recent Jobs
            </div>
            <div class="flex items-center gap-2">
              <n-button class="flex items-center gap-2 bg-blue-500 text-white px-2 py-1 rounded-xl"
                        @click="OpenAddJobModal">
                <n-icon :component="ClipboardTaskAdd20Regular" size="24px"/>
                <span>
                  Add Job
                </span>
              </n-button>
            </div>
          </div>
          <div style="height: 70vh" class="overflow-y-scroll relative">
            <n-table
                striped size="small"
                border="outer"
                class="w-full"
            >
              <thead>
              <tr class="text-center">
                <th>No</th>
                <th>Job Name</th>
                <th>Sheet Dimension</th>
                <th>Added Time</th>
                <th>Deadline</th>
                <th>Dimensions</th>
                <th>Priority Level</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody class="text-center">
              <tr v-for="(job,index) in sortJob(jobStore.getNotCompletedJobs)" :key="job.jobID"
                  v-if="jobStore.getAllJobs.length > 0">
                <td>{{ index + 1 }}</td>
                <td>{{ job.jobName }}</td>
                <td>{{ sheetStore.getCutSheetParentWidth(job.jobID) }} mm x
                  {{ sheetStore.getCutSheetParentLength(job.jobID) }} mm
                </td>
                <td>{{ FormatDate(job.createdTime) }}</td>
                <td>{{ FormatDate(job.deadLine) }}</td>
                <td>
                  {{ job.length }}mm x {{ job.width }}mm
                </td>
                <td class="flex items-center justify-center">
                  <n-tag
                      :color="PriorityColor(job.priority)"
                      class="px-2 flex items-center justify-center min-w-[80px] " round>
                    <div class="text-sm w-full text-center">
                      {{ job.priority }}
                    </div>
                  </n-tag>
                </td>
                <td>
                  <n-tag
                      :color="TagColor(job.currentStatus)"
                      class="px-2 min-w-[110px]" round>
                    <template #icon>
                      <n-icon :component="TagIcon(job.currentStatus)" size="medium" class="ml-2"/>
                    </template>
                    <span class="text-sm">
                {{ job.currentStatus }}
              </span>
                  </n-tag>
                </td>
                <td class="flex items-center justify-center gap-1">
                  <n-button
                      class="bg-blue-500 hover:bg-blue-700 flex text-sm items-center justify-center gap-3 text-white py-1 px-2 w-full rounded"
                      @click="viewSelectedJob(job)">
                    <n-icon :component="NewspaperOutline" size="medium"/>
                    <span class="text-sm">
                    View
                  </span>
                  </n-button>
                  <!--                  <n-button-->
                  <!--                      v-if="job.currentStatus==='Pending'"-->
                  <!--                      class="bg-red-500 hover:bg-red-700 flex text-sm items-center justify-center gap-3 text-white py-1 px-2 w-full rounded"-->
                  <!--                      @click="deleteJob(job)">-->
                  <!--                    <n-icon :component="TrashBinOutline" size="medium"/>-->
                  <!--                    <span class="text-sm">-->
                  <!--                    Delete-->
                  <!--                    </span>-->
                  <!--                  </n-button>-->
                </td>
              </tr>


              <tr v-else>
                <td colspan="7" class="text-center">
                  No Jobs
                </td>
              </tr>
              </tbody>
            </n-table>
          </div>
        </div>

      </div>
      <!--      <div class="w-1/4 flex flex-col gap-2 items-center h-full justify-start">-->
      <!--        <div class="font-bold text-xl pt-4">-->
      <!--          Notifications-->
      <!--        </div>-->
      <!--        <div class="flex flex-col gap-2 w-full px-2 h-full items-center ">-->
      <!--          <div class="w-full flex py-2 justify-between mx-3 px-3 bg-blue-200 rounded-2xl"-->
      <!--               v-for="notification in Notifications" :key="notification.id">-->
      <!--            <div class="flex-col flex">-->
      <!--              <div class=" font-bold">-->
      <!--                {{ notification.title }} <span-->
      <!--                  class="ml-4 text-gray-400 text-xs font-medium">{{ TimeElapsed(notification.date + " " + notification.time) }}</span>-->
      <!--              </div>-->
      <!--              <div class="text-sm">-->
      <!--                {{ notification.description }}-->
      <!--              </div>-->
      <!--            </div>-->
      <!--            <div class="flex-col items-center justify-center flex">-->
      <!--              {{ formatDate(notification.date) }}-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->


      <!--      </div>-->
    </div>
  </InEmployeeLayout>

</template>



