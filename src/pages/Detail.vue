<template>
    <view class="container" ref="backTop">
        <uv-back-top :scroll-top="scrollTop" top="800"></uv-back-top>
        <uv-empty
            v-if="error === false"
            icon="https://img01.yzcdn.cn/vant/empty-image-default.png"
            :text="useRandomText('load')"
            style="padding-top: 160px"
        >
            <uv-gap height="30"></uv-gap>
            <uv-button
                type="primary"
                :customStyle="{ padding: '0 25px' }"
                shape="circle"
                loadingText="加载中"
                :text="useRandomText()"
                @click="reload()"
                :loading="loading"
            >
                再试一次
            </uv-button>
        </uv-empty>
        <template v-else>
            <view class="topic-wrap">
                <AuthorInfo :loading="!loading" :item="detail"></AuthorInfo>
                <view class="title">{{ detail.title }}</view>
                <uv-skeletons
                    :loading="loading"
                    :skeleton="[
                        {
                            type: 'line',
                            num: 3,
                            gap: '20rpx'
                        }
                    ]"
                >
                    <MarkDown :content="detail.content"></MarkDown>
                </uv-skeletons>
            </view>
            <view v-if="detail.subtle_list.length" class="subtle-wrap">
                <template
                    v-for="(item, index) in detail.subtle_list"
                    :key="index"
                >
                    <view class="title">
                        第{{ index + 1 }}条附言 {{ item.time }}
                    </view>
                    <view class="content" :class="{ loading }">
                        <MarkDown :content="item.content"></MarkDown>
                    </view>
                </template>
            </view>
            <view class="tag-info">
                <TopicTag :item="detail"></TopicTag>
            </view>
            <view class="divider"></view>
            <uv-sticky offset-top="0">
                <view class="reply-option" v-if="total">
                    <uv-text
                        type="info"
                        bold
                        size="14"
                        :text="`${total}条回复`"
                    ></uv-text>
                    <view style="width: 240rpx">
                        <uv-subsection
                            :list="items"
                            :current="current"
                            custom-style="border-radius: 30rpx;"
                            custom-item-style="border-radius: 30rpx;"
                            @change="handleChange"
                        ></uv-subsection>
                    </view>
                </view>
            </uv-sticky>
            <view
                v-for="item in data"
                :key="item.index"
                :class="item.author"
                class="reply-wrap"
            >
                <view class="user-info">
                    <AuthorInfo :item="item"></AuthorInfo>
                    <view class="floor">
                        {{ `${item.index}楼` }}
                    </view>
                </view>
                <view class="md-wrap">
                    <view class="quote-wrap" v-if="item.quote">
                        <MarkDown :content="item.quote"></MarkDown>
                    </view>
                    <MarkDown :content="item.content"></MarkDown>
                </view>
            </view>
            <!-- #ifdef MP-WEIXIN -->
            <ad unit-id="adunit-6996f541fca34984"></ad>
            <!-- #endif -->
            <uv-load-more
                v-if="isLastPage && !loading"
                :nomoreText="useRandomText('more')"
                status="nomore"
                height="60"
            />
            <uv-safe-bottom></uv-safe-bottom>
        </template>
    </view>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref, toRaw, watch } from 'vue';
import { $getTopicDetail } from '@/service';
import { onPageScroll, onPullDownRefresh } from '@dcloudio/uni-app';
import { useIndexStore } from '@/stores';
import { usePagination } from '@alova/scene-vue';
import AuthorInfo from '@/components/AuthorInfo.vue';
import MarkDown from '@/components/MarkDown.vue';
import TopicTag from '@/components/TopicTag.vue';
import { useRandomText } from '@/hooks';
import { storeToRefs } from 'pinia';

const props = defineProps(['id']);
const store = useIndexStore();

const { topicBaseInfo } = storeToRefs(store);

const items = ['正序', '倒序', 'OP'];
const current = ref(0);

const scrollTop = ref(0);

const reverseData = ref([]);
const positiveData = ref([]);
const opData = ref([]);
const hotData = ref([]); // 热门评论

const detail = ref({
    id: '',
    once: '',
    avatar: '',
    title: '',
    content: '',
    author: '',
    publish_time: '',
    tag_name: '',
    tag_link: '',
    subtle_list: []
});

onMounted(() => {
    detail.value = {
        ...detail.value,
        ...topicBaseInfo.value
    };
});

function handleChange(index) {
    current.value = index;
    switch (index) {
        case 0:
            data.value = positiveData.value;
            break;
        case 1:
            data.value = reverseData.value;
            break;
        case 2:
            data.value = opData.value;
            break;
    }
}

const {
    data,
    loading,
    fetching,
    send,
    error,
    reload,
    total,
    page,
    isLastPage,
    onSuccess,
    onComplete
} = usePagination(
    (page, pageSize) => $getTopicDetail({ id: props.id, p: page }),
    {
        append: true,
        initialPageSize: 100,
        data: response => {
            let list = response.list;
            list = list.map(item => {
                return {
                    ...item,
                    content: item.content.replace(
                        /(@.*?>)(.*?)(<\/a>)/g,
                        '<text class="user-name">$1$2$3</text>'
                    )
                };
            });
            return list;
        }
    }
);

onSuccess(({ data: res }) => {
    detail.value = res.detail;
    store.saveHistoryTopics(res.detail);
    if (!isLastPage.value) {
        page.value++;
    } else {
        uni.stopPullDownRefresh();
        data.value = data.value.map((item, index) => {
            item.quote = '';
            const frontData = JSON.parse(JSON.stringify(toRaw(data.value)))
                .splice(0, index)
                .reverse();
            if (frontData.length >= 1) {
                let excludeAuthor = [];
                for (let i = 0; i < frontData.length; i++) {
                    let frontItem = frontData[i];
                    if (
                        item.content.includes(frontItem.author) &&
                        !excludeAuthor.includes(frontItem.author)
                    ) {
                        item.quote += `<view>${frontItem.content}</view><view style="display: block;height: 20rpx"></view>`;
                        excludeAuthor.push(frontItem.author);
                    }
                }
            }
            return { ...item, index: index + 1 };
        });
        positiveData.value = data.value;
        reverseData.value = JSON.parse(
            JSON.stringify(toRaw(data.value))
        ).reverse();
        opData.value = JSON.parse(JSON.stringify(toRaw(data.value))).filter(
            item => item.is_master
        );
    }
});

onPageScroll(e => {
    scrollTop.value = e.scrollTop;
    // #ifdef APP-NVUE
    scrollTop.value = e.detail.scrollTop;
    // #endif
    console.log(isLastPage && !loading);
});

onPullDownRefresh(reload);
</script>
<style lang="less" scoped>
text {
    user-select: text;
}

@keyframes skeleton-loading {
    0% {
        background-position: 100% 50%;
    }
    50% {
        background-position: 0 50%;
    }
    100% {
        background-position: 0 50%;
    }
}

.loading {
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    height: 100%;
    animation: skeleton-loading 2.8s ease infinite;
}

.subtle-wrap {
    background: #f9f9f9;
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

.divider {
    height: 20rpx;
    background: #f5f5f5;
}

.floor {
    color: #999;
    font-size: 22rpx;
}

.reply-option {
    background: #fff;
    height: 70rpx;
    padding: 0 30rpx;
    border-bottom: 1px solid #f5f5f5;
    border-top: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .reply-num {
        color: #666;
        font-size: 24rpx;
        font-weight: 400;
    }
}

.reply-wrap {
    padding: 25rpx 0 0 30rpx;

    .user-info {
        display: flex;
        justify-content: space-between;
        padding-right: 30rpx;
    }

    .md,
    .quote {
        margin-left: 80rpx;
        padding-bottom: 25rpx;
        padding-right: 30rpx;
    }

    .md-wrap {
        margin-left: 80rpx;
        padding-bottom: 25rpx;
        padding-right: 30rpx;
        border-bottom: 1px solid #f5f5f5;
    }

    .quote-wrap {
        background: #f9f9f9;
        padding: 20rpx 20rpx 0;
        margin-right: 30rpx;
        margin-bottom: 20rpx;
    }

    .user-info {
        margin-bottom: 10rpx;
    }
}
</style>
