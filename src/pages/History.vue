<template>
    <view class="container">
        <LoadFaild v-if="!historyTopic.length" :status="false"></LoadFaild>
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
                @click.stop="getTopicsDetail(item.id)"
            >
                <Topic :item="item"></Topic>
            </view>
            <NoMore>只展示最近访问的30条</NoMore>
        </scroll-view>
    </view>
</template>
<script setup>
import Topic from '@/components/Topic.vue';
import LoadFaild from '@/components/LoadFaild';
import NoMore from '@/components/NoMore';
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
    height: calc(100% - env(safe-area-inset-bottom));
}
</style>
