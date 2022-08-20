<template>
    <view class="sleletion-wrap">
        <view v-for="item in props.type === 'list' ? 7 : 1" class="topic-wrap">
            <view class="author-info">
                <view class="skeleton avatar"></view>
                <view class="skeleton name"></view>
                <view class="skeleton time"></view>
            </view>
            <view class="title">
                <view class="skeleton line1"></view>
                <view class="skeleton line2"></view>
            </view>
            <view class="topic-info">
                <view class="skeleton type"></view>
                <view class="skeleton reply"></view>
            </view>
        </view>
        <template v-if="props.type !== 'list'">
            <view class="divider">
                <view class="skeleton total"></view>
            </view>
            <view v-for="item in 10" class="reply-wrap">
                <view class="author-info">
                    <view class="info">
                        <view class="skeleton avatar"></view>
                        <view class="skeleton name"></view>
                        <view class="skeleton time"></view>
                    </view>
                    <view class="skeleton floor"></view>
                </view>
                <view class="title">
                    <view class="skeleton line1"></view>
                    <view class="skeleton line2"></view>
                </view>
            </view>
        </template>
    </view>
</template>
<script setup>
const props = defineProps({
    type: {
        default: 'list',
        type: String
    }
});
</script>
<style lang="less" scoped>
.sleletion-wrap {
    overflow: hidden;
    height: 100vh;
}
.author-info {
    display: flex;
    align-items: center;
    .avatar {
        width: 35px;
        margin-right: 10px;
        border-radius: 5px;
    }
    .name {
        width: 100px;
        margin-right: 20px;
    }
    .time {
        width: 80px;
    }
}
.title {
    margin-top: 15px;
    .line1 {
        width: 100%;
    }
    .line2 {
        width: 80%;
        margin-top: 10px;
    }
}
.topic-wrap {
    background: #fff;
    padding: 25px 30px;
    .topic-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 35px;
        margin-top: 10px;
        .type {
            width: 150px;
            border-radius: 25px;
        }
        .reply {
            width: 100px;
        }
    }
}
.reply-wrap {
    padding: 25px 30px;
    margin-top: 10px;
    .author-info {
        justify-content: space-between;
        .info {
            display: flex;
            align-items: center;
        }
        .floor {
            width: 50px;
        }
    }
}
.divider {
    padding: 0 30px 10px;
    .total {
        height: 30px;
    }
}
.skeleton {
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    height: 35px;
    animation: skeleton-loading 2.8s ease infinite;
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
</style>
