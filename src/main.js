import { createSSRApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia';
import { storePlugin } from '@/stores/storePlugin';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import uvUI from '@climblee/uv-ui';
export function createApp() {
    const app = createSSRApp(App);
    const pinia = createPinia();
    pinia.use(storePlugin);
    pinia.use(piniaPluginPersistedstate);
    app.use(pinia);
    app.use(uvUI);
    uni.$uv.setConfig({
        // 修改$uv.props对象的属性
        props: {
            // 修改uv-text组件的size参数的默认值，注意：默认值都要用default声明
            text: {
                color: {
                    default: 'red'
                }
            }
        }
    });
    return {
        app,
        pinia
    };
}
