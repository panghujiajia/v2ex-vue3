import Request from 'luch-request';
import environments from '../environments';
import { useStore } from '../store';
import { storeToRefs } from 'pinia';

const createInterceptor = instance => {
    instance.interceptors.request.use(
        config => {
            // 可使用async await 做异步操作
            console.log(config);
            if (config.custom.loading) {
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                });
            }
            // 判断接口是否需要token
            if (config.custom.auth) {
                const store = useStore();
                let { cookie, userInfo } = storeToRefs(store);
                if (!cookie.value) {
                    if (userInfo.value.username) {
                        uni.showToast({
                            title: '用户登录信息失效，请重新登录',
                            icon: 'none'
                        });
                    }
                    // 如果token不存在，return Promise.reject(config) 会取消本次请求
                    return Promise.reject(config);
                }
                config.header.token = cookie.value;
            }
            return config;
        },
        config => {
            // 可使用async await 做异步操作
            if (config.custom.loading) {
                uni.hideLoading();
            }
            uni.showToast({
                title: '请求错误，请稍后再试',
                icon: 'none'
            });
            return Promise.reject(config);
        }
    );
    instance.interceptors.response.use(
        response => {
            if (response.config.custom.loading) {
                uni.hideLoading();
            }
            /* 对响应成功做点什么 可使用async await 做异步操作*/
            // if (response.config.custom.verification) { // 演示自定义参数的作用
            //   return response.data
            // }
            return response;
        },
        response => {
            if (response.config.custom.loading) {
                uni.hideLoading();
            }
            /*  对响应错误做点什么 （statusCode !== 200）*/
            console.log('error response:', response);
            const { statusCode } = response;
            if (statusCode === 403) {
                uni.showToast({
                    title: '登录失效，请重新登录',
                    icon: 'none'
                });
            } else {
                uni.showToast({
                    title: '网络错误，请稍后再试',
                    icon: 'none'
                });
            }
            return Promise.reject(response);
        }
    );
};

export const $http = new Request({
    baseURL: environments.url,
    timeout: 10000,
    custom: {
        loading: true // 是否需要loading
    }
});
createInterceptor($http);
