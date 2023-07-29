<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides,NNotificationProvider } from 'naive-ui'
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#6C3CFE',
    textColor1: '#6C3CFE',
  },
  Table: {
    headerColor: '#000000',
  },
  Button:{
    color: '#6C3CFE',
    textColor: '#ffffff',
  },
  Card:{
    titleTextColor: '#ffffff',
    titleFontSizeLarge: '2rem',
  },

}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-notification-provider>
      <router-view />
    </n-notification-provider>
  </n-config-provider>
</template>

<style>


</style>
