import { defineStore } from 'pinia';
import allTags from '../config/allTag.config';
import { reactive, ref } from 'vue';
import {
    $getLoginReward,
    $getLoginRewardInfo,
    $getUserBalance,
    $getUserInfo,
    $getUserNotifications,
    $getV2exConfig
} from '@/service';

export const useIndexStore = defineStore(
    'v2ex',
    () => {
        const dev = import.meta.env.DEV;
        const tabs = ref([
            {
                name: 'Top10',
                value: 'top'
            },
            {
                name: '全部',
                value: 'all'
            },
            {
                name: '技术',
                value: 'tech'
            },
            {
                name: '创意',
                value: 'creative'
            },
            {
                name: '好玩',
                value: 'play'
            },
            {
                name: 'Apple',
                value: 'apple'
            },
            {
                name: '酷工作',
                value: 'jobs'
            },
            {
                name: '交易',
                value: 'deals'
            },
            {
                name: '城市',
                value: 'city'
            },
            {
                name: '问与答',
                value: 'qna'
            },
            {
                name: '最热',
                value: 'hot'
            }
        ]);

        const currentTabIndex = ref(0);
        const currentTabName = ref('top');

        const allTag = reactive(allTags);
        const myTag = ref([]);

        const v2exConfig = ref({});

        const historyTopic = ref([]);

        const topicBaseInfo = ref({
            id: '',
            title: '',
            reply_num: '',
            tag_name: '',
            tag_link: '',
            author: '',
            avatar: '',
            last_reply_time: '',
            replyer: ''
        });

        const skeleton = [
            30,
            {
                type: 'flex',
                num: 1,
                children: [
                    {
                        type: 'custom',
                        num: 1,
                        style: 'width:60rpx;height:60rpx;margin:0 20rpx 0 30rpx;'
                    },
                    {
                        type: 'line',
                        num: 2,
                        gap: 10,
                        style: [
                            'width:100rpx;height: 25rpx',
                            'width:160rpx;height: 25rpx'
                        ]
                    }
                ]
            },
            20,
            {
                type: 'line',
                num: 2,
                gap: 10,
                style: 'width:calc(100% - 60rpx);marginLeft: 30rpx'
            },
            20
        ];

        const autoSign = ref(false);
        const cookie = ref('');
        const toastTitle = ref('');
        const notifications = ref(0);
        const visited = ref([]);
        const userInfo = ref({
            avatar: '',
            balance: [],
            sign_in_day: '',
            info: '',
            is_sign_in: '',
            username: '',
            password: ''
        });

        function saveTopicBaseInfo(info) {
            topicBaseInfo.value = info;
        }

        function updateVisited(id) {
            visited.value.push(id);
        }

        function changeTabIndex(index) {
            currentTabIndex.value = index;
            changeTabName();
        }

        function changeTabName() {
            currentTabName.value = tabs.value[currentTabIndex.value].value;
        }

        function updateMyTag(tag) {
            myTag.value = tag;
        }

        function updateV2exConfig(data) {
            v2exConfig.value = data;
        }

        function saveNotifications(num) {
            notifications.value = num;
        }

        async function getV2exConfig() {
            const data = await $getV2exConfig();
            if (data) {
                updateV2exConfig(data);
            }
        }

        async function getLoginReward() {
            const data = await $getLoginReward();
            if (data) {
                const { sign_in_day, is_sign_in } = data;
                if (is_sign_in) {
                    uni.showToast({
                        title: `签到成功，${sign_in_day}`,
                        icon: 'none'
                    });
                } else {
                    uni.showToast({
                        title: '签到失败',
                        icon: 'none'
                    });
                }
                saveUserInfo(data);
            }
        }

        async function getLoginRewardInfo() {
            const data = await $getLoginRewardInfo();
            if (data) {
                const { is_sign_in } = data;
                if (!is_sign_in && autoSign.value) {
                    await getLoginReward();
                    return;
                }
                saveUserInfo(data);
            }
        }

        async function getUserBalance() {
            const data = await $getUserBalance();
            if (data) {
                saveUserInfo({ balance: data });
            }
        }

        async function getUserInfo() {
            const data = await $getUserInfo(userInfo.value.username);
            if (data) {
                let { info } = data;
                info = info.split('，')[0];
                saveUserInfo({ ...data, info });
            }
        }

        function saveCookie(data) {
            cookie.value = data;
        }

        function toggleAutoSign(data) {
            autoSign.value = data;
        }

        function saveUserInfo(data) {
            userInfo.value = { ...userInfo.value, ...data };
        }

        function saveHistoryTopics(data) {
            let history = historyTopic.value.reverse();
            history = history.filter(item => {
                return item.id !== data.id;
            });
            history.push(data);
            historyTopic.value = history.slice(-30).reverse();
        }

        async function getUserNotifications() {
            const data = await $getUserNotifications();
            if (data) {
                uni.setTabBarBadge({
                    index: 2,
                    text: data.toString()
                });
                saveNotifications(data);
            } else {
                uni.removeTabBarBadge({
                    index: 2
                });
                saveNotifications(0);
            }
        }

        return {
            dev,
            allTag,
            myTag,
            currentTabIndex,
            currentTabName,
            tabs,
            autoSign,
            cookie,
            toastTitle,
            notifications,
            userInfo,
            visited,
            v2exConfig,
            historyTopic,
            topicBaseInfo,
            skeleton,
            saveTopicBaseInfo,
            toggleAutoSign,
            changeTabIndex,
            getV2exConfig,
            updateMyTag,
            updateVisited,
            saveCookie,
            saveUserInfo,
            getUserInfo,
            getLoginReward,
            getLoginRewardInfo,
            getUserBalance,
            saveHistoryTopics,
            saveNotifications,
            getUserNotifications
        };
    },
    {
        persist: true
    }
);
