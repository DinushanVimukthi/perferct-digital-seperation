import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from "@pages/LoginPage.vue";
import OutDashboard from "@pages/OutEmployee/Dashboard.vue";
import OngoingJobs from "@pages/OutEmployee/OngoingJobs.vue";
import FinishedJobs from "@pages/OutEmployee/FinishedJobs.vue";
import Setting from "@pages/OutEmployee/Setting.vue";
import PendingJobs from "@pages/OutEmployee/PendingJobs.vue";
import ReportIssue from "@pages/OutEmployee/ReportIssue.vue";

import InDashboard from "@pages/InEmployee/Dashboard.vue";
import InCurrentJobs from "@pages/InEmployee/CurrentJobs.vue";
import InSetting from "@pages/InEmployee/Setting.vue";
import CollectableJobs from "@pages/InEmployee/CollectableJobs.vue";


// @ts-ignore
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => LoginPage
    },
    {
        path: '/outEmp',
        name: 'OutDashboard',
        children: [
            {
                path: 'dashboard',
                name: 'OutDashboard',
                component: () => OutDashboard
            },
            {
                path: 'ongoing',
                name: 'OutOngoing',
                component: () => OngoingJobs
            },
            {
                path: 'pending',
                name: 'OutPending',
                component: () => PendingJobs
            },
            {
                path: 'finished',
                name: 'OutFinished',
                component: () => FinishedJobs
            },
            {
                path: 'reportIssue',
                name: 'OutReport',
                component: () => ReportIssue
            },
            {
                path: 'settings',
                name: 'OutProfile',
                component: () => Setting
            }
            ]
    },
    {
        path: '/inEmp',
        children: [
            {
                path: 'dashboard',
                name: 'InDashboard',
                component: () => InDashboard
            },
            {
                path: 'current',
                name: 'InCurrent',
                component: () => InCurrentJobs
            },
            {
                path: 'collectable',
                name: 'InCollectable',
                component: () => CollectableJobs
            },
            {
                path: 'settings',
                name: 'InProfile',
                component: () => InSetting
            }
            ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
