import {defineStore} from "pinia"
import {User} from "../types/Types.ts";
import {addUserToDB, createUser, getUserFromDB, signInUser,signOutUser} from "../services/userService.ts";


export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: {} as User,
        userID: "",
        userRole: "",
    }),
    getters: {
        getUser(): User {
            return this.user;
        },
        getUserID(): string | undefined {
            if (this.userID) {
                return this.userID
            }
        },
        getUserRole(): string {
            if (this.userRole) {
                return this.userRole
            } else {
                return ""
            }
        },
        getUserPIN():string{
            if (this.user.userPIN){
                return this.user.userPIN
            }else{
                return ""
            }
        }
    },
    actions: {
        async createUser(user: User) {
            //@ts-ignore
            const userCredentials=await createUser(user.userEmail, user.userPassword)
            const userID=userCredentials.user.uid
            user.userID=userID
            let userObject:User = {
                userID: user.userID,
                userEmail: user.userEmail,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                userRole: user.userRole,
            }
            if (user.userRole==="OutEmployee"){
                userObject = {
                    ...userObject,
                    userPIN: user.userPIN
                }
            }
            await addUserToDB(userObject)
            // this.setUser({...userObject, userID})
        },
        async logUser(email:string,password:string) {
            const credential = await signInUser(email,password)
            console.log(credential)
            if (credential.success){
                const userID=credential.user?.uid
                if (typeof userID === "string") {
                    const user = await getUserFromDB(userID)
                    if(user === null){
                        throw new Error("User not found! Please contact the administrator.")
                    }
                    localStorage.setItem("userID", userID)
                    localStorage.setItem("userRole", user.userRole)
                    this.setUser(user)
                    this.setUserID(userID)
                    this.setUserRole(user.userRole)
                    return {
                        success:true,
                        userRole : user.userRole
                    }
                }
                return credential

            }else{
                return credential
            }

        },
        async logOutUser() {
            this.setUser({} as User)
            this.setUserID("")
            this.setUserRole("")
            localStorage.removeItem("userID")
            localStorage.removeItem("userRole")
            await signOutUser();

        },
        setUser(user: User) {
            this.user = user;
        },
        setUserID(userID: string) {
            this.userID = userID;
        },
        setUserRole(userRole: string) {
            this.userRole = userRole;
        },
    }
})






