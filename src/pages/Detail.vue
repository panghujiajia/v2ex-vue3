<template>
    <view class="container">
        <template v-if="loading && loadType === 'refresh'">
            <Skeleton type="detail"></Skeleton>
        </template>
        <template v-else>
            <view v-if="!topicsDetail.title" class="load-failed">
                <view class="reload">
                    <image
                        class="empty-img"
                        src="https://img01.yzcdn.cn/vant/empty-image-error.png"
                    >
                    </image>
                    <view class="empty-desc">加载失败</view>
                    <view class="empty-button" @click="loadData()">
                        再试一次
                    </view>
                </view>
            </view>
            <template v-else>
                <view class="topic-wrap">
                    <AuthorInfo :item="topicsDetail"></AuthorInfo>
                    <view class="title">{{ topicsDetail.title }}</view>
                    <MarkDown :content="topicsDetail.content"></MarkDown>
                </view>
                <view
                    v-if="topicsDetail.subtle_list.length"
                    class="subtle-wrap"
                >
                    <template
                        v-for="(item, index) in topicsDetail.subtle_list"
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
                    <TopicTag :item="topicsDetail"></TopicTag>
                    <view class="floor-wrap">
                        <image
                            class="reply-icon"
                            src="https://cdn.todayhub.cn/lib/image/reply_neue.png"
                            @click="replyTopic()"
                        ></image>
                        <view class="floor">OP</view>
                    </view>
                </view>
                <view v-if="topicsDetail.reply_num" class="reply-num">
                    {{ topicsDetail.reply_num }}条回复
                </view>
                <view
                    v-for="(item, index) in topicsDetail.reply_list"
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
                <view v-if="replyBox" class="reply-wrap">
                    <textarea
                        :hold-keyboard="true"
                        :maxlength="-1"
                        :show-confirm-bar="false"
                        :value="content"
                        auto-focus
                        class="textarea"
                        fixed
                        placeholder="请输入内容"
                        placeholder-style="font-size: 28px;color: #999;"
                        @input="onInputChange"
                    />
                    <view class="tip">
                        <view>请尽量让自己的回复能够对别人有帮助</view>
                        <view>若提交失败请尝试重新登录</view>
                    </view>
                    <view class="btn-wrap">
                        <view
                            class="reply-btn cancel-btn"
                            @click="cancelReply()"
                        >
                            取消
                        </view>
                        <view class="reply-btn" @click="confirmReply()">
                            提交
                        </view>
                    </view>
                </view>
                <!-- #ifdef MP-WEIXIN -->
                <ad unit-id="adunit-6996f541fca34984"></ad>
                <!-- #endif -->
                <view v-if="noMore" class="no-more">
                    没有了，去看看别的或休息一下吧
                </view>
            </template>
        </template>
    </view>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { $getTopicDetail, $replyTopic } from '../service';
import AuthorInfo from '@/components/AuthorInfo';
import TopicTag from '@/components/TopicTag';
import Skeleton from '@/components/Skeleton';
import MarkDown from '@/components/MarkDown';
import { onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { useStore } from '../store';
const store = useStore();
let loading = ref(true);
let replyBox = ref(false);
let content = ref('');
let params = reactive({
    id: '',
    p: 1
});
let totalPage = ref(1);
let loadType = ref('refresh');
let noMore = ref(false);
let topicsDetail = ref({
    reply_list: [],
    subtle_list: []
});
const props = defineProps(['id']);
function onLoad() {
    params.id = props.id;
    params.p = 1;
    loadData();
}
onLoad();
async function loadData() {
    const replyList = topicsDetail.value.reply_list || [];
    const res = await $getTopicDetail(params);
    if (res) {
        let { reply_list, page, once } = res;
        if (params.p === 1) {
            topicsDetail.value = res;
            uni.setNavigationBarTitle({ title: topicsDetail.value.title });
            totalPage.value = page || 1;
        }
        topicsDetail.value.once = once;
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
            topicsDetail.value.reply_list = reply_list;
            uni.stopPullDownRefresh();
        } else {
            if (!noMore.value) {
                topicsDetail.value.reply_list = [...replyList, ...reply_list];
            }
        }
        if (params.p >= totalPage.value) {
            noMore.value = true;
        }
    }
    loading.value = false;
}
function onInputChange(e) {
    const {
        detail: { value }
    } = e;
    content.value = value;
}
async function confirmReply() {
    const { once, id } = topicsDetail.value;
    if (!content.value) {
        uni.showToast({
            title: '回复内容不能为空',
            icon: 'none'
        });
        return;
    }
    const params = {
        once,
        id,
        content: content.value
    };
    const data = await $replyTopic(params);
    if (data) {
        replyBox.value = false;
        content.value = '';
        params.p = 1;
        loadType.value = 'loadMore';
        noMore.value = false;
        await loadData();
        uni.pageScrollTo({
            scrollTop: 999999
        });
    } else {
        uni.showToast({
            title: '回复失败，请重试',
            icon: 'none'
        });
    }
}
function cancelReply() {
    replyBox.value = false;
    content.value = '';
}
function replyTopic(item) {
    if (!store.cookie) {
        uni.showModal({
            title: '提示',
            content: '登录后才能回帖',
            confirmText: '去登录',
            cancelText: '算了',
            success: ({ confirm }) => {
                if (confirm) {
                    uni.navigateTo({ url: '/pages/Login' });
                }
            }
        });
        return;
    }
    if (item) {
        const { author } = item;
        content.value = content.value
            ? `${content.value}\n@${author} `
            : `@${author} `;
    }
    replyBox.value = true;
}
onPullDownRefresh(() => {
    loadType.value = 'refresh';
    onLoad();
});
onReachBottom(() => {
    if (noMore.value) {
        return;
    }
    params.p = ++params.p;
    loadType.value = 'loadMore';
    loadData();
});
</script>
<style lang="less" scoped>
.container {
    padding-bottom: env(safe-area-inset-bottom);
}
text {
    user-select: text;
}
.subtle-wrap {
    background: #fffff9;
    color: #666;
    padding: 0 30px 25px;
    .title {
        padding-top: 25px;
        font-size: 24px;
        border-top: 2px solid #f5f5f5;
    }
}
.reply-btn {
    padding: 0 20px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    background: #4474ff;
    color: #fff;
    font-size: 28px;
    border-radius: 8px;
}
.reply-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 400px;
    padding: 20px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 0 20px #dedede;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    .textarea {
        background: #fff;
        width: 100%;
        flex: 1;
        border: 1px solid #dedede;
        margin-bottom: 10px;
        padding: 10px;
        box-sizing: border-box;
    }
    .tip {
        font-size: 26px;
        color: #999;
        margin-bottom: 10px;
    }
    .btn-wrap {
        align-self: flex-end;
    }
    .reply-btn {
        display: inline-block;
        padding: 0 20px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        background: #4474ff;
        color: #fff;
        font-size: 28px;
        border-radius: 8px;
    }
    .cancel-btn {
        background: #efefef;
        color: #999;
        margin-right: 20px;
    }
}
.topic-wrap {
    padding: 25px 30px;
    background: #fff;
    .user-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .title {
        font-size: 32px;
        color: #333;
        line-height: 45px;
        font-weight: bold;
        margin: 20px 0;
    }
}
.tag-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 30px;
    background: #fff;
}
.floor-wrap {
    display: flex;
    align-items: center;
    .reply-icon {
        width: 30px;
        height: 30px;
        margin-right: 15px;
    }
    .floor {
        color: #999;
        font-size: 22px;
    }
}
.reply-num {
    height: 50px;
    line-height: 50px;
    padding: 0 30px;
    background: #f5f5f5;
    color: #999;
    font-size: 22px;
    font-weight: 400;
}
.topic-reply {
    padding-bottom: 20px;
    border-bottom: 20px solid #f5f5f5;
    /deep/rich-text {
        font-weight: 500;
    }
    .user-info {
        margin-bottom: 10px;
    }
}
</style>
