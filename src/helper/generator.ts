
// Helper function to generate a random task
import {Job, Task} from "@/types/Types.ts";

function generateRandomTask(): Task {
    const taskTypes = ['Writing', 'Exposing', 'Washing', 'Drying', 'Finishing'];

    return {
        taskID: getRandomNumber(1, 1000),
        taskType: getRandomArrayElement(taskTypes),
        startedTime: getRandomDate(),
        startedBy: getRandomName(),
        remarks: getRandomSentence(),
    };
}

// Helper function to generate a random number within a range
function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get a random element from an array
function getRandomArrayElement<T>(arr: T[]): T {
    const randomIndex = getRandomNumber(0, arr.length - 1);
    return arr[randomIndex];
}

// Helper function to generate a random date within a range of years
function getRandomDate(): Date {
    const startYear = 2000;
    const endYear = 2023;
    const randomYear = getRandomNumber(startYear, endYear);
    const randomMonth = getRandomNumber(0, 11); // Months are zero-based (0 to 11)
    const randomDay = getRandomNumber(1, 28); // We assume all months have 28 days for simplicity

    return new Date(randomYear, randomMonth, randomDay);
}

// Helper function to generate a random name
function getRandomName(): string {
    const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Williams', 'David Brown'];
    return getRandomArrayElement(names);
}

// Helper function to generate a random sentence
function getRandomSentence(): string {
    const words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
    const sentenceLength = getRandomNumber(5, 10);
    const sentence = Array.from({ length: sentenceLength }, () => getRandomArrayElement(words)).join(' ');

    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

// Function to generate a random job
function generateRandomJob(): Job {
    const statusOptions = ['Pending', 'Approved', 'Started', 'Processing', 'Completed', 'Delivered'];

    const tasks: Task[] = Array.from({ length: getRandomNumber(1, 5) }).map(generateRandomTask);

    return {
        jobID: getRandomNumber(1000, 9999),
        jobName: getRandomSentence(),
        createdTime: getRandomDate(),
        createdBy: getRandomName(),
        width: getRandomNumber(1, 100),
        length: getRandomNumber(1, 100),
        sheetID: getRandomNumber(1000, 9999),
        design: getRandomSentence(),
        currentStatus: getRandomArrayElement(statusOptions),
        approvedBy: getRandomName(),
        approvedTime: getRandomDate(),
        startedTime: getRandomDate(),
        tasks,
    };
}

export { generateRandomJob}
