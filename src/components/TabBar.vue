<template>
    <view class="tabbar-container">
        <view class="tabbar-wrap ignore">
            <view
                v-for="(item, index) in tabBar"
                :key="index"
                class="tabbar-item"
                @click="toggleTabBar(index)"
            >
                <image
                    :src="
                        currentTabBar === index
                            ? item.selectedIconPath
                            : item.iconPath
                    "
                    class="icon"
                />
                <view
                    :class="{ selected: currentTabBar === index }"
                    class="name"
                >
                    {{ item.text }}
                </view>
            </view>
        </view>
        <view class="safe-area"></view>
    </view>
</template>
<script setup>
import { reactive, toRefs } from 'vue';
import { useStore } from '../store';

const store = useStore();
let { currentTabBar } = toRefs(store);

const tabBar = reactive([
    {
        iconPath: '/static/icons/top-bright.png',
        selectedIconPath: '/static/icons/top-cur.png',
        text: '热门'
    },
    {
        iconPath: '/static/icons/all-bright.png',
        selectedIconPath: '/static/icons/all-cur.png',
        text: '全部'
    },
    {
        iconPath: '/static/icons/user-bright.png',
        selectedIconPath: '/static/icons/user-cur.png',
        text: '我的'
    }
]);
function toggleTabBar(index) {
    if (index === currentTabBar.value) {
        return;
    }
    store.changeTabBar(index);
}
</script>
<style lang="less" scoped>
.ignore {
    border-top: 1px solid #f0f0f0;
}
.tabbar-container {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 998;
    width: 100%;
    display: flex;
    flex-direction: column;
    .safe-area {
        height: env(safe-area-inset-bottom);
        width: 100%;
        background: #fff;
    }
    .tabbar-wrap {
        height: 90px;
        background: #fff;
        display: flex;
        .tabbar-item {
            padding-top: 10px;
            flex: 1;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .icon {
                width: 40px;
                height: 40px;
            }
            .name {
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                &.selected {
                    color: #4474ff;
                }
            }
        }
    }
}
</style>
