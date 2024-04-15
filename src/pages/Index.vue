<template>
    <view class="index-container">
        <uv-sticky
            bgColor="#fff"
            offsetTop="0"
            customNavHeight="env(safe-area-inset-top)"
        >
            <uv-tabs
                :list="tabs"
                :current="currentTagIndex"
                @change="handleChange"
            ></uv-tabs>
        </uv-sticky>
        <swiper
            :current="currentTagIndex"
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
                    v-if="error === false"
                    icon="https://img01.yzcdn.cn/vant/empty-image-default.png"
                    text="加载失败"
                    style="padding-top: 160px"
                >
                    <uv-gap height="30"></uv-gap>
                    <uv-button
                        type="primary"
                        :customStyle="{ padding: '0 25px' }"
                        shape="circle"
                        loadingText="加载中"
                        text="加载失败"
                        @click="send()"
                        :loading="loading"
                    >
                        再试一次
                    </uv-button>
                </uv-empty>
                <scroll-view v-else :scroll-y="scrollY" class="list-wrap">
                    <uv-skeletons
                        :loading="loading || currentTagIndex !== tagIndex"
                        :skeleton="
                            skeleton.concat(
                                skeleton,
                                skeleton,
                                skeleton,
                                skeleton,
                                skeleton
                            )
                        "
                    >
                        <uv-empty
                            v-if="error !== false && !data.length"
                            icon="https://img01.yzcdn.cn/vant/empty-image-default.png"
                            text="暂无数据"
                            style="padding-top: 160px"
                        ></uv-empty>
                        <template v-else>
                            <view
                                v-for="item in data"
                                :key="item.id"
                                class="item"
                                @click="getTopicsDetail(item)"
                            >
                                <v-topic
                                    :item="item"
                                    :visited="false"
                                ></v-topic>
                            </view>
                            <uv-load-more
                                v-if="!loading"
                                status="nomore"
                                height="60"
                            />
                        </template>
                    </uv-skeletons>
                </scroll-view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script setup>
import VTopic from '@/components/v-topic.vue';
import LoadFailed from '@/components/LoadFailed.vue';
import { ref, toRaw } from 'vue';
import { $getTabTopics, $getTopicDetail } from '@/service';
import { storeToRefs } from 'pinia';
import { onShow } from '@dcloudio/uni-app';
import { useIndexStore } from '@/stores';
import { useFetcher, useWatcher } from 'alova';

const store = useIndexStore();
let { cookie, tabs, currentTagIndex, currentTagName, visited } =
    storeToRefs(store);

let scrollY = ref(true);
const skeleton = [
    30,
    {
        type: 'flex',
        num: 1,
        children: [
            {
                type: 'custom',
                num: 1,
                style: 'width:60rpx;height:60rpx;margin:0 20rpx 0 30rpx;'
            },
            {
                type: 'line',
                num: 2,
                gap: 10,
                style: [
                    'width:100rpx;height: 25rpx',
                    'width:160rpx;height: 25rpx'
                ]
            }
        ]
    },
    20,
    {
        type: 'line',
        num: 2,
        gap: 10,
        style: 'width:calc(100% - 60rpx);marginLeft: 30rpx'
    },
    20
];

onShow(() => {
    if (cookie.value) {
        store.getUserNotifications();
    }
    // #ifdef APP-PLUS
    // 监听设备网络状态变化事件
    console.log(plus.networkinfo.isSetProxy());
    // #endif
});

function getTopicsDetail(detail) {
    const { id } = detail;
    if (!visited.value.includes(id)) {
        store.updateVisited(id);
        const target = data.value.find(item => {
            return item.id === id;
        });
        target.visited = true;
    }
    store.saveTopicBaseInfo(detail);
    uni.navigateTo({
        url: `/pages/Detail?id=${id}`
    });
}

const { data, loading, send, onSuccess, error } = useWatcher(
    () => $getTabTopics(currentTagName.value),
    [currentTagName],
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
    // needFetchDetail();
    // needFetchOtherTabs();
});

function needFetchOtherTabs() {
    const next = tabs.value[currentTagIndex.value + 1];
    next && fetch($getTabTopics(next.value));
}

function needFetchDetail() {
    const list = toRaw(data.value);
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.reply_num > 100 && !item.visited) {
            const page = Math.ceil(item.reply_num / 100);
            for (let j = 1; j <= page; j++) {
                fetch($getTopicDetail({ id: item.id, p: j }));
            }
        }
    }
}

onSuccess_fetch(() => {});

function onTagChange(index) {
    store.changeTagIndex(index);
}

function handleSwiperChange({ detail: { current } }) {
    store.changeTagIndex(current);
}

function handleChange({ index }) {
    console.log(index);
    index !== undefined && onTagChange(index);
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
