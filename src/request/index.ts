import { service } from './service';
import { config } from './config';
import { useCache } from '@/hooks/useCache';

const { cache } = useCache()

const { default_headers } = config;

const request = (option: any) => {

    const { url, method, params, data, headers, responseType } = option;

    return service({
        url: url,
        method,
        params,
        data,
        responseType: responseType,
        headers: Object.assign(default_headers, headers, {
            'Authorization': cache.get('Auth-Token')
        }),
    });
}

export default {
    get: <T = any>(option: any) => {
        return request({ method: 'get', ...option }) as unknown as T;
    },
    post: <T = any>(option: any) => {
        return request({ method: 'post', ...option }) as unknown as T;
    },
    delete: <T = any>(option: any) => {
        return request({ method: 'delete', ...option }) as unknown as T;
    },
    put: <T = any>(option: any) => {
        return request({ method: 'put', ...option }) as unknown as T;
    },
};
