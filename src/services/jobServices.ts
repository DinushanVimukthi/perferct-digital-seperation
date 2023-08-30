import {fdb} from "@/services/firebase.ts";
import {ref as dbRef,get as dbGet,set as dbSet,push as dbPush,onChildAdded,onChildChanged,onChildRemoved} from "firebase/database";
import {Job, Task} from "@/types/Types.ts";
import {useJobStore} from "@store/jobStore.ts";

const getJobs = async () => {
    const jobsRef = dbRef(fdb, 'jobs');
    const snapshot = await dbGet(jobsRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return [];
    }
}

const getJob = async (jobID: number) => {
    const snapshot = await fdb.ref('jobs/' + jobID).get();
    return snapshot.val();
}

const getJobByCutSheetID = async (cutSheetID: number) => {
    const ref = await dbRef(fdb, 'jobs');
    const snapshot = await dbGet(ref);
    let jobs = snapshot.val();
    for (let job of jobs) {
        for (let cutSheet of job.cutSheets) {
            if (cutSheet.cutSheetID === cutSheetID) {
                return job;
            }
        }
    }
}

const addJob = async (job: Job) => {
    const ref = dbRef(fdb, 'jobs/' + job.jobID);
    // Check if jobID already exists
    const snapshot = await dbGet(ref);
    if (snapshot.exists()) {
        throw new Error("Job ID already exists");
    }
    await dbSet(ref, job);
}

const editJob = async (job: Job) => {
    const ref = dbRef(fdb, 'jobs/' + job.jobID);
    await dbSet(ref, job);
}

const deleteJob = async (jobID: number) => {
    const ref = dbRef(fdb, 'jobs/' + jobID);
    await dbSet(ref, null);
}

const addTask = async (jobID: string, task: Task) => {
    const ref = dbRef(fdb, 'jobs/' + jobID + '/tasks/' + task.taskType);
    await dbSet(ref, task);
}

const updateTask = async (jobID: string, taskName: string, task: Task) => {
    const ref = dbRef(fdb, 'jobs/' + jobID + '/tasks/' + taskName);
    await dbSet(ref, task);
}

const addJobHooks = () => {
    const jobStore = useJobStore();
    const jobsRef = dbRef(fdb, 'jobs');
    onChildAdded(jobsRef, (snapshot) => {
        jobStore.jobs[snapshot.key] = snapshot.val();
    })
    onChildChanged(jobsRef, (snapshot) => {
        jobStore.jobs[snapshot.key] = snapshot.val();
    })
    onChildRemoved(jobsRef, (snapshot) => {
        delete jobStore.jobs[snapshot.key];
    })
}

export {getJobs, getJob, getJobByCutSheetID, addJob, editJob, deleteJob, addJobHooks,addTask,updateTask}