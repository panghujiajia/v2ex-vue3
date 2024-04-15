<template>
    <view :class="props.item.author" class="wrap">
        <view class="user-info">
            <v-author :item="props.item"></v-author>
            <view class="floor">{{ props.item.index }}楼</view>
        </view>
        <view class="md-wrap">
            <view class="quote-wrap" v-if="props.item.quote">
                <MarkDown :content="props.item.quote"></MarkDown>
            </view>
            <MarkDown :content="props.item.content"></MarkDown>
        </view>
    </view>
</template>
<script setup>
import VAuthor from '@/components/v-author.vue';
import MarkDown from '@/components/MarkDown.vue';

const props = defineProps(['item']);
</script>
<style lang="scss" scoped>
.wrap {
    padding-top: 20rpx;
}
.user-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10rpx;
    .floor {
        color: $uv-tips-color;
        font-size: 22rpx;
    }
}
.md-wrap {
    margin-left: 80rpx;
    border-bottom: 1px solid $uv-bg-color;
    padding-bottom: 20rpx;
}

.quote-wrap {
    background: $uv-bg-color;
    padding: 20rpx 20rpx 0;
    margin-bottom: 20rpx;
}
</style>
