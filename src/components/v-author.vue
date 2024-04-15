<template>
    <view class="author-info">
        <uv-avatar
            class="avatar"
            shape="square"
            size="60rpx"
            :src="props.item.avatar"
            @click.stop.prevent="getUserTopic(props.item.author)"
        ></uv-avatar>
        <view class="info">
            <view class="flex">
                <view
                    class="name"
                    @click.stop.prevent="getUserTopic(props.item.author)"
                >
                    {{ props.item.author }}
                </view>
                <view v-if="props.item.is_master" class="op">OP</view>
                <template v-if="item.like_num">
                    <image
                        class="like-icon"
                        src="https://cdn.todayhub.cn/lib/image/like_num.png"
                    >
                    </image>
                    <text class="like-num">
                        {{ item.like_num }}
                    </text>
                </template>
            </view>
            <view class="time">
                {{
                    props.item.last_reply_time ||
                    props.item.publish_time ||
                    props.item.reply_time
                }}
                <template v-if="props.item.replyer">
                    {{ props.item.replyer }} 回复
                </template>
            </view>
        </view>
    </view>
</template>
<script setup>
const props = defineProps(['item']);

function getUserTopic(username) {
    uni.navigateTo({
        url: `/pages/UserTopic?username=${username}`
    });
}
</script>
<style lang="less" scoped>
.author-info {
    display: flex;
    align-items: center;

    .avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 8rpx;
    }
    .info {
        margin-left: 20rpx;
    }

    .flex {
        display: flex;
        align-items: center;
    }

    .name {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #666666;
    }

    .time {
        font-size: 22rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
    }

    .op {
        border: 2rpx solid #1484cd;
        color: #1484cd;
        font-size: 20rpx;
        border-radius: 5rpx;
        font-weight: 500;
        padding: 4rpx 5rpx;
        line-height: 16rpx;
        margin-left: 20rpx;
    }

    .like-icon {
        width: 24rpx;
        height: 24rpx;
        margin-left: 20rpx;
    }

    .like-num {
        font-size: 22rpx;
        color: #999;
        font-weight: 400;
        margin-left: 6rpx;
    }
}
</style>
