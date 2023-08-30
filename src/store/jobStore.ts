import {defineStore} from "pinia"
import {Job, Task} from "@/types/Types.ts";
import {addJob, addTask, deleteJob, editJob, getJobs, updateTask} from "@/services/jobServices.ts";


export const useJobStore = defineStore('jobStore', {
    state: () => ({
        jobs: {},
    }),
    getters: {
        getJobs(): any {
            return this.jobs;
        },
        getAllJobs(): Job[] {
            let jobs: Job[] = [];
            const values = Object.values(this.jobs);
            for (let value of values) {
                jobs.push(value);
            }
            return jobs;
        },
        getPendingJobs():Job[]{
            let jobs: Job[] = [];
            const values:Job[] = Object.values(this.jobs);
            for (let value of values) {
                if(value.currentStatus==="Pending"){
                    jobs.push(value);
                }
            }
            return jobs;
        },
        getLastJobID(): string {
            const keys = Object.keys(this.jobs);
            if (keys.length === 0) {
                return 'JOB_0';
            } else {
                const keys = Object.keys(this.jobs);
                // sort the keys in descending order
                keys.sort(function (a, b) {
                    return parseInt(b.split('_')[1]) - parseInt(a.split('_')[1]);
                });
                const newID = parseInt(keys[0].split('_')[1]) + 1;
                return "JOB_" + newID;
            }
        },
        getTasks: (state) => (jobID: string) => {
            const job:Job = Object.values(state.jobs).find((job: Job) => job.jobID === jobID);
            return job.tasks;
        },
        getOngoingJobs: (state)=>{
            let jobs: Job[] = [];
            const values:Job[] = Object.values(state.jobs);
            for (let value of values) {
                if(value.currentStatus==="Processing"){
                    jobs.push(value);
                }
            }
            return jobs;
        },
        getCurrentTask: (state) => (jobID: string) : Task => {
            const job:Job = Object.values(state.jobs).find((job: Job) => job.jobID === jobID);
            const tasks:Record<string, Task> = job.tasks;
            //get the first task that is not having a finished at date
            const values:Task[] = Object.values(tasks);
            for (let value of values) {
                if(value.finishedTime===""){
                    return value;
                }
            }
        },
        getFinishedJobs: (state)=>{
            let jobs: Job[] = [];
            const values:Job[] = Object.values(state.jobs);
            for (let value of values) {
                if(value.currentStatus==="Finished"){
                    jobs.push(value);
                }
            }
            return jobs;
        },
        getCompletedTasks: (state) => {
            let jobs: Job[] = [];
            const values:Job[] = Object.values(state.jobs);
            for (let value of values) {
                if(value.currentStatus==="Completed"){
                    jobs.push(value);
                }
            }
            return jobs;
        },
        getDeliveredJobs: (state)=>{
            let jobs: Job[] = [];
            const values:Job[] = Object.values(state.jobs);
            for (let value of values) {
                if(value.currentStatus==="Collected"){
                    jobs.push(value);
                }
            }
            return jobs;
        },
        getNotCompletedJobs: (state)=>{
            let jobs: Job[] = [];
            const values:Job[] = Object.values(state.jobs);
            for (let value of values) {
                if(value.currentStatus!=="Collected"){
                    jobs.push(value);
                }
            }
            console.log(jobs)
            return jobs;
        },
        getCollectableJobs: (state)=>{
            let jobs: Job[] = [];
            const values:Job[] = Object.values(state.jobs);
            for (let value of values) {
                if(value.currentStatus==="Completed"){
                    jobs.push(value);
                }
            }
            return jobs;
        }
    },
    actions: {
        async addJob(job: Job) {
            try {
                await addJob(job);
            }catch (e) {
                console.log(e)
            }
        },
        async editJob(job: Job) {
            await editJob(job)
        },
        async deleteJob(jobID: number) {
            await deleteJob(jobID)
        },
        async InitializeJobs() {
            this.jobs = await getJobs();
        },
        async addJobTask(jobID: string,task:Task) {
            await addTask(jobID,task)
        },
        async updateJobStatus(jobID: string, status: string) {
            const job: Job = Object.values(this.jobs).find((job: Job) => job.jobID === jobID);
            job.currentStatus = status;
            await editJob(job);
        },
        async finishTask(jobID: string, taskName: string,userID:string) {
            const job: Job = Object.values(this.jobs).find((job: Job) => job.jobID === jobID);
            const task: Task = job.tasks[taskName];
            task.finishedTime = new Date().toISOString();
            task.finishedBy = userID;
            await updateTask(jobID,taskName,task);
        },
        async finishJob(jobID: string) {
            const job: Job = Object.values(this.jobs).find((job: Job) => job.jobID === jobID);
            job.currentStatus = "Finished";
            await editJob(job);
        },
        async completeJob(jobID: string,floorValues:Record<string,any>) {
            const job: Job = Object.values(this.jobs).find((job: Job) => job.jobID === jobID);
            job.currentStatus = "Completed";
            job.floorValues = floorValues;
            await editJob(job);
        },
        async collectJob(job: Job,userID:string) {
            job.currentStatus = "Collected";
            job.collectedDate = new Date().toISOString();
            job.collectedBy = userID;
            await editJob(job);
        }
    }
})






