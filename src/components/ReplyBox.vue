<template>
    <view
        :style="{
            opacity: replyVisible ? 1 : 0,
            visibility: replyVisible ? 'visible' : 'hidden'
        }"
        class="reply-container"
        @click="hideReply"
    >
        <view
            :style="{
                transform: `translateY(${boxBottom}px)`
            }"
            class="reply-wrap"
            @click.stop.prevent="
                () => {
                    return false;
                }
            "
        >
            <view class="content-box">
                <textarea
                    :adjust-position="false"
                    :focus="isFocus"
                    :maxlength="-1"
                    :show-confirm-bar="false"
                    :value="content"
                    auto-focus
                    auto-height
                    class="textarea"
                    fixed
                    placeholder="请输入内容"
                    @input="onInputChange"
                />
                <view class="tip">
                    <view>请尽量让自己的回复能够对别人有帮助</view>
                    <view>若提交失败请尝试重新登录</view>
                </view>
            </view>
            <view
                :class="!content ? 'disabled' : ''"
                class="reply-btn"
                @click.stop.prevent="confirmReply()"
            >
                提交
            </view>
        </view>
    </view>
</template>
<script setup>
import { nextTick, ref, watch } from 'vue';
import { $replyTopic } from '../service';

let content = ref('');
let isFocus = ref(false);
let boxBottom = ref(1000);
let replyVisible = ref(false);
const props = defineProps(['replyWho', 'topic', 'show']);
const emit = defineEmits(['replySuccess']);
watch(
    () => props.replyWho,
    (newVal, oldVal) => {
        if (newVal) {
            if (props.replyWho.value) {
                const { author } = props.replyWho;
                content.value = `${content.value}\n@${author} `;
            }
        }
    }
);
function showReply() {
    replyVisible.value = true;
    isFocus.value = true;
    boxBottom.value = 0;
}
function hideReply() {
    replyVisible.value = false;
    isFocus.value = false;
    boxBottom.value = 1000;
}
defineExpose({ showReply });

async function onInputChange(e) {
    const {
        detail: { value }
    } = e;
    content.value = value;
}
async function confirmReply() {
    const { once, id } = props.topic;
    if (!content.value) {
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
        emit('replySuccess');
    } else {
        uni.showToast({
            title: '回复失败，请重试',
            icon: 'none'
        });
    }
}
</script>
<style lang="less" scoped>
.reply-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: all linear 0.2s;
}
.reply-wrap {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100vw;
    padding: 25rpx 30rpx 360px;
    box-sizing: border-box;
    background: #fff;
    height: auto;
    transition: all linear 0.2s;
    border-radius: 20rpx 20rpx 0 0;
    transform: translateY(1000px);
    .content-box {
        word-break: break-all;
        .textarea {
            line-height: 44rpx;
            margin-right: 100rpx;
            width: calc(100% - 100rpx);
        }
        .tip {
            color: #999;
            margin-top: 10rpx;
            view {
                font-size: 22rpx;
                line-height: 34rpx;
            }
        }
    }
    .reply-btn {
        display: inline-block;
        text-align: center;
        width: 80rpx;
        height: 50rpx;
        line-height: 50rpx;
        background: #4474ff;
        color: #fff;
        font-size: 26rpx;
        border-radius: 5rpx;
        position: absolute;
        z-index: 10;
        top: 20rpx;
        right: 20rpx;
        &.disabled {
            background: #dedede;
        }
    }
}
</style>
