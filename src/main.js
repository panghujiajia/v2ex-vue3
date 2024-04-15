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
        // 修改$uv.config对象的属性
        config: {
            // 修改默认单位为rpx，相当于执行 uni.$uv.config.unit = 'rpx'
            unit: 'px'
        },
        // 修改$uv.props对象的属性
        props: {
            // 修改uv-text组件的size参数的默认值，注意：默认值都要用default声明
            text: {
                color: {
                    default: 'red'
                }
            }
            // 其他组件属性配置，具体的参数名称可以去每个组件的props.js中进行查看
            // ......
        }
    });
    return {
        app,
        pinia
    };
}
