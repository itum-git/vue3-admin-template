/**
 * 配置浏览器本地存储的方式，可直接存储对象数组。
 */

import { useSessionStorage, useLocalStorage } from '@vueuse/core';

type CacheType = 'sessionStorage' | 'localStorage' | 'session' | 'local';

const _sessionStorage: Recordable = {};

const _localStorage: Recordable = {};

// const StorageSerializers = {
//     boolean: {
//         read: (v) => v === 'true',
//         write: (v) => String(v)
//     },
//     object: {
//         read: (v) => JSON.parse(v),
//         write: (v) => JSON.stringify(v)
//     },
//     number: {
//         read: (v) => Number.parseFloat(v),
//         write: (v) => String(v)
//     },
//     any: {
//         read: (v) => v,
//         write: (v) => String(v)
//     },
//     string: {
//         read: (v) => v,
//         write: (v) => String(v)
//     },
//     map: {
//         read: (v) => new Map(JSON.parse(v)),
//         write: (v) => JSON.stringify(Array.from(v.entries()))
//     },
//     set: {
//         read: (v) => new Set(JSON.parse(v)),
//         write: (v) => JSON.stringify(Array.from(v))
//     },
//     date: {
//         read: (v) => new Date(v),
//         write: (v) => v.toISOString()
//     }
// };

const sessionCache = {
    set(key: string, value: any) {
        if (_sessionStorage[key]) {
            _sessionStorage[key].value = value
        } else {
            _sessionStorage[key] = useSessionStorage(key, value);
        }
    },
    get(key: string) {
        if (!_sessionStorage[key]) {
            // writeDefaults: false 不写入，只读取
            _sessionStorage[key] = useSessionStorage(key, null, { writeDefaults: false })
        }
        return _sessionStorage[key].value
    },
};

const localCache = {
    set(key: string, value: any) {
        if (_localStorage[key]) {
            _localStorage[key].value = value
        } else {
            _localStorage[key] = useLocalStorage(key, value);
        }
    },
    get(key: string) {
        if (_localStorage[key]) {
            // writeDefaults: false 不写入，只读取
            _localStorage[key] = useLocalStorage(key, null, { writeDefaults: false })
        }
        return _localStorage[key].value
    },
};

export const useCache = (type?: CacheType) => {
    return { cache: (type === 'localStorage' || type === 'local') ? localCache : sessionCache };
};
