<template>
    <view class="container">
        <view v-if="!historyTopic.length" class="load-failed">
            <view class="reload">
                <image
                    class="empty-img"
                    src="https://img01.yzcdn.cn/vant/empty-image-default.png"
                >
                </image>
                <view class="empty-desc">暂无访问记录</view>
            </view>
        </view>
        <scroll-view
            v-else
            :scroll-y="true"
            class="list-wrap"
            scroll-with-animation
            @touchmove.prevent.stop="
                () => {
                    return false;
                }
            "
        >
            <view
                v-for="(item, index) in historyTopic"
                :key="index"
                class="item"
                @click.stop="getTopicsDetail(item.id)"
            >
                <Topic :item="item"></Topic>
            </view>
            <view class="no-more">只展示最近访问的30条</view>
        </scroll-view>
    </view>
</template>
<script setup>
import Topic from '@/components/Topic.vue';
import { useStore } from '../store';
import { storeToRefs } from 'pinia';

const store = useStore();
let { historyTopic } = storeToRefs(store);
function getTopicsDetail(id) {
    uni.navigateTo({
        url: `/pages/Detail?id=${id}`
    });
}
</script>
<style lang="less" scoped>
.container {
    height: calc(100vh - env(safe-area-inset-bottom));
}
</style>
