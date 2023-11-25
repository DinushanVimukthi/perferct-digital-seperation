<script setup lang="ts">

import {ClipboardTaskAdd20Regular,ContentViewGallery20Regular} from "@vicons/fluent";
import {CheckmarkDone, CheckmarkSharp, EyeOutline, NewspaperOutline,DocumentTextOutline, Send,Close,CloudUploadOutline as ArchiveIcon} from "@vicons/ionicons5";
import {User,Password,UserFollow} from "@vicons/carbon";
import {KeyReset20Regular} from "@vicons/fluent";
import {User as IUser} from "@/types/Types.ts";
import moment from "moment";
import {
  NCard,
  NIcon,
  NInputGroup,
  NInputNumber,
  NModal,
  NTable,
  NInput,
  NTag,
  NSelect,
  NUpload,
  NUploadDragger,
  NText,
  NResult,
  useNotification,
  NotificationType, useDialog, useMessage,
} from "naive-ui"
import {computed, onMounted, ref, UnwrapRef, watch} from "vue";
import {useJobStore} from "@store/jobStore.ts";
import {useSheetStore} from "@store/sheetStore.ts";
import {useUserStore} from "@store/UserStore.ts";
import OwnerLayout from "@/Layout/OwnerLayout.vue";
import {useAdminStore} from "@store/adminStore.ts";
import {decryptText, encryptText} from "@/helper/Security.ts";

// Pinia Store
const jobStore = useJobStore();
const sheetStore = useSheetStore();
const userStore = useUserStore();
const adminStore = useAdminStore();

onMounted(()=>{
  adminStore.getAllUsers();
})


//Modal Ref
const addUserModal = ref(false);
const changePinModal = ref(false);
const deactivateUserModal = ref(false);


// User Object
// const userForm = ref<User>({
//   userID: null,
//   userEmail:null,
//   userName:null,
//   firstName : null,
//   lastName:null,
//   userRole:null,
//   userPassword:null
// })
const userForm = ref({
  userID: "user_01",
  userEmail:"stdinushan@gmail.com",
  userName:"User01",
  firstName : "User 01 First",
  lastName:"User 01 Last",
  userRole:"InEmployee",
  userPassword:"1234567890",
  userPIN : "1234"
})

//User Type Objects
const userTypes = ref([
  {
    label: "In Employee",
    value: "InEmployee"
  },
  {
    label: "Out Employee",
    value: "OutEmployee"
  }
])

const formPin = ref({
  currentPin: null,
  newPin: null,
  confirmPin: null,
  userID: null
})

const message = useMessage()
const dialog = useDialog()

const resetPassword = (userEmail:string) =>{
  dialog.success({
    title: 'Reset Password',
    content: 'Are you sure you want to reset password?',
    positiveText: 'Yes',
    negativeText: 'No',
    onPositiveClick: async () => {
      await adminStore.resetPassword(userEmail);
      message.success("Password Reset Successfully")
    },
    onNegativeClick: () => {
      message.info("Password Reset Cancelled")
    }
  })
}

const deactivateUser = () =>{
  console.log("Deactivate User")
}


const notification = useNotification();
const notify =(type: NotificationType,title:string,message:string)=> {
  notification[type]({
    content: message,
    title,
    duration: 2500,
    keepAliveOnHover: true
  })
}



const OpenAddUserModal = () =>{
  addUserModal.value = true;
}


const changePIN = ()=>{
  console.log(formPin.value)
}

const openChangePINModal = (user:IUser)=>{
  console.log(user)
  changePinModal.value = true;
  formPin.value.userID = user.userID;
}

const FormatDate = (date:string) =>{
  return moment(date).format('DD MMM hh:mm A');
}


const addUser = async ()=>{
  const fieldValue = userForm.value;
  //validate
  if(!fieldValue.userRole){
    notify("error","Error","Please Select User Role");
    return;
  }
  if(!fieldValue.userName){
    notify("error","Error","Please Enter User Name");
    return;
  }
  if(!fieldValue.userEmail){
    notify("error","Error","Please Enter User Email");
    return;
  }
  if(!fieldValue.userPassword){
    notify("error","Error","Please Enter User Password");
    return;
  }
  if(fieldValue.userPassword.length < 8){
    notify("error","Error","Password must be 8 characters long");
    return;
  }
  let userPin =Math.floor(1000 + Math.random() * 9000);
  if (userForm.value.userRole ==="OutEmployee"){
    userForm.value.userPIN = encryptText(userPin.toString());
  }
  await userStore.createUser(userForm.value)
  notificaationModal.value = true;
  addUserModal.value = false;
  notificationModalProps.value.title = "Your PIN is "+userPin;
  notificationModalProps.value.description = "Please use this PIN to use the system. Do not share this PIN with anyone";
  notify("success","Success","User Added Successfully & Logging to new Account ");
}


const notificationModalProps = ref({
  title:"",
  description:"",
  status:"warning" as  "500" | "error" | "info" | "success" | "warning" | "404" | "403" | "418" | undefined,
  btnText:"OK"
})

const clearNotificationModalProps = ()=>{
  notificationModalProps.value.title = "";
  notificationModalProps.value.description = "";
  notificationModalProps.value.status = "warning";
  notificationModalProps.value.btnText = "OK";
}

const notificaationModal = ref(false);

const changePin = ()=>{
  const fieldValue = formPin.value;
  console.log(fieldValue)
  //validate
  if(!fieldValue.currentPin){
    notify("error","Error","Please Enter Current PIN");
    return;
  }
  if(!fieldValue.newPin){
    notify("error","Error","Please Enter New PIN");
    return;
  }
  if(!fieldValue.confirmPin){
    notify("error","Error","Please Confirm New PIN");
    return;
  }
  if(fieldValue.newPin !== fieldValue.confirmPin){
    notify("error","Error","New PIN and Confirm PIN does not match");
    return;
  }
  if(fieldValue.newPin.length !== 4){
    notify("error","Error","PIN must be 4 characters long");
    return;
  }
  console.log(decryptText(adminStore.getUserPIN(formPin.value.userID)))
  if(fieldValue.currentPin !== decryptText(adminStore.getUserPIN(formPin.value.userID))){
    notify("error","Error","Current PIN is incorrect");
    return;
  }
  adminStore.updateUserPIN(fieldValue.userID,encryptText(fieldValue.currentPin.toString()));
  changePinModal.value = false;
  notify("success","Success","PIN Changed Successfully");
}

const resetPIN = ()=>{
  dialog.success({
    title: 'Reset PIN',
    content: 'Are you sure you want to reset PIN?',
    positiveText: 'Yes',
    negativeText: 'No',
    onPositiveClick: async () => {
      let userPin =Math.floor(1000 + Math.random() * 9000);
      console.log(formPin)
      await adminStore.updateUserPIN(formPin.value.userID, encryptText(userPin.toString()));
      notify("success","Success","PIN Reset Successfully");
      changePinModal.value = false;
      notify("success","Success","Your PIN is "+userPin);
    },
    onNegativeClick: () => {
      message.info("PIN Reset Cancelled")
    }
  })
}

</script>

<template>
  <OwnerLayout>
    <n-modal
        v-model:show="addUserModal"
        title="Dialog"
        class="w-1/2 rounded-2xl"
    >
      <n-card
          class="w-2/5 rounded-2xl"
          title="Add New User"
          header-style="background-color: #476ECA;text-align: center;font-size: 20px;font-weight: 600;border-radius: 10px 10px 0 0;text-color: #fff;"
          footer-style="background-color: #fff;padding: 10px 20px;text-align: center; border-radius: 0 0 10px 10px;"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
      >

        <div class="flex gap-5 w-full">
          <div class="w-full gap-4 p-2 flex flex-col">
            <div class="flex justify-center items-start py-4 gap-2">
              <div class="flex w-full gap-4 flex-col">
                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-semibold w-1/4"> User Role</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-select v-model:value="userForm.userRole" :options="userTypes" class="mr-8" placeholder="Select User Role"/>
                  </n-input-group>
                </div>
                <div class="flex gap-2 items-center justify-center">
                  <span class="text-sm font-semibold w-1/4"> User Name</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-input clearable size="small" placeholder="User Name" v-model:value="userForm.userName" class="mr-8"/>
                  </n-input-group>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-semibold w-1/4"> Email</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-input clearable  size="small" placeholder="User Email" v-model:value="userForm.userEmail" class="mr-8"/>
                  </n-input-group>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-semibold w-1/4"> First Name</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-input clearable  size="small" placeholder="User First Name"  v-model:value="userForm.firstName" class="mr-8"/>
                  </n-input-group>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-semibold w-1/4"> Last Name</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-input clearable  size="small" placeholder="User Last Name"  v-model:value="userForm.lastName"  class="mr-8"/>
                  </n-input-group>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-semibold w-1/4"> Password</span>
                  <n-input-group class="flex items-center justify-center gap-2">
                    <n-input type="password"  size="small" placeholder="User Password"  v-model:value="userForm.userPassword"  class="mr-8"/>
                  </n-input-group>
                </div>


              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex items-center justify-center w-full gap-2">
            <n-button class="bg-red-500 hover:bg-red-800 px-4 py-2  rounded-full flex items-center justify-center gap-3 text-lg text-white font-bold " @click="addUserModal =false">
              <n-icon :component="Close" size="24px" />
              Cancel
            </n-button>
            <n-button class="bg-green-600 hover:bg-green-700 rounded-full px-4 py-2 flex items-center justify-center gap-3 text-lg text-white font-bold " @click="addUser">
              <n-icon :component="UserFollow" size="24px" />
              Add User
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="changePinModal">
      <n-card
        :style="{ width: '400px' }"
      >
        <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <div class="font-bold text-xl">Change PIN</div>
          <div  class="flex items-center justify-center my-3 cursor-pointer bg-red-400 rounded-full p-1 text-white hover:bg-red-800">
            <n-icon :component="Close" size="24px" @click="changePinModal = false" />
          </div>
        </div>
        <div class="flex gap- items-center justify-center">
          <span class="text-sm w-2/3 font-semibold">Current PIN</span>
          <n-input v-model:value="formPin.currentPin" type="password" class="w-1/3" placeholder="Current PIN" />
        </div>
          <div class="flex gap- items-center justify-center">
            <span class="text-sm w-2/3 font-semibold">New PIN</span>
            <n-input v-model:value="formPin.newPin" type="password" placeholder="New PIN" />
          </div>
          <div class="flex gap- items-center justify-center">
            <span class="text-sm w-2/3 font-semibold">Confirm New PIN</span>
            <n-input v-model:value="formPin.confirmPin" type="password" placeholder="Confirm New PIN" />
          </div>
        <div class="flex gap-2 justify-end">
          <n-button class="bg-red-500 hover:bg-red-800 px-4 py-2  rounded-full flex items-center justify-center gap-3 text-white font-bold " @click="changePinModal = false">
            Cancel
          </n-button>
          <n-button class="bg-green-600 hover:bg-green-700 rounded-full px-4 py-2 flex items-center justify-center gap-3 text-white font-bold " @click="resetPIN">
            Reset PIN
          </n-button>
          <n-button class="bg-green-600 hover:bg-green-700 rounded-full px-4 py-2 flex items-center justify-center gap-3 text-white font-bold " @click="changePin">
            Change PIN
          </n-button>


        </div>
        </div>
      </n-card>
    </n-modal>
    <n-modal v-model:show="deactivateUserModal">
      <n-card
        :style="{ width: '400px' }"
      >
        <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center border-b">
          <div class="font-bold text-xl">Confirm Deactivate User</div>
          <div  class="flex items-center justify-center my-3 cursor-pointer bg-red-400 rounded-full p-1 text-white hover:bg-red-800">
            <n-icon :component="Close" size="24px" @click="deactivateUserModal = false" />
          </div>
        </div>
            <div class="fle items-center justify-center text-lg font-semibold">
              Are you sure you want to deactivate this user?
            </div>
          <div class="flex gap-2 justify-end">
            <n-button class="bg-red-500 hover:bg-red-800 px-4 py-2  rounded-full flex items-center justify-center gap-3 text-white font-bold " @click="deactivateUserModal = false">
              Cancel
            </n-button>
            <n-button class="bg-green-600 hover:bg-green-700 rounded-full px-4 py-2 flex items-center justify-center gap-3 text-white font-bold " @click="deactivateUser">
              Deactivate User
            </n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
    <n-modal v-model:show="notificaationModal"
      :on-after-leave="clearNotificationModalProps"
    >
      <n-result
          class="bg-white p-8 rounded-xl"
          :status="notificationModalProps.status"
          :title="notificationModalProps.title"
          :description="notificationModalProps.description"
      >
        <template #footer>
          <div class="flex gap-2 justify-center items-center">
            <n-button class="bg-blue-500 hover:bg-blue-800 px-4 py-2  rounded-full flex items-center justify-center gap-3 text-white font-bold " @click="notificaationModal = false">
              {{ notificationModalProps.btnText }}
            </n-button>
          </div>
        </template>
      </n-result>
    </n-modal>
    <div class="flex items-start gap-6 bg-white p-8 justify-center w-full h-full">
      <div class="w-10/12 flex-col gap-4 flex ">
          <div class="flex items-center justify-between w-full">
            <div class="ml-8 font-bold text-xl">
              All Users
            </div>
            <div class="flex items-center gap-2">
              <n-button class="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-xl" @click="OpenAddUserModal">
                <n-icon :component="UserFollow" size="24px" />
                <span>
                  Add User
                </span>
              </n-button>
            </div>
          </div>
          <n-scrollbar style="max-height: 120px">
            <n-table
                striped size="small"
                border="outer"
                class="w-full"
            >
              <thead>
              <tr class="text-center">
                <th>No</th>
                <th>User Name</th>
                <th>User Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>User Type</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody class="text-center">
              <tr v-for="(user,index) in adminStore.getUsers" :key="user.userID" v-if="adminStore.getUsers.length>0">
                <td>{{index+1}}</td>
                <td>{{user.userName}}</td>
                <td>{{user.userEmail}}</td>
                <td>{{user.firstName.trim()!=='' ?user.firstName:"-"}}</td>
                <td>{{user.lastName.trim()!=='' ?user.lastName:"-"}}</td>
                <td>
                {{user.userRole}}
                </td>
                <td class="flex gap-2 items-center justify-center" >
                  <n-button class="bg-yellow-600 hover:bg-blue-700 flex text-sm items-center justify-center gap-3 text-white py-2 px-2 rounded" @click="resetPassword(user.userEmail)">
                    <n-icon :component="Password" size="medium" />
                    <span class="text-sm">
                    Reset Password
                  </span>
                  </n-button>
                  <n-button class="bg-blue-500 hover:bg-blue-700 flex text-sm items-center justify-center gap-3 text-white py-2 px-2 rounded" @click="openChangePINModal(user)" v-if="user.userRole==='OutEmployee'">
                    <n-icon :component="KeyReset20Regular" size="medium" />
                    <span class="text-sm">
                    Change PIN
                  </span>
                  </n-button>

<!--                  <n-button class="bg-red-500 hover:bg-red-700 flex text-sm items-center justify-center gap-3 text-white py-2 px-2  rounded" @click="deactivateUserModal = true">-->
<!--                    <n-icon :component="User" size="medium" />-->
<!--                    <span class="text-sm">-->
<!--                    Deactivate-->
<!--                  </span>-->
<!--                  </n-button>-->

                </td>
              </tr>
              <tr v-else>
                <td colspan="7" class="text-center">
                  No Jobs
                </td>
              </tr>
              </tbody>
            </n-table>
          </n-scrollbar>
        </div>
    </div>
  </OwnerLayout>

</template>

<style scoped>
canvas {
  display: block;
  margin: 0 auto;
  width: 80%;
  height: 100%;
}

</style>