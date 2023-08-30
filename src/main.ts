import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from "pinia";
import router from '@/router'
import VueCryptojs from 'vue-cryptojs'





const pinia = createPinia()
const Application = createApp(App)

Application.use(pinia)
Application.use(VueCryptojs)
Application.use(router)


Application.mount('#app')
