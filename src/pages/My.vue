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
        <view class="cell-group">
            <view
                class="cell van-hairline--bottom"
                @click="navigateTo('history')"
            >
                <view>访问记录</view>
                <view class="icon-arrow"></view>
            </view>
            <view
                class="cell van-hairline--bottom"
                @click="navigateTo('topic', true)"
            >
                <view>我的主题</view>
                <view class="icon-arrow"></view>
            </view>
            <view
                class="cell van-hairline--bottom"
                @click="navigateTo('reply', true)"
            >
                <view>我的回复</view>
                <view class="icon-arrow"></view>
            </view>
            <view
                class="cell van-hairline--bottom"
                @click="navigateTo('message', true)"
            >
                <view>我的消息</view>
                <view class="dot-wrap">
                    <view v-if="notifications" class="dot">
                        {{ notifications }}
                    </view>
                    <view class="icon-arrow"></view>
                </view>
            </view>
            <!--            <view-->
            <!--                class="cell van-hairline&#45;&#45;bottom"-->
            <!--                @click="navigateTo('collect', true)"-->
            <!--            >-->
            <!--                <view>我的收藏</view>-->
            <!--                <view class="icon-arrow"></view>-->
            <!--            </view>-->
            <view class="cell van-hairline--bottom">
                <view>自动签到</view>
                <switch
                    :checked="autoSign"
                    color="#ffc413"
                    disabled
                    @click="onAutoSignChange"
                />
            </view>
            <view class="cell van-hairline--bottom">
                <view>
                    <view>站内链接跳转</view>
                    <view class="tip">
                        点击"/t/1024、/go/v2ex"，打开对应帖子、节点
                    </view>
                </view>
                <switch
                    :checked="autoNavigate"
                    color="#ffc413"
                    disabled
                    @click="onAutoNavigateChange"
                />
            </view>
            <!--            <view class="cell van-hairline&#45;&#45;bottom">-->
            <!--                <view>-->
            <!--                    <view>使用我的代理</view>-->
            <!--                    <view class="tip">直接请求v2ex官网，速度更快</view>-->
            <!--                </view>-->
            <!--                <switch-->
            <!--                    :checked="autoNavigate"-->
            <!--                    color="#ffc413"-->
            <!--                    @change="onAutoNavigateChange"-->
            <!--                />-->
            <!--            </view>-->
            <view
                v-if="cookie"
                class="cell van-hairline--bottom"
                @click="login()"
            >
                <view>重新登录</view>
                <view class="icon-arrow"></view>
            </view>
            <!--            <view-->
            <!--                class="cell van-hairline&#45;&#45;bottom"-->
            <!--                @click="navigateTo('about')"-->
            <!--            >-->
            <!--                <view>关于</view>-->
            <!--                <view class="icon-arrow"></view>-->
            <!--            </view>-->
            <!-- #ifdef MP-WEIXIN -->
            <ad unit-id="adunit-5dede007095ed080"></ad>
            <!-- #endif -->
        </view>
    </scroll-view>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useIndexStore } from '@/stores';

const store = useIndexStore();

let {
    autoSign,
    autoNavigate,
    cookie,
    currentTabBar,
    toastTitle,
    notifications,
    v2exConfig,
    userInfo
} = storeToRefs(store);

function onAutoNavigateChange() {
    uni.vibrateShort({});
    store.toggleAutoNavigate(!autoNavigate.value);
}

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
.dot-wrap {
    display: flex;
    align-items: center;
    .dot {
        border-radius: 20rpx;
        padding: 0 16rpx;
        background: #fa5151;
        color: #fff;
        font-size: 22rpx;
        font-weight: bold;
    }
}
.cell-group {
    background: #fff;
    margin: 0 30rpx;
    margin-top: -250rpx;
    border-radius: 16rpx 16rpx 0 0;
    position: relative;
    box-sizing: border-box;
    z-index: 2;
    .tip {
        color: #999;
        font-size: 22rpx;
    }
    .icon-arrow {
        position: relative;
        width: 20rpx;
        height: 20rpx;
        &:after,
        &:before {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            width: 2rpx;
            height: 12rpx;
            border-radius: 2rpx;
            background: #ccc;
            transform: rotateZ(-45deg);
        }
        &:after {
            top: 8rpx;
            transform: rotateZ(45deg);
        }
    }
    .cell {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100rpx;
        padding: 0 30rpx 0 40rpx;
        box-sizing: border-box;
        border-bottom: 1rpx solid #f0f0f0;
        color: #282828;
        font-size: 32rpx;
        /deep/.uni-switch-input {
            transform: scale(0.7);
            margin-right: -10rpx;
            &:after {
                box-shadow: 0 0 4rpx rgb(0 0 0 / 40%);
                height: 100%;
            }
            &:before {
                height: 100%;
                width: 100%;
                background: #fff;
            }
            opacity: 1;
        }
        text {
            font-size: 24rpx;
            color: #999;
            line-height: 100rpx;
        }
        &:last-child {
            border-bottom: 0 none;
        }
    }
}
</style>
