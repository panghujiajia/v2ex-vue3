<template>
    <view class="container">
        <Skeleton v-if="loading && loadType === 'refresh'"></Skeleton>
        <LoadFaild
            v-else-if="!list.length"
            :status="true"
            @reload="getList()"
        ></LoadFaild>
        <view v-else>
            <view class="topic-header">
                <view class="header-top">
                    <text class="name">
                        {{ title || nodeInfo.topic_title || '' }}
                    </text>
                    主题总数 {{ nodeInfo.topic_count || 0 }}
                </view>
                <view class="header-bottom">
                    {{ nodeInfo.topic_intro || 'World is powered by solitude' }}
                </view>
            </view>
            <view class="list-wrap">
                <view
                    v-for="(item, index) in list"
                    :key="index"
                    class="item"
                    @click="getTopicsDetail(item.id)"
                >
                    <Topic :item="item" :visited="false"></Topic>
                </view>
            </view>
            <NoMore v-if="noMore"></NoMore>
        </view>
    </view>
</template>
<script setup>
import Topic from '@/components/Topic';
import Skeleton from '@/components/Skeleton';
import LoadFaild from '@/components/LoadFailed.vue';
import NoMore from '@/components/NoMore';
import { storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';
import { $getAllTopics } from '../service';
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

const store = useIndexStore();
let { visited } = storeToRefs(store);
let list = ref([]);
let nodeInfo = ref({
    topic_count: 0,
    topic_intro: '',
    topic_title: ''
});
let params = reactive({
    p: 1,
    value: '',
    title: ''
});
let loading = ref(true);
let noMore = ref(false);
let loadType = ref('refresh');

const props = defineProps(['value', 'title']);
onLoad(() => {
    uni.setNavigationBarTitle({ title: props.title || '节点' });
    params.value = props.value;
    params.title = props.title;
    getList();
});
async function getList() {
    loading.value = true;
    const res = await $getAllTopics({
        tab: params.value,
        p: params.p
    });
    if (res) {
        let { data, nodeInfo: info } = res;
        nodeInfo.value = info;
        if (!params.title) {
            uni.setNavigationBarTitle({
                title: nodeInfo.value.topic_title || '节点'
            });
        }
        const tagArr = data.map(item => {
            let isVisited = false;
            if (visited.value.includes(item.id)) {
                isVisited = true;
            }
            item.tag_name = params.title;
            item.tag_link = params.value;
            item.noNavigate = true;
            return { ...item, visited: isVisited };
        });
        // 如果是加载更多
        if (loadType.value === 'loadMore') {
            if (!noMore.value) {
                list.value = [...list.value, ...tagArr];
            }
        } else {
            list.value = tagArr;
            uni.stopPullDownRefresh();
        }
        isLastPage();
    }
    loading.value = false;
}
function isLastPage() {
    const { topic_count } = nodeInfo.value;
    const len = list.value.length;
    if (len >= topic_count) {
        noMore.value = true;
    }
}

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

onPullDownRefresh(refresh);
function refresh() {
    params.p = 1;
    loadType.value = 'refresh';
    noMore.value = false;
    getList();
}
onReachBottom(loadMore);
function loadMore() {
    if (noMore.value) {
        return;
    }
    params.p = ++params.p;
    loadType.value = 'loadMore';
    getList();
}
</script>
<style lang="less" scoped>
.topic-header {
    min-height: 200rpx;
    background: url(https://cdn.todayhub.cn/lib/image/bg-topic.jpg) 50%
        no-repeat;
    background-size: cover;
    padding: 30rpx;
    box-sizing: border-box;
    color: #fff;
    display: flex;
    flex-direction: column;
    font-weight: 400;
    .header-top {
        font-size: 26rpx;
        .name {
            font-size: 38rpx;
            margin-right: 20rpx;
            font-weight: 500;
        }
    }
    .header-bottom {
        font-size: 28rpx;
        margin-top: 15rpx;
    }
}
</style>
