<template>
    <mp-html
        v-if="props.content"
        :content="props.content"
        markdown
        selectable
        loading-img="https://via.placeholder.com/400x250.png?text=V2EX"
        @linktap="linkClick"
    />
</template>
<script setup>
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html';
import { useIndexStore } from '../stores';

const props = defineProps(['content']);
const store = useIndexStore();

function linkClick(e) {
    const { href, innerText } = e;
    const hrefArr = href.split('/');
    if (hrefArr.length >= 3) {
        // 点击 @用户 跳转对应楼层
        // if (href.indexOf('/member/') > -1) {
        //     // this.lastScrollTop = this.scrollTop;
        //     const query = uni.createSelectorQuery().in(this);
        //     query
        //         .select(`.${innerText}`)
        //         .boundingClientRect(data => {
        //             uni.pageScrollTo({
        //                 scrollTop: this.scrollTop + data.top
        //             });
        //         })
        //         .exec();
        //     return;
        // }
        // 链接为主题详情
        if (href.indexOf('/t/') > -1) {
            let id = href.split('/').pop();
            if (!/^[0-9]*$/.test(id)) {
                if (id.includes('#')) {
                    id = id.split('#').shift();
                } else {
                    return;
                }
            }
            uni.navigateTo({
                url: `/pages/Detail?id=${id}`
            });
            return;
        }
        // 链接为节点链接
        if (href.indexOf('/go/') > -1) {
            const val = href.split('/').pop();
            uni.navigateTo({
                url: `/pages/Tag?value=${val}`
            });
            return;
        }
    }
    // #ifdef MP-WEIXIN
    uni.setClipboardData({
        data: href,
        success: () => {
            uni.showToast({
                title: '链接复制成功',
                icon: 'none'
            });
        }
    });
    // #endif
    // #ifdef APP-PLUS
    plus.runtime.openURL(href);
    // #endif
}
</script>
<style lang="scss" scoped>
::v-deep(.user-name) {
    color: $uv-main-color;
    view,
    text {
        color: $uv-main-color;
    }

    ._hover {
        text-decoration: none;
    }
}
</style>
