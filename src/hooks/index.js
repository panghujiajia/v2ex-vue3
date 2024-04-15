import { storeToRefs } from 'pinia';
import { useIndexStore } from '@/stores';

export function useSetMeta(method, meta = {}) {
    const defaultMeta = {
        loading: true,
        ignoreToken: true,
        showResultMsg: false
    };
    method.meta = {
        ...defaultMeta,
        ...meta
    };
    return method;
}

// 等待
export async function wait(time) {
    return new Promise(r => {
        setTimeout(r, time * 1000 || 1500);
    });
}

// 跳转详情
export function getTopicsDetail(detail) {
    const store = useIndexStore();
    const { visited } = storeToRefs(store);
    const { id } = detail;
    if (!visited.value.includes(id)) {
        store.updateVisited(id);
        detail.visited = true;
    }
    store.saveTopicBaseInfo(detail);
    uni.navigateTo({
        url: `/pages/Detail?id=${id}`
    });
}
