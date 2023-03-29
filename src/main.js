import {createApp} from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// highlightjs
import hljs from 'highlight.js';
//按需引入vant
import 'vant/lib/index.css'
import {Toast, Button, Field, Popup, Slider, Switch} from "vant"
VMdPreview.use(githubTheme, {
    Hljs: hljs,
});

axios.defaults.headers = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + '替换成自己的apikey'
};

const app = createApp(App)
app.use(router).use(store).use(Toast).use(Button).use(Field).use(Popup).use(Slider).use(Switch).use(VMdPreview)
app.mount('#app')
