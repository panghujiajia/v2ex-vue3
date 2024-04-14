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

export function useRandomText(type = 'load') {
    const textObj = {
        load: [
            '加载失败',
            '要不再试一次？',
            '看看是不是网络不太好',
            '再给我一次机会',
            '你让我再试一次',
            '要不算了吧'
        ],
        more: ['没有了哦', '去看看别的吧', '休息一下', '让眼睛放松一下', '无了']
    };
    if (type) {
        let index = uni.$uv.random(0, textObj[type].length);
        return textObj[type][index];
    }
}
