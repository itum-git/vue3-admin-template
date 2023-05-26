import request from '@/request';

// 会员等级配置列表
export const getGradeListApi = (params): Promise<IResponse> => {
    return request.get({ url: '/vip/grade/list', params })
}

// 会员权益配置列表
export const getBenefitsListApi = async (): Promise<IResponse> => {
    return request.get({ url: '/vip/benefits/list' })
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