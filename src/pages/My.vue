<template>
    <scroll-view
        :scroll-y="true"
        class="scroll-view"
        @touchmove.prevent.stop="
            () => {
                return false;
            }
        "
    >
        <view v-if="toastTitle" class="toast">{{ toastTitle }}</view>
        <view class="top-wrap">
            <view class="header">
                <view class="header-info">
                    <view class="avatar" @click="showTip()">
                        <image
                            :src="
                                userInfo.avatar ||
                                'https://cdn.todayhub.cn/lib/image/img-user-avatar.png'
                            "
                        />
                    </view>
                    <view class="info">
                        <view>
                            <view class="nick-name" @click="showTip()">
                                {{ userInfo.username || '点击登录' }}
                            </view>
                            <view v-if="cookie" class="rank">
                                {{ userInfo.info || '' }}
                            </view>
                            <view v-if="cookie" class="rank">
                                {{ userInfo.sign_in_day || '' }}
                            </view>
                        </view>
                        <view v-if="cookie" class="money">
                            <template v-if="userInfo.balance">
                                <template
                                    v-for="(item, index) in userInfo.balance"
                                >
                                    <view v-if="item">
                                        <image
                                            :src="`https://cdn.todayhub.cn/lib/image/icon-balance${
                                                userInfo.balance.length - index
                                            }.png`"
                                        ></image>
                                        <text>{{ item }}</text>
                                    </view>
                                </template>
                            </template>
                        </view>
                    </view>
                </view>
                <view v-if="userInfo.is_sign_in" class="btn-sign disabled">
                    已签到
                </view>
                <view v-else class="btn-sign" @click="getSignIn()"> 签到 </view>
            </view>
        </view>
        <uv-cell-group
            :border="false"
            customStyle="background:#fff;margin: -250rpx 30rpx 0;border-radius: 20rpx;"
        >
            <uv-cell
                isLink
                size="large"
                title="访问记录"
                @click="navigateTo('history')"
            >
                <template v-slot:icon>
                    <uv-icon
                        name="shijian"
                        size="20"
                        custom-prefix="v2ex"
                    ></uv-icon>
                </template>
            </uv-cell>
            <uv-cell
                isLink
                @click="navigateTo('topic', true)"
                size="large"
                title="我的主题"
            >
                <template v-slot:icon>
                    <uv-icon
                        name="audit"
                        size="20"
                        custom-prefix="v2ex"
                    ></uv-icon>
                </template>
            </uv-cell>
            <uv-cell
                isLink
                size="large"
                title="我的回复"
                @click="navigateTo('reply', true)"
            >
                <template v-slot:icon>
                    <uv-icon
                        name="qianshuxieyi"
                        size="20"
                        custom-prefix="v2ex"
                    ></uv-icon>
                </template>
            </uv-cell>
            <uv-cell
                isLink
                size="large"
                title="我的消息"
                @click="navigateTo('message', true)"
                :border="false"
            >
                <template v-slot:icon>
                    <uv-icon
                        name="xiaoxi-zhihui"
                        size="20"
                        custom-prefix="v2ex"
                    ></uv-icon>
                </template>
                <template v-slot:value>
                    <uv-badge
                        type="error"
                        max="99"
                        :value="notifications"
                    ></uv-badge>
                </template>
            </uv-cell>
        </uv-cell-group>
        <uv-gap height="20"></uv-gap>
        <uv-cell-group
            :border="false"
            customStyle="background:#fff;margin: 0 30rpx;border-radius: 20rpx;box-shadow: 0 5rpx 20rpx #dedede;"
        >
            <uv-cell size="large" title="自动签到">
                <template v-slot:icon>
                    <uv-icon
                        name="zhiwen"
                        size="20"
                        custom-prefix="v2ex"
                    ></uv-icon>
                </template>
                <template v-slot:value>
                    <uv-switch
                        size="20"
                        v-model="autoSign"
                        activeColor="#02B386"
                    ></uv-switch>
                </template>
            </uv-cell>
            <uv-cell
                v-if="cookie"
                @click="logout()"
                size="large"
                title="退出"
                :border="false"
            >
                <template v-slot:icon>
                    <uv-icon
                        name="logout"
                        size="20"
                        custom-prefix="v2ex"
                    ></uv-icon>
                </template>
            </uv-cell>
            <uv-cell
                v-else
                @click="login()"
                size="large"
                title="登录"
                :border="false"
            >
                <template v-slot:icon>
                    <uv-icon
                        name="login"
                        size="20"
                        custom-prefix="v2ex"
                    ></uv-icon>
                </template>
            </uv-cell>
        </uv-cell-group>
        <!-- #ifdef MP-WEIXIN -->
        <ad unit-id="adunit-5dede007095ed080"></ad>
        <!-- #endif -->
    </scroll-view>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useIndexStore } from '@/stores';

const store = useIndexStore();

let { autoSign, cookie, toastTitle, notifications, v2exConfig, userInfo } =
    storeToRefs(store);

function getSignIn() {
    if (!cookie.value) {
        uni.showToast({
            title: '您需要登录才能进行签到哦！',
            icon: 'none'
        });
        return;
    }
    store.getLoginReward();
}

function logout() {
    if (cookie.value) {
        uni.showModal({
            title: '确定退出吗？',
            success: res => {
                console.log(res);
                if (res.confirm) {
                    store.saveCookie('');
                    store.saveNotifications(0);
                    login();
                }
            }
        });
    } else {
        uni.showToast({
            title: '没登录',
            icon: 'none'
        });
    }
}
function login() {
    uni.navigateTo({ url: '/pages/Login' });
}
function onAutoSignChange() {
    uni.vibrateShort({});
    if (!cookie.value) {
        uni.showToast({
            title: '登录后才能为您自动签到哦！',
            icon: 'none'
        });
        return;
    }
    store.toggleAutoSign(!autoSign.value);
}
function showTip() {
    if (!cookie.value) {
        login();
        return;
    }
    if (toastTitle.value) {
        return;
    }
    let len = v2exConfig.value.toast.length;
    if (len) {
        toastTitle.value =
            v2exConfig.value.toast[Math.round(Math.random() * len)];
        setTimeout(() => {
            toastTitle.value = '';
        }, 5000);
    }
}
function navigateTo(key, auth = false) {
    if (auth && !cookie.value) {
        uni.showToast({
            title: '您需要登录才能访问哦！',
            icon: 'none'
        });
        return;
    }
    const urlList = {
        history: '/pages/History',
        topic: '/pages/UserTopic',
        reply: '/pages/UserReply',
        message: '/pages/UserMessage',
        collect: '/pages/MyCollect',
        about: '/pages/About'
    };
    if (!key) {
        uni.showToast({
            title: '...',
            icon: 'none'
        });
        return;
    }
    const url = urlList[key];
    if (['reply', 'topic'].includes(key)) {
        uni.navigateTo({
            url: `${url}?username=${userInfo.value.username}`
        });
        return;
    }
    uni.navigateTo({ url });
}
</script>
<style lang="less" scoped>
.scroll-view {
    background: #efefef;
    box-sizing: border-box;
    position: relative;
    height: 100%;
    .toast {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translateX(-310rpx);
        z-index: 99999;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 20rpx;
        padding: 20rpx;
        color: #fff;
        font-size: 28rpx;
        width: 620rpx;
        box-sizing: border-box;
    }
    .top-wrap {
        height: 600rpx;
        background: url(https://cdn.todayhub.cn/lib/image/bg-user-center.png)
            50% no-repeat;
        background-size: 100%;
        .header {
            height: 400rpx;
            padding: 0 30rpx;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .header-info {
                display: flex;
            }
            .avatar {
                width: 180rpx;
                height: 180rpx;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 30rpx;
                image {
                    width: 180rpx;
                    height: 180rpx;
                }
            }
            .info {
                width: 330rpx;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .nick-name {
                    font-size: 40rpx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #ffffff;
                    line-height: 56rpx;
                }
                .rank {
                    font-size: 24rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #ffffff;
                    line-height: 33rpx;
                    margin: 10rpx 0;
                }
                .money {
                    height: 40rpx;
                    display: flex;
                    align-items: center;
                    margin-top: 30rpx;
                    color: #fff;
                    font-size: 24rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    view {
                        display: flex;
                        align-items: center;
                        margin-right: 15rpx;
                    }
                    image {
                        width: 34rpx;
                        height: 34rpx;
                        margin-right: 5rpx;
                    }
                }
            }
            .btn-sign {
                width: 143rpx;
                height: 51rpx;
                background: #ffc413;
                border-radius: 26rpx;
                font-size: 28rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                line-height: 51rpx;
                text-align: center;
                &.disabled {
                    background: #c3c3c3;
                }
            }
        }
    }
}
</style>
