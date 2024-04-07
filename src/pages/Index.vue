<template>
    <view class="index-container">
        <NavBar
            :current="currentTagIndex"
            :list="tabs"
            @tagChange="onTagChange"
        />
        <swiper
            :current="currentTagIndex"
            class="weui-tabs-swiper"
            duration="300"
            easing-function="easeOutCubic"
            @animationfinish="animationFinish"
            @change="onChange"
            @transition="onTransition"
            @touchmove.prevent.stop="
                () => {
                    return false;
                }
            "
        >
            <swiper-item
                v-for="(tab, tagIndex) in tabs"
                :key="tagIndex"
                :data-index="tagIndex"
                class="weui-tabs-swiper-item"
            >
                <Skeleton
                    v-if="loading || currentTagIndex !== tagIndex"
                ></Skeleton>
                <LoadFailed
                    v-else-if="!data.length"
                    :status="true"
                    @reload="send()"
                ></LoadFailed>
                <scroll-view v-else :scroll-y="scrollY" class="list-wrap">
                    <view
                        v-for="item in data"
                        :key="item.id"
                        class="item"
                        @click="getTopicsDetail(item.id)"
                    >
                        <Topic :item="item" :visited="false"></Topic>
                    </view>
                    <NoMore></NoMore>
                </scroll-view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script setup>
import Topic from '@/components/Topic';
import Skeleton from '@/components/Skeleton';
import NavBar from '@/components/NavBar';
import LoadFailed from '@/components/LoadFailed.vue';
import NoMore from '@/components/NoMore';
import { ref, toRaw } from 'vue';
import { $getTabTopics } from '@/service';
import { storeToRefs } from 'pinia';
import { onShow } from '@dcloudio/uni-app';
import { useIndexStore } from '@/stores';
import { useFetcher, useWatcher } from 'alova';

const store = useIndexStore();
let { cookie, tabs, currentTagIndex, currentTagName, visited, storageTime } =
    storeToRefs(store);

let scrollY = ref(true);

let list = ref([]);

onShow(() => {
    if (cookie.value) {
        store.getUserNotifications();
    }
    // #ifdef APP-PLUS
    // 监听设备网络状态变化事件
    console.log(plus.networkinfo.isSetProxy());
    // #endif
});

function getTopicsDetail(id) {
    if (!visited.value.includes(id)) {
        store.updateVisited(id);
        const target = data.value.find(item => {
            return item.id === id;
        });
        target.visited = true;
    }
    uni.navigateTo({
        url: `/pages/Detail?id=${id}`
    });
}

const { data, loading, send, onSuccess } = useWatcher(
    () => $getTabTopics(currentTagName.value),
    [currentTagName],
    {
        initialData: [],
        immediate: true
    }
);

const { fetch, onSuccess: onSuccess_fetch } = useFetcher();

onSuccess(({ data: res }) => {
    data.value = res.map(item => {
        let isVisited = false;
        if (visited.value.includes(item.id)) {
            isVisited = true;
        }
        return { ...item, visited: isVisited };
    });
    uni.pageScrollTo({
        scrollTop: 0
    });
    console.log(toRaw(data.value));
    let next = tabs.value[currentTagIndex.value + 1];
    next && fetch($getTabTopics(next.value));
});

onSuccess_fetch(() => {
    console.log(toRaw(data.value));
});

function onTagChange(index) {
    store.changeTagIndex(index);
}

const onChange = e => {
    const { current } = e.detail;
    onTagChange(current);
};

const onTransition = e => {
    scrollY.value = false;
};

const animationFinish = e => {
    scrollY.value = true;
};
</script>
<style lang="less" scoped>
.index-container {
    height: 100%;
}

.weui-tabs-swiper {
    overflow: hidden;
    width: 100%;
    /* #ifndef APP-PLUS */
    height: calc(100% - 80rpx);
    /* #endif */

    /* #ifdef APP-PLUS */
    height: calc(100vh - 80rpx);
    /* #endif */

    .weui-tabs-swiper-item {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
}
</style>
