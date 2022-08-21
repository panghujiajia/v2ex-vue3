<template>
    <view class="tabbar-page-wrap">
        <view class="content-wrap">
            <view v-show="currentTabBar === 0" class="index-wrap">
                <Index />
            </view>
            <view v-show="currentTabBar === 1" class="tag-wrap">
                <All />
            </view>
            <view v-show="currentTabBar === 2" class="my-wrap">
                <My />
            </view>
        </view>
        <TabBar />
    </view>
</template>
<script setup>
import TabBar from '@/components/TabBar';
import Index from '@/pages/Index';
import All from '@/pages/All';
import My from '@/pages/My';
import { toRefs } from 'vue';
import { useStore } from '../store';

const store = useStore();
let { currentTabBar } = toRefs(store);
</script>
<style lang="less" scoped>
/deep/.uni-scroll-view::-webkit-scrollbar {
    height: 0;
    width: 0;
    background: transparent;
    display: none;
}
.tabbar-page-wrap {
    height: 100vh;
    overflow: hidden;
    .content-wrap {
        height: calc(100vh - 90px - env(safe-area-inset-bottom));
        & > view {
            height: 100%;
        }
    }
}
</style>
