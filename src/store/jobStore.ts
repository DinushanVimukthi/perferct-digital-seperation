import {defineStore} from "pinia"


export const useJobStore = defineStore('jobStore', {
    state: () => ({
        jobs: [],
    }),
    getters: {
        getJobs(): any[] {
            return this.jobs;
        }
    },
    actions: {
        setJobs(jobs) {
            this.jobs = jobs;
        },
        addJob(job) {
            this.jobs.push(job);
        }
    }
})






