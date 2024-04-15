<template>
    <view class="section">
        <uv-text type="info" bold :text="props.title" />
        <uv-text type="info" size="14" :text="props.subTitle" />
    </view>
</template>
<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: false
    }
});
</script>
<style lang="scss" scoped>
.section {
    position: relative;
    padding-left: 20rpx;
    &:before {
        content: '';
        width: 6rpx;
        height: 25rpx;
        top: 3px;
        left: 0;
        border-radius: 4rpx;
        background: $uv-primary;
        position: absolute;
    }
}
</style>
