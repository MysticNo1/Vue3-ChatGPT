import {createRouter, createWebHashHistory} from 'vue-router'
import PageRouter from './page/'

const routes = [...PageRouter]

const router = createRouter({
    history: createWebHashHistory(process.env.VUE_API_BASE_URL), routes
})

export default router
