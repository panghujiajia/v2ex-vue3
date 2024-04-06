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
                v-for="(item, tagIndex) in tabs"
                :key="tagIndex"
                :data-index="tagIndex"
                class="weui-tabs-swiper-item"
            >
                <Skeleton
                    v-if="loading || currentTagIndex !== tagIndex"
                ></Skeleton>
                <LoadFaild
                    v-else-if="!data.length"
                    :status="true"
                    @reload="send()"
                ></LoadFaild>
                <scroll-view v-else :scroll-y="scrollY" class="list-wrap">
                    <view
                        v-for="(item, index) in data"
                        :key="index"
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
import LoadFaild from '@/components/LoadFailed.vue';
import NoMore from '@/components/NoMore';
import { ref } from 'vue';
import { $getTabTopics } from '@/service';
import { storeToRefs } from 'pinia';
import { onShow } from '@dcloudio/uni-app';
import { useIndexStore } from '@/stores';
import { useWatcher } from 'alova';

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
        immediate: []
    }
);

onSuccess(({ data }) => {
    data.value = data.map(item => {
        let isVisited = false;
        if (visited.value.includes(item.id)) {
            isVisited = true;
        }
        return { ...item, visited: isVisited };
    });
    uni.pageScrollTo({
        scrollTop: 0
    });
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
