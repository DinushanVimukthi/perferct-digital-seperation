<script setup lang="ts">

import OwnerLayout from "@/Layout/OwnerLayout.vue";
import ApexCharts from 'apexcharts'

import {onBeforeMount, onMounted} from "vue";
import {useJobStore} from "@store/jobStore.ts";
import {useLoaderStore} from "@store/loaderStore.ts";
import {useUserStore} from "../../store/UserStore.ts";
import {useAdminStore} from "../../store/adminStore.ts";
import {useSheetStore} from "../../store/sheetStore.ts";
import {Job} from "@/types/Types.ts";

onBeforeMount(() => {
  const loaderStore = useLoaderStore();
  const jobStore = useJobStore();
  loaderStore.setLoading(true);
})
onMounted(async () => {




  const currentMonth = new Date().getMonth()
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  setTimeout(() => {
    const loaderStore = useLoaderStore();
    loaderStore.setLoading(false);
    const jobStore = useJobStore();
    const deliveredJobs = jobStore.getDeliveredJobs
    // count jobs by month
    const countJobsByMonth = deliveredJobs.reduce((acc, job) => {
      const month = new Date(job.createdTime).getMonth()
      acc[month] = acc[month] ? acc[month] + 1 : 1
      return acc
    }, [])
    // array of jobs by monthname: [{month: "January", count: 0}, {month: "February", count: 0}, ...]
    const jobsByMonth = months.map((month, index) => {
      return {
        month,
        count: countJobsByMonth[index] || 0
      }
    })
    const options = {

      chart: {
        type: 'line'
      },
      series: [{
        name: 'jobs',
        data: jobsByMonth.map(job => job.count)
      }],
      xaxis: {
        categories: jobsByMonth.map(job => job.month),
        axisTicks: {
          show: false
        },
      },
      stroke: {
        curve: 'smooth',
      }
    }

    let today = new Date().getDate()
    const currentMonth = new Date().getMonth()
    let days = []
    for (let i = today - 30; i <= today; i++) {
      if (i < 1) {
        const month = new Date().getMonth()
        if (month === 0 || month === 2 || month === 4 || month === 6 || month === 7 || month === 9 || month === 11) {
          days.push(31 + i)
        } else if (month === 3 || month === 5 || month === 8 || month === 10) {
          days.push(30 + i)
        } else {
          const year = new Date().getFullYear()
          if (year % 4 === 0) {
            days.push(29 + i)
          } else {
            days.push(28 + i)
          }
        }
      } else {
        days.push(i)
      }
    }
    let jobsByDay= {} as Record<string, number>
    days.forEach(day => {
      jobsByDay[day] = 0
    })

    deliveredJobs.forEach((job: Job) => {
      const day = new Date(job.createdTime).getDate()
      const month = new Date(job.createdTime).getMonth()
      if (month === currentMonth) {
        jobsByDay[day] = jobsByDay[day] + 1
      }else if (month === currentMonth - 1) {
        if (day > today) {
          jobsByDay[day] = jobsByDay[day] + 1
        }
      }
    })


    console.log(jobsByDay)

    const options2 = {

      chart: {
        type: 'bar'
      },
      series: [{
        name: 'jobs',
        data: Object.values(jobsByDay)
      }],
      xaxis: {
        categories: Object.keys(jobsByDay),
        axisTicks: {
          show: false
        },
      },
      stroke: {
        curve: 'smooth',
      }
    }


    var chart = new ApexCharts(document.querySelector("#chart"), options);
    var chart1 = new ApexCharts(document.querySelector("#chart2"), options2);
    chart.render();
    chart1.render();
  }, 3000)
})


</script>

<template>
  <OwnerLayout>
    <div class="flex flex-col justify-start bg-white h-full items-center p-8">
      <div class="flex flex-col gap-4 justify-center my-6 items-center w-full">
        <div class="flex gap-6 h-full justify-center items-center w-full">
          <div
              class="flex w-1/6 h-[150px] bg-white p-3 rounded-xl gap-2 shadow-md border shadow-blue-600 items-center flex-col justify-center ">
            <span class="text-5xl text-blue-600 font-bold">
            {{ useJobStore().getPendingJobs.length }}
          </span>
            <div class="text-sm text-blue-500">
              Ongoing Jobs
            </div>
          </div>
          <div
              class="flex w-1/6 h-[150px] flex-col bg-white p-3 rounded-xl gap-2 shadow-md border shadow-green-600 items-center justify-center ">
              <span class="text-5xl text-green-600 font-bold">
            {{ useJobStore().getOngoingJobs.length }}
          </span>
            <div class="text-sm text-green-500">
              Processing Jobs
            </div>

          </div>
          <div
              class="flex w-1/6 h-[150px] flex-col bg-white p-3 rounded-xl gap-2 shadow-md border shadow-green-600 items-center justify-center ">
              <span class="text-5xl text-green-600 font-bold">
            {{ useSheetStore().getAllSheetsForJobs.length}}
          </span>
            <div class="text-sm text-green-500">
              No of Sheets
            </div>

          </div>
          <div
              class="flex w-1/6 h-[150px] flex-col bg-white p-3 rounded-xl gap-4 shadow-md border shadow-purple-600 items-center justify-center ">
              <span class="text-5xl text-purple-600 font-bold">
            {{ useAdminStore().getUsers.length }}
          </span>
            <div class="text-sm text-purple-500">
              No of Users
            </div>

          </div>
        </div>
      </div>
      <div class="flex justify-center gap-10 p-3 items-center w-full mt-8">
        <div id="chart" class="w-1/2"></div>
        <div id="chart2" class="w-1/2"></div>
      </div>
    </div>
  </OwnerLayout>

</template>

<style scoped>

</style>