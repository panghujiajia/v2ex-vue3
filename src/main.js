import { createSSRApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia';
import { storePlugin } from '@/stores/storePlugin';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export function createApp() {
    const app = createSSRApp(App);
    const pinia = createPinia();
    pinia.use(storePlugin);
    pinia.use(piniaPluginPersistedstate);
    app.use(pinia);
    return {
        app,
        pinia
    };
}
