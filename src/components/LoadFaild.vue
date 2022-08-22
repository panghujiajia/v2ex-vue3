<template>
    <view class="load-failed">
        <view v-if="props.status" class="reload">
            <image
                class="empty-img"
                src="https://img01.yzcdn.cn/vant/empty-image-error.png"
            >
            </image>
            <view class="empty-desc">加载失败</view>
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
const props = defineProps(['status']);
</script>
<style lang="less" scoped>
.load-failed {
    position: fixed;
    height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn-default {
        margin: 20px auto;
        width: 240px;
        height: 60px;
        line-height: 60px;
        border-radius: 60px;
        color: #fff;
        text-align: center;
        background: #4474ff;
        font-size: 24px;
    }
    .reload {
        text-align: center;
        margin-top: -300px;
        .empty-img {
            width: 300px;
            height: 300px;
        }
        .empty-desc {
            margin: 20px 0;
            color: #969799;
            font-size: 24px;
            line-height: 20px;
        }
        .empty-button {
            .btn-default;
        }
    }
}
</style>
