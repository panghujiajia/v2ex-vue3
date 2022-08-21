import { defineStore } from 'pinia';
import allTags from '../config/allTag.config';
import topTags from '../config/topTag.config';
import { reactive, ref } from 'vue';
import {
    $getLoginReward,
    $getLoginRewardInfo,
    $getUserBalance,
    $getUserInfo,
    $getV2exConfig
} from '../service';

export const useStore = defineStore(
    'v2ex',
    () => {
        const tabs = reactive(topTags);

        let currentTabBar = ref(0);
        let currentTagIndex = ref(0);
        let currentTagName = ref('top');

        let allTag = reactive(allTags);
        let myTag = ref([]);

        let v2exConfig = ref({});

        let historyTopic = ref([]);

        let autoSign = ref(false);
        let autoNavigate = ref(true);
        let cookie = ref('');
        let storageTime = ref(15);
        let toastTitle = ref('');
        let notifications = ref(0);
        let visited = ref([]);
        let userInfo = ref({
            avatar: '',
            balance: [],
            sign_in_day: '',
            info: '',
            is_sign_in: '',
            username: '',
            password: ''
        });

        let topicData = reactive({});

        function updateVisited(id) {
            visited.value.push(id);
        }

        function toggleAutoNavigate(data) {
            autoNavigate.value = data;
        }

        function updateTopicData(params) {
            const { key, data } = params;
            topicData[key] = data;
        }

        function getTopicData(key) {
            return topicData[key];
        }

        function changeTagIndex(index) {
            currentTagIndex.value = index;
            changeTagName();
        }
        function changeTagName() {
            currentTagName.value = tabs[currentTagIndex.value].value;
        }
        function changeTabBar(index) {
            currentTabBar.value = index;
        }
        function updateMyTag(tag) {
            myTag = tag;
        }

        function updateV2exConfig(data) {
            v2exConfig.value = data;
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
        return {
            allTag,
            myTag,
            currentTagIndex,
            currentTagName,
            tabs,
            currentTabBar,
            autoSign,
            autoNavigate,
            cookie,
            toastTitle,
            notifications,
            userInfo,
            topicData,
            storageTime,
            visited,
            v2exConfig,
            historyTopic,
            toggleAutoSign,
            changeTabBar,
            changeTagIndex,
            updateTopicData,
            getTopicData,
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
            saveHistoryTopics
        };
    },
    {
        persist: {
            paths: [
                'myTag',
                'v2exConfig',
                'currentTabBar',
                'autoSign',
                'autoNavigate',
                'cookie',
                'storageTime',
                'visited',
                'userInfo',
                'topicData',
                'historyTopic'
            ]
        }
    }
);
