<script setup lang="ts">

</script>

<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <div class="flex w-8/12 h-4/5 flex-center">
      <div class="w-1/2 flex flex-col items-center justify-center">
        <img src="@assets/Images/logo.png" alt="logo" class="" />
      </div>
      <div class="w-1/2 h-full flex flex-col items-center justify-center gap-2">
        <div class="bg-white h-3/4 w-8/12 rounded-3xl shadow-lg p-8">
          <form class="flex flex-col h-5/6 justify-center">
            <h2 class="text-3xl font-semibold mb-6 text-center">
              Sign In
            </h2>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="email">User Name :</label>
              <input type="email" id="email" name="email" class="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-300 transition-colors duration-300" placeholder="Enter your email">
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password:</label>
              <input type="password" id="password" name="password" class="w-full px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-300 transition-colors duration-300" placeholder="Enter your password">
            </div>
<!--            <div class="flex items-center justify-end">-->
<!--              <a href="#" class="text-blue-500 hover:underline">Forgot password?</a>-->
<!--            </div>-->
            <div class="flex items-center justify-center">
              <button type="submit" class="bg-gradient-to-r bg-blue-700 hover:from-blue-600 hover:to-purple-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <img src="@assets/Icons/triangleGroup.svg" alt="triangleGroup" class="absolute bottom-0 right-0 transform -rotate-90"  />
    <img src="@assets/Icons/triangleGroup.svg" alt="triangleGroup" class="absolute top-0 right-0 transform rotate-180" />
  </div>
</template>

<style scoped>

</style>