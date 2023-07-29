
interface TaskType {
    id: number;  // task id
    name: string; // task name
    startTime: string; // date
    endTime: string; // date
    status: string; // ongoing / finished / pending
    startBy: string; // employee id
    endBy: string; // employee  id
    remarks: string; // remarks
}

interface JobType {
    id: number; // job id
    sheetId: number; // sheet id
    width: number; // width
    length: number; // length
    name: string; // job name
    description: string; // job description
    status: string; // ongoing / finished / pending
    approved: boolean; // true / false
    approvedBy: string | null; // employee id
    approvedTime: string | null; // date
    currentStatus: string | null; // write / expose / dry / clean
    tasks: TaskType[] | null; // array of tasks
}

export type {JobType, TaskType};
