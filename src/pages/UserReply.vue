<template>
    <view class="container">
        <Skeleton v-if="loading && loadType === 'refresh'"></Skeleton>
        <LoadFaild
            v-else-if="!list.length"
            :status="loadFaild"
            @reload="getList()"
        ></LoadFaild>
        <view v-else>
            <view class="list-wrap">
                <view v-for="(item, index) in list" :key="index" class="item">
                    <view class="reply-info">
                        <text class="reply-time">
                            {{ item.last_reply_time }}
                        </text>
                        <view class="reply-title">
                            <text class="gray">回复了</text>
                            <text
                                class="light chevron"
                                @click="getUserTopic(item.author)"
                            >
                                {{ item.author }}
                            </text>
                            <text class="gray">创建的主题</text>
                            <text class="gray chevron"> › </text>
                            <text class="light" @click="getTags(item)">
                                {{ item.tag_name }}
                            </text>
                            <text class="gray chevron"> › </text>
                            <text
                                class="light"
                                @click="getTopicsDetail(item.id)"
                            >
                                {{ item.title }}
                            </text>
                        </view>
                    </view>
                    <view class="reply-content">
                        <MarkDown :content="item.content"></MarkDown>
                    </view>
                </view>
            </view>
            <view v-if="noMore" class="no-more"> 没有啦～ </view>
        </view>
    </view>
</template>
<script setup>
import Topic from '@/components/Topic.vue';
import MarkDown from '@/components/MarkDown.vue';
import LoadFaild from '@/components/LoadFaild.vue';
import { $getUserReplys } from '../service';
import Skeleton from '@/components/Skeleton.vue';
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
    uni.setNavigationBarTitle({ title: `${props.username}的回复` });
    getList();
});
async function getList() {
    loading.value = true;
    const topicList = list.value || [];
    const res = await $getUserReplys(params);
    if (res) {
        const { topicInfo, data } = res;
        nodeInfo.value = topicInfo;
        if (loadType.value === 'refresh') {
            list.value = data.map(item => {
                return {
                    ...item,
                    content: item.content.replace(
                        /(@.*?>)(.*?)(<\/a>)/g,
                        '<text class="user-name">$1$2$3</text>'
                    )
                };
            });
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
    } else {
        if (len && len < 19) {
            loadMore();
        }
    }
}
// 跳转主题详情
function getTopicsDetail(id) {
    uni.navigateTo({
        url: `/pages/Detail?id=${id}`
    });
}
function getTags(item) {
    uni.navigateTo({
        url: `/pages/Tag?value=${item.tag_link}&title=${item.tag_name}`
    });
}
function getUserTopic(username) {
    uni.navigateTo({
        url: `/pages/UserTopic?username=${username}`
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
.list-wrap {
    .item {
        font-size: 28px;
        padding: 25px 30px;
        background: #fff;
        /deep/.user-name {
            color: #4474ff;
            view {
                color: #4474ff;
            }
            ._hover {
                text-decoration: none;
            }
        }
        .gray {
            color: #666;
        }
        .light {
            color: #4474ff;
            font-weight: 500;
        }
        .reply-info {
            .reply-time {
                color: #999;
            }
            .reply-title {
                margin: 10px 0 15px;
                .chevron {
                    margin: 0 10px;
                }
            }
        }
        .reply-content {
            background: #f9f9f9;
            padding: 10px 20px;
        }
    }
}
</style>
