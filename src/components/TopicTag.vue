<template>
    <view class="tag-wrap" @click.stop.prevent="getTags(props.item)">
        <text class="symbol">#</text>
        <text>{{ props.item.tag_name }}</text>
    </view>
</template>
<script setup>
const props = defineProps({
    item: Object,
    noNavigate: {
        type: Boolean,
        default: false
    }
});
function getTags(tag) {
    if (props.noNavigate) {
        uni.showToast({
            title: '禁止套娃',
            icon: 'none'
        });
        return;
    }
    uni.navigateTo({
        url: `/pages/Tag?value=${tag.tag_link}&title=${tag.tag_name}`
    });
}
</script>
<style lang="less" scoped>
.tag-wrap {
    padding: 0 20rpx;
    height: 50rpx;
    background: #f6f6f6;
    border-radius: 25rpx;
    display: flex;
    align-items: center;
    text {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        &.symbol {
            color: #4474ff;
            margin-right: 5rpx;
        }
    }
}
</style>
