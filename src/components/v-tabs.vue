<template>
    <view class="nav-bar-wrap">
        <scroll-view
            :scroll-into-view="'tabid_' + (current - 2)"
            class="scroll-view-content"
            scroll-x="true"
        >
            <view
                v-for="(item, index) in tabs"
                :id="'tabid_' + index"
                :key="index"
                :class="current === index ? 'cur' : ''"
                class="tab"
                @click="emit('change', index)"
            >
                <text>{{ item.name }}</text>
            </view>
        </scroll-view>
    </view>
</template>
<script setup>
import { toRefs } from 'vue';
import { useIndexStore } from '@/stores';
import { storeToRefs } from 'pinia';

const props = defineProps(['current']);

const store = useIndexStore();

const { tabs } = storeToRefs(store);
console.log(tabs.value);
const { current } = toRefs(props);

const emit = defineEmits(['change']);
</script>
<style lang="scss" scoped>
.nav-bar-wrap {
    height: 80rpx;
}
.scroll-view-content {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    border-bottom: 1rpx solid #f5f5f5;
    background: #fff;
    height: 80rpx;
    line-height: 80rpx;
    white-space: nowrap;
    box-sizing: border-box;
    .tab {
        display: inline-block;
        color: #666;
        font-size: 26rpx;
        &:last-child {
            margin-right: 20rpx;
        }
        &:first-child {
            margin-left: 10rpx;
        }
        text {
            margin: 0 20rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            border-bottom: 4rpx solid transparent;
        }
        &.cur {
            font-size: 32rpx;
            font-weight: bold;
            color: $uv-primary;
            text {
                border-bottom: 4rpx solid $uv-primary;
            }
        }
    }
}
</style>
