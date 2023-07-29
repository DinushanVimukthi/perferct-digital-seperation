import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from "pinia";
import router from '@/router'



const pinia = createPinia()
const Application = createApp(App)

Application.use(pinia)
Application.use(router)


Application.mount('#app')
