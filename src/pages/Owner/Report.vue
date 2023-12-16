<script setup lang="ts">

import OwnerLayout from "@/Layout/OwnerLayout.vue";
import {useSheetStore} from "../../store/sheetStore.ts";
import {BalanceSheet} from "../../types/Types.ts";
import {ref} from "vue";
import {NCard, NIcon, NModal} from "naive-ui";
import {Close, DocumentTextOutline} from "@vicons/ionicons5";

const sheetStore = useSheetStore();
const selectedSheetsInCategory = ref<any>(null);
const modalActive = ref(false);

const openModal = (sheets)=>{
  selectedSheetsInCategory.value = sheets;
  modalActive.value = true;
}

const balanceSheets = sheetStore.getBalanceSheet;

//categorize by thickness
const balanceSheetsByThickness:BalanceSheet[] = balanceSheets.reduce((acc,cur)=>{
  if(acc[cur.thickness]){
    acc[cur.thickness].push(cur);
  }else{
    acc[cur.thickness] = [cur];
  }
  return acc;
},{});

// sort by thickness
const thickness = Object.keys(balanceSheetsByThickness).sort((a,b)=>Number(a)-Number(b)).map((key)=>{
  return balanceSheetsByThickness[key];
})

const groupSheetWithSameHeightAndLength = (sheets:BalanceSheet[])=>{
  const result = sheets.reduce((acc,cur)=>{
    const key = `${cur.length}-${cur.width}`;
    if(acc[key]){
      acc[key].push(cur);
    }else{
      acc[key] = [cur];
    }
    return acc;
  },{});
  return Object.keys(result).map((key)=>{
    return result[key];
  })
}

const fullBalanceSheetCount = (sheets:BalanceSheet[])=>{
  return sheets.filter((sheet)=>sheet.bSheetID === "").length;
}
</script>

<template>
  <n-modal
      v-model:show="modalActive"
      title="Sheet ID"
      :mask-closable="true"
      :closable="true"
      :footer="false">
    <n-card
        :bordered="false"
        class="rounded-2xl"
        :body-style="{ padding: '0px' }"
        :style="{ width: '50%' }"
    >
      <template #header>
        <div class="flex items-center text-black  justify-center w-full gap-2">
          <div class="flex items-center justify-center gap-2">
            <n-icon :component="DocumentTextOutline" size="large"/>
            <n-text class="text-2xl font-bold">Sheets</n-text>
          </div>
        </div>
      </template>
      <template #header-extra>
        <div class="flex items-center justify-center  w-full">
          <n-icon :component="Close" size="large" @click="modalActive=false"
                  class="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white hover:rounded-full p-1"/>
        </div>
      </template>
      <div class="flex flex-col flex-wrap items-center justify-center gap-2 p-2">
        <div class="" v-for="sheet in selectedSheetsInCategory">
          <n-text class="text-2xl font-bold">
            {{sheet.bSheetID === "" ? sheet.sheetID : sheet.bSheetID}}
          </n-text>
        </div>

      </div>
    </n-card>
  </n-modal>
  <OwnerLayout>

    <div class="overflow-y-scroll flex flex-col gap-4 max-h-[90vh]">
      <div v-for="sheet in thickness" class="flex flex-col gap-1 border-2 gao-3">
        <div class="bg-white text-center px-2 py-2 flex flex-row justify-between items-center">
          <h1 class="text-2xl w-full font-bold">
            Thickness : {{sheet[0].thickness}}mm</h1>
        </div>
        <div class="flex gap-0.5 bg-white flex-row flex-wrap">
          <div v-for="item in groupSheetWithSameHeightAndLength(sheet)"
               class="flex flex-col w-1/4 m-2 p-5 border cursor-pointer border-solid border-black hover:bg-gray-200"
                @click="openModal(item)"
          >
            <h3>
              {{item[0].length}}mm x {{item[0].width}}mm
            </h3>
              <h2>
                Full Sheet : {{fullBalanceSheetCount(item)}}
              </h2>
              <h2>
                Balance Sheet : {{item.length - fullBalanceSheetCount(item)}}
              </h2>
          </div>

        </div>
      </div>
      <div v-if="balanceSheets.length === 0" class="flex flex-col gap-1 border-2 gao-3">
        <div class="bg-white text-center px-2 py-2 flex flex-row justify-between items-center">
          <h1 class="text-2xl w-full font-bold">
            No Balance Sheet Found
          </h1>
        </div>
      </div>
    </div>
  </OwnerLayout>
</template>

<style scoped>

</style>