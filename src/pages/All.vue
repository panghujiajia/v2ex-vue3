<template>
    <scroll-view
        :scroll-y="true"
        class="scroll-view"
        @touchmove.prevent.stop="
            () => {
                return false;
            }
        "
    >
        <view class="my-tags">
            <view>
                <view class="title">我喜欢的</view>
                <template v-if="myTag.length">
                    <view
                        v-for="item in myTag"
                        :key="item.value"
                        :class="{
                            shake: isEdit
                        }"
                        class="my-tag"
                        @click="handleClick(item)"
                    >
                        {{ item.title }}
                    </view>
                </template>
                <view class="tag edit" @click="toggleEdit()">
                    {{ isEdit ? '完成' : '编辑' }}
                </view>
            </view>
        </view>
        <view class="tag-wrap">
            <view>
                <view class="title">测试节点</view>
                <view
                    class="tag"
                    @click="handleClick({ value: 'sandbox', title: '沙盒' })"
                >
                    沙盒
                </view>
            </view>
            <view v-for="key in Object.keys(allTag)" :key="key">
                <view class="title">{{ key }}</view>
                <view
                    v-for="item in allTag[key]"
                    :key="item.value"
                    :class="{
                        shake: isEdit,
                        cur: isEdit && item.active
                    }"
                    class="tag"
                    @click="handleClick(item)"
                >
                    {{ item.title }}
                </view>
            </view>
        </view>
    </scroll-view>
</template>

<script setup>
import { useIndexStore } from '../stores';
import { ref } from 'vue';
import { storeToRefs } from 'pinia/dist/pinia';
import { onHide } from '@dcloudio/uni-app';

const store = useIndexStore();
let { allTag, myTag } = storeToRefs(store);

let isEdit = ref(false);

function getTag(tag) {
    uni.navigateTo({
        url: `/pages/Tag?value=${tag.value}&title=${tag.title}`
    });
}
function handleClick(tag) {
    // 编辑模式
    if (isEdit.value) {
        uni.vibrateShort({});
        setMyTag(tag);
    } else {
        getTag(tag);
    }
}
function toggleEdit() {
    uni.vibrateShort({});
    isEdit.value = !isEdit.value;
}
function setMyTag(tag) {
    const index = myTag.value.findIndex(item => {
        return item.title === tag.title;
    });
    if (index > -1) {
        tag.active = false;
        myTag.value.splice(index, 1);
    } else {
        tag.active = true;
        myTag.value.push(tag);
    }
    store.updateMyTag(myTag.value);
}
onHide(() => {
    isEdit.value = false;
});
// #ifdef MP-WEIXIN
function onShareAppMessage(e) {
    return {
        title: 'v2ex',
        path: '/pages/Hot'
    };
}
// #endif
</script>
<style lang="less" scoped>
.scroll-view {
    height: 100%;
}
.my-tags,
.tag-wrap {
    padding: 20rpx;
    .title {
        line-height: 80rpx;
        margin-bottom: 20rpx;
        font-size: 30rpx;
        font-weight: bold;
    }
    .tag,
    .my-tag {
        line-height: 60rpx;
        padding: 0 20rpx;
        background: #f2f2f2;
        border-radius: 10rpx;
        font-size: 24rpx;
        height: 60rpx;
        display: inline-block;
        vertical-align: top;
        margin: 0 20rpx 20rpx 0;
        &.cur {
            background: darkgray;
            color: #fff;
        }
        &.shake {
            &:nth-child(n) {
                animation: shake infinite alternate 0.1s;
            }
            &:nth-child(2n) {
                animation-delay: 0.1s;
            }
            &:nth-child(3n) {
                animation-delay: 0.2s;
            }
            &:nth-child(4n) {
                animation-delay: 0.1s;
            }
            &:nth-child(4n) {
                animation-delay: 0;
            }
        }
        &.touch {
            box-shadow: 0 0 13rpx #ccc;
        }
    }
    .edit {
        background: #fff;
        border: 2rpx solid #dedede;
        box-sizing: border-box;
        color: #666;
    }
}
@keyframes shake {
    from {
        transform: rotate(2deg);
    }
    to {
        transform: rotate(-2deg);
    }
}
</style>
