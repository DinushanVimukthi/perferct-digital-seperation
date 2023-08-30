import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from "@pages/LoginPage.vue";
import OngoingJobs from "@pages/OutEmployee/OngoingJobs.vue";
import FinishedJobs from "@pages/OutEmployee/FinishedJobs.vue";
import Setting from "@pages/OutEmployee/Setting.vue";
import PendingJobs from "@pages/OutEmployee/PendingJobs.vue";
import ReportIssue from "@pages/OutEmployee/ReportIssue.vue";

import InDashboard from "@pages/InEmployee/Dashboard.vue";
import InCurrentJobs from "@pages/InEmployee/CurrentJobs.vue";
import InSetting from "@pages/InEmployee/Setting.vue";
import CollectableJobs from "@pages/InEmployee/CollectableJobs.vue";


import SMDashboard from "@pages/StockManager/Dashboard.vue";
import SMStock from "@pages/StockManager/Stock.vue";

import ADashboard from "@pages/Owner/Dashboard.vue";
import ManageUser from "@/pages/Owner/ManageUser.vue";
import OCurrentJob from "@/pages/Owner/PendingJobs.vue";
import OJobHistory from "@/pages/Owner/JobHistory.vue";
import OCollectable from "@/pages/Owner/FinishedJobs.vue";
import OReport from "@/pages/Owner/Report.vue";



import {useUserStore} from "@store/UserStore.ts";
import {fAuth} from "@/services/firebase.ts";
import {getCurrentUser, getUserFromDB, IsUserLoggedIn} from "@/services/userService.ts";

// @ts-ignore
const routes = [
    {
        path: '/',
        name: 'Home',
        children: [
            {
                path: '',
                name: 'Login',
                component: () => LoginPage
            }
            ],
        meta : {
            requiresAuth: true
        },
        beforeEnter: async (to,from,next) => {
            console.log(await IsUserLoggedIn())
            if (await IsUserLoggedIn()) {
                const userID = useUserStore().getUserID
                const user = await getUserFromDB(userID)
                switch (user.userRole) {
                    case "OutEmployee":
                        next("/outEmp/pending")
                        break;
                    case "InEmployee":
                        next("/inEmp/dashboard")
                        break;
                    case "StockManager":
                        next("/stockManager/dashboard")
                        break;
                    case "Owner":
                        next("/admin/dashboard")
                        break;
                    default:
                        next("/")
                        break;
                }
            }else{
                next()
            }
        }
    },
    {
        path: '/outEmp',
        name: 'OutDashboard',
        children: [
            {
                path: 'dashboard',
                name: 'OutDashboard',
                component: () => OngoingJobs
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
            ],
        beforeEnter: async () => {
            const currentUser = await fAuth.currentUser
            if (currentUser) {
                const userID = currentUser.uid
                const user = await getUserFromDB(userID)
                if (user.userRole === "OutEmployee") {
                    return true
                }else {
                    return "/"
                }
            }else{
                return "/"
            }
        },
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
            ],
        beforeEnter: () => {
            const userStore = useUserStore()
            if (userStore.getUserRole === "InEmployee") {
                return true
            }else {
                return "/"
            }
        },
    },
    {
        path: '/owner',
        children: [
            {
                path: 'dashboard',
                name: 'AdminDashboard',
                component: ADashboard
            },
            {
                path: 'manageUser',
                name: 'ManageUser',
                component: ManageUser
            },
            {
                path: 'currentJob',
                name: 'OwnerCurrentJob',
                component: OCurrentJob
            },
            {
                path: 'collectable',
                name: 'OwnerCollectableJobs',
                component: OCollectable
            },

            {
                path: 'history',
                name: 'OwnerJobHistory',
                component: OJobHistory
            },
            {
                path: 'report',
                name: 'OwnerReport',
                component: OReport
            }
            ]
    },
    {
        path: '/stockManager',
        children:[
            {
                path: 'dashboard',
                name: 'SMDashboard',
                component: () => SMStock
            },{
                path: 'stock',
                name: 'SMStock',
                component: () => SMStock
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// router.beforeEach(async (to, from, next) => {
//     const userStore = await IsUserLoggedIn()
//     console.log(userStore)
//     next()
// })

export default router
