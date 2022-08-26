<template>
    <view class="reply-wrap">
        <textarea
            :hold-keyboard="true"
            :maxlength="-1"
            :show-confirm-bar="false"
            :value="content"
            auto-focus
            class="textarea"
            fixed
            placeholder="请输入内容"
            placeholder-style="font-size: 28rpx;color: #999;"
            @input="onInputChange"
        />
        <view class="tip">
            <view>请尽量让自己的回复能够对别人有帮助</view>
            <view>若提交失败请尝试重新登录</view>
        </view>
        <view class="btn-wrap">
            <view class="reply-btn cancel-btn" @click="cancelReply()">
                取消
            </view>
            <view class="reply-btn" @click="confirmReply()"> 提交 </view>
        </view>
    </view>
</template>
<script setup>
import { ref, watch } from 'vue';
import { $replyTopic } from '../service';

let content = ref('');
let replyBox = ref(false);
const props = defineProps(['replyWho', 'topic']);
console.log(props.replyWho);
watch(props.replyWho, (oldVal, newVal) => {
    console.log(oldVal, newVal);
    if (newVal) {
        const { author } = props.replyWho;
        content.value = content.value
            ? `${content.value}\n@${author} `
            : `@${author} `;
    }
});
function changesFun() {
    console.log(1111);
}
defineExpose({ changesFun });
function onInputChange(e) {
    const {
        detail: { value }
    } = e;
    content.value = value;
}
async function confirmReply() {
    const { once, id } = props.topic;
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
        content.value = '';
        // params.p = 1;
        // loadType.value = 'refresh';
        // noMore.value = false;
        // await loadData();
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
    content.value = '';
}
</script>
<style lang="less" scoped>
.reply-btn {
    padding: 0 20rpx;
    height: 50rpx;
    text-align: center;
    line-height: 50rpx;
    background: #4474ff;
    color: #fff;
    font-size: 28rpx;
    border-radius: 8rpx;
}
.reply-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 400rpx;
    padding: 20rpx;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 0 20rpx #dedede;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    .textarea {
        background: #fff;
        width: 100%;
        flex: 1;
        border: 1rpx solid #dedede;
        margin-bottom: 10rpx;
        padding: 10rpx;
        box-sizing: border-box;
    }
    .tip {
        font-size: 26rpx;
        color: #999;
        margin-bottom: 10rpx;
    }
    .btn-wrap {
        align-self: flex-end;
    }
    .reply-btn {
        display: inline-block;
        padding: 0 20rpx;
        height: 50rpx;
        text-align: center;
        line-height: 50rpx;
        background: #4474ff;
        color: #fff;
        font-size: 28rpx;
        border-radius: 8rpx;
    }
    .cancel-btn {
        background: #efefef;
        color: #999;
        margin-right: 20rpx;
    }
}
</style>
