import {defineStore} from "pinia"
import {User} from "../types/Types.ts";
import {
    addUserToDB,
    createUser,
    editUser,
    getAllUsersFromDB,
    getUserFromDB,
    resetPassword
} from "../services/userService.ts";

export const useAdminStore = defineStore('adminStore', {
    state: () => ({
        users: {} as Record<string, User>,
    }),
    getters: {
        getUser: (state) => (userID: string) => {
            return state.users[userID]
        },
        getUsers: (state) => {
            return Object.values(state.users).filter(user => user.userRole !== "Admin")
        },
        getInEmployees: (state) => {
            return Object.values(state.users).filter(user => user.userRole === "InEmployee")
        },
        getOutEmployees: (state) => {
            return Object.values(state.users).filter(user => user.userRole === "OutEmployee")
        },
        getUserPIN: (state) => (userID: string) => {
            return state.users[userID]?.userPIN
        }


    },
    actions: {
        async createUser(user: User) {
            const userCredentials=await createUser(user.userEmail, user.userPassword)
            user.userID=userCredentials.user.uid
            let userObject:User = {
                userID: user.userID,
                userEmail: user.userEmail,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                userRole: user.userRole,
            }
            if (user.userRole === "OutEmployee") {
                userObject = {
                    ...userObject,
                    userPIN: user.userPIN,
                }
            }
            await addUserToDB(userObject)
            // this.setUser({...userObject, userID})
        },
        setUser(user: User) {
            this.users[user.userID] = user
        },
        async getAllUsers() {
            const users = await getAllUsersFromDB()
            if (users) {
                this.users = users
            }else{
                this.users={}
            }
        },
        async resetPassword(email: string) {
            await resetPassword(email)
        },
        async updateUserPIN(userID: string, userPIN: string) {
            const user = await getUserFromDB(userID)
            user.userPIN = userPIN
            this.setUser(user)
            await editUser(user)
        }
    }
})






