import { defineStore } from 'pinia';
import allTags from '../config/allTag.config';
import topTags from '../config/topTag.config';
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
        const tabs = reactive(topTags);

        const currentTagIndex = ref(0);
        const currentTagName = ref('top');

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

        const autoSign = ref(false);
        const autoNavigate = ref(true);
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

        function toggleAutoNavigate(data) {
            autoNavigate.value = data;
        }

        function changeTagIndex(index) {
            currentTagIndex.value = index;
            changeTagName();
        }

        function changeTagName() {
            currentTagName.value = tabs[currentTagIndex.value].value;
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
            currentTagIndex,
            currentTagName,
            tabs,
            autoSign,
            autoNavigate,
            cookie,
            toastTitle,
            notifications,
            userInfo,
            visited,
            v2exConfig,
            historyTopic,
            topicBaseInfo,
            saveTopicBaseInfo,
            toggleAutoSign,
            changeTagIndex,
            getV2exConfig,
            updateMyTag,
            updateVisited,
            saveCookie,
            saveUserInfo,
            getUserInfo,
            getLoginReward,
            getLoginRewardInfo,
            getUserBalance,
            toggleAutoNavigate,
            saveHistoryTopics,
            saveNotifications,
            getUserNotifications
        };
    },
    {
        persist: true
    }
);
