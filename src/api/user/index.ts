import request from '@/request';
import type { UserInfo } from './types';

// 用户登录
export const loginApi = (params): Promise<IResponse> => {
    return request.get({ url: '/user/login', params })
}

// 获取用户信息
export const getUserInfoApi = async (): Promise<IResponse<UserInfo>> => {
    return request.get({ url: '/user/info' })
}

export const getUserListApi = (params): Promise<IResponse> => {
    return request.get({ url: '/user/list', params })
}

export const addUserApi = (data): Promise<IResponse> => {
    return request.post({ url: '/user', data })
}

export const editUserApi = (data): Promise<IResponse> => {
    return request.put({ url: '/user', data })
}