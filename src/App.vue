<script>
export default {
    onLaunch: function () {
        console.log('App Launch');
    },
    onShow: function () {
        console.log('App Show');
    },
    onHide: function () {
        console.log('App Hide');
    }
};
</script>

<style lang="less">
html,
body,
uni-page-body,
page {
    /* #ifndef APP-PLUS */
    height: 100%;
    /* #endif */

    /* #ifdef APP-PLUS */
    height: 100vh;
    /* #endif */
}
/deep/.uni-scroll-view::-webkit-scrollbar {
    height: 0;
    width: 0;
    background: transparent;
    display: none;
}
view {
    margin: 0;
    padding: 0;
    font-family: PingFangSC-Regular, PingFang SC;
    font-size: 28rpx;
}
.container {
    padding-bottom: env(safe-area-inset-bottom);
}
.btn-default {
    margin: 20rpx auto;
    width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 60rpx;
    color: #fff;
    text-align: center;
    background: #4474ff;
    font-size: 28rpx;
}
.list-wrap {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .item {
        white-space: normal;
        border-bottom: 20rpx solid #f5f5f5;
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
    }
}
</style>
