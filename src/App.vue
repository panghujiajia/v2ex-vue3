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
view {
    margin: 0;
    padding: 0;
    font-family: PingFangSC-Regular, PingFang SC;
    font-size: 28px;
}
.container {
    padding-bottom: env(safe-area-inset-bottom);
}
.btn-default {
    margin: 20px auto;
    width: 240px;
    height: 60px;
    line-height: 60px;
    border-radius: 60px;
    color: #fff;
    text-align: center;
    background: #4474ff;
    font-size: 24px;
}
.list-wrap {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .item {
        white-space: normal;
        border-bottom: 20px solid #f5f5f5;
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
    }
}
.no-more {
    text-align: center;
    padding: 20px 0;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    font-size: 22px;
}
</style>
