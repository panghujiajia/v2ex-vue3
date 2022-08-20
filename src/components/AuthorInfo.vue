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
        width: 30px;
        height: 30px;
        margin-right: 10px;
        border-radius: 5px;
    }
    .name {
        font-size: 28px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #666666;
        margin-right: 20px;
    }
    .time {
        font-size: 22px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
    }
    .op {
        border: 2px solid #1484cd;
        color: #1484cd;
        font-size: 20px;
        border-radius: 7px;
        font-weight: 500;
        padding: 5px;
        line-height: 16px;
        margin-left: 10px;
    }
    .like-icon {
        width: 20px;
        height: 20px;
        margin-left: 10px;
        margin-right: 5px;
    }
    .like-num {
        font-size: 22px;
        color: #999;
        font-weight: 400;
    }
}
</style>
