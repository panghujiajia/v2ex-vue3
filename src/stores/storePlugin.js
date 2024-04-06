import { createPersistedState } from 'pinia-plugin-persistedstate';

export const storePlugin = createPersistedState({
    storage: {
        getItem(key) {
            return uni.getStorageSync(key);
        },
        setItem(key, value) {
            uni.setStorageSync(key, value);
        }
    }
});
