interface Job {
    jobID: number | string;
    jobName: string;
    width: number;
    length: number;
    parentSheetWidth: number;
    parentSheetLength: number;
    remarks: string;
    createdTime: Date;
    createdBy: string;
    priority: string; // High , Medium , Low
    deadLine: Date | null;
    cutSheetID: string;
    sheetID: string | number;
    design: Design[] | null;
    currentStatus: string; // Pending , Approved , Started , Processing , Completed , Delivered
    approvedBy: string;
    approvedTime: Date;
    startedTime: Date;
    balanceSheets: BalanceSheet[] | null;
    collectedDate: Date | null;
    collectedBy: string | null;
    tasks: Task[]; // Writing , Exposing , Washing , Drying , Finishing
    floorValues : Record<string, number>;
}

interface Design{
    designName: string;
    designType: string;
    designID: string;
    designURL: string;
}

interface Sheet {
    sheetID: string;
    thickness: number;
    width: number;
    filled: boolean;
    length: number;
    count: number;
    balanceSheets: BalanceSheet[] | null;
    cutSheets: CutSheet[] | null;
}

interface BalanceSheet{
    bSheetID: string;
    width: number;
    length: number;
}



interface CutSheet {
    cutSheetID: number;
    parentWidth: number;
    parentLength: number;
    width: number;
    length: number;
    design: string;
    jobID: number;
}

interface Task {
    taskID: number;
    taskType: string;
    startedTime: Date;
    startedBy: string
    finishedTime: Date | string;
    finishedBy: string;
    remarks: string;
}

interface Issue {
    issueID: number;
    issueType: string;
    remark: string;
    issueFiledBy: string;
    status: string;
    subject: Subject;
}

interface Subject {
    sheetID: number;
    updatedBalanceSheets: number;
}

interface User {
    userID: string;
    userEmail: string;
    userName: string;
    firstName: string;
    lastName: string;
    userRole: string;
    userPIN?: string;
    userPassword?: string;
}

interface OutEmployeeUser {
    userName: string;
    userPIN: string;
    lastActive: Date;
}

export type { Job, Sheet, CutSheet, Task, Issue, Subject, User, OutEmployeeUser, Design,BalanceSheet};
