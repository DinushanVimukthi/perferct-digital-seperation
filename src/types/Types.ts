export interface Job {
    jobID: number | string;
    jobName: string;
    createdTime: Date;
    createdBy: string;
    width: number;
    length: number;
    sheetID: string | number;
    design: string | null;
    currentStatus: string; // Pending , Approved , Started , Processing , Completed , Delivered
    approvedBy: string;
    approvedTime: Date;
    startedTime: Date;
    tasks: Task[]; // Writing , Exposing , Washing , Drying , Finishing
}

export interface Sheet {
    sheetID: number;
    thickness: number;
    width: number;
    length: number;
    balanceSheet: Sheet[];
    cutSheets: CutSheet[];
}

export interface CutSheet {
    cutSheetID: number;
    width: number;
    length: number;
    design: string;
    jobID: number;
}

export interface Task {
    taskID: number;
    taskType: string;
    startedTime: Date;
    startedBy: string;
    remarks: string;
}

export interface Issue {
    issueID: number;
    issueType: string;
    remark: string;
    issueFiledBy: string;
    status: string;
    subject: Subject;
}

export interface Subject {
    sheetID: number;
    updatedBalanceSheets: number;
}

export interface User {
    userID: number;
    userEmail: string;
    userName: string;
    userRole: string;
    userPassword: string;
}

export interface OutEmployeeUser {
    userName: string;
    userPIN: string;
    lastActive: Date;
}

