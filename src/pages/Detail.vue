<template>
    <view class="container">
        <Skeleton
            v-if="loading && loadType === 'refresh'"
            type="detail"
        ></Skeleton>
        <LoadFaild
            v-else-if="!topicDetail.title"
            :status="true"
            @reload="loadData()"
        ></LoadFaild>
        <template v-else>
            <view class="topic-wrap">
                <AuthorInfo :item="topicDetail"></AuthorInfo>
                <view class="title">{{ topicDetail.title }}</view>
                <MarkDown :content="topicDetail.content"></MarkDown>
            </view>
            <view v-if="topicDetail.subtle_list.length" class="subtle-wrap">
                <template
                    v-for="(item, index) in topicDetail.subtle_list"
                    :key="index"
                >
                    <view class="title">
                        第{{ index + 1 }}条附言 {{ item.time }}
                    </view>
                    <view class="content">
                        <MarkDown :content="item.content"></MarkDown>
                    </view>
                </template>
            </view>
            <view class="tag-info">
                <TopicTag :item="topicDetail"></TopicTag>
                <view class="floor-wrap">
                    <image
                        class="reply-icon"
                        src="https://cdn.todayhub.cn/lib/image/reply_neue.png"
                        @click="replyTopic()"
                    ></image>
                    <view class="floor">OP</view>
                </view>
            </view>
            <view v-if="topicDetail.reply_num" class="reply-num">
                {{ topicDetail.reply_num }}条回复
            </view>
            <view
                v-for="(item, index) in topicDetail.reply_list"
                :key="index"
                :class="item.author"
                class="topic-wrap topic-reply"
            >
                <view class="user-info">
                    <AuthorInfo :item="item"></AuthorInfo>
                    <view class="floor-wrap">
                        <image
                            class="reply-icon"
                            src="https://cdn.todayhub.cn/lib/image/reply_neue.png"
                            @click="replyTopic(item)"
                        ></image>
                        <view class="floor">
                            {{ `${index + 1}楼` }}
                        </view>
                    </view>
                </view>
                <MarkDown :content="item.content"></MarkDown>
            </view>
            <ReplyBox
                ref="replyBoxRef"
                :replyWho="replyWho"
                :topic="topicDetail"
                @replySuccess="refresh()"
            ></ReplyBox>
            <!-- #ifdef MP-WEIXIN -->
            <ad unit-id="adunit-6996f541fca34984"></ad>
            <!-- #endif -->
            <NoMore v-if="noMore"></NoMore>
        </template>
    </view>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { $getTopicDetail } from '../service';
import AuthorInfo from '@/components/AuthorInfo';
import TopicTag from '@/components/TopicTag';
import Skeleton from '@/components/Skeleton';
import MarkDown from '@/components/MarkDown';
import LoadFaild from '@/components/LoadFaild';
import ReplyBox from '@/components/ReplyBox.vue';
import NoMore from '@/components/NoMore';
import { onPullDownRefresh, onReachBottom, onLoad } from '@dcloudio/uni-app';
import { useStore } from '../store';

const store = useStore();
let loading = ref(true);
let replyWho = ref(null);
let replyBoxRef = ref(null);
let params = reactive({
    id: '',
    p: 1
});
let totalPage = ref(1);
let loadType = ref('refresh');
let noMore = ref(false);
let topicDetail = ref({
    reply_list: [],
    subtle_list: []
});
const props = defineProps(['id']);
onLoad(() => {
    params.id = props.id;
    loadData();
});
async function loadData() {
    loading.value = true;
    const replyList = topicDetail.value.reply_list || [];
    const res = await $getTopicDetail(params);
    if (res) {
        let { reply_list, page, once } = res;
        if (params.p === 1) {
            topicDetail.value = res;
            uni.setNavigationBarTitle({ title: topicDetail.value.title });
            totalPage.value = page || 1;
            store.saveHistoryTopics(res);
        }
        topicDetail.value.once = once;
        reply_list = reply_list.map(item => {
            return {
                ...item,
                content: item.content.replace(
                    /(@.*?>)(.*?)(<\/a>)/g,
                    '<text class="user-name">$1$2$3</text>'
                )
            };
        });
        if (loadType.value === 'refresh') {
            topicDetail.value.reply_list = reply_list;
            uni.stopPullDownRefresh();
        } else {
            if (!noMore.value) {
                topicDetail.value.reply_list = [...replyList, ...reply_list];
            }
        }
        if (params.p >= totalPage.value) {
            noMore.value = true;
        }
    }
    loading.value = false;
}
function replyTopic(item) {
    if (!store.cookie) {
        uni.showModal({
            title: '提示',
            content: '登录后才能回帖',
            confirmText: '去登录',
            cancelText: '取消',
            success: ({ confirm }) => {
                if (confirm) {
                    uni.navigateTo({ url: '/pages/Login' });
                }
            }
        });
        return;
    }
    replyWho.value = item;
    replyBoxRef.value.showReply();
}
onPullDownRefresh(refresh);
function refresh() {
    params.p = 1;
    loadType.value = 'refresh';
    noMore.value = false;
    loadData();
}
onReachBottom(loadMore);
function loadMore() {
    if (noMore.value) {
        return;
    }
    params.p = ++params.p;
    loadType.value = 'loadMore';
    loadData();
}
</script>
<style lang="less" scoped>
text {
    user-select: text;
}
.subtle-wrap {
    background: #fffff9;
    color: #666;
    padding: 25rpx 30rpx;
    .title {
        font-size: 26rpx;
        margin-bottom: 10rpx;
    }
    .content {
        margin-bottom: 30rpx;
        padding-bottom: 30rpx;
        border-bottom: 2rpx solid #f5f5f5;
        &:last-child {
            border-bottom: 0;
            margin-bottom: 0;
            padding-bottom: 0;
        }
    }
}
.topic-wrap {
    padding: 25rpx 30rpx;
    background: #fff;
    .user-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .title {
        font-size: 32rpx;
        color: #333;
        line-height: 45rpx;
        font-weight: bold;
        margin: 20rpx 0;
    }
}
.tag-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25rpx 30rpx;
    background: #fff;
}
.floor-wrap {
    display: flex;
    align-items: center;
    .reply-icon {
        width: 30rpx;
        height: 30rpx;
        margin-right: 15rpx;
    }
    .floor {
        color: #999;
        font-size: 22rpx;
    }
}
.reply-num {
    height: 50rpx;
    line-height: 50rpx;
    padding: 0 30rpx;
    background: #f5f5f5;
    color: #999;
    font-size: 22rpx;
    font-weight: 400;
}
.topic-reply {
    padding-bottom: 20rpx;
    border-bottom: 20rpx solid #f5f5f5;
    /deep/rich-text {
        font-weight: 500;
    }
    .user-info {
        margin-bottom: 10rpx;
    }
}
</style>
