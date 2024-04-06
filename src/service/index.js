import { $http } from './interceptor';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useIndexStore } from '@/stores';
import { useSetMeta } from '@/hooks';

dayjs.extend(relativeTime);

export const $getTabTopics = tab => {
    return useSetMeta($http.Get(`/topics/tab/${tab}`));
};

export const $getAllTopics = params => {
    const store = useIndexStore();
    return useSetMeta($http.Get(`/topics/all/${params.tab}/${params.p}`), {
        ignoreToken: !store.cookie
    });
};

export const $getTopicDetail = ({ id, p }) => {
    const store = useIndexStore();
    const suffix = p ? `${id}/${p}` : id;
    return useSetMeta($http.Get(`/topics/detail/${suffix}`), {
        ignoreToken: !store.cookie,
        loading: false
    });
};

export const $getLoginParams = () => {
    return useSetMeta($http.Get(`/login/params`), {
        loading: false
    });
};

export const $login = params => {
    return useSetMeta($http.Post(`/login`, params));
};

export const $getTopTagConfig = () => {
    return useSetMeta($http.Get(`/config/tag/top`), {
        loading: false
    });
};

export const $getV2exConfig = () => {
    return useSetMeta($http.Get(`/config/v2ex`), {
        loading: false
    });
};

export const $getAllTagConfig = () => {
    const store = useIndexStore();
    return useSetMeta($http.Get(`/config/v2ex`), {
        ignoreToken: !store.cookie,
        loading: false
    });
};

export const $getUserInfo = username => {
    return useSetMeta($http.Get(`/member/${username}`), {
        ignoreToken: false,
        loading: false
    });
};

export const $getUserTopics = params => {
    const store = useIndexStore();
    return useSetMeta(
        $http.Get(`/member/${params.username}/topics/${params.p}`),
        {
            ignoreToken: !store.cookie,
            loading: false
        }
    );
};

export const $getUserReplys = params => {
    const store = useIndexStore();
    return useSetMeta(
        $http.Get(`/member/${params.username}/replies/${params.p}`),
        {
            ignoreToken: !store.cookie
        }
    );
};

export const $getUserMessage = p => {
    return useSetMeta($http.Get(`/message/${p}`), {
        ignoreToken: false
    });
};

export const $getLoginRewardInfo = () => {
    return useSetMeta($http.Get(`/mission/daily`), {
        ignoreToken: false,
        loading: false
    });
};

export const $getLoginReward = () => {
    return useSetMeta($http.Post('/mission/daily', {}), {
        ignoreToken: false
    });
};

export const $getUserBalance = () => {
    return useSetMeta($http.Get(`/balance`), {
        ignoreToken: false,
        loading: false
    });
};

export const $getUserNotifications = () => {
    return useSetMeta($http.Get(`/notifications`), {
        ignoreToken: false,
        loading: false
    });
};

export const $replyTopic = params => {
    return useSetMeta($http.Post(`/t`), {
        ignoreToken: false
    });
};
