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
                    v-else-if="!list.length"
                    :status="true"
                    @reload="getData()"
                ></LoadFaild>
                <scroll-view v-else :scroll-y="scrollY" class="list-wrap">
                    <view
                        v-for="(item, index) in list"
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
import LoadFaild from '@/components/LoadFaild';
import NoMore from '@/components/NoMore';
import { ref } from 'vue';
import { useStore } from '../store';
import { $getTabTopics } from '../service';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { onShow } from '@dcloudio/uni-app';

const store = useStore();
let { cookie, tabs, currentTagIndex, currentTagName, visited, storageTime } =
    storeToRefs(store);

let scrollY = ref(true);

let loading = ref(true);

let list = ref([]);

getData();

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
        const target = list.value.find(item => {
            return item.id === id;
        });
        target.visited = true;
    }
    uni.navigateTo({
        url: `/pages/Detail?id=${id}`
    });
}

async function getList(title) {
    const data = await $getTabTopics(title);
    if (data) {
        const newData = data.map(item => {
            let isVisited = false;
            if (visited.value.includes(item.id)) {
                isVisited = true;
            }
            return { ...item, visited: isVisited };
        });
        list.value = newData;
        store.updateTopicData({ key: `${title}_data`, data: newData });
        store.updateTopicData({ key: `${title}_time`, data: dayjs() });
        uni.pageScrollTo({
            scrollTop: 0
        });
    }
    loading.value = false;
}

function getData() {
    loading.value = true;
    let title = currentTagName.value;
    // 如果没拿到数据就调接口
    if (isExpired(title)) {
        getList(title);
    }
}

function isExpired(title) {
    const time = store.getTopicData(`${title}_time`);
    if (!time) {
        return true;
    }
    const old = dayjs(time);
    const now = dayjs();
    // 缓存时间超过设定的时间,则重新请求数据
    if (now.diff(old, 'minute') >= storageTime.value) {
        return true;
    }
    return getStorageData(title);
}

function getStorageData(title) {
    const data = store.getTopicData(`${title}_data`);
    if (data && data.length) {
        list.value = data;
        loading.value = false;
        return false;
    }
    return true;
}

function onTagChange(index) {
    store.changeTagIndex(index);
}

const onChange = e => {
    const { current } = e.detail;
    onTagChange(current);
    getData();
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
