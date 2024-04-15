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

<style lang="scss">
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
    font-family: PingFangSC-Regular, PingFang SC;
}
//* /deep/.uni-scroll-view::-webkit-scrollbar {
//    height: 0;
//    width: 0;
//    background: transparent;
//    display: none;
//}
view {
    margin: 0;
    padding: 0;
    font-family: PingFangSC-Regular, PingFang SC;
    font-size: 28rpx;
}
.container {
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    position: relative;
}
.list-wrap {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.item {
    padding: 25rpx 30rpx;
    border-bottom: 20rpx solid #f5f5f5;
    white-space: normal;
}
</style>
