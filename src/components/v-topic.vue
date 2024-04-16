<template>
    <view :class="{ visited: item.visited }" class="topic-wrap">
        <v-author :item="item"></v-author>
        <view class="title">
            {{ item.title }}
        </view>
        <view class="topic-info">
            <v-tag :item="item"></v-tag>
            <view class="reply" v-if="item.reply_num">
                {{ item.reply_num }}条回复
            </view>
        </view>
    </view>
</template>
<script setup>
import { toRefs } from 'vue';
import VAuthor from '@/components/v-author.vue';
import VTag from '@/components/v-tag.vue';

const props = defineProps(['item']);
const { item } = toRefs(props);
</script>
<style lang="scss" scoped>
.visited {
    opacity: 0.6;
    //filter: opacity(60%);
    position: relative;
    &:after {
        position: absolute;
        content: '朕已阅';
        right: -20rpx;
        top: 0;
        z-index: 10;
        font-size: 20rpx;
        transform: rotateZ(45deg);
        opacity: 0.3;
    }
}

.topic-wrap {
    background: #fff;

    .title {
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: $uv-main-color;
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
            color: $uv-tips-color;
        }
    }
}
</style>
