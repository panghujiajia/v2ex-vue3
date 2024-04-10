<template>
    <view class="container">
        <Skeleton v-if="loading || fetching" type="detail"></Skeleton>
        <LoadFailed
            v-else-if="!detail.title && finished"
            :status="true"
            @reload="reload()"
        ></LoadFailed>
        <template v-else>
            <view class="topic-wrap">
                <AuthorInfo :item="detail"></AuthorInfo>
                <view class="title">{{ detail.title }}</view>
                <MarkDown :content="detail.content"></MarkDown>
            </view>
            <view v-if="detail.subtle_list.length" class="subtle-wrap">
                <template
                    v-for="(item, index) in detail.subtle_list"
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
                <TopicTag :item="detail"></TopicTag>
            </view>
            <view class="divider"></view>
            <view class="reply-option" v-if="total">
                <view class="reply-num"> {{ total }}条回复</view>
                <view class="tabs">
                    <text
                        v-for="(item, index) in items"
                        :class="{ cur: index === current }"
                        @click="current = index"
                    >
                        {{ item }}
                    </text>
                </view>
            </view>
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
                <MarkDown
                    v-if="item.quote"
                    class="quote"
                    :content="item.quote"
                ></MarkDown>
                <MarkDown class="md" :content="item.content"></MarkDown>
            </view>
            <!-- #ifdef MP-WEIXIN -->
            <ad unit-id="adunit-6996f541fca34984"></ad>
            <!-- #endif -->
            <NoMore v-if="isLastPage"></NoMore>
        </template>
    </view>
</template>
<script setup>
import { ref, toRaw, watch } from 'vue';
import { $getTopicDetail } from '@/service';
import { onPullDownRefresh } from '@dcloudio/uni-app';
import { useIndexStore } from '@/stores';
import { usePagination } from '@alova/scene-vue';
import LoadFailed from '@/components/LoadFailed.vue';
import Skeleton from '@/components/Skeleton.vue';
import AuthorInfo from '@/components/AuthorInfo.vue';
import MarkDown from '@/components/MarkDown.vue';
import TopicTag from '@/components/TopicTag.vue';
import NoMore from '@/components/NoMore.vue';

const props = defineProps(['id']);
const store = useIndexStore();

const items = ['正序', '倒序', 'OP'];
const current = ref(0);

const finished = ref(false);

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

watch(current, (value, oldValue) => {
    console.log(toRaw(positiveData.value));
    switch (value) {
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
});

const {
    data,
    loading,
    fetching,
    send,
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
    uni.setNavigationBarTitle({ title: res.detail.title });
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

onComplete(() => {
    finished.value = true;
});

onPullDownRefresh(reload);
</script>
<style lang="less" scoped>
text {
    user-select: text;
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

.reply-option {
    display: flex;
    justify-content: space-between;
}

.floor {
    color: #999;
    font-size: 22rpx;
}

.reply-option {
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 30rpx;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    align-items: center;

    .reply-num {
        color: #666;
        font-size: 24rpx;
        font-weight: 400;
    }

    .tabs {
        display: flex;
        align-items: center;
        background: #f9f9f9;
        height: 40rpx;
        width: 240rpx;
        border: 2px solid #f9f9f9;

        text {
            flex: 1;
            font-size: 22rpx;
            height: 38rpx;
            color: #666;
            line-height: 38rpx;
            text-align: center;
        }

        .cur {
            background: #fff;
            font-weight: bold;
        }
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
        border-bottom: 1px solid #f5f5f5;
        padding-bottom: 25rpx;
        padding-right: 30rpx;
    }

    .quote {
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
