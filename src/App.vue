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
.load-failed {
    position: fixed;
    height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    .reload {
        text-align: center;
        margin-top: -300px;
        .empty-img {
            width: 300px;
            height: 300px;
        }
        .empty-desc {
            margin: 20px 0;
            color: #969799;
            font-size: 24px;
            line-height: 20px;
        }
        .empty-button {
            .btn-default;
        }
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
