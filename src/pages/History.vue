<template>
    <view class="container">
        <uv-empty
            v-if="!historyTopic.length"
            icon="https://img01.yzcdn.cn/vant/empty-image-default.png"
            text="暂无记录"
            style="padding-top: 160px"
        >
        </uv-empty>
        <scroll-view
            v-else
            :scroll-y="true"
            class="list-wrap"
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
                @click.stop="getTopicsDetail(item)"
            >
                <v-topic :item="item"></v-topic>
            </view>
            <uv-load-more status="nomore" height="60" />
        </scroll-view>
    </view>
</template>
<script setup>
import NoMore from '@/components/NoMore';
import { useIndexStore } from '../stores';
import { storeToRefs } from 'pinia';
import VTopic from '@/components/v-topic.vue';
import { getTopicsDetail } from '@/hooks';

const store = useIndexStore();
let { historyTopic } = storeToRefs(store);
</script>
<style lang="less" scoped>
.container {
    height: calc(100% - env(safe-area-inset-bottom));
}
</style>
