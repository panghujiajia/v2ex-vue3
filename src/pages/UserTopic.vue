<template>
    <view class="container">
        <Skeleton v-if="loading && loadType === 'refresh'"></Skeleton>
        <LoadFaild
            v-else-if="!list.length"
            :status="loadFaild"
            @reload="getList()"
        ></LoadFaild>
        <view v-else class="list-wrap">
            <view
                v-for="(item, index) in list"
                :key="index"
                class="item"
                @click.stop="getTopicsDetail(item.id)"
            >
                <Topic :item="item"></Topic>
            </view>
            <view v-if="noMore" class="no-more"> 没有啦～ </view>
        </view>
    </view>
</template>
<script setup>
import Topic from '@/components/Topic.vue';
import { $getUserTopics } from '../service';
import Skeleton from '@/components/Skeleton.vue';
import LoadFaild from '@/components/LoadFaild.vue';
import { reactive, ref } from 'vue';
import { onPullDownRefresh, onReachBottom, onLoad } from '@dcloudio/uni-app';

let loading = ref(true);
let noMore = ref(false);
let loadFaild = ref(false);
let loadType = ref('refresh');
let list = ref([]);
let params = reactive({
    username: '',
    p: 1
});
let nodeInfo = ref({
    topic_count: 0
});
const props = defineProps(['username']);
onLoad(() => {
    params.username = props.username;
    uni.setNavigationBarTitle({ title: `${props.username}的主题` });
    getList();
});
async function getList() {
    loading.value = true;
    const topicList = list.value || [];
    const res = await $getUserTopics(params);
    if (res) {
        const { topicInfo, data } = res;
        nodeInfo.value = topicInfo;
        if (loadType.value === 'refresh') {
            list.value = data;
            loadFaild.value = false;
            uni.stopPullDownRefresh();
        } else {
            if (!noMore.value) {
                list.value = [...topicList, ...data];
            }
        }
        isLastPage();
    } else {
        if (loadType.value === 'loadMore') {
            params.p = --params.p;
        }
        loadFaild.value = true;
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
// 跳转主题详情
function getTopicsDetail(id) {
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
.container {
    height: calc(100% - env(safe-area-inset-bottom));
    .list-wrap {
        height: auto;
        overflow: auto;
    }
}
</style>
