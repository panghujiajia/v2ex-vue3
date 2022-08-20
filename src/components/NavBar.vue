<template>
    <view>
        <scroll-view
            :scroll-into-view="'tabid_' + (current - 2)"
            class="scroll-view-content"
            scroll-x="true"
        >
            <view
                v-for="(item, index) in list"
                :id="'tabid_' + index"
                :key="index"
                :class="current === index ? 'cur' : ''"
                class="item"
                @click="onClick(index)"
            >
                <text>{{ item.title }}</text>
            </view>
        </scroll-view>
        <view class="placeholder-box"></view>
    </view>
</template>
<script setup>
import { toRefs } from 'vue';

const props = defineProps(['list', 'current']);

const { list, current } = toRefs(props);

const emit = defineEmits(['tagChange']);

function onClick(index) {
    emit('tagChange', index);
}
</script>
<style lang="less" scoped>
.placeholder-box {
    height: 80px;
}
.scroll-view-content {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;
    height: 80px;
    line-height: 80px;
    white-space: nowrap;
    box-sizing: border-box;
    .item {
        display: inline-block;
        color: #666;
        font-size: 26px;
        &:last-child {
            margin-right: 20px;
        }
        &:first-child {
            margin-left: 10px;
        }
        text {
            margin: 0 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            border-bottom: 4px solid transparent;
        }
        &.cur {
            font-size: 32px;
            font-weight: bold;
            color: #4474ff;
            text {
                border-bottom: 4px solid #4474ff;
            }
        }
    }
}
</style>
