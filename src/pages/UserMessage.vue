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
                    <view class="message-info">
                        <text class="message-time">
                            {{ item.last_reply_time }}
                        </text>
                        <view
                            v-if="item.messageType === 'reply'"
                            class="message-title"
                        >
                            <image :src="item.avatar"></image>
                            <text
                                class="light"
                                @click="getUserTopic(item.author)"
                            >
                                {{ item.author }}
                            </text>
                            <text class="gray">在</text>
                            <text
                                class="light"
                                @click="getTopicsDetail(item.id)"
                            >
                                {{ item.title }}
                            </text>
                            <text class="gray">里回复了你</text>
                        </view>
                        <view
                            v-if="item.messageType === 'thanks'"
                            class="message-title"
                        >
                            <image :src="item.avatar"></image>
                            <text
                                class="light"
                                @click="getUserTopic(item.author)"
                            >
                                {{ item.author }}
                            </text>
                            <text class="gray">感谢了你在主题</text>
                            <text class="gray"> › </text>
                            <text
                                class="light"
                                @click="getTopicsDetail(item.id)"
                            >
                                {{ item.title }}
                            </text>
                            <text class="gray">里的回复</text>
                        </view>
                        <view
                            v-if="item.messageType === 'collection'"
                            class="message-title"
                        >
                            <image :src="item.avatar"></image>
                            <text
                                class="light"
                                @click="getUserTopic(item.author)"
                            >
                                {{ item.author }}
                            </text>
                            <text class="gray"> 收藏了你发布的主题 </text>
                            <text class="gray"> › </text>
                            <text
                                class="light"
                                @click="getTopicsDetail(item.id)"
                            >
                                {{ item.title }}
                            </text>
                        </view>
                    </view>
                    <view class="message-content" v-if="item.content">
                        <MarkDown :content="item.content"></MarkDown>
                    </view>
                </view>
            </view>
            <NoMore v-if="noMore"></NoMore>
        </view>
    </view>
</template>
<script setup>
import { $getUserMessage } from '../service';
import MarkDown from '@/components/MarkDown.vue';
import LoadFaild from '@/components/LoadFailed.vue';
import { reactive, ref } from 'vue';
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { useIndexStore } from '@/stores';

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
    message_count: 0
});

const store = useIndexStore();
onLoad(() => {
    store.saveNotifications(0);
    getList();
});
async function getList() {
    loading.value = true;
    const topicList = list.value || [];
    const res = await $getUserMessage(params.p);
    if (res) {
        const { messageInfo, data } = res;
        nodeInfo.value = messageInfo;
        if (loadType.value === 'refresh') {
            list.value = data.map(item => {
                return {
                    ...item,
                    content:
                        item.content &&
                        item.content.replace(
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
    const { message_count } = nodeInfo.value;
    const len = list.value.length;
    if (len >= message_count) {
        noMore.value = true;
    } else {
        if (len && len < 10) {
            loadMore();
        }
    }
}
function getTopicsDetail(id) {
    uni.navigateTo({
        url: `/pages/Detail?id=${id}`
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
<style lang="scss" scoped>
.list-wrap {
    .item {
        font-size: 28rpx;
        padding: 25rpx 30rpx;
        background: #fff;
        .gray {
            color: #666;
        }
        .light {
            color: $uv-primary;
            font-weight: 500;
        }
        .message-info {
            .message-time {
                color: #999;
            }
            .message-title {
                padding: 10rpx 0;
                line-height: 50rpx;
                image {
                    width: 30rpx;
                    height: 30rpx;
                    border-radius: 5rpx;
                    vertical-align: middle;
                }
                text {
                    margin: 0 10rpx;
                }
            }
        }
        .message-content {
            background: $uv-bg-color;
            padding: 20rpx;
        }
    }
}
</style>
