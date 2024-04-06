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
