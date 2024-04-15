<template>
    <view class="container">
        <uv-back-top :scroll-top="scrollTop" top="800"></uv-back-top>
        <uv-empty
            v-if="error === false"
            icon="https://img01.yzcdn.cn/vant/empty-image-default.png"
            text="加载失败"
            style="padding-top: 160px"
        >
            <uv-gap height="30"></uv-gap>
            <uv-button
                type="primary"
                :customStyle="{ padding: '0 25px' }"
                shape="circle"
                loadingText="加载中"
                text="加载失败"
                @click="reload()"
                :loading="loading"
            >
                再试一次
            </uv-button>
        </uv-empty>
        <view class="topic-header">
            <view class="header-top">
                <text class="name">
                    {{ title || detail.topic_title || '' }}
                </text>
                主题总数 {{ detail.topic_count || 0 }}
            </view>
            <view class="header-bottom">
                {{ detail.topic_intro || 'World is powered by solitude' }}
            </view>
        </view>
        <view class="list-wrap">
            <uv-skeletons
                :loading="loading && page === 1"
                :skeleton="
                    skeleton.concat(
                        skeleton,
                        skeleton,
                        skeleton,
                        skeleton,
                        skeleton,
                        skeleton
                    )
                "
            >
                <view
                    v-for="(item, index) in data"
                    :key="index"
                    class="item"
                    @click="getTopicsDetail(item)"
                >
                    <v-topic :item="item"></v-topic>
                </view>
                <uv-load-more
                    :status="
                        isLastPage ? 'nomore' : loading ? 'loading' : 'loadmore'
                    "
                    height="60"
                />
            </uv-skeletons>
        </view>
    </view>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { $getAllTopics } from '../service';
import {
    onPageScroll,
    onPullDownRefresh,
    onReachBottom
} from '@dcloudio/uni-app';
import VTopic from '@/components/v-topic.vue';
import { useIndexStore } from '@/stores';
import { usePagination } from '@alova/scene-vue';
import { getTopicsDetail } from '@/hooks';

const props = defineProps(['value', 'title']);

const store = useIndexStore();
const { visited } = storeToRefs(store);
const { skeleton } = store;

const scrollTop = ref(0);

const detail = ref({
    topic_count: 0,
    topic_intro: '',
    topic_title: ''
});

const {
    data,
    loading,
    send,
    error,
    reload,
    total,
    page,
    isLastPage,
    onSuccess,
    onComplete
} = usePagination(
    (page, pageSize) =>
        $getAllTopics({
            tab: props.value,
            p: page
        }),
    {
        append: true,
        initialPageSize: 20,
        data: response => response.list || []
    }
);
onComplete(() => {
    uni.stopPullDownRefresh();
});
onSuccess(({ data: res }) => {
    if (res) {
        detail.value = res.detail;
        data.value = data.value.map(item => {
            let isVisited = false;
            if (visited.value.includes(item.id)) {
                isVisited = true;
            }
            item.tag_name = props.title;
            item.tag_link = props.value;
            item.noNavigate = true;
            return { ...item, visited: isVisited };
        });
    }
});

onPageScroll(e => {
    scrollTop.value = e.scrollTop;
    // #ifdef APP-NVUE
    scrollTop.value = e.detail.scrollTop;
    // #endif
});

onPullDownRefresh(reload);

onReachBottom(() => {
    if (error.value !== false) {
        page.value++;
    }
});
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
