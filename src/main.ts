
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


import App from '../plat/pages/App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.mount('#app')
