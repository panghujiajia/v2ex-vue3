<template>
    <view class="author-info">
        <image
            :src="props.item.avatar"
            class="avatar"
            @click="getUserTopic(props.item.author)"
        ></image>
        <view class="name" @click="getUserTopic(props.item.author)">
            {{ props.item.author }}
        </view>
        <view class="time">
            {{
                props.item.last_reply_time ||
                props.item.publish_time ||
                props.item.reply_time
            }}
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
        width: 30rpx;
        height: 30rpx;
        margin-right: 10rpx;
        border-radius: 5rpx;
    }
    .name {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #666666;
        margin-right: 20rpx;
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
        border-radius: 7rpx;
        font-weight: 500;
        padding: 5rpx;
        line-height: 16rpx;
        margin-left: 10rpx;
    }
    .like-icon {
        width: 20rpx;
        height: 20rpx;
        margin-left: 10rpx;
        margin-right: 5rpx;
    }
    .like-num {
        font-size: 22rpx;
        color: #999;
        font-weight: 400;
    }
}
</style>
