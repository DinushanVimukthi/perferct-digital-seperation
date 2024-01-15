<script setup lang="ts">

import StockManagerLayout from "@/Layout/StockManagerLayout.vue";
import {NTable,NForm,NFormItem,NInput,NInputNumber,NModal,NCard,FormInst,useMessage} from "naive-ui";
import {computed, onBeforeMount, onMounted, ref, watch} from "vue";
import {Sheet} from "@/types/Types.ts";
import {useSheetStore} from "@store/sheetStore.ts";
import InEmployeeLayout from "@/Layout/InEmployeeLayout.vue";

const sheetStore = useSheetStore()
const sheets = ref<Sheet[]>(sheetStore.sheets);
const sheetsSummarized = computed(() => {
  const summarizedSheets:any[] = []
  const values = Object.values(sheetStore.sheets);
  values.forEach((sheet:Sheet) => {
    const index = summarizedSheets.findIndex((summarizedSheet:Sheet) => {
      return summarizedSheet.thickness === sheet.thickness && summarizedSheet.width === sheet.width && summarizedSheet.length === sheet.length && summarizedSheet.type === sheet.stockType
    })
    if (index === -1){
      summarizedSheets.push({
        sheetID: sheet.sheetID.split('_')[0],
        thickness: sheet.thickness,
        type: sheet.stockType,
        width: sheet.width,
        length: sheet.length,
        count: 1,
        parentSheetID: null
      })
    } else {
      summarizedSheets[index].count += 1
    }
  })
  return summarizedSheets
})


onBeforeMount(async () => {
  await sheetStore.InitializeSheets()
  sheets.value = sheetStore.sheets
})

watch(sheetStore.sheets, (newVal) => {
  if (newVal.length > 10){
    sheets.value = newVal.slice(0,10)
  } else {
    sheets.value = newVal
  }
})

const form = ref<Sheet>({
  sheetID: "",
  thickness: null,
  stockType: null,
  width: null,
  length: null,
  count : null,
  parentSheetID: null
});

const selectedSheet = ref<Sheet>(null);

const addSheetModal = ref(false);
const editSheetModal = ref(false);
const deleteModal = ref(false);



const openAddModal = async () => {
  addSheetModal.value = true;
  form.value.sheetID = sheetStore.getLastSheetID
};
const openEditModal = async (sheet:Sheet) => {
  selectedSheet.value = sheet
  editSheetModal.value = true;
};

const openDeleteModal = async (sheet:Sheet) => {
  selectedSheet.value = sheet
  deleteModal.value = true;
};

const addSheet = async (e:MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      addSheetModal.value = false;
      // check if sheet width < length
      if (form.value.width > form.value.length){
        const temp = form.value.width
        form.value.width = form.value.length
        form.value.length = temp
      }
      await sheetStore.addSheet(form.value)
      sheetStore.sheets = sheetStore.getAllSheets
      message.success('Sheet Added Successfully')
      await sheetStore.InitializeSheets()
      sheets.value = sheetStore.sheets
      form.value = {
        sheetID: "",
        stockType: null,
        thickness: null,
        width: null,
        length: null,
        count: null
      }
      form.value.sheetID = sheetStore.getLastSheetID
    } else {
      message.error('Invalid')
    }
  })
};
const EditSheet = async (e:MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      editSheetModal.value = false;
      await sheetStore.editSheet(selectedSheet.value)
      sheetStore.sheets = sheetStore.getAllSheets
      message.success('Sheet ID: ' + selectedSheet.value.sheetID + ' Edited Successfully')
      form.value = {
        sheetID: "",
        thickness: 0,
        width: 0,
        length: 0,
        count: 1
      }

      form.value.sheetID = sheetStore.getLastSheetID
    } else {
      message.error('Invalid')
    }
  })
};

const DeleteSheet = async () => {
  deleteModal.value = false;
  await sheetStore.deleteSheet(selectedSheet.value.sheetID)
  sheetStore.sheets = sheetStore.getAllSheets
  message.success('Sheet ID: ' + selectedSheet.value.sheetID + ' Deleted Successfully')
  form.value = {
    sheetID: "",
    thickness: 0,
    width: 0,
    length: 0,
    count: 1
  }
  form.value.sheetID = sheetStore.getLastSheetID
};

const rules = {
  thickness: [
    {
      required: true,
      message: "Please input Sheet Thickness",
      trigger: "blur" ,
      validator: (_:any, value:any) => {
        value = Number(value)
        if (value < 0) {
          message.error('Negative Value')
          return Promise.reject('Negative Value')
        } else {
          return Promise.resolve()
        }
      }
    },
  ],
  width: [
    { required: true,
      message: "Please input Sheet Width",
      trigger: "blur",
      validator: (_:any, value:any) => {
        value = Number(value)
        if (value < 0) {
          message.error('Negative Value')
          return Promise.reject('Negative Value')
        } else {
          return Promise.resolve()
        }
      }
    },
  ],
  length: [
    {
      required: true,
      message: "Please input Sheet Length",
      trigger: "blur",
      validator: (_:any, value:any) => {
        value = Number(value)
        if (value < 0) {
          message.error('Negative Value')
          return Promise.reject('Negative Value')
        } else {
          return Promise.resolve()
        }
      }
    },
  ],
};
const formRef = ref<FormInst | null>(null);
const message = useMessage()

</script>

<template>
  <InEmployeeLayout>
<!--    <n-modal v-model:show="addSheetModal" title="Add Stock">-->
<!--      <n-card-->
<!--        class=" p-1 rounded-3xl flex items-center justify-center w-2/5"-->
<!--      >-->
<!--        <template #header>-->
<!--          <div class="text-2xl text-black text-center font-bold">Add New Sheet</div>-->
<!--        </template>-->

<!--        <n-form-->
<!--            ref="formRef"-->
<!--            :rules="rules"-->
<!--            label-placement="left"-->
<!--            :model="form"-->
<!--            class="w-full p-6">-->
<!--          <n-form-item label="Sheet ID" label-width="120px" label-align="center" path="sheetID" >-->
<!--            <n-input v-model:value="form.sheetID" readonly class="w-full font-bold" />-->
<!--          </n-form-item>-->
<!--          <n-form-item label="Sheet Type" label-width="120px" label-align="center" path="sheet Type" >-->
<!--            <n-input v-model:value="form.stockType"  class="w-full" maxlength="5" @input="()=>form.stockType = form.stockType.toLocaleUpperCase()"/>-->
<!--          </n-form-item>-->

<!--          <n-form-item label="Thickness" label-width="120px" label-align="center" path="thickness">-->
<!--            <n-input-number v-model:value="form.thickness" class="w-full" />-->
<!--          </n-form-item>-->
<!--          <n-form-item label="Width" label-width="120px" label-align="center" path="width">-->
<!--            <n-input-number v-model:value="form.width" class="w-full" />-->
<!--          </n-form-item>-->
<!--          <n-form-item label="Length" label-width="120px" label-align="center" path="length">-->
<!--            <n-input-number v-model:value="form.length" class="w-full" />-->
<!--          </n-form-item>-->
<!--          <n-form-item label="No of Sheet" label-width="120px" label-align="center" path="length">-->
<!--            <n-input-number   v-model:value="form.count" class="w-full" />-->
<!--          </n-form-item>-->
<!--        </n-form>-->
<!--        <template #footer>-->
<!--          <div class="flex flex-row gap-2 justify-start">-->
<!--            <button class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="addSheetModal = false">-->
<!--              Cancel-->
<!--            </button>-->
<!--            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="addSheet">-->
<!--              Add Sheet-->
<!--            </button>-->
<!--          </div>-->
<!--        </template>-->
<!--      </n-card>-->
<!--    </n-modal>-->
    <n-modal v-model:show="editSheetModal" title="Edi Sheet">
      <n-card
        class=" p-1 rounded-3xl flex items-center justify-center w-2/5"
      >
        <template #header>
          <div class="text-2xl text-black text-center font-bold">View Sheet Category</div>
        </template>

        <n-form
            ref="formRef"
            :rules="rules"
            label-placement="left"
            :model="form"
            class="w-full p-6">
          <n-form-item label="Sheet ID" label-width="120px" label-align="center" path="sheetID" >
            <n-input v-model:value="selectedSheet.sheetID" readonly class="w-full font-bold" />
          </n-form-item>
          <n-form-item label="Type" label-width="120px" label-align="center" path="type">
            <n-input readonly v-model:value="selectedSheet.type" class="w-full" />
          </n-form-item>
          <n-form-item label="Thickness" label-width="120px" label-align="center" path="thickness">
            <n-input-number readonly v-model:value="selectedSheet.thickness" class="w-full" />
          </n-form-item>
          <n-form-item label="Width" label-width="120px" label-align="center" path="width">
            <n-input-number readonly v-model:value="selectedSheet.width" class="w-full" />
          </n-form-item>
          <n-form-item label="Length" label-width="120px" label-align="center" path="length">
            <n-input-number readonly v-model:value="selectedSheet.length" class="w-full" />
          </n-form-item>
          <n-form-item label="No of Sheet" label-width="120px" label-align="center" path="length">
            <n-input-number readonly   v-model:value="selectedSheet.count" class="w-full" />
          </n-form-item>
        </n-form>
        <template #footer>
          <div class="flex flex-row gap-2 justify-start">
            <button class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="editSheetModal = false">
              Close
            </button>
<!--            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="EditSheet">-->
<!--              Edit Sheet-->
<!--            </button>-->
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal
        v-model:show="deleteModal"
        preset="dialog"
        title="Dialog"
        content="Are you sure?"
        positive-text="Submit"
        negative-text="Cancel"
        @positive-click="DeleteSheet"
        @negative-click="deleteModal = false"
    />
    <div class="flex flex-col p-3">
      <div class="flex-col gap-4 bg-white flex p-3">
        <div class="flex flex-row gap-2 items-center justify-between">
          <div class="text-2xl text-center font-bold my-4">Manage Stock
          </div>
<!--          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="openAddModal">-->
<!--            Add Sheet-->
<!--          </button>-->
        </div>
        <div style="height: 80vh" class="overflow-y-scroll relative">
          <n-table
              striped size="small"
              border="outer"
              class="w-full"
          >
            <thead class="sticky top-0">
            <tr class="text-center">
              <th>Sheet ID</th>
              <th>Sheet Type</th>
              <th>Sheet Thickness</th>
              <th>Sheet Width</th>
              <th>Sheet Length</th>
              <th> Total Sheet</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr class="text-center" v-for="sheet in sheetsSummarized" :key="sheet.id">
              <td>{{sheet.sheetID}}</td>
              <td>{{sheet.type}}</td>
              <td>{{sheet.thickness}} mm</td>
              <td>{{sheet.width}} mm</td>
              <td>{{sheet.length}} mm</td>
              <td>
                {{sheet.count}}
              </td>
              <td class="flex flex-row gap-2 justify-center">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="openEditModal(sheet)">
                  View
                </button>
              </td>
            </tr>
            <tr class="text-center" v-if="sheets.length==0">
              <td colspan="7">No Data</td>
            </tr>
            </tbody>
          </n-table>
        </div>
      </div>
    </div>
  </InEmployeeLayout>
</template>

<style scoped>

</style>