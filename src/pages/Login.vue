<template>
    <view class="container">
        <view class="top">
            <view class="title">
                <view>V2EX</view>
                <view>创意工作者们的社区</view>
            </view>
        </view>
        <view class="cell-group">
            <view class="cell">
                <view class="label">用户名</view>
                <input
                    :value="username"
                    class="form-item"
                    placeholder="请输入用户名"
                    @input="getUsername"
                />
            </view>
            <view class="cell">
                <view class="label">密码</view>
                <input
                    :value="password"
                    class="form-item"
                    placeholder="请输入密码"
                    type="password"
                    @input="getPassword"
                />
            </view>
            <view class="cell code-cell">
                <view class="label">验证码</view>
                <view class="form-item">
                    <input
                        :value="code"
                        class="form-item"
                        placeholder="请输入验证码"
                        @input="getCode"
                    />
                    <image
                        :src="
                            captchaBase64 ||
                            'https://cdn.todayhub.cn/lib/image/code-loading.gif'
                        "
                        class="code"
                        @click="getLoginParams()"
                    />
                </view>
            </view>
            <view class="promise">
                我发誓，没有记录您任何信息，所有内容均存储在本地
            </view>
            <view class="btn-default" @click="login()">登录</view>
        </view>
    </view>
</template>
<script setup>
import { useStore } from '../store';
import { storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { $getLoginParams, $login } from '../service';
const store = useStore();

let { cookie, userInfo } = storeToRefs(store);

// 登录页面拿的参数
let signinData = ref({
    username_key: '',
    password_key: '',
    code_key: '',
    once: '',
    cookie: ''
});
// 验证码的base64
let captchaBase64 = ref('');
let code = ref('');
let username = ref('');
let password = ref('');
onShow(() => {
    getLoginParams();
});
async function getLoginParams() {
    captchaBase64.value = '';
    username.value = userInfo.value.username || username.value || '';
    password.value = userInfo.value.password || password.value || '';
    code.value = '';
    const data = await $getLoginParams();
    if (data) {
        const { codeUrl } = data;
        signinData.value = data;
        captchaBase64.value =
            'data:image/png;base64,' +
            uni.arrayBufferToBase64(new Uint8Array(codeUrl.data));
    } else {
        getLoginParams();
    }
}
// 获取输入的验证码
function getCode(e) {
    code.value = e.detail.value;
}
// 获取输入的账号
function getUsername(e) {
    username.value = e.detail.value;
}
// // 获取输入的密码
function getPassword(e) {
    password.value = e.detail.value;
}
// 登录请求
async function login() {
    const { username_key, password_key, code_key, once, cookie } =
        signinData.value;
    if (!username.value) {
        uni.showToast({
            title: '请输入用户名',
            icon: 'none'
        });
        return;
    }
    if (!password.value) {
        uni.showToast({
            title: '请输入密码',
            icon: 'none'
        });
        return;
    }
    if (!code.value) {
        uni.showToast({
            title: '请输入验证码',
            icon: 'none'
        });
        return;
    }
    const params = {
        [username_key]: username.value,
        [password_key]: password.value,
        [code_key]: code.value,
        cookie,
        once,
        next: '/'
    };
    uni.showLoading({
        title: '登录中...',
        mask: true
    });
    const data = await $login(params);
    if (data) {
        uni.showToast({
            title: '登录成功，即将自动跳转',
            icon: 'none',
            mask: true,
            duration: 1000 * 30
        });
        store.saveCookie(cookie + ';' + data);
        store.saveUserInfo({
            username: username.value,
            password: password.value
        });
        await store.getUserInfo();
        await store.getUserBalance();
        await store.getLoginRewardInfo();
        uni.hideToast();
        uni.navigateBack({
            delta: 1
        });
    } else {
        uni.showToast({
            title: '登录失败，请重试',
            icon: 'none'
        });
        getLoginParams();
    }
}
</script>
<style lang="less" scoped>
.container {
    height: 100%;
    background: #efefef;
    box-sizing: border-box;
    .top {
        height: 600rpx;
        background: url(https://cdn.todayhub.cn/lib/image/bg-user-center.png)
            50% no-repeat;
        background-size: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .title {
            width: 690rpx;
            height: 400rpx;
            line-height: 70rpx;
            color: #fff;
            view {
                font-size: 48rpx;
                font-weight: bold;
            }
        }
    }
}
.cell-group {
    margin: 0 30rpx;
    margin-top: -250rpx;
    border-radius: 16rpx 16rpx 0 0;
    position: relative;
    box-sizing: border-box;
    z-index: 2;
    height: calc(100% - 350rpx);
    background: #fff;
    .cell {
        display: flex;
        align-items: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100rpx;
        line-height: 100rpx;
        padding: 0 30rpx 0 40rpx;
        box-sizing: border-box;
        border-bottom: 1rpx solid #f0f0f0;
        color: #282828;
        font-size: 32rpx;
        &.code-cell {
            padding-right: 0;
        }
        .label {
            width: 100rpx;
            padding-right: 36rpx;
            text-align: right;
            color: #33374d;
            font-size: 32rpx;
        }
        .form-item {
            height: 100%;
            flex: 1;
            font-size: 32rpx;
            display: flex;
            align-items: center;
            input {
                flex: 1;
            }
            .code {
                width: 280rpx;
                height: 100rpx;
            }
        }
    }
}
.promise {
    color: #999;
    font-size: 22rpx;
    line-height: 40rpx;
    padding: 10rpx 20rpx;
    margin-top: 15rpx;
}
.btn-default {
    width: 660rpx;
    border-radius: 10rpx;
    margin-top: 15rpx;
}
</style>
