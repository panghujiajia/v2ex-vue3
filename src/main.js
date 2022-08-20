import { createSSRApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { storePlugin } from './store/storePlugin';

const pinia = createPinia();
// pinia.use(piniaPluginPersistedstate);
pinia.use(storePlugin);
export function createApp() {
    const app = createSSRApp(App);
    app.use(pinia);
    return {
        app
    };
}
