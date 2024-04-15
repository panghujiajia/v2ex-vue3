<template>
    <view class="index-container">
        <v-tabs
            :current="currentTabIndex"
            :list="tabs"
            @change="handleTabChange"
        />
        <swiper
            :current="currentTabIndex"
            class="weui-tabs-swiper"
            duration="300"
            easing-function="easeOutCubic"
            @animationfinish="animationFinish"
            @change="handleSwiperChange"
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
                <uv-empty
                    v-if="error === false || (!loading && !data.length)"
                    icon="https://img01.yzcdn.cn/vant/empty-image-default.png"
                    text="暂无数据"
                    style="padding-top: 160px"
                >
                    <uv-gap height="30"></uv-gap>
                    <uv-button
                        type="primary"
                        :customStyle="{ padding: '0 25px' }"
                        shape="circle"
                        loadingText="加载中"
                        text="再试一次"
                        @click="send()"
                        :loading="loading"
                    >
                        再试一次
                    </uv-button>
                </uv-empty>
                <scroll-view v-else :scroll-y="scrollY" class="list-wrap">
                    <uv-skeletons
                        :loading="loading || currentTabIndex !== tagIndex"
                        :skeleton="
                            [].concat(
                                skeleton,
                                skeleton,
                                skeleton,
                                skeleton,
                                skeleton
                            )
                        "
                    >
                        <view
                            v-for="item in data"
                            :key="item.id"
                            class="item"
                            @click="getTopicsDetail(item)"
                        >
                            <v-topic :item="item"></v-topic>
                        </view>
                        <uv-load-more
                            v-if="!loading"
                            status="nomore"
                            height="60"
                        />
                    </uv-skeletons>
                </scroll-view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script setup>
import VTopic from '@/components/v-topic.vue';
import VTabs from '@/components/v-tabs.vue';
import { ref, toRaw } from 'vue';
import { $getTabTopics, $getTopicDetail } from '@/service';
import { storeToRefs } from 'pinia';
import { onShow } from '@dcloudio/uni-app';
import { useIndexStore } from '@/stores';
import { useFetcher, useWatcher } from 'alova';
import { getTopicsDetail } from '@/hooks';

const store = useIndexStore();
const { cookie, tabs, currentTabIndex, currentTabName, visited } =
    storeToRefs(store);
const { skeleton } = store;

let scrollY = ref(true);

onShow(() => {
    if (cookie.value) {
        store.getUserNotifications();
    }
    // #ifdef APP-PLUS
    // 监听设备网络状态变化事件
    console.log(plus.networkinfo.isSetProxy());
    // #endif
});

const { data, loading, send, onSuccess, error } = useWatcher(
    () => $getTabTopics(currentTabName.value),
    [currentTabName],
    {
        initialData: [],
        immediate: true
    }
);

const { fetch, onSuccess: onSuccess_fetch } = useFetcher({
    updateState: false
});

onSuccess(({ data: res }) => {
    data.value =
        res &&
        res.map(item => {
            let isVisited = false;
            if (visited.value.includes(item.id)) {
                isVisited = true;
            }
            return { ...item, visited: isVisited };
        });
    uni.pageScrollTo({
        scrollTop: 0
    });
    needFetchDetail();
    needFetchOtherTabs();
});

function needFetchOtherTabs() {
    const next = tabs.value[currentTabIndex.value + 1];
    next && fetch($getTabTopics(next.value));
}

function needFetchDetail() {
    const list = toRaw(data.value);
    let id = '';
    let max = 0;
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.reply_num > 100 && !item.visited) {
            if (item.reply_num > max) {
                max = item.reply_num;
                id = item.id;
            }
        }
    }
    if (id) {
        const page = Math.ceil(max / 100);
        for (let p = 1; p <= page; p++) {
            fetch($getTopicDetail({ id, p }));
        }
    }
}

onSuccess_fetch(() => {});

function handleTabChange(index) {
    store.changeTabIndex(index);
}

function handleSwiperChange({ detail: { current } }) {
    store.changeTabIndex(current);
}

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
.item {
    padding: 25rpx 30rpx;
    border-bottom: 20rpx solid #f5f5f5;
    white-space: normal;
}
</style>
