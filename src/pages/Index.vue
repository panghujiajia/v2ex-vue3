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
                <view v-else-if="!list.length" class="load-failed">
                    <view class="reload">
                        <image
                            class="empty-img"
                            src="https://img01.yzcdn.cn/vant/empty-image-error.png"
                        >
                        </image>
                        <view class="empty-desc">加载失败</view>
                        <view class="empty-button" @click="getData()">
                            再试一次
                        </view>
                    </view>
                </view>
                <scroll-view
                    v-else
                    :scroll-y="scrollY"
                    class="list-wrap"
                    scroll-with-animation
                >
                    <view
                        v-for="(item, index) in list"
                        :key="index"
                        class="item"
                        @click="getTopicsDetail(item.id)"
                    >
                        <Topic :item="item" :visited="false"></Topic>
                    </view>
                    <view class="no-more">没有了，去看看别的或休息一下吧</view>
                </scroll-view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script setup>
import Topic from '@/components/Topic';
import Skeleton from '@/components/Skeleton';
import NavBar from '@/components/NavBar';
import { ref } from 'vue';
import { useStore } from '../store';
import { $getTabTopics } from '../service';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';

const store = useStore();
let { tabs, currentTagIndex, currentTagName, visited, storageTime } =
    storeToRefs(store);

let scrollY = ref(true);

let loading = ref(true);

let list = ref([]);

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

store.getV2exConfig();
getData();

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
    height: calc(100% - 80px);
    .weui-tabs-swiper-item {
        height: 100%;
        width: 100%;
        overflow: hidden;
        .list-wrap {
            background: #f5f5f5;
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            .item {
                white-space: normal;
                margin-bottom: 20px;
                display: inline-block;
                width: 100%;
            }
        }
    }
}
</style>
