<template>
    <mp-html
        v-if="props.content"
        :content="props.content"
        :copyLink="false"
        markdown
        selectable
        @linktap="linkClick"
    />
</template>
<script setup>
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html';
const props = defineProps(['content']);
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
        if (this.autoNavigate) {
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
<style lang="less" scoped>
/deep/.user-name {
    color: #4474ff;
    view,
    text {
        color: #4474ff;
        font-weight: bold;
    }
    ._hover {
        text-decoration: none;
    }
}
</style>
