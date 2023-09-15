<script setup lang="ts">

import OwnerLayout from "@/Layout/OwnerLayout.vue";
import {useSheetStore} from "../../store/sheetStore.ts";
import {BalanceSheet} from "../../types/Types.ts";

const sheetStore = useSheetStore();

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
  <OwnerLayout>
    <div class="overflow-y-scroll flex flex-col gap-4 max-h-[90vh]">
      <div v-for="sheet in thickness" class="flex flex-col gap-1 border-2 gao-3">
        <div class="bg-white text-center px-2 py-2 flex flex-row justify-between items-center">
          <h1 class="text-2xl w-full font-bold">
            Thickness : {{sheet[0].thickness}}mm</h1>
        </div>
        <div class="flex gap-0.5 bg-white flex-row flex-wrap">
          <div v-for="item in groupSheetWithSameHeightAndLength(sheet)" class="flex flex-col w-1/4 m-2 p-5 border border-solid border-black">
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
    </div>


  </OwnerLayout>

</template>

<style scoped>

</style>