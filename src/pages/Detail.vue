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
        <template v-else>
            <view class="topic-wrap base-padding">
                <v-author :item="detail"></v-author>
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
            <view
                v-if="detail && detail.subtle_list.length && !loading"
                class="base-padding"
            >
                <template
                    v-for="(item, index) in detail.subtle_list"
                    :key="index"
                >
                    <v-section
                        :title="`第${index + 1}条附言`"
                        :sub-title="item.time"
                    ></v-section>
                    <MarkDown
                        style="padding-left: 20rpx; margin-top: 10rpx"
                        :content="item.content"
                    ></MarkDown>
                    <uv-gap height="30rpx"></uv-gap>
                </template>
            </view>
            <view class="tag-wrap">
                <v-tag :item="detail"></v-tag>
            </view>
            <template v-if="hotData.length && !loading">
                <uv-gap height="20rpx" bgColor="#f5f5f5"></uv-gap>
                <view class="base-padding hot-data">
                    <v-section title="热门回复"></v-section>
                </view>
                <view class="reply-wrap">
                    <v-reply-item
                        v-for="item in hotData"
                        :key="item.index"
                        :item="item"
                    ></v-reply-item>
                </view>
            </template>
            <uv-gap height="20rpx" bgColor="#f5f5f5"></uv-gap>
            <uv-sticky offset-top="0">
                <view class="reply-option" v-if="total && !loading">
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
                            activeColor="#02B386"
                            @change="handleChange"
                        ></uv-subsection>
                    </view>
                </view>
            </uv-sticky>
            <view class="reply-wrap">
                <uv-skeletons :loading="loading" :skeleton="skeletonReply">
                    <v-reply-item
                        v-for="item in data"
                        :key="item.index"
                        :item="item"
                    ></v-reply-item>
                </uv-skeletons>
            </view>
            <!-- #ifdef MP-WEIXIN -->
            <ad unit-id="adunit-6996f541fca34984"></ad>
            <!-- #endif -->
            <uv-empty
                v-if="error !== false && !loading && !data.length"
                icon="https://img01.yzcdn.cn/vant/empty-image-default.png"
                text="暂无回复"
                style="padding-bottom: 60px"
            ></uv-empty>
            <uv-load-more
                v-if="isLastPage && !loading && data.length"
                status="nomore"
                height="60"
            />
        </template>
    </view>
</template>
<script setup>
import { onMounted, ref, toRaw } from 'vue';
import { $getTopicDetail } from '@/service';
import { onPageScroll, onPullDownRefresh } from '@dcloudio/uni-app';
import { useIndexStore } from '@/stores';
import { usePagination } from '@alova/scene-vue';
import VAuthor from '@/components/v-author.vue';
import MarkDown from '@/components/MarkDown.vue';
import { storeToRefs } from 'pinia';
import VTag from '@/components/v-tag.vue';
import VSection from '@/components/v-section.vue';
import VReplyItem from '@/components/v-reply-item.vue';

const props = defineProps(['id']);
const store = useIndexStore();

const { topicBaseInfo } = storeToRefs(store);

const items = ['正序', '倒序', 'OP'];
const current = ref(0);

const scrollTop = ref(0);

let timer = null;

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

const skeletonReply = [
    {
        type: 'flex',
        num: 1,
        children: [
            {
                type: 'custom',
                num: 1,
                style: 'width:60rpx;height:60rpx;marginRight: 20rpx;'
            },
            {
                type: 'line',
                num: 2,
                gap: 10,
                style: [
                    'width:160rpx;height: 25rpx',
                    'width:100rpx;height: 25rpx'
                ]
            }
        ]
    },
    20,
    {
        type: 'line',
        num: 3,
        gap: 10,
        style: 'width:calc(100% - 80rpx);marginLeft: 80rpx'
    }
];

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
        middleware: async (ctx, next) => {
            if (timer) {
                clearTimeout(timer);
            }
            ctx.controlLoading();
            ctx.update({ loading: true });
            await next();
            timer = setTimeout(
                () => {
                    ctx.update({ loading: false });
                },
                ctx.cachedResponse ? 300 : 1500
            );
        },
        data: response => {
            let list = response.list || [];
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
onComplete(() => {
    uni.stopPullDownRefresh();
});
onSuccess(({ data: res }) => {
    if (res) {
        detail.value = res.detail;
        store.saveHistoryTopics(res.detail);
        if (!isLastPage.value) {
            page.value++;
        } else {
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
            hotData.value = JSON.parse(
                JSON.stringify(toRaw(data.value))
            ).filter(item => item.like_num >= 10);
        }
    }
});

onPageScroll(e => {
    scrollTop.value = e.scrollTop;
    // #ifdef APP-NVUE
    scrollTop.value = e.detail.scrollTop;
    // #endif
});

onPullDownRefresh(reload);
</script>
<style lang="scss" scoped>
.base-padding {
    padding: 25rpx 30rpx;
}

.topic-wrap {
    .title {
        font-size: 32rpx;
        color: $uv-main-color;
        line-height: 45rpx;
        font-weight: bold;
        margin: 10rpx 0;
    }
}

.tag-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx 25rpx;
}

.reply-option {
    background: #fff;
    height: 70rpx;
    padding: 0 30rpx;
    border-bottom: 1px solid $uv-bg-color;
    border-top: 1px solid $uv-bg-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.hot-data {
    border-bottom: 1px solid $uv-bg-color;
}

.reply-wrap {
    padding: 25rpx 30rpx 0;
}
</style>
