<template>
    <view class="container">
        <view>
            本项目技术栈为uni-app+vue3+pinia+alova
            <text class="link" @click="setClipboard(wechat, 'wechat')">
                微信号
            </text>
            联系我。
        </view>
        <view>
            <text class="link" @click="setClipboard(v2exVue3, 'github')">
                前端代码(vue3重构版)
            </text>
            <text class="link" @click="setClipboard(v2exApi, 'github')">
                后端代码
            </text>
        </view>
    </view>
</template>
<script setup>
import { ref } from 'vue';

let v2exVue2 = ref('https://github.com/panghujiajia/v2ex.git');
let v2exVue3 = ref('https://github.com/panghujiajia/v2ex-vue3.git');
let v2exApi = ref('https://github.com/panghujiajia/v2ex-api-nestjs.git');
let wechat = ref('GooodTimes');

function setClipboard(data, type) {
    uni.setClipboardData({
        data,
        success: () => {
            uni.showToast({
                title: type === 'github' ? 'Github地址已复制' : '微信号已复制',
                icon: 'none'
            });
        }
    });
}

function previewImg(url) {
    uni.previewImage({
        urls: [url]
    });
}
</script>
<style lang="less" scoped>
.container {
    background: #fff;
    padding: 30rpx;
    view {
        font-size: 32rpx;
        color: #666;
        line-height: 50rpx;
        margin-bottom: 20rpx;
    }
    .link {
        color: #0969da;
        font-weight: bold;
        font-size: 34rpx;
        margin: 0 10rpx;
        text-decoration: underline;
    }
    .payment-img {
        width: 500rpx;
        height: 500rpx;
        display: block;
        margin: 30rpx auto;
    }
}
</style>
