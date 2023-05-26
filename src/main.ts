import { createApp } from 'vue';
import App from './App.vue';

/**** icon 相关 ****/
import 'virtual:svg-icons-register';
import '@purge-icons/generated'
/**** icon 相关 ****/

import './styles/index.scss'
import 'uno.css'

// 只有在 .vue 之外的文件中需要引入
// import 'element-plus/theme-chalk/src/message.scss';

import { setupStore } from './store';

import { setupRouter } from './router';

const setupAll = async () => {
    const app = createApp(App);

    // app.use(ElementPlus)

    setupStore(app);

    setupRouter(app);

    app.mount('#app');
};

setupAll();
