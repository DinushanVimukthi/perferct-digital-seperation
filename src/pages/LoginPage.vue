<script setup lang="ts">

import {useUserStore} from "@store/UserStore.ts";
import {NotificationType, useNotification,NInput,NButton} from "naive-ui";
import {ref} from "vue";
import router from "@/router"
import { } from "firebase/auth"
import {useLoaderStore} from "@store/loaderStore.ts";


const notification = useNotification();
const notify =(type: NotificationType,title:string,message:string)=> {
  notification[type]({
    content: message,
    title,
    duration: 2500,
    keepAliveOnHover: true
  })
}
const loginForm = ref({
  email: '',
  password: ''
})

const userStore = useUserStore();

const login =async () => {
  // Validate form
  if (loginForm.value.email.trim() === '' || loginForm.value.password.trim() === '') {
    notify('error','Error','Please fill all fields');
    return;
  }
  const loaderStore = useLoaderStore();
  loaderStore.setLoading(true);
  try {
    const result = await userStore.logUser(loginForm.value.email,loginForm.value.password);
    if (result.success){

      const userRole = result.userRole

      let path = ''
      if (userRole === 'InEmployee'){
        path +='/inEmp/dashboard'
      }else if (userRole === 'OutEmployee'){
        path +='/outEmp/pending'
      }else if (userRole === 'StockManager') {
        path +='/stockManager/dashboard'
      }else if (userRole === 'Admin') {
        path +='/owner/dashboard'
      }
      router.push(path)
      notify('success','Success','Logged in successfully');
    }else{
      const error = result.error
      if (error.code === 'auth/user-not-found'){
        notify('error','Error','User not found');
      }else if (error.code === 'auth/wrong-password'){
        notify('error','Error','Incorrect password');
      } else{
        notify('error','Error','Something went wrong');
      }
      loaderStore.setLoading(false);
    }
  }catch (e){
    notify('error','Error',e.toString());
    loaderStore.setLoading(false);
  }

}
const year = new Date().getFullYear();
</script>

<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <div class="flex flex-wrap w-8/12  h-4/5 flex-center">
      <div class="w-1/2 flex flex-col items-center justify-center">
        <img src="@assets/Images/logo.png" alt="logo" class="" />
      </div>
      <div class="w-1/2 h-full flex flex-col items-center justify-center gap-2">
        <div class="bg-white h-3/4 w-8/12 min-w-[400px] min-h-[600px] rounded-3xl shadow-lg p-8">
          <form class="flex flex-col h-5/6 justify-center" @submit.prevent="login">
            <h1 class="text-2xl font-semibold mb-6 text-center">
              Welcome, <br/><span class=" text-4xl font-bold text-blue-600">
              Perfect Digital Seperation
            </span>
            </h1>
            <h2 class="text-3xl font-semibold mb-6 text-center">
              Sign In 
            </h2>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="email">User Email :</label>
              <n-input type="text" id="email" name="email" class="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-300 transition-colors duration-300" placeholder="Enter your email" v-model:value="loginForm.email"/>
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password:</label>
              <n-input type="password" id="password" name="password" class="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-300 transition-colors duration-300" placeholder="Enter your password" v-model:value="loginForm.password"/>
            </div>
<!--            <div class="flex items-center justify-end">-->
<!--              <a href="#" class="text-blue-500 hover:underline">Forgot password?</a>-->
<!--            </div>-->
            <div class="flex items-center justify-center">
              <n-button
                  @click="login"
                  class="bg-gradient-to-r bg-blue-700 hover:from-blue-600 hover:text-white hover:to-purple-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300">
                Login
              </n-button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <img src="@assets/Icons/triangleGroup.svg" alt="triangleGroup" class="absolute bottom-0 right-0 transform -rotate-90"  />
    <img src="@assets/Icons/triangleGroup.svg" alt="triangleGroup" class="absolute top-0 right-0 transform rotate-180" />
  </div>
  <footer class="absolute bottom-0 w-full flex justify-center items-center">
    <p class="text-gray-400 text-sm">
      © {{year}} All Rights Reserved.   <span class="text-blue-500">DVTech</span>
    </p>
  </footer>
</template>

<style scoped>

</style>