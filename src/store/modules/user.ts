import { ActionTree, MutationTree, GetterTree, Module } from 'vuex';
import { loginApi, getUserInfoApi } from '@/api/user';
import { useCache } from '@/hooks/useCache';
import { RootState } from '../type';

// 临时
const userInfo:{ [key:string]: any } = {
    name: 'admin',
    avatar: '',
    permissions: ['test'],
}

const { cache } = useCache();

interface UserState {
    info: object | null;
    token: string;
    isEmpty: boolean;
}

const state: UserState = {
    info: cache.get('userinfo') || null, //  用户信息
    token: cache.get('Auth-Token'), // 用户 token
    isEmpty: true, // 当前用户是否为空，即登出、切换登录等情况为 true
}

const mutations: MutationTree<UserState> = {
    SET_USERINFO: (state, info) => {
        state.info = info;
        cache.set('userinfo', info)
    },
    SET_TOKEN: (state, token) => {
        state.token = token
        cache.set('Auth-Token', token)
    },
    SET_ISEMPTY: (state, isEmpty) => {
        state.isEmpty = isEmpty
    },
}

const actions: ActionTree<UserState, any> = {
    async login({ commit }, { username, password }) {

        const res = await loginApi({ username, password })

        const token = res.data.token

        // 存储 token
        commit('SET_TOKEN', token)
        userInfo.name = username
        return true
    },
    async logout({ commit }) {

        // 清空 token 和 userInfo
        commit('SET_TOKEN', null)
        commit('SET_USERINFO', null)
        commit('permission/SET_PERMISSIONS', null, { root: true })
        // 用户置空
        commit('SET_ISEMPTY', true)
    },
    async getUserInfo({ commit,  }) {

        const res = await getUserInfoApi()

        console.log(res)

        const userinfo = res.data

        // 存储用户信息
        commit('SET_USERINFO', userinfo)
        commit('permission/SET_PERMISSIONS', userinfo.permissions, { root: true })
        // 用户置存
        commit('SET_ISEMPTY', false)
    },
    setToken({ commit }, token) {
        commit('SET_TOKEN', token)
    },
}

const getters: GetterTree<UserState, RootState> = {
    userInfo: (state) => state.info || {},
}

const store: Module<UserState, RootState> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default store
