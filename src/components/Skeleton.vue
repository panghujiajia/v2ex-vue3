<template>
    <view class="sleletion-wrap">
        <view v-for="item in props.type === 'list' ? 10 : 1" class="topic-wrap">
            <view class="author-info">
                <view class="skeleton avatar"></view>
                <view class="skeleton name"></view>
                <view class="skeleton time"></view>
            </view>
            <view class="title">
                <view class="skeleton line1"></view>
                <view class="skeleton line2"></view>
            </view>
            <view class="topic-info">
                <view class="skeleton type"></view>
                <view class="skeleton reply"></view>
            </view>
        </view>
        <template v-if="props.type !== 'list'">
            <view class="divider">
                <view class="skeleton total"></view>
            </view>
            <view v-for="item in 10" class="reply-wrap">
                <view class="author-info">
                    <view class="info">
                        <view class="skeleton avatar"></view>
                        <view class="skeleton name"></view>
                        <view class="skeleton time"></view>
                    </view>
                    <view class="skeleton floor"></view>
                </view>
                <view class="title">
                    <view class="skeleton line1"></view>
                    <view class="skeleton line2"></view>
                </view>
            </view>
        </template>
    </view>
</template>
<script setup>
const props = defineProps({
    type: {
        default: 'list',
        type: String
    }
});
</script>
<style lang="less" scoped>
.sleletion-wrap {
    overflow: hidden;
    height: 100%;
}
.author-info {
    display: flex;
    align-items: center;
    .avatar {
        width: 35rpx;
        margin-right: 10rpx;
        border-radius: 5rpx;
    }
    .name {
        width: 100rpx;
        margin-right: 20rpx;
    }
    .time {
        width: 80rpx;
    }
}
.title {
    margin-top: 15rpx;
    .line1 {
        width: 100%;
    }
    .line2 {
        width: 80%;
        margin-top: 10rpx;
    }
}
.topic-wrap {
    background: #fff;
    padding: 25rpx 30rpx;
    .topic-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 35rpx;
        margin-top: 10rpx;
        .type {
            width: 150rpx;
            border-radius: 25rpx;
        }
        .reply {
            width: 100rpx;
        }
    }
}
.reply-wrap {
    padding: 25rpx 30rpx;
    margin-top: 10rpx;
    .author-info {
        justify-content: space-between;
        .info {
            display: flex;
            align-items: center;
        }
        .floor {
            width: 50rpx;
        }
    }
}
.divider {
    padding: 0 30rpx 10rpx;
    .total {
        height: 30rpx;
    }
}
.skeleton {
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    height: 35rpx;
    animation: skeleton-loading 2.8s ease infinite;
}
@keyframes skeleton-loading {
    0% {
        background-position: 100% 50%;
    }
    50% {
        background-position: 0 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
</style>
