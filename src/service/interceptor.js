import { createAlova } from 'alova';
import AdapterUniapp from '@alova/adapter-uniapp';
import { storeToRefs } from 'pinia';
import { useIndexStore } from '@/stores';
import { wait } from '@/hooks';

const instOption = {
    ...AdapterUniapp(),
    timeout: 30 * 1000,
    beforeRequest(method) {
        if (method.meta.loading) {
            uni.showLoading({
                title: '加载中...',
                mask: true
            });
        }
        if (!method.meta.ignoreToken) {
            const { cookie, userInfo } = storeToRefs(useIndexStore());
            if (!cookie.value) {
                if (userInfo.value.username) {
                    uni.showToast({
                        title: '登录失效，请重新登录',
                        icon: 'none'
                    });
                }
                return Promise.reject(false);
            }
            method.config.headers.token = cookie.value;
        }
    },
    responded: {
        onSuccess: async (response, method) => {
            if (method.meta.loading) {
                uni.hideLoading();
            }
            if (response.data.statusCode === 403) {
                uni.showToast({
                    title: '登录失效，请重新登录',
                    icon: 'none'
                });
                return Promise.reject(false);
            }
            if (response.data.status !== 200) {
                uni.showToast({
                    title: '网络错误，请稍后再试',
                    icon: 'none',
                    mask: true
                });
                return Promise.reject(false);
            }
            if (method.meta.showResultMsg) {
                uni.showToast({
                    title: response.data.msg || '操作成功',
                    icon: 'none',
                    mask: true
                });
                await wait();
            }
            return response.data.data;
        },
        onError: (error, method) => {
            console.log('onError', error);
            if (method.meta.loading) {
                uni.hideLoading();
            }
            return Promise.reject(false);
        },
        onComplete: event => {
            // console.log(event);
            if (event.meta.loading && event.config.localCache) {
                uni.hideLoading();
            }
        }
    },
    errorLogger: true,
    cacheLogger: import.meta.env.DEV
};
export const $http = createAlova({
    ...instOption,
    baseURL: import.meta.env.VITE_BASE_URL
});
