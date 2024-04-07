<template>
    <view :class="{ visited: item.visited }" class="topic-wrap">
        <AuthorInfo :item="item"></AuthorInfo>
        <view class="title">
            {{ item.title }}
        </view>
        <view class="topic-info">
            <TopicTag :item="item" :noNavigate="!!item.noNavigate"></TopicTag>
            <view class="reply">{{ item.reply_num }}条回复</view>
        </view>
    </view>
</template>
<script setup>
import { toRefs } from 'vue';
import AuthorInfo from '@/components/AuthorInfo';
import TopicTag from '@/components/TopicTag';

const props = defineProps(['item']);
const { item } = toRefs(props);
</script>
<style lang="less" scoped>
.visited {
    opacity: 0.5;
}

.topic-wrap {
    background: #fff;
    padding: 25rpx 30rpx;

    .title {
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 45rpx;
        margin: 10rpx 0;
    }

    .topic-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50rpx;
        margin-top: 10rpx;

        .reply {
            font-size: 22rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
        }
    }
}
</style>
