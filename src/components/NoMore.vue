<template>
    <view class="no-more">
        <slot>{{ tips[index] }}</slot>
    </view>
</template>
<script setup>
import { ref } from 'vue';

let tips = ref([
    '没有了哦',
    '去看看别的吧',
    '休息一下',
    '让眼睛放松一下',
    '无了',
    '就到这吧',
    '你的快递拿了吗'
]);
let index = ref(Math.floor(Math.random() * tips.value.length));
</script>
<style lang="less" scoped>
.no-more {
    background: #fff;
    text-align: center;
    padding: 20rpx 0;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    font-size: 22rpx;
}
</style>
