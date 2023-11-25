import {fAuth, fdb} from "../services/firebase.ts";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,onAuthStateChanged,sendPasswordResetEmail} from "firebase/auth"
import {get as dbGet, ref as dbRef, set as dbSet} from "firebase/database"
import {User} from "../types/Types.ts";
import {useUserStore} from "../store/UserStore.ts";
import router from "../router";


const createUser = async (email: string, password: string) => {

    return await createUserWithEmailAndPassword(fAuth, email, password)
}

const signInUser = async (email: string, password: string) => {
    return signInWithEmailAndPassword(fAuth, email, password).then((userCredential) => {
        localStorage.setItem("userID", userCredential.user.uid)

        // Signed in
        return {
            success: true,
            user: userCredential.user
        }
        // ...
    }).catch((error) => {
        return {
            success: false,
            error:error,
            user:null
        }
    })
}

const signOutUser = async () => {
    if (fAuth.currentUser) {
        await signOut(fAuth)
    }

}

const addUserToDB = async (user:User) => {
    const userRef = dbRef(fdb, `users/${user.userID}`)
    await dbSet(userRef, user)
}

const getUserFromDB = async (userID:string) => {
    const userRef = dbRef(fdb, `users/${userID}`)
    const userSnapshot = await dbGet(userRef)
    if (userSnapshot.exists()) {
        return userSnapshot.val()
    } else {
        return null
    }
}

const getAllUsersFromDB = async () => {
    const usersRef = dbRef(fdb, `users`)
    const usersSnapshot = await dbGet(usersRef)
    if (usersSnapshot.exists()) {
        return usersSnapshot.val()
    } else {
        return null
    }
}

const getCurrentUser = async () => {
    const user = await fAuth.currentUser
    if (user) {
        const userStore = useUserStore()
        const userRef = dbRef(fdb, `users/${user.uid}`)
        const userSnapshot = await dbGet(userRef)
        if (userSnapshot.exists()) {
            userStore.setUserID(user.uid)
            userStore.setUser(userSnapshot.val())
            userStore.setUserRole(userSnapshot.val().userRole)
        }
    }
    onAuthStateChanged(fAuth, async (user) => {
        if (user) {
            const userStore = useUserStore()
            const userRef = dbRef(fdb, `users/${user.uid}`)
            const userSnapshot = await dbGet(userRef)

            if (userSnapshot.exists()) {
                const userRole = userSnapshot.val().userRole
                userStore.setUserID(user.uid)
                userStore.setUser(userSnapshot.val())
                userStore.setUserRole(userSnapshot.val().userRole)
                let path = ""
                switch (userRole) {
                    case "Admin":
                        path = "/owner/dashboard"
                        break
                    case "InEmployee":
                        path = "/inEmp/dashboard"
                        break
                    case "OutEmployee":
                        path = "/outEmp/pending"
                        break
                    case "StockManager":
                        path = "/stockManager/stock"
                        break
                    default:
                        path = "/"
                }
                //get current path
                const currentPath = router.currentRoute.value.path
                const currentRole = path.split("/")[1]
                console.log(currentPath.split("/")[1])
                console.log(currentRole)
                if (currentPath.split("/")[1] !== currentRole) {
                    router.push(path)
                }else{
                    router.push(currentPath)
                }

            }
        } else {
            console.log("no user")
        }
    })
}

const IsUserLoggedIn = async () => {
    //get current userID from local storage
    //check if user exists in db
    //if exists return true

    const localUserID = localStorage.getItem("userID")
    if (localUserID) {
        const localUserRole = localStorage.getItem("userRole")
        if (localUserRole) {
            const userStore = useUserStore()
            userStore.setUserID(localUserID)
            userStore.setUserRole(localUserRole)
            return true
        }
    }
    return false

    // const user = await fAuth.currentUser
    // if (user) {
    //     return true
    // } else {
    //     return true
    // }
}

const resetPassword = async (email:string) => {
    return await sendPasswordResetEmail(fAuth,email)
}

const editUser = async (user:User) => {
    const userRef = dbRef(fdb, `users/${user.userID}`)
    await dbSet(userRef, user)
}


export {createUser, signInUser, signOutUser, addUserToDB,getUserFromDB,editUser,getCurrentUser,getAllUsersFromDB,IsUserLoggedIn,resetPassword}