<template>
    <view class="container">
        <Skeleton v-if="loading && loadType === 'refresh'"></Skeleton>
        <view v-else-if="!list.length" class="load-failed">
            <view v-if="loadFaild" class="reload">
                <image
                    class="empty-img"
                    src="https://img01.yzcdn.cn/vant/empty-image-error.png"
                >
                </image>
                <view class="empty-desc">加载失败</view>
                <view class="empty-button" @click="getUserTopics()">
                    再试一次
                </view>
            </view>
            <view v-else class="reload">
                <image
                    class="empty-img"
                    src="https://img01.yzcdn.cn/vant/empty-image-default.png"
                >
                </image>
                <view class="empty-desc">暂无主题记录</view>
            </view>
        </view>
        <scroll-view
            v-else
            :scroll-y="true"
            class="list-wrap"
            scroll-with-animation
            @touchmove.prevent.stop="
                () => {
                    return false;
                }
            "
        >
            <view
                v-for="(item, index) in list"
                :key="index"
                class="item"
                @click.stop="getTopicsDetail(item.id)"
            >
                <Topic :item="item"></Topic>
            </view>
            <view v-if="noMore" class="noMore"> 没有啦～ </view>
        </scroll-view>
    </view>
</template>
<script setup>
import Topic from '@/components/Topic.vue';
import { $getUserTopics } from '../service';
import Skeleton from '@/components/Skeleton.vue';
import { reactive, ref } from 'vue';
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

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
function onLoad() {
    params.username = props.username;
    uni.setNavigationBarTitle({ title: `${props.username}的主题` });
    getUserTopics();
}
onLoad();
async function getUserTopics() {
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
                list = [...topicList, ...data];
            }
        }
        isLastPage();
    } else {
        loadFaild.value = true;
    }
    loading.value = false;
}
function isLastPage() {
    const { topic_count } = nodeInfo.value;
    console.log(list.value.length);
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
onPullDownRefresh(() => {
    params.p = 1;
    loadType.value = 'refresh';
    noMore.value = false;
    getUserTopics();
});
onReachBottom(() => {
    if (noMore.value) {
        return;
    }
    params.p = ++params.p;
    loadType.value = 'loadMore';
    getUserTopics();
});
</script>
<style lang="less" scoped>
.container {
    height: calc(100vh - env(safe-area-inset-bottom));
}
</style>
