<template>
    <view class="load-failed">
        <view v-if="props.status" class="reload">
            <image
                class="empty-img"
                src="https://img01.yzcdn.cn/vant/empty-image-error.png"
            >
            </image>
            <view class="empty-desc">{{ tips[index] }}</view>
            <view class="empty-button" @click="$emit('reload')">
                再试一次
            </view>
        </view>
        <view v-else class="reload">
            <image
                class="empty-img"
                src="https://img01.yzcdn.cn/vant/empty-image-default.png"
            >
            </image>
            <view class="empty-desc">暂无记录</view>
        </view>
    </view>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps(['status']);
let tips = ref([
    '加载失败',
    '要不再试一次？',
    '网络不太好',
    '再给我一次机会',
    '你让我再试一次',
    '要不算了吧'
]);
let index = ref(Math.floor(Math.random() * tips.value.length));
</script>
<style lang="less" scoped>
.load-failed {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn-default {
        margin: 20rpx auto;
        width: 240rpx;
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 60rpx;
        color: #fff;
        text-align: center;
        background: #4474ff;
        font-size: 24rpx;
    }
    .reload {
        text-align: center;
        margin-top: -300rpx;
        .empty-img {
            width: 300rpx;
            height: 300rpx;
        }
        .empty-desc {
            margin: 20rpx 0;
            color: #969799;
            font-size: 24rpx;
            line-height: 20rpx;
        }
        .empty-button {
            .btn-default;
        }
    }
}
</style>
